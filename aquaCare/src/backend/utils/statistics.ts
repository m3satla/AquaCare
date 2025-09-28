import { Router } from 'express';
import { getStatistics, getStatisticsByPool } from '../controllers/statisticsController';

const router = Router();

console.log("📊 Statistics routes loaded");

// קבלת סטטיסטיקות כללית (לפי poolId של המשתמש המחובר)
router.get('/', getStatistics);

// קבלת סטטיסטיקות לפי בריכה ספציפית
router.get('/pool/:poolId', getStatisticsByPool);

export default router;
