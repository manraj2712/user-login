const express = require("express");

const router = express.Router();

const {isRegistered, isLoggedIn} = require("../middleware/user");
const {isRegisteredUser,loginWithEmail,signupWithEmail,signupWithPhone,verifyOtp,sendOtp,getUserDetails} = require("../controllers/userController");
const { append } = require("express/lib/response");

router.route("/is-registered-user").post(isRegisteredUser);
router.route("/signup-with-email").post(signupWithEmail);
router.route("/signup-with-phone").post(signupWithPhone);
router.route("/login-with-email").post(isRegistered,loginWithEmail);
router.route("/sendotp").post(isRegistered,sendOtp);
router.route("/verifyotp").post(verifyOtp);
router.route("/get-user-details").post(isLoggedIn,getUserDetails);

module.exports = router;