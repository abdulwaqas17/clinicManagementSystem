const CaseHistory = require("../../models/caseHistory");
const Appointment = require("../../models/appointment");
const User = require("../../models/users");

// Create Case History Controller
const createCaseHistory = async (req, res) => {
  try {
    const loggedInUser = req.user; // from verifyToken middleware
    const { user, appointment, diagnosis, prescription, notes, followUpDate } = req.body;

    // Only doctors can create case history
    if (loggedInUser.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can create case history.",
      });
    }

    // Validate required fields
    if (!user || !appointment || !diagnosis || !prescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription and diagnosis are required.",
      });
    }

    // Check if the appointment exists and belongs to this doctor
    const existingAppointment = await Appointment.findById(appointment)
      .populate("doctor", "firstName lastName");

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // if (existingAppointment.doctor._id.toString() !== loggedInUser.id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You can only create case history for your own appointments.",
    //   });
    // }

    // Create new Case History
    const caseHistory = new CaseHistory({
      user,
      doctor: loggedInUser.id,
      appointment,
      diagnosis,
      prescription,
      notes,
      followUpDate,
    });

    await caseHistory.save();

    // Update appointment status → Completed
    await Appointment.findByIdAndUpdate(appointment, { status: "Completed" });

    // Populate before sending response
    const populatedCase = await CaseHistory.findById(caseHistory._id)
      .populate("user", "firstName lastName email")
      .populate("doctor", "firstName lastName doctorInfo.specialization")
      .populate("appointment", "date timeSlot");

    res.status(201).json({
      success: true,
      message: "Case history created successfully.",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Error in createCaseHistory:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = createCaseHistory;
