require("dotenv").config();
const asyncHand = require("express-async-handler");
const nodemailer = require("nodemailer");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");
const stripe = require("stripe")(process.env.SK_TEST_KEY);

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

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const drivers_document_auth = asyncHand((req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Authentication Parameters:", authenticationParameters);
    res.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const sendProfileUpdateEmailVerification = asyncHand(async (req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const otp = generateOTP();

    try {
      const selectQuery = "SELECT email FROM users WHERE uid = $1";
      pool.query(selectQuery, [decryptedUID], (selectErr, selectResult) => {
        if (selectErr) {
          console.error("Error fetching user email:", selectErr);
          return res.status(500).json({ success: false, email: null });
        }

        const email = selectResult.rows[0].email;

        pool.query(
          "INSERT INTO email_verification_otps (email, otp, created_at) VALUES ($1, $2, NOW())",
          [email, otp],
          (insertErr) => {
            if (insertErr) {
              console.error(
                "Error saving email OTP to the database:",
                insertErr
              );
              return res.status(500).json({ success: false, email: null });
            }

            sendOTPEmail(email, otp);
            res.status(200).json({ success: true, email });
          }
        );
      });
    } catch (error) {
      console.error("Error sending email verification code:", error);
      res.status(500).json({ success: false, email: null });
    }
  });
});

const fetchFarmersProfileData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const searchQuery =
      "select * from users join user_profiles on users.uid = user_profiles.uid where users.uid = $1";

    pool.query(searchQuery, [decryptedUID], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error : ", err });
        console.log("Internal Server Error : ", err);
      } else {
        console.log(result.rows[0]);
        res.status(200).json(result.rows[0]);
      }
    });
  });
});

const fetchFarmersProfileIMG = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;

    const query =
      "select profile_img from farmers_profile_management where uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        // Check if any rows are returned
        if (result.rows.length > 0) {
          console.log("Image link fetched", result.rows[0].profile_img);
          res.status(200).json({ link: result.rows[0].profile_img });
        } else {
          console.log("No data found for the given UID");
          res.status(404).json({ message: "No image found for the given UID" });
        }
      }
    });
  });
});

const updateFarmersAddress = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, updatedAddressData } = req.body;
    const updateQuery =
      "UPDATE user_profiles SET village = $1, taluka = $2, district = $3, state = $4, pincode = $5 WHERE uid = $6";
    const updateValues = [
      updatedAddressData.village,
      updatedAddressData.taluka,
      updatedAddressData.district,
      updatedAddressData.state,
      updatedAddressData.pincode,
      decryptedUID,
    ];

    pool.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(`Error updating address: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Address Updated" });
      }
    });
  });
});

const fetchFarmersAddress = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT village, taluka, district, state, pincode FROM user_profiles WHERE uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching address data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        console.log("Address data fetched: ", result.rows[0]);
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const updateFarmersFarmDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, updatedFarmData } = req.body;
    const updateQuery =
      "INSERT INTO farmers_profile_management (uid, farm_name, farm_size, farm_type, crops_grown, irrigation_methods, storage_facilities, live_stocks, pesticides_used, farming_methods) VALUES ($10, $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9) ON CONFLICT (uid) DO UPDATE SET farm_name = $1, farm_size = $2, farm_type = $3, crops_grown = $4, irrigation_methods = $5, storage_facilities = $6, live_stocks = $7::jsonb, pesticides_used = $8::jsonb, farming_methods = $9 WHERE farmers_profile_management.uid = $10";

    const updateValues = [
      updatedFarmData.farm_name,
      updatedFarmData.farm_size,
      updatedFarmData.farm_type,
      updatedFarmData.crops_grown,
      updatedFarmData.irrigation_methods,
      updatedFarmData.storage_facilities,
      updatedFarmData.live_stocks,
      updatedFarmData.pesticides_used,
      updatedFarmData.farming_methods,
      decryptedUID,
    ];

    pool.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(`Error updating farm details: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Farm Details Updated" });
      }
    });
  });
});

