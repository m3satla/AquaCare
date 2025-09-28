import express from 'express';
import {
  getInternalMessages,
  sendInternalMessage,
  markMessageAsRead,
  getMessageRecipients,
  getMessageStatistics
} from '../controllers/internalMessages';

const router = express.Router();

// ✅ ניתובים להודעות פנימיות
router.get('/messages', getInternalMessages);
router.post('/messages', sendInternalMessage);
router.put('/messages/:messageId/read', markMessageAsRead);
router.get('/recipients', getMessageRecipients);
router.get('/statistics', getMessageStatistics);

export default router;

