const CaseHistory = require("../../models/caseHistory");

const editCaseHistory = async (req, res) => {
  try {
    const doctorId = req.user.id; // Logged-in doctor from verifyToken
    const { caseHistoryId } = req.params;
    const { diagnosis, prescription, notes, followUpDate } = req.body;

    // Validate doctor role
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can edit case history.",
      });
    }

    // Check if case history exists
    const caseHistory = await CaseHistory.findById(caseHistoryId);
    if (!caseHistory) {
      return res.status(404).json({
        success: false,
        message: "Case history not found.",
      });
    }

    // Check if this doctor created the case history
    if (caseHistory.doctor.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own case histories.",
      });
    }

    // Update allowed fields
    if (diagnosis) caseHistory.diagnosis = diagnosis;
    if (prescription) caseHistory.prescription = prescription;
    if (notes) caseHistory.notes = notes;
    if (followUpDate) caseHistory.followUpDate = followUpDate;

    // Save updated record
    await caseHistory.save();

    // Populate related details for response
    const updatedCaseHistory = await CaseHistory.findById(caseHistory._id)
      .populate("user", "firstName lastName email")
      .populate("doctor", "firstName lastName doctorInfo.specialization")
      .populate({
        path: "appointment",
        select: "date timeSlot",
      });

    res.status(200).json({
      success: true,
      message: "Case history updated successfully.",
      data: updatedCaseHistory,
    });
  } catch (error) {
    console.error("Error editing case history:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = editCaseHistory;
