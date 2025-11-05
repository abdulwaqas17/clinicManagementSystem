const Appointment = require("../../models/appointment");
const mongoose = require("mongoose");


const getDoctorBookedSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    // Find booked or checked-in appointments for this doctor
  const appointments = await Appointment.find({
  doctor: doctorId,
  status: "Booked",
}).select("date timeSlot -_id");

    // If no appointments found
    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No booked or checked-in slots found for this doctor",
        data: [],
      });
    }

    // Return booked times
    res.status(200).json({
      success: true,
      message: "Booked time slots fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching booked slots",
    });
  }
};

module.exports = getDoctorBookedSlots;
