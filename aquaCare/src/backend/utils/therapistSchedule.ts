import express from 'express';
import {
  getTherapistScheduleRequests,
  createScheduleRequest,
  updateScheduleRequest,
  getScheduleStatistics
} from '../controllers/therapistSchedule';

const router = express.Router();

// ✅ ניתובים ללוח זמנים של מטפלים
router.get('/requests', getTherapistScheduleRequests);
router.post('/requests', createScheduleRequest);
router.put('/requests/:scheduleId', updateScheduleRequest);
router.get('/statistics', getScheduleStatistics);

export default router;

