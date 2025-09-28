import { RequestHandler } from "express";
import Sensors from "../models/Sensors";
import SensorModel from "../models/Sensors";
import mongoose from "mongoose";

// ✅ שליפת קריאות אחרונות של כל החיישנים
export const getLatestSensorReadings: RequestHandler = async (_req, res) => {
  try {
    const latestReadings = await SensorModel.aggregate([
      {
        $group: {
          _id: "$id", // מזהה ייחודי של החיישן
          latestReading: { $last: "$$ROOT" } // או $first – תלוי מה הסדר הרצוי
        }
      },
      {
        $replaceRoot: { newRoot: "$latestReading" }
      }
    ]);
    res.json({ success: true, sensors: latestReadings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ שליפת היסטוריית קריאות לפי סוג חיישן
export const getSensorHistory: RequestHandler = async (req, res) => {
  try {
    const { sensorId } = req.params;
    
    // נחפש לפי סוג החיישן או לפי שם
    let query = {};
    if (sensorId === 'waterTemp') {
      query = { name: { $regex: /water|temperature/i } };
    } else if (sensorId === 'chlorine') {
      query = { name: { $regex: /chlorine/i } };
    } else if (sensorId === 'showerTemp') {
      query = { name: { $regex: /shower/i } };
    } else if (sensorId === 'acidity') {
      query = { name: { $regex: /acidity|ph/i } };
    } else {
      // אם לא מצאנו התאמה, נחזיר את כל החיישנים
      query = {};
    }
    
    const history = await Sensors.find(query).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ הוספת קריאה חדשה מחיישן
export const addSensorReading: RequestHandler = async (req, res) => {
  try {
    const sensorData = req.body;
    const newReading = new Sensors(sensorData);
    await newReading.save();
    res.json({ success: true, sensor: newReading });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ מחיקת קריאה מחיישן לפי ID
export const deleteSensorReading: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sensors.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Sensor reading not found" });
    }
    res.json({ success: true, message: "Sensor reading deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// ✅ עדכון מצב חירום לפי שדה id

export const updateSensorEmergency: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid sensor ID" });
    }

    const updated = await SensorModel.findByIdAndUpdate(
      id,
      {
        emergency: req.body.emergency,
        emergencyReason: req.body.emergencyReason,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: "Sensor not found" });
    }

    res.json({ success: true, sensor: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const updateSensorReading: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedSensor = await Sensors.findByIdAndUpdate(id, update, { new: true });

    if (!updatedSensor) {
      return res.status(404).json({ success: false, message: "Sensor not found" });
    }

    res.json({ success: true, sensor: updatedSensor });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
