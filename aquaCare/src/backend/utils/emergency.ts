// routes/emergency.ts
import express from "express";
import { getEmergencyStatus, updateEmergencyStatus } from "../controllers/emergencyController";
import appointmentsRoutes from "./appointment";
import paymentsRoutes from "./payments";
import summaryRoutes from "./summary";
import facilityStatusRoutes from "./facilityStatus";
import remindersRoutes from "./reminders";
import optimizationRoutes from "./optimization";
import requestsRouter from "./requests";
import activityLogRoutes from "./activityLog";
const router = express.Router();

router.use("/appointments", appointmentsRoutes)
.use("/payments", paymentsRoutes)
.use("/summary", summaryRoutes)
.use("/facility-status", facilityStatusRoutes)
.use("/reminders", remindersRoutes)
.use("/optimization", optimizationRoutes)
.use("/requests", requestsRouter)
.use("/activity-log", activityLogRoutes);

// GET: מצב נוכחי
router.get("/emergency-status", getEmergencyStatus);

// POST: עדכון מצב
router.post("/emergency-status", updateEmergencyStatus);



export default router;
