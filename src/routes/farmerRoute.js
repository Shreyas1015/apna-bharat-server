const express = require("express");

const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  sendProfileUpdateEmailVerification,
  drivers_document_auth,
  fetchFarmersProfileData,
  fetchFarmersProfileIMG,
  updateFarmersAddress,
  fetchFarmersAddress,
  updateFarmersFarmDetails,
  fetchFarmersFarmData,
  farmerJobForm,
  getAllJobs,
  deleteJob,
  updateJobDetails,
  fetchParticularJobDetails,
  updateJobStatus,
  fetchAppliedApplications,
  rejectApplication,
  acceptApplication,
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
} = require("../controllers/farmerController");
const router = express.Router();

router.get("/drivers_document_auth", drivers_document_auth);
router.post(
  "/sendProfileUpdateEmailVerification",
  authenticateToken,
  sendProfileUpdateEmailVerification
);
router.post(
  "/fetchFarmersProfileData",
  authenticateToken,
  fetchFarmersProfileData
);
router.post(
  "/fetchFarmersProfileIMG",
  authenticateToken,
  fetchFarmersProfileIMG
);

router.post("/fetchFarmersAddress", authenticateToken, fetchFarmersAddress);
router.post("/updateFarmersAddress", authenticateToken, updateFarmersAddress);
router.post(
  "/updateFarmersFarmDetails",
  authenticateToken,
  updateFarmersFarmDetails
);
router.post("/fetchFarmersFarmData", authenticateToken, fetchFarmersFarmData);
router.post("/farmerJobForm", authenticateToken, farmerJobForm);
router.post("/getAllJobs", authenticateToken, getAllJobs);
router.delete("/deleteJob", authenticateToken, deleteJob);
router.post("/updateJobDetails", authenticateToken, updateJobDetails);
router.post(
  "/fetchParticularJobDetails",
  authenticateToken,
  fetchParticularJobDetails
);
router.post("/updateJobStatus", authenticateToken, updateJobStatus);
router.post("/rejectApplication", authenticateToken, rejectApplication);
router.post("/acceptApplication", authenticateToken, acceptApplication);
router.post(
  "/fetchFarmersAcceptedApplications",
  authenticateToken,
  fetchFarmersAcceptedApplications
);
router.post(
  "/fetchAppliedApplications",
  authenticateToken,
  fetchAppliedApplications
);
router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.post("/success", authenticateToken, handlePaymentSuccess);
router.post("/EquipmentRentalForm", authenticateToken, EquipmentRentalForm);
router.post("/getAllEquipmentForms", authenticateToken, getAllEquipmentForms);
router.post(
  "/applyForRentalEquipment",
  authenticateToken,
  applyForRentalEquipment
);
router.post(
  "/getAllRentalEquipmentApplications",
  authenticateToken,
  getAllRentalEquipmentApplications
);
router.post(
  "/fetchAppliedApplicationsForRentedProducts",
  authenticateToken,
  fetchAppliedApplicationsForRentedProducts
);
router.delete("/deleteEquipmentForm", authenticateToken, deleteEquipmentForm);
router.post(
  "/UpdateEquipmentRentalForm",
  authenticateToken,
  UpdateEquipmentRentalForm
);
router.post(
  "/fetchParticularEquipmentDetails",
  authenticateToken,
  fetchParticularEquipmentDetails
);
router.post(
  "/acceptEquipmentApplication",
  authenticateToken,
  acceptEquipmentApplication
);
router.post("/fetchRentedProducts", authenticateToken, fetchRentedProducts);
router.post(
  "/handleReturnApplication",
  authenticateToken,
  handleReturnApplication
);

module.exports = router;