const fetchFarmersFarmData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT farm_name, farm_size, farm_type, crops_grown, irrigation_methods, storage_facilities, live_stocks, pesticides_used, farming_methods FROM farmers_profile_management WHERE uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching farm data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const farmerJobForm = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, fullFormData } = req.body;

    const insertQuery =
      "INSERT INTO jobs (uid, jobTitle, jobDescription, jobLocation, startDate, endDate, workingHours, wageSalary, qualificationsSkills, applicationDeadline, aadharCard, kissanCard) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

    const insertValues = [
      decryptedUID,
      fullFormData.jobTitle,
      fullFormData.jobDescription,
      fullFormData.jobLocation,
      fullFormData.startDate,
      fullFormData.endDate,
      fullFormData.workingHours,
      fullFormData.wageSalary,
      fullFormData.qualificationsSkills,
      fullFormData.applicationDeadline,
      fullFormData.aadharCard,
      fullFormData.kisanCreditCard,
    ];

    pool.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error(`Error inserting job form data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Form Submitted" });
      }
    });
  });
});

const getAllJobs = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query = "SELECT * FROM jobs WHERE uid = $1 order by jid desc";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching all jobs: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows);
      }
    });
  });
});

const getAllRentalEquipmentApplications = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const query = "SELECT * FROM equipmentrental order by er_id desc";
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Error fetching all jobs: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows);
      }
    });
  });
});

const getAllEquipmentForms = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT * FROM equipmentrental WHERE uid = $1 order by er_id desc";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching all jobs: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows);
      }
    });
  });
});

const deleteJob = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jobId } = req.body;
    const deleteQuery = "DELETE FROM jobs WHERE uid = $1 AND jid = $2";
    pool.query(deleteQuery, [decryptedUID, jobId], (err, result) => {
      if (err) {
        console.error(`Error deleting job: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized access" });
      } else {
        return res.status(200).json({ message: "Job Deleted" });
      }
    });
  });
});

