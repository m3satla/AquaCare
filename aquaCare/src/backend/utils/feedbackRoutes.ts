// routes/feedbackRoutes.ts
import { Router } from "express";
import { submitFeedback, getFeedbacksByClient } from "../controllers/feedbackController";

const router = Router();

router.post("/", submitFeedback); // שליחת משוב
router.get("/by-client/:clientId", getFeedbacksByClient); // צפייה במשובים של לקוח מסוים

export default router;
