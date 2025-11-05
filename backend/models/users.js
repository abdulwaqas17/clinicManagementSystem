const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    date_of_birth: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"] },
    country: { type: String, required: [true, "Country is required"] },
    profileImage: { type: String, default: "" }, // for all users

    role: {
      type: String,
      enum: ["user", "doctor", "admin", "receptionist"],
      required: [true, "Role is required"],
    },

    status: {
      type: String,
      enum: ["active", "invited", "disabled"],
      default: "active", // By default user active hoga
    },

    // Doctor-specific fields
    doctorInfo: {
      specialization: { type: String },
      doctorRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      experience: { type: Number },
      consultationFee: { type: Number },
      schedule: [
        {
          day: String,
          startTime: String,
          endTime: String,
        },
      ],
    },
  },
  { timestamps: true }
);

// Custom validation for doctors
userSchema.pre("save", function (next) {
  if (this.role === "doctor") {
    const docInfo = this.doctorInfo || {};

    if (
      !docInfo.specialization ||
      docInfo.experience == null ||
      docInfo.consultationFee == null ||
      !docInfo.schedule ||
      docInfo.schedule.length === 0
    ) {
      const err = new Error(
        "All doctor fields are required for users with role 'doctor'"
      );
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

// for multi
// clinic : {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Clinic",
//   required: true,
// },
