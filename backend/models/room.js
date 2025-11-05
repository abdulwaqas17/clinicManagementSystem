const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true, unique: true },
    name: { type: String }, // e.g. "Consultation Room 1"

    status: {
        type: String,
      enum: ["available", "booked", "checkup-continue", "disabled", "maintenance"],
      default: "available",
    },
    
    
    // Doctor currently using the room
    doctorAssign : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to doctor
      required : [true, "Room must be assigned to a doctor"]
}],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);

// for multi
// clinic: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Clinic",
//   required: true,
// },