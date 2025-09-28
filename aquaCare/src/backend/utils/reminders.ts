import { Router } from "express";
import { sendTomorrowReminders } from "../controllers/reminders";

const router = Router();
router.post("/send-tomorrow", sendTomorrowReminders);
router.post("/sendReminder", (req, res) => {
  // Handle individual reminder sending
  const { email, appointment } = req.body;
  console.log(`📧 Sending reminder to ${email} for appointment on ${appointment.date}`);
  res.json({ success: true, message: "Reminder sent" });
});
export default router;
