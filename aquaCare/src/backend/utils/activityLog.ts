import express from "express";
import { 
  getActivityLogsByPool, 
  getActivityLogsByUser, 
  createActivityLog, 
  getAllActivityLogs 
} from "../controllers/activityLog";

const router = express.Router();

// Get activity logs by pool
router.get("/pool", getActivityLogsByPool);

// Get activity logs by user
router.get("/user/:userId", getActivityLogsByUser);

// Create new activity log
router.post("/", createActivityLog);

// Get all activity logs (admin only)
router.get("/all", getAllActivityLogs);

// Default GET route for /api/activity-log
router.get("/", getAllActivityLogs);

export default router;
