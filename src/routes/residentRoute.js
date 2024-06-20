const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  reportIssue,
  getIndividualIssueData,
} = require("../controllers/residentController");

const router = express.Router();

router.post("/reportIssue", authenticateToken, reportIssue);
router.post(
  "/getIndividualIssueData",
  authenticateToken,
  getIndividualIssueData
);

module.exports = router;
