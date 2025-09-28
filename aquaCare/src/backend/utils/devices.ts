// routes/devices.ts
import express from "express";
import { updateDeviceStatus, getDeviceStatus } from "../controllers/deviceController";

console.log("🔧 Loading device routes...");

const router = express.Router();

// POST: עדכון מצב מכשיר
router.post("/device-status", updateDeviceStatus);
console.log("🔧 POST /device-status route registered");

// GET: קבלת מצב מכשיר
router.get("/device-status/:deviceType", getDeviceStatus);
console.log("🔧 GET /device-status/:deviceType route registered");

console.log("🔧 Device routes loaded successfully");

export default router;

