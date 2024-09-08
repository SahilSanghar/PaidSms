import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";
import { ForgotOTPModel, OTPModel } from "../models/otp.js";
import { ApiWalletuser } from "../models/apiAndWallet.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const OTP_EXPIRATION_TIME = 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production environment
  sameSite: "None", // Required for cross-origin requests
  maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiry time
};
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function sendOTPByEmail(email, otp, text, subject) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `${subject}`,
    text: `${text}: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
}

async function storeOTP(email, otp) {
  try {
    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Find existing OTPs for the same email and delete them
    const existingOTP = await OTPModel.findOne({ email });

    if (existingOTP) {
      // OTP already exists, return an error message
      return { error: "OTP already sent, please resend to get a new OTP." };
    }

    // Create a new OTP document
    const newOTP = new OTPModel({ email, otp: hashedOTP });

    // Save the new OTP document
    await newOTP.save();

    // Set a timeout to automatically delete the OTP after expiration
    setTimeout(async () => {
      try {
        await OTPModel.deleteOne({ email });
        console.log("OTP deleted after expiration");
      } catch (error) {
        console.error("Error deleting OTP:", error);
      }
    }, OTP_EXPIRATION_TIME);

    return newOTP;
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error; // Propagate the error for handling in the calling function
  }
}

async function resendotp(email, otp) {
  try {
    // Hash the new OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete all existing OTPs for the same email
    await OTPModel.deleteMany({ email });

    // Create a new OTP document
    const newOTP = new OTPModel({ email, otp: hashedOTP });

    // Save the new OTP document
    await newOTP.save();

    // Set a timeout to automatically delete the OTP after expiration
    setTimeout(async () => {
      await OTPModel.deleteOne({ email });
      console.log("OTP deleted after expiration");
    }, OTP_EXPIRATION_TIME);

    return newOTP;
  } catch (error) {
    console.error("Error updating OTP:", error);
    throw error; // Propagate the error for handling in the calling function
  }
}

async function storeForgotOTP(email, otp) {
  try {
    // Hash the OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Find existing OTPs for the same email and delete them
    const existingOTP = await ForgotOTPModel.findOne({ email });

    if (existingOTP) {
      // OTP already exists, return an error message
      return { error: "OTP already sent, please resend to get a new OTP." };
    }

    // Create a new OTP document
    const newOTP = new ForgotOTPModel({ email, otp: hashedOTP });

    // Save the new OTP document
    await newOTP.save();

    // Set a timeout to automatically delete the OTP after expiration
    setTimeout(async () => {
      try {
        await ForgotOTPModel.deleteOne({ email });
        console.log("OTP deleted after expiration");
      } catch (error) {
        console.error("Error deleting OTP:", error);
      }
    }, OTP_EXPIRATION_TIME);

    return newOTP;
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error; // Propagate the error for handling in the calling function
  }
}

async function resendForgototp(email, otp) {
  try {
    // Hash the new OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete all existing OTPs for the same email
    await ForgotOTPModel.deleteMany({ email });

    // Create a new OTP document
    const newOTP = new ForgotOTPModel({ email, otp: hashedOTP });

    // Save the new OTP document
    await newOTP.save();

    // Set a timeout to automatically delete the OTP after expiration
    setTimeout(async () => {
      await ForgotOTPModel.deleteOne({ email });
      console.log("OTP deleted after expiration");
    }, OTP_EXPIRATION_TIME);

    return newOTP;
  } catch (error) {
    console.error("Error updating OTP:", error);
    throw error; // Propagate the error for handling in the calling function
  }
}

const getIpDetails = async (req) => {
  // Get the IP address
  const ip = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0].trim()
    : req.connection.remoteAddress;

  try {
    console.log(ip);
    // Make a request to the IP-API service
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    // Check if the request was successful
    if (data.status === "fail") {
      throw new Error(data.message);
    }

    // Extract required details
    const {
      city,
      regionName: state,
      zip: pincode,
      country,
      isp: serviceProvider,
    } = data;

    // Return the IP details
    return { city, state, pincode, country, serviceProvider, ip };
  } catch (error) {
    // Handle error (e.g., log it, send a response, etc.)
    return {
      city: "unknown",
      state: "unknown",
      pincode: "unknown",
      country: "unknown",
      serviceProvider: "unknown",
      ip,
    };
  }
};

const urls = [
  "https://php.paidsms.in/p/fastsms.php",
  "https://php.paidsms.in/p/5sim.php",
  "https://php.paidsms.in/p/smshub.php",
  "https://php.paidsms.in/p/tigersms.php",
  "https://php.paidsms.in/p/grizzlysms.php",
  "https://php.paidsms.in/p/tempnumber.php",
  "https://php.paidsms.in/p/smsmansingle.php",
  "https://php.paidsms.in/p/smsmanmulti.php",
  "https://php.paidsms.in/p/cpay.php",
];

const fetchUrlsWithDelay = async (urls, delay) => {
  const results = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.text(); // Assuming the response is text
      results.push(data);
      console.log(`Fetched data from ${url}:`, data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return results;
};

export const scheduleDailyTask = () => {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0); // Set to next midnight

  const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

  setTimeout(() => {
    runDailyTask();
    setInterval(runDailyTask, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }, timeUntilMidnight);
};

const runDailyTask = async () => {
  console.log("Running daily URL fetch task...");
  await fetchUrlsWithDelay(urls, 10000); // 10 seconds delay
};

// Function to calculate the time until midnight
const makeApiCall = async () => {
  try {
    await fetch(`${process.env.BASE_URL}/api/save-server-data-once`);
  } catch (error) {
    console.error("Error making API call:", error);
  }
};

// Function to calculate the time until 1:00 AM
const getTimeUntilOneAM = () => {
  const now = new Date();
  const oneAM = new Date();
  oneAM.setHours(1, 0, 0, 0); // Set to 1:00 AM of the next day

  if (now > oneAM) {
    oneAM.setDate(oneAM.getDate() + 1); // Move to the next day if 1:00 AM has already passed
  }

  return oneAM - now; // Time in milliseconds
};

// Schedule the API call at 1:00 AM
export const scheduleOneAMApiCall = () => {
  const timeUntilOneAM = getTimeUntilOneAM();

  // Set a timeout to run at 1:00 AM
  setTimeout(() => {
    // Call the function immediately at 1:00 AM
    makeApiCall();

    // Schedule subsequent calls every 24 hours
    setInterval(makeApiCall, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }, timeUntilOneAM);
};

export {
  generateOTP,
  resendotp,
  sendOTPByEmail,
  storeOTP,
  storeForgotOTP,
  resendForgototp,
  getIpDetails,
};
