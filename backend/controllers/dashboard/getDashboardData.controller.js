const User = require("../../models/users");
const Appointment = require("../../models/appointment");
const CaseHistory = require("../../models/caseHistory");
const Room = require("../../models/room");

// Dashboard Data Controller
const getDashboardData = async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("====================================");
    console.log(loggedInUser);
    console.log(loggedInUser.id);
    console.log(loggedInUser.id);

    console.log("====================================");
    const role = loggedInUser.role;

    
    // Check user status
    if (loggedInUser.status === "disabled" || loggedInUser.status === "invited") {
      return res.status(403).json({ message: "User account is disabled or Invited" });
    }

    let dashboardData = {};

    // Admin
    if (role === "admin") {
      const doctors = await User.find({ role: "doctor" }).populate({
        path: "doctorInfo.doctorRoom",
        select: "roomNumber name",
      });

            // 2. All users (only role: user)
      const users = await User.find({ role: "user" });

      const receptionists = await User.find({ role: "receptionist" });

      // 2. All appointments with user populated
      const appointments = await Appointment.find()
        .populate("user", "firstName lastName email phone")
        .populate({
          path: "doctor",
          select: "firstName lastName doctorInfo.specialization doctorInfo.consultationFee",
          populate: {
            path: "doctorInfo.doctorRoom",
            model: "Room",
            select: "roomNumber name",
          },
        });

      // 3. All rooms
      const rooms = await Room.find();

      // 4. Admin profile
      const adminProfile = await User.findById(loggedInUser.id);

      // 5. Admin's case history
      const adminCaseHistory = await CaseHistory.find({
        user: loggedInUser.id,
      })
      .populate("user", "firstName lastName")
        .populate("doctor", "firstName lastName doctorInfo.specialization doctorInfo.consultationFee")
        .populate("appointment", "date timeSlot");

      // send data
      dashboardData = {
        users, receptionists,
        doctors,
        appointments,
        rooms,
        profile: adminProfile,
        caseHistory: adminCaseHistory,
      };
    }

    // Doctor
    else if (role === "doctor") {
      // 1. Doctor's appointments with user populated
      const appointments = await Appointment.find({ doctor: loggedInUser.id })
        .populate({
          path: "user",
          select: "firstName lastName email phone",
          // populate: {
          //   path: "caseHistory",
          //   populate: [
          //     { path: "doctor", select: "firstName lastName doctorInfo.specialization doctorInfo.consultationFee" },
          //     { path: "appointment", select: "date timeSlot" },
          //   ],
          // },
        })
        .populate({
          path: "doctor",
          select: "firstName lastName doctorInfo.specialization doctorInfo.consultationFee",
          populate: {
            path: "doctorInfo.doctorRoom",
            model: "Room",
            select: "roomNumber name",
          },
        });

      // 2. Doctor's profile
      const doctorProfile = await User.findById(loggedInUser.id);

      // send data
      dashboardData = {
        appointments,
        profile: doctorProfile,
      };
    }

    // Receptionist
    else if (role === "receptionist") {
      const doctors = await User.find({ role: "doctor" }).populate({
        path: "doctorInfo.doctorRoom",
        select: "roomNumber name",
      });

       const rooms = await Room.find();

      // 1. All appointments with user populated
      const appointments = await Appointment.find()
        .populate("user", "firstName lastName email phone")
        .populate({
          path: "doctor",
          select: "firstName lastName doctorInfo.specialization doctorInfo.consultationFee",
          populate: {
            path: "doctorInfo.doctorRoom",
            model: "Room",
            select: "roomNumber name",
          },
        });

      // 2. All users (only role: user)
      const users = await User.find({ role: "user" });

      // 3. Case history of this receptionist
      const receptionistCaseHistory = await CaseHistory.find({
        user: loggedInUser.id,
      })
      .populate("user", "firstName lastName")
        .populate("doctor", "firstName lastName doctorInfo.specialization doctorInfo.consultationFee")
        .populate("appointment", "date timeSlot");

      // 4. Receptionist profile
      const receptionistProfile = await User.findById(loggedInUser.id);

      // send data
      dashboardData = {
        appointments,
        users,
        rooms,
        doctors,
        caseHistory: receptionistCaseHistory,
        profile: receptionistProfile,
      };
    }

    // Regular User
    else if (role === "user") {
      
      const doctors = await User.find({ role: "doctor" }).populate({
        path: "doctorInfo.doctorRoom",
        select: "roomNumber name",
      });

      // 1. User's appointments
      const appointments = await Appointment.find({
        user: loggedInUser.id,
      }).populate("doctor", "firstName lastName doctorInfo.specialization doctorInfo.consultationFee")
      .populate("user", "firstName lastName");

      // 2. User's case history
      const userCaseHistory = await CaseHistory.find({
        user: loggedInUser.id,
      })
      .populate("user", "firstName lastName")
        .populate("doctor", "firstName lastName doctorInfo.specialization ")
        .populate("appointment", "date timeSlot");

      // 3. User profile
      const userProfile = await User.findById(loggedInUser.id);

      // send data
      dashboardData = {
        appointments,
        doctors,
        caseHistory: userCaseHistory,
        profile: userProfile,
      };
    }

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = getDashboardData;
