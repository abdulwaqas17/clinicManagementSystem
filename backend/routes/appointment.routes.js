const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const getDoctorBookedSlots = require("../controllers/appointments/getBookSlots.controller");
const bookAppointment = require("../controllers/appointments/bookAppointment.controller");
const updateAppointment = require("../controllers/appointments/editAppointment.controller");
const router = express.Router();


// Get Booked Slots of a Doctor
router.get("/booked-slots/:doctorId", verifyToken, getDoctorBookedSlots);

// Book Appointment (only logged-in user)
router.post("/book", verifyToken, bookAppointment);

// Edit Appointment (admin, receptionist, doctor, or patient)
router.put("/edit/:appointmentId", verifyToken, updateAppointment);

module.exports = router;
