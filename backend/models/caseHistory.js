const mongoose = require("mongoose");

const caseHistorySchema = new mongoose.Schema(
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
    
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    
    diagnosis: {
        type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },
    
    prescription: {
        type: String,
      trim: true,
    },
    
    notes: {
        type: String,
        trim: true,
    },
    
    followUpDate: {
        type: Date,
    },
    
    // Files or reports (images, PDFs, etc.)
    attachments: [
        {
            fileUrl: { type: String, required: true }, // Cloudinary or local path
            // fileType: {
                //   type: String,
                //   enum: ["image", "pdf", "other"],
        //   default: "other",
        // },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseHistory", caseHistorySchema);

// clinic: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Clinic",
//   required: true,
// },