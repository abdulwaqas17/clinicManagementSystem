const User = require("../../models/users");
const bcrypt = require('bcryptjs')

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log('===============rreset pass cont=====================');
  console.log(email,newPassword);
  console.log('===============rreset pass cont=====================');
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = resetPassword