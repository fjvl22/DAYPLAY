import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/checkout", authMiddleware, createCheckoutSession);

export default router;
