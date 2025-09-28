import cron from "node-cron";
import { sendEmail } from "../config/mail";
import { QueueModel } from "../models/queue";

export function setupDailyRemindersJob() {
  // ירוץ כל יום בשעה 20:00 (8 בערב)
  cron.schedule("* * * * *", async () => {
    try {
      console.log("🕗 שליחת תזכורות אוטומטית רצה...");

      // get all the templates from the database
      const queue = await QueueModel.find({ 
        status: "pending",
        sendAt: { $lte: new Date() }
      });
      console.log(queue);

      queue.forEach(async (item) => {
        // send the emails
        // console.log("sending email to", item.email);
        try {
          await sendEmail(
            item.email, 
            item.data.subject, 
            item.data.text, 
            item.data.html
          );  
          // update the item in the queue
          await QueueModel.findByIdAndUpdate(item._id, { status: "sent", sentAt: new Date() });
        } catch (err) {
          console.error("❌ שגיאה בשליחת תזכורות:", err);
          await QueueModel.findByIdAndUpdate(item._id, { status: "failed", error: err, failedAt: new Date() });
        }
      });
    } catch (err) {
      console.error("❌ שגיאה בשליחת תזכורות:", err);
    }
  });
}
