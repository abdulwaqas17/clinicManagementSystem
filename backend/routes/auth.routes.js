const express = require("express");
const upload = require("../middlewares/multer");
const registerUser = require("../controllers/auth/register.controller");
const loginUser = require("../controllers/auth/login.controller");
const forgotPassword = require("../controllers/auth/forgotPassword");
const verifyOTP = require("../controllers/auth/verifyOtp");
const resetPassword = require("../controllers/auth/resetPassword");
const router = express.Router();

// User Login Route
router.post("/register", upload.single("profileImage"), registerUser);

// User Login Route
router.post("/login", loginUser)

// forget password route
router.post("/forgot-password",forgotPassword);

// verify otp route
router.post("/verify-otp",verifyOTP);

// reset password route
router.post("/reset-password",resetPassword);


module.exports = router;
