// routes/feedback.ts
import { Router } from "express";
import { submitFeedback, getFeedbackByAppointment } from "../controllers/feedbackController";

const router = Router();

// שליחת משוב חדש
router.post("/", submitFeedback);

// שליפת משוב לפי מזהה פגישה (אופציונלי)
router.get("/:appointmentId", getFeedbackByAppointment);

export default router;
