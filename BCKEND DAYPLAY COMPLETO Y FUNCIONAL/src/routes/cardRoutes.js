import express from "express";
import { addCard } from "../controllers/card_controller.js";

const router = express.Router();
router.post("/", addCard);
export default router;
