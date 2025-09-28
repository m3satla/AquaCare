// src/cron/markNoShows.ts
import Appointment from "../models/Appointment";
// import Log from "../models/Log"; // מושבת כרגע

export const markNoShows = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  try {
    const noShows = await Appointment.find({
      date: dateStr,
      isCanceled: { $ne: true },
      isConfirmed: { $ne: true },
    });

    const logPromises = noShows.map(async (appt) => {
      appt.isNoShow = true;
      await appt.save();

      // רישום ללוג - השבתתי כרגע עד לעדכון מבנה הלוג
      console.log(`🚫 הלקוח ${appt.clientId} לא הופיע לפגישה ב־${appt.date} בשעה ${appt.time}.`);
    });

    await Promise.all(logPromises);

    // לוג סיכום לפעולה - השבתתי כרגע עד לעדכון מבנה הלוג
    console.log(`✔️ סומנו ${noShows.length} לקוחות כלא-מופיעים לתאריך ${dateStr}`);
  } catch (err) {
    // לוג שגיאה - השבתתי כרגע עד לעדכון מבנה הלוג
    console.error("❌ שגיאה בסימון NO_SHOW:", err instanceof Error ? err.message : "שגיאה לא ידועה");
  }
};
