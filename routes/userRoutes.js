import express from "express";
import {
  deleteOnce,
  getAll,
  getById,
  resetPassword,
  sendOTPResetEmail,
  updateOnce,
  updatePassword,
  updatePhoto
} from "../controllers/userController.js";
import { register, login, logout,emailVerification } from "../controllers/authController.js";
import multer from "../middlewares/multer-config.js";
import { checkCurrentUser } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes without jwt  
router.route("/").get(getAll);
router.route("/:id").delete(deleteOnce);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/OTPReset").post(sendOTPResetEmail);
router.route("/ResetPassword").post(resetPassword);
router.route("/VerifyEmail").post(emailVerification);


// Routes with jwt 
router.route("/showProfile").get(checkCurrentUser,getById);
router.put("/update", checkCurrentUser, updateOnce);
router.route("/updatePhoto").put(checkCurrentUser,multer, updatePhoto);
router.route("/updatePassword").put(checkCurrentUser,updatePassword);
router.route("/logout").post(checkCurrentUser,logout);



export default router;
