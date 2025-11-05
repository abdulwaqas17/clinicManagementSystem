const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const inviteUser = require("../controllers/user/inviteUser.controller");
const upload = require("../middlewares/multer");
const acceptInvite = require("../controllers/user/confirmUser.controller");
const updateUser = require("../controllers/user/updateUser.controller");

const router = express.Router();

// Only admin can invite new users
router.post("/invite",upload.single("profileImage"), verifyToken, inviteUser);

// Accept invite route
router.post("/confirm/:id", acceptInvite);

// Update user
router.put("/update/:id", verifyToken, upload.single("profileImage"), updateUser);

module.exports = router;