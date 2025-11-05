const Room = require("../../models/room");
const User = require("../../models/users");
const mongoose = require("mongoose");

// Update Room Controller
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user; // from verifyToken middleware
    const { roomNumber, name, status, doctorAssign } = req.body;

    // Check role
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

    // Find existing room
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if new roomNumber already exists (except this one)
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

     //  Validate doctor IDs
    if (!doctorAssign || !Array.isArray(doctorAssign) || doctorAssign.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one doctor must be assigned to the room",
      });
    }

    // Validate assigned doctors if provided
    if (doctorAssign && doctorAssign.length > 0) {
      const doctors = await User.find({
        _id: { $in: doctorAssign },
        role: "doctor",
      });

      if (doctors.length !== doctorAssign.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid doctor IDs found in doctorAssign list",
        });
      }
    }

    // Prepare updated data
    const updateData = {};
    if (roomNumber) updateData.roomNumber = roomNumber;
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    if (doctorAssign) updateData.doctorAssign = doctorAssign;

    // Update the room
    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("doctorAssign", "firstName lastName email");

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