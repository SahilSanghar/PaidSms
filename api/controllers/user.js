import {
  generateOTP,
  resendForgototp,
  resendotp,
  sendOTPByEmail,
  storeForgotOTP,
  storeOTP,
} from "../lib/utils.js";
import { ForgotOTPModel, OTPModel } from "../models/otp.js";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { ApiWalletuser } from "./../models/apiAndWallet.js";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { Order } from "../models/order.js";
import crypto from "crypto";
import { generateTronAddress } from "../lib/tron.js";

async function getUserBalance(userId) {
  const user = await ApiWalletuser.findOne({ userId });
  return user ? user.balance : 0; // Return 0 or any default value if user is not found
}

const signup = async (req, res) => {
  const { email, captcha } = req.body;

  // List of allowed email domains
  const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
  ];

  // Function to get the domain from the email
  const getEmailDomain = (email) => {
    return email.split("@")[1];
  };

  // Check if the email domain is allowed
  const emailDomain = getEmailDomain(email);
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({ error: "Use Valid Email" });
  }

  if (!captcha) {
    return res.status(400).json({ error: "Please complete the CAPTCHA" });
  }

  try {
    // Verify CAPTCHA token
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newOtp = generateOTP();

    const otpText = "Your OTP for registration is";
    const subText = "OTP verification";

    const sendOpt = await sendOTPByEmail(email, newOtp, otpText, subText);

    if (sendOpt) {
      const result = await storeOTP(email, newOtp);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({
        status: "PENDING",
        message: "Verification otp sent.",
        email,
      });
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Failed to sign up user" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Check if the email already exists in the user collection
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Find the OTP document for the provided email
    const otpDoc = await OTPModel.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    // Compare the provided OTP with the stored hashed OTP
    const validOTP = await bcrypt.compare(otp, otpDoc.otp);

    if (!validOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Delete the OTP document
    await otpDoc.deleteOne();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user document
    const newUser = new UserModel({
      email,
      password: hashedPassword,
    });

    // Save the new user document
    const data = await newUser.save();
    const api_key = crypto.randomUUID().toString("hex").split("-").join("");

    const { privateKey, address } = await generateTronAddress();

    const api_key_wallet = new ApiWalletuser({
      userId: data._id,
      api_key,
      balance: 0,
      trxAddress: address,
      trxPrivateKey: privateKey,
    });

    await api_key_wallet.save();

    res
      .status(200)
      .json({ status: "VERIFIED", message: "User registered successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User Already Exist" });
    }

    // Generate a new OTP
    const newOtp = generateOTP();

    // Send the new OTP via email
    const otpText = "Your new OTP for registration is";
    const subText = "OTP verification";
    const sendOpt = await sendOTPByEmail(email, newOtp, otpText, subText);

    if (sendOpt) {
      // Update the OTP in the database
      const result = await resendotp(email, newOtp);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({
        status: "PENDING",
        message: "New OTP sent successfully.",
        email,
      });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

const login = async (req, res) => {
  const { email, password, captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ error: "Please complete the CAPTCHA" });
  }

  try {
    // Verify CAPTCHA token
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Get the trxAddress and privatekey

    const api_key_wallet = await ApiWalletuser.findOne({ userId: user._id });

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        trxAddress: api_key_wallet.trxAddress,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User does not exist. Please sign up for an account." });
    }

    // Generate a new OTP
    const newOtp = generateOTP();

    const otpText = "Your OTP for Changing Password is";
    const subText = "Forgot Password OTP verification";

    const sendOtpResult = await sendOTPByEmail(email, newOtp, otpText, subText);

    if (sendOtpResult) {
      const result = await storeForgotOTP(email, newOtp);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({
        status: "PENDING",
        message: "Forgot Password OTP sent successfully.",
        email,
      });
    }
  } catch (error) {
    console.error("Error sending OTP for forgot password:", error);
    res.status(500).json({ error: "Failed to send OTP for forgot password" });
  }
};

const resendForgotOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "User Does Not Exists" });
    }

    // Generate a new OTP
    const newOtp = generateOTP();

    // Send the new OTP via email
    const otpText = "Your new OTP for Changing Password is";
    const subText = "Forgot Password OTP verification";
    const sendOpt = await sendOTPByEmail(email, newOtp, otpText, subText);

    if (sendOpt) {
      // Update the OTP in the database
      const result = await resendForgototp(email, newOtp);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({
        status: "PENDING",
        message: "New OTP sent successfully.",
        email,
      });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

const forgotVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP document for the provided email
    const otpDoc = await ForgotOTPModel.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ error: "No OTP sent." });
    }

    // Compare the provided OTP with the stored hashed OTP
    const validOTP = await bcrypt.compare(otp, otpDoc.otp);

    if (!validOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // If OTP is valid, return success response
    res
      .status(200)
      .json({ status: "VERIFIED", message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

const changePasswordUnauthenticated = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the OTP document for the provided email
    const otpDoc = await ForgotOTPModel.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ error: "OTP not verified." });
    }

    // Delete the OTP document
    await otpDoc.deleteOne();

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(password, 12);

    // Find the user document by email and update the password
    await UserModel.updateOne({ email }, { password: newHashedPassword });

    res.status(200).json({
      status: "SUCCESS",
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const changePasswordAuthenticated = async (req, res) => {
  const { currentPassword, newPassword, userId, captcha } = req.body;

  if (!captcha) {
    return res.status(400).json({ error: "Please complete the CAPTCHA" });
  }

  try {
    // Verify CAPTCHA token
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      return res.status(400).json({ error: "Invalid CAPTCHA" });
    }
    // Assuming req.user is populated by the isAuthenticated middleware

    // Find the user by userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const googleSignup = async (req, res) => {
  const { token } = req.body;

  try {
    // Fetch user data from Google OAuth 2.0 userinfo endpoint
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // Check if response status is 200 (OK)
    if (response.status === 200) {
      const profile = await response.json();

      // Check if user already exists in the database
      let user = await UserModel.findOne({ email: profile.email });

      if (!user) {
        // If user does not exist, create a new user record
        const newUser = new UserModel({
          googleId: profile.id,
          displayName: profile.name,
          email: profile.email,
          profileImg: profile.picture,
        });

        // Save the new user record
        const savedUser = await newUser.save();

        // Generate a new API key
        const api_key = crypto.randomUUID().toString("hex").split("-").join("");

        const { privateKey, address } = await generateTronAddress();

        // Create a new wallet record
        const api_key_wallet = new ApiWalletuser({
          userId: savedUser._id,
          api_key,
          balance: 0,
          trxAddress: address,
          trxPrivateKey: privateKey,
        });

        await api_key_wallet.save();

        // Generate a JWT token
        const token = jwt.sign(
          {
            email: savedUser.email,
            userId: savedUser._id,
            logintype: "google",
            trxAddress: api_key_wallet.trxAddress,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );

        return res.status(200).json({ token });
      } else {
        return res
          .status(400)
          .json({ error: "User already exists, Please Login." });
      }
    } else {
      // Handle error if the response status is not 200
      return res
        .status(response.status)
        .json({ error: "Failed to fetch user data" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Fetch user data from Google OAuth 2.0 userinfo endpoint
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // Check if response status is 200 (OK)
    if (response.status === 200) {
      const profile = await response.json();

      // Find user in the database based on email
      const user = await UserModel.findOne({ email: profile.email });

      if (!user || !user.googleId) {
        return res.status(400).json({
          error: "User not found, Please register.",
        });
      } else {
        // Get the user's wallet information
        const api_key_wallet = await ApiWalletuser.findOne({
          userId: user._id,
        });

        // Generate a JWT token
        const token = jwt.sign(
          {
            email: user.email,
            logintype: "google",
            userId: user._id,
            trxAddress: api_key_wallet.trxAddress,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );

        return res.status(200).json({ token });
      }
    } else {
      // Handle error if the response status is not 200
      return res
        .status(response.status)
        .json({ error: "Failed to fetch user data" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Query user data
    const userData = await UserModel.find({}, "-password");

    if (!userData || userData.length === 0) {
      return res.status(404).json({ error: "No user data" });
    }

    // Map over user data and fetch balance for each user
    const userDataWithBalance = await Promise.all(
      userData.map(async (user) => {
        const balance = await getUserBalance(user._id);
        return { ...user._doc, balance };
      })
    );

    res.status(200).json(userDataWithBalance);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const blockUnblockUser = async (req, res) => {
  try {
    const { blocked, userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.blocked = blocked;
    await user.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "User Saved Successfully",
    });
  } catch (error) {
    console.error("Error Blocking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const blockedUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const blocked = user.blocked;

    if (blocked) {
      return res.status(200).json({
        message: "User is blocked",
      });
    } else {
      return res.status(200).json({
        message: "User is not blocked",
      });
    }
  } catch (error) {
    console.error("Error blocked user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await UserModel.find({ blocked: true });
    res.status(200).json({ data: blockedUsers });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getuser = async (req, res) => {
  try {
    const { userId } = req.query;

    // Find the user by ID
    const user = await UserModel.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the user's API wallet data
    const apikeywallet = await ApiWalletuser.findOne({ userId });

    if (!apikeywallet) {
      return res.status(404).json({ error: "API wallet not found" });
    }

    // Combine user data with API wallet data
    const userDataWithWallet = {
      ...user._doc,
      balance: apikeywallet.balance || 0,
      api_key: apikeywallet.api_key,
      trxAddress: apikeywallet.trxAddress,
      trxPrivateKey: apikeywallet.trxPrivateKey,
    };

    res.status(200).json(userDataWithWallet);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

const getOrdersByUserId = async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await Order.find({ userId }).sort({ orderTime: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export {
  signup,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  forgotVerifyOTP,
  resendForgotOTP,
  changePasswordUnauthenticated,
  changePasswordAuthenticated,
  googleLogin,
  googleSignup,
  getAllUsers,
  blockUnblockUser,
  blockedUser,
  getuser,
  getOrdersByUserId,
  getAllBlockedUsers,
};
