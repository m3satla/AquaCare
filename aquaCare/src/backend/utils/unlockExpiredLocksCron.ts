import cron from "node-cron";
import UserModel from "../models/user";

export const startUnlockExpiredLocksCron = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const result = await UserModel.updateMany(
        { isLocked: true, lockUntil: { $lte: now } },
        { $set: { isLocked: false, lockUntil: null, failedLoginAttempts: 0 } }
      );
      if ((result as any).modifiedCount > 0) {
        console.log(`🔓 Accounts unlocked automatically: ${(result as any).modifiedCount}`);
      }
    } catch (err) {
      console.error("❌ Error unlocking expired locks:", err);
    }
  });
};