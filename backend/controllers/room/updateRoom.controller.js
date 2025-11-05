const Room = require("../../models/room");
const mongoose = require("mongoose");

// Update Room Controller
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user; // from verifyToken middleware
    const { roomNumber, name, status } = req.body;

    // Only admin can update rooms
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update rooms",
      });
    }

    // Validate room ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    // Check if room exists
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if room number already exists (excluding this room)
    if (roomNumber) {
      const existingRoom = await Room.findOne({
        roomNumber,
        _id: { $ne: id },
      });
      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: "Room number already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (roomNumber) updateData.roomNumber = roomNumber;
    if (name) updateData.name = name;
    if (status) updateData.status = status;

    // Update the room
    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    console.error("Error in updateRoom:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = updateRoom;
