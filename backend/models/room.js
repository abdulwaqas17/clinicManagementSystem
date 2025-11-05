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