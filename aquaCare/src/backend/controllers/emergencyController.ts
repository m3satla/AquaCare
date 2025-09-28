// controllers/emergencyController.ts
import { Request, Response } from "express";
import EmergencyStatus from "../models/EmergencyStatus";
import sendTelegramMessage from "../sendTelegram";
// import Log from "../models/Log"; // מושבת כרגע

export const getEmergencyStatus = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Getting emergency status...");
    const latest = await EmergencyStatus.findOne().sort({ updatedAt: -1 });
    const status = latest?.isEmergency || false;
    console.log("📊 Current emergency status:", status);
    res.json({ emergency: status });
  } catch (err) {
    console.error("❌ Error getting emergency status:", err);
    res.status(500).json({ error: "שגיאה בשליפת מצב חירום" });
  }
};

export const updateEmergencyStatus = async (req: Request, res: Response) => {
  const { emergency, source = "manual", userId = null, sendNotification = true, reason = null } = req.body;

  try {
    console.log("🔧 Updating emergency status:", { emergency, source, userId });
    const newStatus = new EmergencyStatus({ isEmergency: emergency });
    await newStatus.save();
    console.log("✅ Emergency status saved to database");

    // לוג מצב חירום - השבתתי כרגע עד לעדכון מבנה הלוג
    console.log(`📢 מצב חירום ${emergency ? "הופעל" : "כובה"} (${source}) - משתמש: ${userId}`);

    // ✅ שליחת התראה לטלגרם רק אם נדרש
    if (sendNotification) {
      try {
        const timestamp = new Date().toLocaleString('he-IL');
        const action = emergency ? "הופעל" : "כובה";
        
        // הודעה מותאמת לפי מקור וסיבה
        let message = `🚨 מצב חירום ${action} במערכת AquaCare! 🚨\n\n`;
        message += `זמן: ${timestamp}\n`;
        
        if (reason && source === "sensor") {
          message += `סיבה: ${reason}\n`;
        }
        
        message += `\n${emergency ? "יש לבדוק את המערכת מיד ולנקוט בפעולה מתאימה." : "המערכת חזרה למצב רגיל."}`;

        await sendTelegramMessage(message);
        console.log("✅ התראה נשלחה לטלגרם בהצלחה");
      } catch (telegramError) {
        console.error("❌ שגיאה בשליחת התראה לטלגרם:", telegramError);
        // לא נכשל את הבקשה אם הטלגרם נכשל
      }
    } else {
      console.log("📝 התראה לא נשלחה (sendNotification = false)");
    }

    console.log(`📢 מצב חירום ${emergency ? "הופעל" : "כובה"} (${source})`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ שגיאה בעדכון מצב חירום:", err);
    res.status(500).json({ error: "שגיאה בעדכון מצב חירום" });
  }
};
