// src/cron/sendFeedbackRequests.ts
import Appointment from "../models/Appointment";
import User from "../models/User";
import nodemailer from "nodemailer";

// פונקציה פנימית לשליחת מייל (כמו utils/mailer)
const sendFeedbackEmail = async (to: string, appointmentId: string, name: string) => {
  const feedbackLink = `http://localhost:5173/feedback?appointmentId=${appointmentId}`;
  const subject = `נשמח לשמוע את דעתך`; 
  const message = `שלום ${name},\n\nתודה שביקרת אצלנו! נשמח אם תשתף אותנו בחווייתך:\n${feedbackLink}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your_email@gmail.com",
      pass: process.env.EMAIL_PASS || "your_password",
    },
  });

  await transporter.sendMail({
    from: 'AquaCare <no-reply@aquacare.com>',
    to,
    subject,
    text: message,
  });

  console.log(`📨 משוב נשלח אל ${to}`);
};

export const sendFeedbackRequests = async () => {
  console.log("📬 התחלת שליחת בקשות למשוב...");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  try {
    const appointments = await Appointment.find({
      date: dateStr,
      isCanceled: { $ne: true },
      isConfirmed: true,
    });

    for (const appt of appointments) {
      const client = await User.findOne({ id: appt.clientId });
      if (client?.email) {
        const appointmentId = String(appt._id); // ✅ המרה בטוחה למחרוזת
        await sendFeedbackEmail(client.email, appointmentId, client.firstName);
      }
    }

    console.log("🎉 סיום שליחת המשובים.");
  } catch (err) {
    console.error("❌ שגיאה בשליחת משובים:", err);
  }
};
