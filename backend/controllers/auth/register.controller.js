const bcrypt = require("bcryptjs");
const User = require("../../models/users");
const validator = require("validator"); // email/phone validate k liye
const uploadToCloudinary = require("../../config/cloudinary");

//  User Signup Controller (for role: patient only)
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      date_of_birth,
      address,
      city,
      country,
      role,
    } = req.body;

    //  Basic required fields check
    if (
      !firstName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !date_of_birth ||
      !address ||
      !city ||
      !country ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    //  Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    //  Phone format validation (basic international or Pakistani format)
    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format.",
      });
    }

    //  Date of birth validation (not in the future)
    const dob = new Date(date_of_birth);
    if (dob > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date of birth cannot be in the future.",
      });
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

    //  Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new user (only patient role)
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      date_of_birth,
      gender,
      address,
      city,
      country,
      profileImage: uploadedImageUrl,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: newUser._id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = registerUser;