const deleteEquipmentForm = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, erId } = req.body;
    const deleteQuery =
      "DELETE FROM equipmentrental WHERE uid = $1 AND er_id = $2";
    pool.query(deleteQuery, [decryptedUID, erId], (err, result) => {
      if (err) {
        console.error(`Error deleting Equipment form: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Equipment Form not found or unauthorized access" });
      } else {
        return res.status(200).json({ message: "Equipment form Deleted" });
      }
    });
  });
});

const updateJobDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid, job } = req.body;
    console.log("Job Details = ", job);
    const updateQuery =
      "UPDATE jobs SET jobTitle = $1, jobDescription = $2, jobLocation = $3, startDate = $4, endDate = $5, workingHours = $6, wageSalary = $7, qualificationsSkills = $8, applicationDeadline = $9, aadharCard = $10, kissanCard = $11 WHERE uid = $12 AND jid = $13";
    pool.query(
      updateQuery,
      [
        job.jobtitle,
        job.jobdescription,
        job.joblocation,
        job.startdate,
        job.enddate,
        job.workinghours,
        job.wagesalary,
        job.qualificationsskills,
        job.applicationdeadline,
        job.aadharcard,
        job.kissancard,
        decryptedUID,
        jid,
      ],
      (err, result) => {
        if (err) {
          console.error(`Error updating job details: ${err}`);
          return res.status(500).json({ error: "Server Error" });
        } else {
          return res.status(200).json({ message: "Job Details Updated" });
        }
      }
    );
  });
});

const UpdateEquipmentRentalForm = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, er_id, fullFormData } = req.body;

    const updateQuery =
      "UPDATE EquipmentRental SET equipment_name = $1, equipment_description = $2, equipment_condition = $3, rental_location = $4, rental_price = $5, payment_terms = $6, usage_restrictions = $7, owner_name = $8, contact_number = $9, contact_email = $10, aadhar_card_url = $11, kisan_credit_card_url = $12, pickup_delivery_options = $13, additional_accessories = $14, insurance_details = $15, terms_conditions = $16 WHERE uid = $17 AND er_id = $18";

    pool.query(
      updateQuery,
      [
        fullFormData.equipment_name,
        fullFormData.equipment_description,
        fullFormData.equipment_condition,
        fullFormData.rental_location,
        fullFormData.rental_price,
        fullFormData.payment_terms,
        fullFormData.usage_restrictions,
        fullFormData.owner_name,
        fullFormData.contact_number,
        fullFormData.contact_email,
        fullFormData.aadhar_card_url,
        fullFormData.kisan_credit_card_url,
        fullFormData.pickup_delivery_options,
        fullFormData.additional_accessories,
        fullFormData.insurance_details,
        fullFormData.terms_conditions,
        decryptedUID,
        er_id,
      ],
      (err, result) => {
        if (err) {
          console.error(`Error updating equipment rental details: ${err}`);
          return res.status(500).json({ error: "Server Error" });
        } else {
          return res
            .status(200)
            .json({ message: "Equipment Rental Details Updated" });
        }
      }
    );
  });
});

const fetchParticularJobDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid } = req.body;
    const query =
      "SELECT * FROM jobs join users on jobs.uid = users.uid WHERE jobs.uid = $1 AND jobs.jid = $2";
    pool.query(query, [decryptedUID, jid], (err, result) => {
      if (err) {
        console.error(`Error fetching job details: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const fetchParticularEquipmentDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { er_id } = req.body;
    const query = "SELECT * FROM equipmentrental where er_id = $1";
    pool.query(query, [er_id], (err, result) => {
      if (err) {
        console.error(`Error fetching equipment details: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const updateJobStatus = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid } = req.body;
    const updateQuery =
      "UPDATE jobs SET status = 1 WHERE uid = $2 AND jid = $3";
    pool.query(updateQuery, [decryptedUID, jid], (err, result) => {
      if (err) {
        console.error(`Error updating job status: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      }
    });
  });
});

const fetchAppliedApplications = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT j.*, jat.who_applied, jat.job_status, jat.applied_date, lpm.skills AS labourer_skills, lpm.qualification AS labourer_qualification, lpm.experience AS labourer_experience, up.dob AS labourer_dob, up.gender AS labourer_gender, up.village AS labourer_village, up.taluka AS labourer_taluka, up.district AS labourer_district, up.state AS labourer_state, up.pincode AS labourer_pincode, up.aadharcardfront AS labourer_aadharcardfront, up.aadharcardback AS labourer_aadharcardback, up.profile_img AS labourer_profile_img, u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone_number, u.user_type AS user_type FROM jobs j JOIN jobs_application_tracker jat ON j.jid = jat.jid JOIN labourers_profile_management lpm ON jat.who_applied::integer = lpm.uid JOIN user_profiles up ON lpm.uid = up.uid JOIN users u ON up.uid = u.uid WHERE j.uid = $1; ";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const fetchFarmersAcceptedApplications = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT j.*, jat.who_applied, jat.job_status, jat.applied_date, lpm.skills AS labourer_skills, lpm.qualification AS labourer_qualification, lpm.experience AS labourer_experience, up.dob AS labourer_dob, up.gender AS labourer_gender, up.village AS labourer_village, up.taluka AS labourer_taluka, up.district AS labourer_district, up.state AS labourer_state, up.pincode AS labourer_pincode, up.aadharcardfront AS labourer_aadharcardfront, up.aadharcardback AS labourer_aadharcardback, up.profile_img AS labourer_profile_img, u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone_number, u.user_type AS user_type FROM jobs j JOIN jobs_application_tracker jat ON j.jid = jat.jid JOIN labourers_profile_management lpm ON jat.who_applied::integer = lpm.uid JOIN user_profiles up ON lpm.uid = up.uid JOIN users u ON up.uid = u.uid WHERE j.uid = $1 AND jat.job_status = 2; ";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const rejectApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { jobId, whoApplied } = req.body;
    const query =
      "update jobs_application_tracker set job_status = 3 where jid = $1 and who_applied = $2";
    pool.query(query, [jobId, whoApplied], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Updated jobs_application_tracker" });
      }
    });
  });
});

const acceptApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { jobId, whoApplied } = req.body;

    const query =
      "update jobs_application_tracker set job_status = 2 where jid = $1 and who_applied = $2";
    pool.query(query, [jobId, whoApplied], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Updated jobs_application_tracker" });
      }
    });
  });
});

const acceptEquipmentApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { erId, requestId } = req.body;
    console.log(erId, requestId);
    const query1 =
      "UPDATE equipmentrental SET availability = 1 WHERE er_id = $1";
    const query2 =
      "UPDATE requests SET if_rented = 1, rented_date = NOW() WHERE request_id = $1";

    pool.query(query1, [erId], (err1, result1) => {
      if (err1) {
        console.error("Error updating equipment rental:", err1);
        res.status(500).json({ message: "Error updating equipment rental" });
      } else {
        pool.query(query2, [requestId], (err2, result2) => {
          if (err2) {
            console.error("Error updating request status:", err2);
            res.status(500).json({ message: "Error updating request status" });
          } else {
            console.log("Updated equipment rental and request status");
            res
              .status(200)
              .json({ message: "Updated equipment rental and request status" });
          }
        });
      }
    });
  });
});

const handleReturnApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { erId, requestId } = req.body;
    console.log(erId, requestId);
    const query1 =
      "UPDATE equipmentrental SET availability = 0 WHERE er_id = $1";
    const query2 =
      "UPDATE requests SET if_rented = 0, return_date = NOW() WHERE request_id = $1";

    pool.query(query1, [erId], (err1, result1) => {
      if (err1) {
        console.error("Error updating equipment rental:", err1);
        res.status(500).json({ message: "Error updating equipment rental" });
      } else {
        pool.query(query2, [requestId], (err2, result2) => {
          if (err2) {
            console.error("Error updating request status:", err2);
            res.status(500).json({ message: "Error updating request status" });
          } else {
            console.log("Updated equipment rental and request status");
            res
              .status(200)
              .json({ message: "Updated equipment rental and request status" });
          }
        });
      }
    });
  });
});

// const createCheckoutSession = asyncHand((req, res) => {
//   authenticateUser(req, res, async () => {
//     const lineItems = req.body.lineItems;

//     try {
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: lineItems,
//         mode: "payment",
//         success_url: `https://apna-bharat-server-2.onrender.com/farmers/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: "https://apna-bharat-server-2.onrender.com/farmers/cancel",
//       });

//       console.log(session);
//       res.json({ id: session.id });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         error: "An error occurred while creating the checkout session.",
//       });
//     }
//   });
// });

