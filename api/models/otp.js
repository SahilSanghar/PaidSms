import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OTPModel =
  mongoose.models.OTPModel || mongoose.model("verifyOtp", schema);

const ForgotOTPModel =
  mongoose.models.ForgotOTPModel || mongoose.model("forgotOtp", schema);

export { OTPModel, ForgotOTPModel };
