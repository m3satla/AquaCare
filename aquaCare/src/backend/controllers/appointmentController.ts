import { Request, Response } from "express";
import AvailableSlot from "../models/AvailableSlot";
import Appointment from "../models/Appointment";

// שליפת שעות פנויות
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const slots = await AvailableSlot.find({ isBooked: false });
    res.status(200).json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת שעות פנויות" });
  }
};

// יצירת זמן פנוי
export const createSlot = async (req: Request, res: Response) => {
  try {
    const { date, time, employeeId } = req.body;
    const slot = new AvailableSlot({ date, time, employeeId });
    await slot.save();
    res.status(201).json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה ביצירת זמן פנוי" });
  }
};

// עדכון זמן פנוי
export const updateSlot = async (req: Request, res: Response) => {
  try {
    const slotId = req.params.id;
    const updatedSlot = await AvailableSlot.findByIdAndUpdate(slotId, req.body, { new: true });
    res.status(200).json({ success: true, updatedSlot });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בעדכון זמן פנוי" });
  }
};

// מחיקת זמן פנוי
export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const slotId = req.params.id;
    await AvailableSlot.findByIdAndDelete(slotId);
    res.status(200).json({ success: true, message: "נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה במחיקת זמן פנוי" });
  }
};

// קביעת תור
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { clientId, slotId, type, notes, poolId } = req.body;

    console.log('📤 Booking request received:', { clientId, slotId, type, notes, poolId });

    const slot = await AvailableSlot.findById(slotId);
    if (!slot || slot.isBooked) {
      console.log('❌ Slot not found or already booked:', { slotId, slot });
      return res.status(400).json({ success: false, error: "הזמן כבר נתפס או לא קיים" });
    }

    // Ensure we have a poolId
    if (!poolId) {
      console.log('❌ Missing poolId in request');
      return res.status(400).json({ success: false, error: "חסר מזהה בריכה" });
    }

    const appointment = new Appointment({
      clientId,
      employeeId: slot.employeeId,
      poolId,
      date: slot.date,
      time: slot.time,
      type,
      notes,
    });

    console.log('📝 Creating appointment:', appointment);
    await appointment.save();

    slot.isBooked = true;
    await slot.save();

    console.log('✅ Appointment created successfully:', appointment);
    res.status(201).json({ success: true, appointment });
  } catch (error: any) {
    console.error('❌ Error in bookAppointment:', error);
    res.status(500).json({ success: false, error: "שגיאה בקביעת תור", details: error.message });
  }
};

// ביטול תור
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { isCanceled: true },
      { new: true }
    );
    res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בביטול תור" });
  }
};

// שליפת תורים לפי לקוח
export const getAppointmentsByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    console.log("🔍 Looking for appointments for clientId:", clientId);
    
    const appointments = await Appointment.find({ clientId });
    console.log("✅ Found", appointments.length, "appointments for client:", clientId);
    console.log("📋 Appointments:", appointments);
    
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("❌ Error in getAppointmentsByClient:", error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת תורים" });
  }
};

// שליפת תורים לפי עובד
export const getAppointmentsByEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const appointments = await Appointment.find({ employeeId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת תורים לפי עובד" });
  }
};

// שליפת כל התורים לפי בריכה
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.query;
    
    if (!poolId) {
      return res.status(400).json({ 
        success: false, 
        error: "poolId is required" 
      });
    }

    console.log("🏊 Getting appointments for poolId:", poolId);
    const appointments = await Appointment.find({ poolId });
    console.log("✅ Found", appointments.length, "appointments for pool:", poolId);
    
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת כל התורים" });
  }
};

// שליפת תור לפי מזהה
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: "תור לא נמצא" });
    }
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: "שגיאה בשליפת תור לפי מזהה" });
  }
};

// אישור הגעה דרך לינק במייל
export const confirmArrival = async (req: Request, res: Response) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isConfirmed: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: "הפגישה לא נמצאה" });
    res.status(200).send("✅ ההגעה אושרה בהצלחה.");
  } catch (error) {
    res.status(500).send("שגיאה באישור ההגעה.");
  }
};

// ביטול דרך לינק במייל
export const declineAppointment = async (req: Request, res: Response) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isCanceled: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: "הפגישה לא נמצאה" });
    res.status(200).send("❌ הפגישה בוטלה בהצלחה.");
  } catch (error) {
    res.status(500).send("שגיאה בביטול הפגישה.");
  }
};
