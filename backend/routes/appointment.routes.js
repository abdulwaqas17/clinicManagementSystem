const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const getDoctorBookedSlots = require("../controllers/appointments/getBookSlots.controller");
const router = express.Router();


// Get Booked Slots of a Doctor
router.get("/booked-slots/:doctorId", verifyToken, getDoctorBookedSlots);

module.exports = router;
