const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    
    
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ["Booked", "Checked-In", "Completed", "Cancelled"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

  // clinic: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Clinic",
  //   required: true,
  // },