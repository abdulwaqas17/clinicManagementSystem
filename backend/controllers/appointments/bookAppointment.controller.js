const Appointment = require("../../models/appointment");
const User = require("../../models/users");

// Book Appointment Controller
const bookAppointment = async (req, res) => {
  try {
    const loggedInUser = req.user; // from verifyToken middleware
    const { doctor, date, timeSlot } = req.body;

    // Basic validation
    if (!doctor || !date || !timeSlot || !timeSlot.startTime || !timeSlot.endTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, date, and valid timeSlot (startTime, endTime) are required.",
      });
    }

    // Check if doctor exists and has role doctor
    const doctorExists = await User.findOne({ _id: doctor, role: "doctor" });
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or not a valid doctor.",
      });
    }

    // Check if doctor already has appointment booked for same date/time
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: new Date(date),
      "timeSlot.startTime": timeSlot.startTime,
      "timeSlot.endTime": timeSlot.endTime,
      status: "Booked",
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for the selected doctor.",
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      user: loggedInUser._id,
      doctor,
      date: new Date(date),
      timeSlot,
      status: "Booked", // default
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = bookAppointment;
