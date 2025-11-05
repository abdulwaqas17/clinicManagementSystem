const Room = require("../../models/room");

// Create Room Controller
const createRoom = async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Only Admin can create rooms
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create rooms",
      });
    }

    const { roomNumber, name, status } = req.body;

    if (!name || !roomNumber ) {
        return res.status(400).json({
            success: false,
            message: "Room name and number are required",
        });
    }
    
    // Check duplicate room number
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room number already exists",
      });
    }

    // Create new room
    const newRoom = new Room({
      roomNumber,
      name,
      status: status || "available",
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating room",
    });
  }
};

module.exports = createRoom;
