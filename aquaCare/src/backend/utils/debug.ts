import { Router, Request, Response } from "express";
import AvailableSlot from "../models/AvailableSlot";

const router = Router();

// יצירת זמנים פנויים לדוגמה
router.post("/create-sample-slots", async (req: Request, res: Response) => {
  try {
    console.log('🔄 יוצר זמנים פנויים לדוגמה...');

    // מחיקת זמנים קיימים (אופציונלי)
    await AvailableSlot.deleteMany({});
    console.log('🗑️ נמחקו זמנים קיימים');

    // יצירת תאריכים לשבוע הקרוב
    const today = new Date();
    const sampleSlots = [];

    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      const dateString = targetDate.toISOString().split('T')[0];

      // שעות זמינות ביום
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
      for (const time of times) {
        sampleSlots.push({
          employeeId: 'therapist_001',
          poolId: 'pool_001',
          date: dateString,
          time: time,
          isBooked: false
        });
      }
    }

    // הכנסת הנתונים
    const result = await AvailableSlot.insertMany(sampleSlots);
    console.log(`✅ נוצרו ${result.length} זמנים פנויים בהצלחה!`);

    res.status(200).json({
      success: true,
      message: `נוצרו ${result.length} זמנים פנויים בהצלחה`,
      sampleData: result.slice(0, 5) // הצגת 5 ראשונים
    });

  } catch (error: any) {
    console.error('❌ שגיאה ביצירת זמנים פנויים:', error);
    res.status(500).json({
      success: false,
      error: "שגיאה ביצירת זמנים פנויים",
      details: error.message
    });
  }
});

// בדיקת זמנים קיימים
router.get("/check-slots", async (req: Request, res: Response) => {
  try {
    const totalSlots = await AvailableSlot.countDocuments();
    const availableSlots = await AvailableSlot.countDocuments({ isBooked: false });
    const bookedSlots = await AvailableSlot.countDocuments({ isBooked: true });
    
    const sampleSlots = await AvailableSlot.find().limit(10);

    res.status(200).json({
      success: true,
      statistics: {
        total: totalSlots,
        available: availableSlots,
        booked: bookedSlots
      },
      sampleSlots: sampleSlots
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "שגיאה בבדיקת זמנים",
      details: error.message
    });
  }
});

export default router;
