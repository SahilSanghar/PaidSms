import { ApiWalletuser } from "../models/apiAndWallet.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { RechargeApiModel } from "../models/rechange-api.js";
import moment from "moment";
import { ServerModel } from "../models/servers.js";

const api_key = async (req, res) => {
  try {
    const { userId } = req.query;

    const maintainanceServerData = await ServerModel.findOne({ server: 0 });
    if (maintainanceServerData.maintainance) {
      return res.status(403).json({ error: "Site is under maintenance." });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await ApiWalletuser.findOne({ userId });
    res.status(200).json({ api_key: user.api_key });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const balance = async (req, res) => {
  try {
    const { api_key } = req.query;

    const maintainanceServerData = await ServerModel.findOne({ server: 0 });
    if (maintainanceServerData.maintainance) {
      return res.status(403).json({ error: "Site is under maintenance." });
    }

    if (!api_key) {
      return res.status(400).json({ error: "Invalid Api Key" });
    }

    const user = await ApiWalletuser.findOne({ api_key });
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Invalid Api Key" });
  }
};
const changeApikey = async (req, res) => {
  try {
    const { userId } = req.query;

    const maintainanceServerData = await ServerModel.findOne({ server: 0 });
    if (maintainanceServerData.maintainance) {
      return res.status(403).json({ error: "Site is under maintenance." });
    }

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }
    const newApikey = crypto.randomUUID().toString("hex").split("-").join("");

    await ApiWalletuser.findOneAndUpdate(
      { userId },
      {
        api_key: newApikey,
      }
    );
    res
      .status(200)
      .json({ message: "Api key updated successfully", api_key: newApikey });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upiQRUpdate = async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).send("QR code file is required");
    }

    // Extract base64 data from the file object
    const base64Data = file.split(",")[1];
    const bufferData = Buffer.from(base64Data, "base64");

    // Define the file path where you want to save the QR code
    const filePath = join(__dirname, "uploads", "upi-qr-code.png");

    // Delete previous file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Save the new file
    fs.writeFileSync(filePath, bufferData);

    res.status(200).send("QR code updated successfully");
  } catch (error) {
    console.error("Error updating UPI:", error);
    res.status(500).send("Server error");
  }
};

const updateBalance = async (req, res) => {
  try {
    const { userId, new_balance } = req.body;

    if (!userId || new_balance === undefined) {
      return res
        .status(400)
        .json({ message: "User ID and new_balance are required" });
    }

    // Validate new_balance
    const parsedBalance = parseFloat(new_balance);
    if (isNaN(parsedBalance)) {
      return res.status(400).json({ message: "Invalid balance value" });
    }

    // Find the user by userId
    const user = await ApiWalletuser.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the difference between new balance and old balance
    const oldBalance = parseFloat(user.balance);
    const balanceDifference = parsedBalance - oldBalance;

    // Save the recharge history
    if (balanceDifference !== 0) {
      const formattedDate = moment().format("MM/DD/YYYYThh:mm:ss A");

      const rechargeHistoryResponse = await fetch(
        `${process.env.BASE_URL}/api/save-recharge-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            transaction_id: Date.now() * 1000, // Unique transaction ID
            amount: balanceDifference.toFixed(2),
            payment_type: "Admin Added",
            date_time: formattedDate,
            status: "Received",
          }),
        }
      );

      if (!rechargeHistoryResponse.ok) {
        const error = await rechargeHistoryResponse.json();
        console.error("Error saving recharge history:", error);
        return res
          .status(rechargeHistoryResponse.status)
          .json({ error: error.message });
      }
    }

    res
      .status(200)
      .json({ message: "Balance updated successfully", balance: user.balance });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to update balance" });
  }
};

const getUpiQR = async (req, res) => {
  try {
    const maintainanceServerData = await ServerModel.findOne({ server: 0 });
    if (maintainanceServerData.maintainance) {
      return res.status(403).json({ error: "Site is under maintenance." });
    }
    // Define the file path where the QR code is saved
    const filePath = join(__dirname, "uploads", "upi-qr-code.png");

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Send the file as a response
      res.sendFile(filePath);
    } else {
      res.status(404).send("QR code file not found");
    }
  } catch (error) {
    console.error("Error getting UPI QR code:", error);
    res.status(500).send("Server error");
  }
};

const createOrUpdateApiKey = async (req, res) => {
  try {
    const { api_key, recharge_type } = req.body;

    if (!recharge_type) {
      return res.status(400).json({ error: "recharge_type is required." });
    }

    if (api_key === undefined || api_key === null) {
      return res.status(400).json({ error: "API key is required." });
    }

    let existingApi = await RechargeApiModel.findOne({ recharge_type });

    if (existingApi) {
      // Update the existing API key
      existingApi.api_key = api_key;
      await existingApi.save();
      return res.status(200).json({ message: "API key updated successfully." });
    } else {
      // Create a new API key
      const newApi = new RechargeApiModel({ recharge_type, api_key });
      await newApi.save();
      return res.status(201).json({ message: "API key created successfully." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getApiKey = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: "recharge_type is required" });
    }

    const doc = await RechargeApiModel.findOne({ recharge_type: type });

    if (!doc) {
      return res.status(404).json({ message: "API key not found" });
    }

    res.status(200).json({ api_key: doc.api_key });
  } catch (error) {
    console.error("Error fetching API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  api_key,
  balance,
  changeApikey,
  upiQRUpdate,
  createOrUpdateApiKey,
  updateBalance,
  getApiKey,
  getUpiQR,
};
