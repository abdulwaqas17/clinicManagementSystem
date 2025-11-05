const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const getDashboardData = require("../controllers/dashboard/getDashboardData.controller");
const router = express.Router();

// get dashboard data 
router.get("/", verifyToken, getDashboardData); 

module.exports = router;
