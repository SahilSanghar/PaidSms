import express from "express";
import cors from "cors";
import { connectDB } from "../lib/db.js";
import serverDataRoute from "../routes/serverData.js";
import userRoute from "../routes/user.js";
import ApiWalletRoute from "../routes/apiAndWallet.js";
import historyRoute from "../routes/History.js";
import serverRoute from "../routes/servers.js";
import serverDiscountRoute from "../routes/serverDiscount.js";
import serviceDiscountRoute from "../routes/serviceDiscount.js";
import getServiceData from "../routes/getData.js";
import userDiscountRoute from "../routes/userDiscount.js";
import dataRoute from "../data/routes.js";
import services from "../routes/service.js";
import unsendTrxRoute from "../routes/unsend-trx.js";
import RechargeRoute from "../routes/recharge-api.js";
import BlockUsers from "../routes/block-users.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../middleware/error.js";
import getServerTwoToken from "./../lib/getServertwoToken.js";
import { checkAndCancelExpiredOrders } from "../controllers/service.js";
import { runFraudCheck } from "../lib/blockUsersFraud.js";
import { scheduleJob } from "../lib/telegram-recharge-transaction.js";
import { scheduleDailyTask, scheduleOneAMApiCall } from "../lib/utils.js";

const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;
const allowedOrigins = process.env.ALLOWEDORIGINS;

connectDB(mongoURI);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the request origin is in the allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", serverDataRoute);
app.use("/api", userRoute);
app.use("/api", ApiWalletRoute);
app.use("/api", historyRoute);
app.use("/api", serverRoute);
app.use("/api", serverDiscountRoute);
app.use("/api", serviceDiscountRoute);
app.use("/api", userDiscountRoute);
app.use("/api", getServiceData);
app.use("/api", dataRoute);
app.use("/api", services);
app.use("/api", unsendTrxRoute);
app.use("/api", RechargeRoute);
app.use("/api", BlockUsers);

app.use(errorMiddleware);

getServerTwoToken();
// Schedule the checkAndCancelExpiredOrders function to run every 5 minutes
setInterval(checkAndCancelExpiredOrders, 5000); // 5 minutes in milliseconds

// Call the function every 5 seconds
setInterval(runFraudCheck, 5000);

scheduleJob();

scheduleOneAMApiCall();

scheduleDailyTask();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
