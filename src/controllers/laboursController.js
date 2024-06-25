require("dotenv").config();
const asyncHand = require("express-async-handler");
const nodemailer = require("nodemailer");
const pool = require("../config/dbConfig");
const { authenticateUser } = require("../middlewares/authMiddleware");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.TRANSPORTER_EMAIL,
    to: email,
    subject: "Your Email OTP",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    "Email verification OTP sent to mail:",
    email,
    "and the OTP is:",
    otp
  );
}

async function sendOTPPhone(phone, otp) {
  // Implement code to send the OTP via SMS (not provided here)
  console.log(
    "Phone verification OTP sent to phone:",
    phone,
    "and the OTP is:",
    otp
  );
}

const updateLaboursAdditionalInfo = asyncHand(async (req, res) => {
  const { decryptedUID, additionalInfo } = req.body;

  // First, get the up_id from user_profiles
  const getUPId = "SELECT up_id FROM user_profiles WHERE uid = $1";
  pool.query(getUPId, [decryptedUID], (err, result1) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else if (result1.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      const up_id = result1.rows[0].up_id;
      console.log("up_id:", up_id);

      // Now perform the UPSERT operation
      const upsertAdditionalInfo = `
        INSERT INTO labourers_profile_management (up_id, uid, skills, experience, qualification)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (up_id) DO UPDATE
        SET skills = EXCLUDED.skills, experience = EXCLUDED.experience, qualification = EXCLUDED.qualification;
      `;

      pool.query(
        upsertAdditionalInfo,
        [
          up_id,
          decryptedUID,
          additionalInfo.skills,
          additionalInfo.experience,
          additionalInfo.qualification,
        ],
        (err, result2) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res
              .status(200)
              .json({ message: "Additional Info Updated Successfully" });
          }
        }
      );
    }
  });
});

const fetchLaboursAdditionalInfo = asyncHand(async (req, res) => {
  const { decryptedUID } = req.body;
  const getAdditionalInfo =
    "SELECT skills, experience, qualification FROM labourers_profile_management WHERE uid = $1";
  pool.query(getAdditionalInfo, [decryptedUID], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

const getAllJobs = asyncHand(async (req, res) => {
  authenticateUser(req, res, () => {
    const getAllJobs = "SELECT * FROM jobs ORDER BY jid DESC";
    pool.query(getAllJobs, (err, result) => {
      if (err) {
        console.log("Error in getAllJobs:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const applyForJob = asyncHand(async (req, res) => {
  authenticateUser(req, res, () => {
    const { jobId, decryptedUID } = req.body;
    const applyForJob = `INSERT INTO jobs_application_tracker (jid, who_applied, job_status) VALUES ($1, $2, 1)`;
    pool.query(applyForJob, [jobId, decryptedUID], (err, result) => {
      if (err) {
        console.log("Error in applyForJob:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Applied Successfully" });
      }
    });
  });
});

const fetchJobApplicationTracker = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "select * from jobs_application_tracker where who_applied = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Error fetching Job Application Tracer : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const checkEligibility = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query = `SELECT COUNT(*) 
                   FROM labourers_profile_management 
                   WHERE uid = $1 AND skills IS NOT NULL AND qualification IS NOT NULL AND experience IS NOT NULL`;
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Error in checkEligibility:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        if (result.rows[0].count > 0) {
          res.status(200).json({ message: 1 });
        } else {
          res.status(200).json({ message: 0 });
        }
      }
    });
  });
});

const fetchPersonalJobDataStatus = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "select * from jobs_application_tracker join jobs on jobs.jid = jobs_application_tracker.jid where who_applied = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Internal Server error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

module.exports = {
  updateLaboursAdditionalInfo,
  fetchLaboursAdditionalInfo,
  getAllJobs,
  applyForJob,
  fetchJobApplicationTracker,
  checkEligibility,
  fetchPersonalJobDataStatus,
};
