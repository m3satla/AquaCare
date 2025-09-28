import express from "express";
import { getAllPayments, getPaymentsByPool, getPaymentsByUser, createPayment, getMockCards } from "../controllers/payments";

const router = express.Router();

// שליפת כל התשלומים
router.get("/", getAllPayments);

// Mock cards list
router.get("/mock/cards", getMockCards);

// שליפת תשלומים לפי בריכה (למנהלים)
router.get("/pool/:poolId", getPaymentsByPool);

// שליפת תשלומים לפי משתמש
router.get("/user/:userId", getPaymentsByUser);

// יצירת תשלום חדש
router.post("/", createPayment);

export default router;
