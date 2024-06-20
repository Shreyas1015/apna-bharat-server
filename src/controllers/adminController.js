require("dotenv").config();
const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const { authenticateUser } = require("../middlewares/authMiddleware");

const getTotalIssuesCount = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select count(*) as totalIssues from issues";

    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(parseInt(result.rows[0].totalissues));
      }
    });
  });
});

const getResolvedIssuesCount = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select count(*) from issues where status = 2 or status = 3";

    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(parseInt(result.rows[0].count));
      }
    });
  });
});

const getPendingIssuesCount = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select count(*) from issues where status = 0 or status = 1";

    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(parseInt(result.rows[0].count));
      }
    });
  });
});

const getReportedIssuesCountOverTime = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { timePeriod } = req.body;
    let query = "";

    switch (timePeriod) {
      case "daily":
        query = `
            SELECT issue_type AS category_name, COUNT(*) AS post_count
            FROM issues
            WHERE issue_date >= current_date
            GROUP BY issue_type`;
        break;
      case "weekly":
        query = `
            SELECT issue_type AS category_name, COUNT(*) AS post_count
            FROM issues
            WHERE issue_date >= current_date - interval '7 days'
            GROUP BY issue_type`;
        break;
      case "monthly":
        query = `
            SELECT issue_type AS category_name, COUNT(*) AS post_count
            FROM issues
            WHERE issue_date >= current_date - interval '1 month'
            GROUP BY issue_type`;
        break;
      default:
        res.status(400).json({ message: "Invalid time period specified" });
        return;
    }

    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const getRecentIssues = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query =
      "SELECT issue_type,issue_date,resident_name FROM issues ORDER BY issue_date DESC LIMIT 5;";
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server error", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({
          message: "Recent Issues",
          issues: result.rows,
        });
      }
    });
  });
});

const getGroupByIssuesCount = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query =
      "SELECT issue_type, COUNT(*) AS issue_count FROM issues GROUP BY issue_type ORDER BY issue_count DESC";
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server error", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ issues: result.rows });
      }
    });
  });
});

const getGroupBybarGraphData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = `SELECT statuses.status AS status, COALESCE(issue_counts.issue_count, 0) AS issue_count FROM (VALUES (0, 'Open'), (1, 'In Progress'), (2, 'Resolved'), (3, 'Closed') ) AS statuses(status_code, status) LEFT JOIN (SELECT status AS status_code, COUNT(*) AS issue_count FROM issues GROUP BY status ) AS issue_counts ON statuses.status_code = issue_counts.status_code ORDER BY statuses.status_code; `;
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server error", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ issues: result.rows });
      }
    });
  });
});

const getGroupByPriority = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = ` SELECT priority_levels.priority_level, COALESCE(issue_counts.issue_count, 0) AS issue_count FROM (VALUES ('Low'), ('Medium'), ('High')) AS priority_levels(priority_level) LEFT JOIN (SELECT priority_level, COUNT(*) AS issue_count FROM issues GROUP BY priority_level ) AS issue_counts ON priority_levels.priority_level = issue_counts.priority_level ORDER BY priority_levels.priority_level`;
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server error", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ issues: result.rows });
      }
    });
  });
});

const getIssueData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "select * from issues order by issue_id desc";
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const getAllUsersData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query =
      "select * from user_profiles join users on users.uid = user_profiles.uid order by users.uid asc";
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const updateIssueStatus = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { issueId, newStatus } = req.body;
    const query = "UPDATE issues SET status = $1 WHERE issue_id = $2";
    const values = [newStatus, issueId];

    pool.query(query, values, (err, result) => {
      if (err) {
        console.error("Internal Server Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Issue status updated successfully" });
      }
    });
  });
});

const deleteUser = asyncHand(async (req, res) => {
  authenticateUser(req, res, async () => {
    const { uid } = req.body;
    const tables = [
      "email_verification_otps",
      "equipmentrental",
      "farmers_profile_management",
      "issues",
      "jobs",
      "jobs_application_tracker",
      "labourers_profile_management",
      "requests",
      "user_profiles",
      "users",
    ];

    try {
      await pool.query("BEGIN");

      for (let table of tables) {
        // Check if the 'uid' column exists in the table
        const columnCheckQuery = `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = 'uid'
        `;
        const columnCheckResult = await pool.query(columnCheckQuery, [table]);

        if (columnCheckResult.rows.length > 0) {
          const deleteQuery = `DELETE FROM ${table} WHERE uid = $1`;
          await pool.query(deleteQuery, [uid]);
        } else {
          console.log(
            `UID column not found in table ${table}, skipping deletion.`
          );
        }
      }

      await pool.query("COMMIT");
      res.status(200).json({
        message: "User data deleted successfully from all relevant tables.",
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("Error deleting user data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

module.exports = {
  getPendingIssuesCount,
  getResolvedIssuesCount,
  getTotalIssuesCount,
  getReportedIssuesCountOverTime,
  getRecentIssues,
  getGroupByIssuesCount,
  getGroupBybarGraphData,
  getGroupByPriority,
  getGroupByIssuesCount,
  getIssueData,
  updateIssueStatus,
  getAllUsersData,
  deleteUser,
};
