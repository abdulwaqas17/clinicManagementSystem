const User = require("../../models/users");
const nodemailer = require("nodemailer");

// POST /api/users/invite
const inviteUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      city,
      country,
      role,
      doctorInfo,
    } = req.body;

    // Check if current user (from middleware) is admin
    const currentUser = req.user; // From auth middleware
    if (!currentUser || currentUser.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can invite users" });
    }

    // Check required fields
    if (
      !firstName ||
      !email ||
      !phone ||
      !gender ||
      !date_of_birth ||
      !address ||
      !city ||
      !country ||
      !role
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be filled",
        });
    }

    // Doctor-specific validation
    if (role === "doctor") {
      if (
        !doctorInfo ||
        !doctorInfo.specialization ||
        doctorInfo.experience == null ||
        doctorInfo.consultationFee == null ||
        !doctorInfo.schedule ||
        doctorInfo.schedule.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message: "All doctor info fields are required",
          });
      }
    }

    //  Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists.",
      });
    }

    //  Profile image upload to Cloudinary (optional)
    let uploadedImageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      uploadedImageUrl = result.secure_url;
    }

    // Create invited user (no password yet)
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      city,
      country,
      role,
      status: "invited",
    profileImage: uploadedImageUrl,
      doctorInfo: role === "doctor" ? doctorInfo : undefined,
    });

    await newUser.save();

    // Email check
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email credentials not configured in .env",
      });
    }

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const inviteLink = `http://localhost:5173/invite/${newUser._id}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation to join the clinic as ${role}`,
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>You have been invited to join our clinic as a <strong>${role}</strong>.</p>
        <p>Please click the link below to complete your registration and set your password:</p>
        <p><a href="${inviteLink}" target="_blank">Complete Registration</a></p>
        <p>Regards,<br/>Clinic Admin</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: `Invitation sent to ${email}`,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Invite Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = inviteUser;
