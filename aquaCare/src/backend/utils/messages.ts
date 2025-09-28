import { Router } from "express";
import {
  createMessage,
  getInboxMessages,
  getSentMessages,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
  getMessageStats
} from "../controllers/messageController";

const router = Router();

// יצירת הודעה חדשה
router.post("/", createMessage);

// שליפת הודעות נכנסות
router.get("/inbox", getInboxMessages);

// שליפת הודעות יוצאות
router.get("/sent", getSentMessages);

// שליפת שיחה ספציפית
router.get("/conversation/:conversationId", getConversation);

// שליפת רשימת שיחות
router.get("/conversations", getConversations);

// סמן הודעה כנקראה
router.patch("/:messageId/read", markAsRead);

// מחיקת הודעה
router.delete("/:messageId", deleteMessage);

// שליפת סטטיסטיקות
router.get("/stats", getMessageStats);

export default router;
