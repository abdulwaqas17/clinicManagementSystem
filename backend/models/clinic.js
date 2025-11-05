// const mongoose = require("mongoose");

// const clinicSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     country: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       trim: true,
//     },
//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },

//     // Clinic working schedule
//     schedule: [
//       {
//         day: {
//           type: String, // e.g. Monday, Tuesday
//           required: true,
//         },
//         openTime: {
//           type: String, // "09:00"
//           required: true,
//         },
//         closeTime: {
//           type: String, // "18:00"
//           required: true,
//         },
//       },
//     ],
//   },
//   { timestamps: true } // auto adds createdAt & updatedAt
// );

// module.exports = mongoose.model("Clinic", clinicSchema);
