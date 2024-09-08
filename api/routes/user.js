import { Router } from "express";
import {
  blockedUser,
  blockUnblockUser,
  changePasswordAuthenticated,
  changePasswordUnauthenticated,
  forgotPassword,
  forgotVerifyOTP,
  getAllBlockedUsers,
  getAllUsers,
  getOrdersByUserId,
  getuser,
  googleLogin,
  googleSignup,
  login,
  resendForgotOTP,
  resendOTP,
  signup,
  verifyOTP,
} from "../controllers/user.js";

const app = Router();

app.post("/signup", signup);
app.post("/verify-otp", verifyOTP);
app.post("/resend-otp", resendOTP);
app.post("/login", login);
app.post("/forgot-password", forgotPassword);
app.post("/resend-forgot-otp", resendForgotOTP);
app.post("/verify-forgot-otp", forgotVerifyOTP);
app.post("/change-password-unauthenticated", changePasswordUnauthenticated);
app.post("/change-password-authenticated", changePasswordAuthenticated);
app.post("/google-login", googleLogin);
app.post("/google-signup", googleSignup);

// Admin Apis
app.get("/get-all-users", getAllUsers);
app.get("/get-user", getuser);
app.post("/user", blockUnblockUser);
app.get("/blocked-user", blockedUser);
app.get("/get-all-blocked-users", getAllBlockedUsers);
app.get("/orders", getOrdersByUserId);

export default app;
