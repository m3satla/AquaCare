import { Router } from "express";
import {
  getAvailableSlots,
  bookAppointment,
  cancelAppointment,
  getAppointmentsByClient,
  getAppointmentsByEmployee,
  getAllAppointments,
  getAppointmentById,
  createSlot,
  updateSlot,
  deleteSlot,
  confirmArrival,
  declineAppointment,
} from "../controllers/appointmentController";

const router = Router();

// שליפת שעות פנויות
router.get("/available-slots", getAvailableSlots);

// קביעת תור ע"י לקוח
router.post("/book", bookAppointment);

// ביטול תור ע"י לקוח או עובד
router.post("/cancel", cancelAppointment);

// אישור הגעה ע"י לחיצה מהמייל
router.patch("/confirm/:id", confirmArrival);

// ביטול פגישה ע"י לחיצה מהמייל
router.patch("/decline/:id", declineAppointment);

// שליפת תורים לפי מזהה לקוח
router.get("/client/:clientId", getAppointmentsByClient);

// שליפת תורים לפי מזהה עובד
router.get("/employee/:employeeId", getAppointmentsByEmployee);

// שליפת כל התורים (גישה מנהלית)
router.get("/all", getAllAppointments);

// שליפת תור לפי מזהה
router.get("/:id", getAppointmentById);

// יצירת זמן פנוי (עובד)
router.post("/slots", createSlot);

// עדכון זמן פנוי (עובד)
router.put("/slots/:id", updateSlot);

// מחיקת זמן פנוי (עובד)
router.delete("/slots/:id", deleteSlot);

// ברירת מחדל
router.get("/", getAllAppointments);

export default router;
