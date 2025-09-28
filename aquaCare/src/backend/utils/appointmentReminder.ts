import cron from "node-cron";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Appointment from "../models/Appointment";
import UserModel from "../models/user";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // כתובת השולח
    pass: process.env.EMAIL_PASS, // סיסמה/אפליקציה
  },
});

const sendAppointmentReminder = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

  const appointments = await Appointment.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    isConfirmed: false,
    isCanceled: { $ne: true },
  });

  for (const appointment of appointments) {
    const user = await UserModel.findById(appointment.clientId);
    if (!user || !user.email) continue;

    const confirmLink = `http://localhost:5173/confirm/${appointment._id}`;
    const cancelLink = `http://localhost:5173/cancel/${appointment._id}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "📅 תזכורת לפגישה בבריכה",
      html: `
        <p>שלום ${user.firstName},</p>
        <p>תזכורת לפגישה שלך בתאריך: <strong>${new Date(appointment.date).toLocaleDateString()}</strong></p>
        <p>בבקשה אשר/י את הגעתך:</p>
        <p>
          ✅ <a href="${confirmLink}">אישור הגעה</a><br>
          ❌ <a href="${cancelLink}">ביטול פגישה</a>
        </p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📨 תזכורת נשלחה ל: ${user.email}`);
    } catch (err) {
      console.error(`❌ שגיאה בשליחת מייל ל-${user.email}`, err);
    }
  }
};

// הפעלת cron: כל יום ב-08:00 בבוקר
export const startAppointmentReminderCron = () => {
  cron.schedule("* * * * *", () => {
    console.log("🚀 הפעלת קרון תזכורות לפגישות...");
    sendAppointmentReminder();
  });
};
