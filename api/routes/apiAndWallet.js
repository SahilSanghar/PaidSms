import { Router } from "express";

import {
  api_key,
  balance,
  changeApikey,
  createOrUpdateApiKey,
  getApiKey,
  getUpiQR,
  updateBalance,
  upiQRUpdate,
} from "../controllers/apiAndWallet.js";

const app = Router();

app.get("/api_key", api_key);
app.get("/balance", balance);
app.get("/change_api_key", changeApikey);
app.post("/edit-balance", updateBalance);
app.post("/update-qr", upiQRUpdate);
app.get("/get-qr", getUpiQR);
app.post("/add-recharge-api", createOrUpdateApiKey);
app.get("/get-reacharge-api", getApiKey);

export default app;
