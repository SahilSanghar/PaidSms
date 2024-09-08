import { Router } from "express";
import { saveRechargeHistory, saveTransactionHistory } from "./controller.js";

const router = Router();

router.get("/saveRechargeHistory", saveRechargeHistory);
router.get("/saveTransactionHistoryToDatabase", saveTransactionHistory);

export default router;
