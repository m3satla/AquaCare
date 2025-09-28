import { Router } from "express";
import {
  getLatestSensorReadings,
  getSensorHistory,
  addSensorReading,
  deleteSensorReading,
  updateSensorReading
} from "../controllers/sensor";

import SensorModel from "../models/Sensors";

const router = Router();

console.log("✅ sensors routes loaded");

// שליפת קריאות אחרונות של כל החיישנים
router.get("/latest", getLatestSensorReadings);

// שליפת כל החיישנים (לשימוש בפרונטנד) - רשימה ריקה
router.get("/", async (req, res) => {
  try {
    console.log("🔍 GET /api/sensors - Returning empty list...");
    
    // החזרת רשימה ריקה - אין סנסורים להצגה
    const sensors: any[] = [];
    console.log(`✅ Returning ${sensors.length} sensors (empty list)`);
    res.json(sensors);
  } catch (error: any) {
    console.error("❌ Error fetching sensors:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// שליפת היסטוריית קריאות לפי מזהה חיישן
router.get("/history/:sensorId", getSensorHistory);

// הוספת קריאה חדשה מחיישן
router.post("/", addSensorReading);

// מחיקת קריאה מחיישן
router.delete("/:id", deleteSensorReading);

// ✅ עדכון מצב חירום לחיישן לפי ID
router.put("/:id", async (req, res) => {
  try {
    // Try to find by MongoDB _id first, then by numeric id
    let updatedSensor = await SensorModel.findByIdAndUpdate(
      req.params.id,
      {
        emergency: req.body.emergency,
        emergencyReason: req.body.emergencyReason,
      },
      { new: true }
    );

    // If not found by _id, try by numeric id
    if (!updatedSensor) {
      updatedSensor = await SensorModel.findOneAndUpdate(
        { id: Number(req.params.id) },
        {
          emergency: req.body.emergency,
          emergencyReason: req.body.emergencyReason,
        },
        { new: true }
      );
    }

    if (!updatedSensor) {
      return res.status(404).json({ success: false, error: "Sensor not found" });
    }

    res.json({ success: true, sensor: updatedSensor });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
