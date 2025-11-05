const User = require("../../models/users");
const bcrypt = require("bcryptjs");

// Accept Invite Controller
const acceptInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be at least 6 characters long",
      });
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check user status (must be invited)
    if (user.status !== "invited") {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User is not invited or already active.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and status
    user.password = hashedPassword;
    user.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully. You can now log in.",
    });
    
  } catch (error) {
    console.error("Error in acceptInvite:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = acceptInvite;
