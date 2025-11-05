const Appointment = require("../../models/appointment");
const User = require("../../models/users");
const mongoose = require("mongoose");

// Update Appointment Controller
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const loggedInUser = req.user; // from verifyToken middleware
    const { doctor, date, timeSlot, status } = req.body;

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    // Find existing appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // Check permissions
    // Allowed roles: admin, receptionist, doctor, patient
    const allowedRoles = ["admin", "receptionist", "doctor", "patient"];
    if (!allowedRoles.includes(loggedInUser.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit appointments.",
      });
    }

    // If doctor is being updated → validate doctor
    if (doctor) {
      const doctorExists = await User.findOne({ _id: doctor, role: "doctor" });
      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found or not valid.",
        });
      }
    }

    // If date/timeSlot/doctor changed → check for conflicts
    if (doctor && date && timeSlot && timeSlot.startTime && timeSlot.endTime) {
      const existingAppointment = await Appointment.findOne({
        doctor,
        date: new Date(date),
        "timeSlot.startTime": timeSlot.startTime,
        "timeSlot.endTime": timeSlot.endTime,
        status: "Booked",
        _id: { $ne: appointmentId }, // exclude current appointment
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: "This time slot is already booked for the selected doctor.",
        });
      }
    }

    // Prepare update data (only update provided fields)
    const updateData = {};
    if (doctor) updateData.doctor = doctor;
    if (date) updateData.date = new Date(date);
    if (timeSlot) updateData.timeSlot = timeSlot;
    if (status) updateData.status = status;

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("user", "firstName lastName email")
      .populate({
          path: "doctor",
          select: "firstName lastName doctorInfo.specialization doctorInfo.consultationFee",
          populate: {
            path: "doctorInfo.doctorRoom",
            model: "Room",
            select: "roomNumber name",
          },
        });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Appointment updated successfully.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating appointment.",
    });
  }
};

module.exports = updateAppointment;
