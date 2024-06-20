const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getTotalIssuesCount,
  getResolvedIssuesCount,
  getPendingIssuesCount,
  getReportedIssuesCountOverTime,
  getRecentIssues,
  getGroupByIssuesCount,
  getGroupBybarGraphData,
  getGroupByPriority,
  getIssueData,
  updateIssueStatus,
  getAllUsersData,
  deleteUser,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/getTotalIssuesCount", authenticateToken, getTotalIssuesCount);
router.post(
  "/getResolvedIssuesCount",
  authenticateToken,
  getResolvedIssuesCount
);
router.post("/getPendingIssuesCount", authenticateToken, getPendingIssuesCount);
router.post(
  "/getReportedIssuesCountOverTime",
  authenticateToken,
  getReportedIssuesCountOverTime
);
router.post("/getRecentIssues", authenticateToken, getRecentIssues);
router.post("/getGroupByIssuesCount", authenticateToken, getGroupByIssuesCount);
router.post(
  "/getGroupBybarGraphData",
  authenticateToken,
  getGroupBybarGraphData
);
router.post("/getGroupByPriority", authenticateToken, getGroupByPriority);
router.post("/getIssueData", authenticateToken, getIssueData);
router.post("/updateIssueStatus", authenticateToken, updateIssueStatus);
router.post("/getAllUsersData", authenticateToken, getAllUsersData);
router.delete("/deleteUser", authenticateToken, deleteUser);

module.exports = router;
