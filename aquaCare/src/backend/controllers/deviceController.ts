// controllers/deviceController.ts
import { Request, Response } from "express";
import DeviceStatus from "../models/DeviceStatus";
import sendTelegramMessage from "../sendTelegram";

export const updateDeviceStatus = async (req: Request, res: Response) => {
  console.log("🔧 ===== DEVICE STATUS UPDATE REQUEST START =====");
  console.log("🔧 Device status update endpoint hit!");
  const { deviceType, isOn, userId, poolId } = req.body;

  try {
    console.log("🔧 Device status update request received!");
    console.log("🔧 Updating device status:", { deviceType, isOn, userId, poolId });
    console.log("🔧 Request body:", req.body);
    console.log("🔧 Request URL:", req.url);
    console.log("🔧 Request method:", req.method);
    
    const newStatus = new DeviceStatus({ 
      deviceType, 
      isOn, 
      userId, 
      poolId 
    });
    console.log("💾 Saving device status to database:", {
      deviceType: newStatus.deviceType,
      isOn: newStatus.isOn,
      userId: newStatus.userId,
      poolId: newStatus.poolId
    });
    await newStatus.save();
    console.log("✅ Device status saved to database with ID:", newStatus._id);

    // שליחת התראה לטלגרם
    try {
      console.log("🔔 Preparing Telegram notification...");
      console.log("🔔 Device type received:", deviceType);
      console.log("🔔 Device type type:", typeof deviceType);
      const timestamp = new Date().toLocaleString('he-IL');
      const deviceName = deviceType === "light" ? "אור" : "דוד";
      console.log("🔔 Device name determined:", deviceName);
      const action = isOn ? "נדלק" : "כובה";
      
      const message = `💡 ${deviceName} ${action} במערכת AquaCare!\n\n` +
        `זמן: ${timestamp}\n` +
        `מכשיר: ${deviceName}\n` +
        `סטטוס: ${isOn ? "פועל" : "כבוי"}\n\n` +
        `${isOn ? "המכשיר פועל כעת." : "המכשיר כבוי."}`;

          console.log("🔔 Sending Telegram message:", message);
    console.log("🔔 Message length:", message.length);
    console.log("🔔 Calling sendTelegramMessage function...");
    await sendTelegramMessage(message);
    console.log("✅ Device notification sent to Telegram successfully");
    } catch (telegramError: any) {
      console.error("❌ שגיאה בשליחת התראה לטלגרם:", telegramError);
      console.error("❌ Telegram error details:", telegramError.message);
      console.error("❌ Telegram error stack:", telegramError.stack);
    }

    console.log("✅ Device status update completed successfully");
    console.log("✅ Sending response:", { success: true, deviceStatus: newStatus });
    res.json({ success: true, deviceStatus: newStatus });
    console.log("🔧 ===== DEVICE STATUS UPDATE REQUEST END =====");
  } catch (err: any) {
    console.error("❌ שגיאה בעדכון מצב מכשיר:", err);
    console.error("❌ Error details:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ error: "שגיאה בעדכון מצב מכשיר" });
    console.log("🔧 ===== DEVICE STATUS UPDATE REQUEST END WITH ERROR =====");
  }
};

export const getDeviceStatus = async (req: Request, res: Response) => {
  console.log("🔍 ===== GET DEVICE STATUS REQUEST START =====");
  const { deviceType } = req.params;

  try {
    console.log("🔍 Device status request received!");
    console.log("🔍 Getting device status for:", deviceType);
    
    const latest = await DeviceStatus.findOne({ deviceType }).sort({ updatedAt: -1 });
    console.log("🔍 Latest device status from DB:", latest);
    const status = latest?.isOn || false;
    console.log("🔍 Final status value:", status);
    
    console.log("📊 Current device status:", status);
    console.log("📊 Sending response:", { isOn: status });
    res.json({ isOn: status });
  } catch (err: any) {
    console.error("❌ Error getting device status:", err);
    console.error("❌ Error details:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ error: "שגיאה בשליפת מצב מכשיר" });
  }
};
