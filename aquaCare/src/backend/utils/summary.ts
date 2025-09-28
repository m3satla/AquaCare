import { Router } from "express";
import {
  getTodaySummary,
  upsertTodaySummary,
  getSummaryByDate,
  getSummaryRange,
  deleteSummaryById,
} from "../controllers/";

const router = Router();

// שליפת הסיכום של היום
router.get("/today", getTodaySummary);

// יצירה או עדכון של הסיכום של היום
router.post("/today", upsertTodaySummary);

// שליפת סיכום לפי תאריך (yyyy-mm-dd)
router.get("/date/:date", getSummaryByDate);

// שליפת סיכומים לפי טווח תאריכים
router.get("/range", getSummaryRange);

// מחיקת סיכום לפי ID
router.delete("/:id", deleteSummaryById);

// יצירת סיכום ידנית (לבדיקות)
router.post("/create-manual", async (req, res) => {
  try {
    const { createManualSummary } = await import("../cron/dailySummaryCron");
    const { poolId } = req.body;
    
    await createManualSummary(poolId);
    
    res.json({ 
      success: true, 
      message: "Manual summary created successfully" 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});



export default router;