const createCheckoutSession = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { lineItems, customerDetails } = req.body;

    try {
      // Create a customer
      const customer = await stripe.customers.create({
        name: customerDetails.name,
        address: customerDetails.address,
      });

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `https://apna-bharat-client.vercel.app/farmers/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "https://apna-bharat-client.vercel.app/farmers/cancel",
        customer: customer.id,
      });

      console.log(session);
      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while creating the checkout session.",
      });
    }
  });
});

const handlePaymentSuccess = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { id } = req.body;
    console.log("Received Checkout Session ID:", id);

    try {
      const session = await stripe.checkout.sessions.retrieve(id);

      if (session.payment_status === "paid") {
        console.log("Payment was successful. Cart Cleared");
        res.status(200).json({ status: "success" });
      } else {
        console.log("Payment was not successful.");
        res.status(400).json({ error: "Payment was not successful." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the payment." });
    }
  });
});

const EquipmentRentalForm = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { fullFormData, decryptedUID } = req.body;

    const insertQuery = `
    INSERT INTO EquipmentRental (uid, owner_name, contact_number, contact_email, rental_location, rental_price, equipment_name, equipment_description, equipment_condition, payment_terms, usage_restrictions, aadhar_card_url, kisan_credit_card_url, pickup_delivery_options, additional_accessories, insurance_details, terms_conditions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
   `;

    const insertValues = [
      decryptedUID,
      fullFormData.ownerName,
      fullFormData.contactNumber,
      fullFormData.contactEmail,
      fullFormData.rentalLocation,
      parseInt(fullFormData.rentalPrice),
      fullFormData.equipmentName,
      fullFormData.equipmentDescription,
      fullFormData.equipmentCondition,
      fullFormData.paymentTerms,
      fullFormData.usageRestrictions,
      fullFormData.aadharCard,
      fullFormData.kisanCreditCard,
      fullFormData.pickupDeliveryOptions,
      fullFormData.additionalAccessories,
      fullFormData.insuranceDetails,
      fullFormData.termsConditions,
    ];

    pool.query(insertQuery, insertValues, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
      } else {
        res.status(200).json({ message: "Form Submitted" });
      }
    });
  });
});

const fetchAppliedApplicationsForRentedProducts = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { decryptedUID } = req.body;

    const query = ` SELECT r.request_id, r.request_date, u.uid AS requester_uid, u.name AS requester_name, u.email AS requester_email, u.phone_number AS requester_phone, up.village AS requester_village, up.taluka AS requester_taluka, up.district AS requester_district, up.state AS requester_state, up.pincode AS requester_pincode, up.profile_img as requester_profile_img, up.aadharcardfront as requester_addharCard_front, up.aadharcardback as requester_addharCard_back, e.er_id, e.equipment_name, e.equipment_description, e.rental_price, e.owner_name, e.contact_number AS owner_contact, e.contact_email AS owner_email, e.availability as availability FROM requests r JOIN users u ON r.uid = u.uid JOIN equipmentrental e ON r.er_id = e.er_id LEFT JOIN user_profiles up ON u.uid = up.uid WHERE e.uid = $1 ORDER BY r.request_date DESC; `;
    pool.query(query, [decryptedUID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
      } else {
        res.status(200).json(results.rows);
      }
    });
  });
});

const fetchRentedProducts = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { decryptedUID } = req.body;

    const query = ` SELECT r.request_id, r.request_date,r.rented_date ,u.uid AS requester_uid, u.name AS requester_name, u.email AS requester_email, u.phone_number AS requester_phone, up.village AS requester_village, up.taluka AS requester_taluka, up.district AS requester_district, up.state AS requester_state, up.pincode AS requester_pincode, up.profile_img as requester_profile_img, up.aadharcardfront as requester_addharCard_front, up.aadharcardback as requester_addharCard_back, e.er_id, e.equipment_name, e.equipment_description, e.rental_price, e.owner_name, e.contact_number AS owner_contact, e.contact_email AS owner_email, e.availability as availability FROM requests r JOIN users u ON r.uid = u.uid JOIN equipmentrental e ON r.er_id = e.er_id LEFT JOIN user_profiles up ON u.uid = up.uid WHERE e.uid = $1 and e.availability = 1 ORDER BY r.request_date DESC; `;
    pool.query(query, [decryptedUID], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
      } else {
        res.status(200).json(results.rows);
      }
    });
  });
});

const applyForRentalEquipment = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { er_id, decryptedUID } = req.body;

    const query = "INSERT INTO requests (er_id, uid) VALUES ($1, $2)";
    pool.query(query, [er_id, decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error applying for rental equipment: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Applied successfully!" });
      }
    });
  });
});

module.exports = {
  drivers_document_auth,
  farmerJobForm,
  updateFarmersAddress,
  sendProfileUpdateEmailVerification,
  fetchFarmersProfileData,
  fetchFarmersProfileIMG,
  fetchFarmersAddress,
  updateFarmersFarmDetails,
  fetchFarmersFarmData,
  getAllJobs,
  deleteJob,
  updateJobDetails,
  fetchParticularJobDetails,
  updateJobStatus,
  fetchAppliedApplications,
  acceptApplication,
  rejectApplication,
  fetchFarmersAcceptedApplications,
  createCheckoutSession,
  handlePaymentSuccess,
  EquipmentRentalForm,
  getAllEquipmentForms,
  deleteEquipmentForm,
  fetchParticularEquipmentDetails,
  UpdateEquipmentRentalForm,
  fetchAppliedApplicationsForRentedProducts,
  getAllRentalEquipmentApplications,
  applyForRentalEquipment,
  acceptEquipmentApplication,
  fetchRentedProducts,
  handleReturnApplication,
};
