// Assuming RechargeHistory is an array of objects containing recharge data

import { RechargeHistory } from "./RechargeHistory.js";
import { rechargeHistory, transactionHistory } from "./../models/history.js";
import { TransactionHistory } from "./TransactionHistory.js";

export const saveRechargeHistory = async (req, res) => {
  try {
    // Iterate over the RechargeHistory array
    for (const recharge of RechargeHistory) {
      // Create a new document using the Mongoose model and save it to the database
      await rechargeHistory.create({
        userId: recharge.userId,
        transaction_id: recharge.transaction_id,
        amount: recharge.amount,
        payment_type: recharge.payment_type,
        date_time: recharge.date_time,
        status: recharge.status,
      });
    }
    res.json({ message: "Recharge history saved successfully." });
  } catch (error) {
    console.error("Error saving recharge history:", error);
  }
};

export const saveTransactionHistory = async (req, res) => {
  try {
    // Iterate over the RechargeHistory array
    for (const transaction of TransactionHistory) {
      // Create a new document using the Mongoose model and save it to the database
      await transactionHistory.create({
        userId: transaction.userId,
        id: transaction.id,
        number: transaction.number,
        otp: transaction.otp,
        date_time: transaction.date_time,
        service: transaction.service,
        server: transaction.server,
        price: transaction.price,
        status: transaction.status,
      });
    }
    res.json({ message: "Transaction history saved successfully." });
  } catch (error) {
    console.error("Error saving transaction history:", error);
  }
};
