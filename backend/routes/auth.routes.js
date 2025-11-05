const express = require("express");
const upload = require("../middlewares/multer");
const registerUser = require("../controllers/auth/register.controller");
const loginUser = require("../controllers/auth/login.controller");
const router = express.Router();

// User Login Route
router.post("/register", upload.single("profileImage"), registerUser);

// User Login Route
router.post("/login", loginUser)

module.exports = router;
