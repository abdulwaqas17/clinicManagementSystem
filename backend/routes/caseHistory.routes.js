const express = require("express");
const createCaseHistory = require("../controllers/caseHistory/createCaseHistory.controller");
const verifyToken = require("../middlewares/verifyToken");
const editCaseHistory = require("../controllers/caseHistory/editCaseHistory.controller");
const router = express.Router();

router.post("/create", verifyToken, createCaseHistory);

router.put("/edit/:caseHistoryId", verifyToken, editCaseHistory);
module.exports = router;
