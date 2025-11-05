const Room = require("../../models/room");

// Delete Room Controller
const deleteRoom = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;

    // Only admin can delete room
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete rooms",
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

    // Delete room
    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting room",
    });
  }
};

module.exports = deleteRoom;
