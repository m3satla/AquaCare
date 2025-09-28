import express from "express";
import ActionModel from "../models/action";

const router = express.Router();

// ✅ שליפת כל ההיסטוריה של הפעולות
router.get("/", async (req, res) => {
  try {
    const actions = await ActionModel.find().sort({ timestamp: -1 });
    res.json(actions);
  } catch (error: any) {
    console.error("❌ שגיאה בטעינת הפעולות:", error);
    res.status(500).json({ error: "שגיאה בטעינת ההיסטוריה" });
  }
});

export default router;
