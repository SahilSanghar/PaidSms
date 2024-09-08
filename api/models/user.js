import mongoose from "mongoose";

// Define user schema
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    blocked_reason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.UserModel || mongoose.model("users", schema);
