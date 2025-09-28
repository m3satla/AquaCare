// controllers/feedbackController.ts
import { Request, Response } from "express";
import Feedback from "../models/Feedback";

// ✅ שליחת משוב עם מניעת שליחה כפולה
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { clientId, appointmentId, rating, comment } = req.body;

    // בדיקה אם כבר נשלח משוב לפגישה הזו
    const existingFeedback = await Feedback.findOne({ appointmentId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        error: "כבר נשלח משוב עבור הפגישה הזו.",
      });
    }

    const feedback = new Feedback({ clientId, appointmentId, rating, comment });
    await feedback.save();

    res.status(201).json({ success: true, message: "תודה על המשוב!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליחת משוב" });
  }
};

// ✅ שליפת כל המשובים לפי לקוח
export const getFeedbacksByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const feedbacks = await Feedback.find({ clientId });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת משובים" });
  }
};

// ✅ שליפת משוב לפי מזהה פגישה (למייל)
export const getFeedbackByAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const feedback = await Feedback.findOne({ appointmentId });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "לא נמצא משוב לפגישה זו" });
    }

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת המשוב" });
  }
};

// ✅ (אופציונלי) שליפת כל המשובים (לניהול)
export const getAllFeedbacks = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת כלל המשובים" });
  }
};
