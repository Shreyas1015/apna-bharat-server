require("dotenv").config();
const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const { authenticateUser } = require("../middlewares/authMiddleware");

const reportIssue = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { fullFormData, decryptedUID } = req.body;
    const query =
      "INSERT INTO issues (uid, resident_name, contact_info, address, issue_type, issue_description, issue_location, issue_date, images, priority_level, additional_comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    const values = [
      decryptedUID,
      fullFormData.residentName,
      fullFormData.contactInfo,
      fullFormData.address,
      fullFormData.issueType,
      fullFormData.issueDescription,
      fullFormData.issueLocation,
      fullFormData.issueDate,
      fullFormData.images,
      fullFormData.priorityLevel,
      fullFormData.additionalComments,
    ];
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Internal Server Error", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Issue Submitted Successfully" });
      }
    });
  });
});

const getIndividualIssueData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;

    const query = "select * from issues where uid = $1 order by issue_id desc";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

module.exports = {
  reportIssue,
  getIndividualIssueData,
};
