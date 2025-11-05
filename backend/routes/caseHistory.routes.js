const express = require("express");
const createCaseHistory = require("../controllers/caseHistory/createCaseHistory.controller");
const verifyToken = require("../middlewares/verifyToken");
const editCaseHistory = require("../controllers/caseHistory/editCaseHistory.controller");
const router = express.Router();

// Create Case History (only doctor)
router.post("/create", verifyToken, createCaseHistory);

// Edit Case History (only doctor who created it)
router.put("/edit/:caseHistoryId", verifyToken, editCaseHistory);

module.exports = router;

