const Room = require("../../models/room");
const User = require("../../models/users");

// Create Room Controller
const createRoom = async (req, res) => {
  try {
    const loggedInUser = req.user;

    //  Only Admin can create rooms
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create rooms",
      });
    }

    const { roomNumber, name, doctorAssign, status } = req.body;

    //  Validate doctor IDs
    if (!doctorAssign || !Array.isArray(doctorAssign) || doctorAssign.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one doctor must be assigned to the room",
      });
    }

    //  Verify all assigned doctors exist and have role = doctor
    const doctors = await User.find({
      _id: { $in: doctorAssign },
      role: "doctor",
    });

    if (doctors.length !== doctorAssign.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor IDs or non-doctor users included",
      });
    }

    //  Check duplicate room number
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room number already exists",
      });
    }

    //  Create room
    const newRoom = new Room({
      roomNumber,
      name,
      status: status || "available",
      doctorAssign,
    });

    await newRoom.save();

       // Populate doctor details before sending response
    const populatedRoom = await Room.findById(newRoom._id)
      .populate("doctorAssign", "firstName lastName email phone");

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: populatedRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating room",
    });
  }
};

module.exports =  createRoom;