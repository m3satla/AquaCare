import { Request } from 'express';
import Log, { ILog } from '../models/Log';

export interface LogData {
  userId: string;
  userEmail: string;
  action: string;
  type: 'login' | 'logout' | 'view' | 'create' | 'update' | 'delete' | 'booking' | 'payment' | 'presence' | 'navigation' | 'error' | 'schedule_request' | 'schedule_update' | 'internal_message' | 'response';
  details?: string;
  poolId: string;
  ip?: string;
  userAgent?: string;
}

/**
 * פונקציה לשמירת לוג במסד הנתונים
 */
export const saveLog = async (logData: LogData): Promise<ILog | null> => {
  try {
    console.log("🔍 Saving log with data:", logData);
    console.log("🔍 MongoDB connection state:", Log.db?.readyState);
    
    const log = new Log({
      ...logData,
      timestamp: new Date()
    });

    console.log("🔍 Log object created:", log.toObject());

    const savedLog = await log.save();
    console.log(`📝 Log saved successfully: ${logData.action} by ${logData.userEmail}`);
    return savedLog;
  } catch (error) {
    console.error('❌ Error saving log:', error);
    console.error('❌ Error stack:', (error as Error)?.stack);
    console.error('❌ Error message:', (error as Error)?.message);
    return null;
  }
};

/**
 * פונקציה לשמירת לוג עם פרטי HTTP request
 */
export const saveLogWithRequest = async (req: Request, logData: Omit<LogData, 'ip' | 'userAgent'>): Promise<ILog | null> => {
  const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string;
  const userAgent = req.headers['user-agent'];

  return saveLog({
    ...logData,
    ip,
    userAgent
  });
};

/**
 * פונקציה לשליפת לוגים לפי בריכה
 */
export const getLogsByPool = async (poolId: string | number, limit: number = 100): Promise<ILog[]> => {
  try {
    const logs = await Log.find({ poolId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
    
    return logs;
  } catch (error) {
    console.error('❌ Error fetching logs by pool:', error);
    return [];
  }
};

/**
 * פונקציה לשליפת לוגים לפי משתמש
 */
export const getLogsByUser = async (userId: string, limit: number = 50): Promise<ILog[]> => {
  try {
    const logs = await Log.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
    
    return logs;
  } catch (error) {
    console.error('❌ Error fetching logs by user:', error);
    return [];
  }
};

/**
 * פונקציה לשליפת כל הלוגים (למנהלים)
 */
export const getAllLogs = async (limit: number = 200): Promise<ILog[]> => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
    
    return logs;
  } catch (error) {
    console.error('❌ Error fetching all logs:', error);
    return [];
  }
};

/**
 * פונקציה לשליפת לוגים לפי סוג
 */
export const getLogsByType = async (type: string, poolId?: string | number, limit: number = 100): Promise<ILog[]> => {
  try {
    const query: any = { type };
    if (poolId) {
      query.poolId = poolId;
    }

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
    
    return logs;
  } catch (error) {
    console.error('❌ Error fetching logs by type:', error);
    return [];
  }
};

/**
 * פונקציה למחיקת לוגים ישנים (לתחזוקה)
 */
export const cleanOldLogs = async (daysToKeep: number = 90): Promise<number> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await Log.deleteMany({ timestamp: { $lt: cutoffDate } });
    console.log(`🧹 Cleaned ${result.deletedCount} old logs (older than ${daysToKeep} days)`);
    
    return result.deletedCount || 0;
  } catch (error) {
    console.error('❌ Error cleaning old logs:', error);
    return 0;
  }
};
