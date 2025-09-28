import { Router } from 'express';
import {
  getWorkSchedule,
  saveWorkSchedule,
  generateTimeSlots,
  updateAvailableSlots
} from '../controllers/workScheduleController';

const router = Router();

console.log('🔧 Setting up work-schedule routes');

// שליפת לוח עבודה לפי בריכה
router.get('/:poolId', (req, res, next) => {
  console.log('📥 GET /api/work-schedule/:poolId called with poolId:', req.params.poolId);
  next();
}, getWorkSchedule);

// שמירת לוח עבודה
router.post('/:poolId', (req, res, next) => {
  console.log('📥 POST /api/work-schedule/:poolId called with poolId:', req.params.poolId);
  next();
}, saveWorkSchedule);

// יצירת זמני תור אוטומטית
router.post('/:poolId/generate-slots', generateTimeSlots);

// עדכון זמנים זמינים לפי לוח העבודה
router.post('/:poolId/update-slots', updateAvailableSlots);

console.log('✅ Work-schedule routes configured');

export default router;
