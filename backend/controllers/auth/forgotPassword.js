const User = require("../../models/users");
const nodemailer = require("nodemailer");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 min

    console.log(Date.now());
    console.log(otpExpires);
    

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
        to:"www.waqas00001@gmail.com",
    //   to: user.email,
      subject: "Password Reset OTP",
      html: `<h2>Password Reset Request</h2>
             <p>Your OTP code is: <b>${otp}</b></p>
             <p>This code will expire in 5 minutes.</p>`
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = forgotPassword;