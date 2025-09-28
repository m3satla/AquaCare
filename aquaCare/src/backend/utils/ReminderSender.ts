// backend/controllers/reminders.ts
import Appointment from "../models/Appointment";
import User from "../models/user";

export async function sendRemindersForTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: tomorrow, $lt: dayAfter }
  });

  for (const appointment of appointments) {
    const user = await User.findById(appointment.clientId);
    if (user?.email) {
      console.log(`📧 נשלחת תזכורת ל-${user.email} עבור תור בתאריך ${appointment.date}`);
    }
  }
}
