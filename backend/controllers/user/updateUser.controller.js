const bcrypt = require("bcryptjs");
const User = require("../../models/users");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../../config/cloudinary");

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      date_of_birth,
      address,
     password,
      doctorInfo
    } = req.body;

    console.log('===============doctor info=====================');
    console.log(
      doctorInfo);
    console.log('===============doctor info=====================');

    if(!firstName || !lastName || !email || !phone || !gender || !date_of_birth || !address){
      return  res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // 2. Find user
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Role-based access control
    const role = loggedInUser.role;
    const canEdit =
      role === "admin" ||
      id === loggedInUser.id.toString() ||
      (role === "receptionist" &&
        (userToUpdate.role === "user" || id === loggedInUser.id.toString()));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this user",
      });
    }

    // 4. Prevent duplicate email or phone
    if (email || phone) {
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email or phone number already in use",
        });
      }
    }

    // 5. Prepare update data
    let updateData = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      date_of_birth,
      address
    };

    // 6. Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // 7. Include doctor info if applicable
    if (userToUpdate.role === "doctor" && doctorInfo) {
      
      updateData.doctorInfo = JSON.parse(doctorInfo);
    }

    // 8. Upload image if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      updateData.profileImage = uploadResult.secure_url;
    }

    // 9. Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = updateUser;
