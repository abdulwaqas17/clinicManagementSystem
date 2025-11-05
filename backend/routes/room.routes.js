const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const createRoom = require("../controllers/room/createRoom.controller");
const updateRoom = require("../controllers/room/updateRoom.controller");
const deleteRoom = require("../controllers/room/deleteRoom.controller");
const router = express.Router();

// create room
router.post("/create", verifyToken, createRoom);

// update room
router.put("/update/:id", verifyToken, updateRoom);

// Protected route — only admin can delete
router.delete("/delete/:id", verifyToken, deleteRoom);

module.exports = router;
