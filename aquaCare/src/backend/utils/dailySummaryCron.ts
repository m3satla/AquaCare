import * as cron from 'node-cron';
import SummaryDataModel from '../models/SummaryData';
import Appointment from '../models/Appointment';
import UserModel from '../models/user';
import SensorsModel from '../models/Sensors';
import { getTodayDateString, getTodayRange } from '../utils/dateUtils';

// יצירת סיכום יומי עם נתונים אמיתיים
export const createDailySummary = async () => {
  try {
    console.log('📊 Creating daily summary with real data...');
    
    const todayDate = getTodayDateString();
    const { startOfDay, endOfDay } = getTodayRange();
    
    // קבלת כל הבריכות הייחודיות
    const pools = await UserModel.distinct('poolId');
    
    for (const poolId of pools) {
      console.log(`🏊 Processing pool: ${poolId}`);
      
      // בדיקה אם כבר יש סיכום להיום לבריכה זו
      const existingSummary = await SummaryDataModel.findOne({
        poolId: String(poolId),
        createdAt: { 
          $gte: startOfDay, 
          $lte: endOfDay 
        }
      });
      
      if (existingSummary) {
        console.log(`✅ Summary already exists for pool ${poolId} today`);
        continue;
      }
      
      // חישוב נתונים אמיתיים
      
      // 1. מספר לקוחות (משתמשים רגילים ומטופלים)
      const totalCustomers = await UserModel.countDocuments({
        poolId: String(poolId),
        role: { $in: ['normal', 'patient'] }
      });
      
      // 2. מספר תורים להיום
      const todayAppointments = await Appointment.find({
        poolId: String(poolId),
        date: {
          $gte: startOfDay.toISOString().split('T')[0],
          $lte: endOfDay.toISOString().split('T')[0]
        }
      });
      
      const totalTreatments = todayAppointments.length;
      const completedAppointments = todayAppointments.filter(apt => 
        apt.isConfirmed && !apt.isCanceled && !apt.isNoShow
      ).length;
      
      // 3. הכנסות יומיות (250 ₪ לתור שהושלם)
      const dailyRevenue = completedAppointments * 250;
      
      // 4. סטטוס חיישנים (החיישן האחרון)
      const latestSensor = await SensorsModel.findOne({
        poolId: String(poolId)
      }).sort({ createdAt: -1 });
      
      let sensorStatus = 'תקין';
      if (latestSensor) {
        // בדיקת תקינות החיישנים
        const tempOk = latestSensor.temperature >= 20 && latestSensor.temperature <= 30;
        const chlorineOk = latestSensor.chlorine >= 1 && latestSensor.chlorine <= 3;
        const acidityOk = latestSensor.acidity >= 6.5 && latestSensor.acidity <= 7.5;
        
        if (!tempOk || !chlorineOk || !acidityOk) {
          sensorStatus = 'אזהרה';
        }
      }
      
      // 5. בעיות שדווחו (נניח 0 כרגע, אפשר להוסיף לוגיקה אמיתית)
      const reportedIssues = 0;
      
      // יצירת הסיכום
      const summaryData = {
        poolId: String(poolId),
        totalCustomers,
        totalTreatments,
        reportedIssues,
        sensorStatus,
        dailyRevenue,
        date: new Date()
      };
      
      const newSummary = new SummaryDataModel(summaryData);
      await newSummary.save();
      
      console.log(`✅ Created daily summary for pool ${poolId}:`, {
        totalCustomers,
        totalTreatments,
        dailyRevenue,
        sensorStatus
      });
    }
    
    console.log('✅ Daily summary creation completed');
  } catch (error) {
    console.error('❌ Error creating daily summary:', error);
  }
};

// Cron job שרץ כל יום בשעה 00:01
export const dailySummaryCron = cron.schedule(
  '0 1 * * *', // כל יום בשעה 1:00 בבוקר
  createDailySummary,
  {
    timezone: 'Asia/Jerusalem'
  }
);

// פונקציה ליצירת סיכום ידנית (לבדיקות)
export const createManualSummary = async (poolId?: string) => {
  try {
    if (poolId) {
      // יצירת סיכום לבריכה ספציפית
      const pools = [poolId];
      for (const pid of pools) {
        await createDailySummaryForPool(pid);
      }
    } else {
      // יצירת סיכום לכל הבריכות
      await createDailySummary();
    }
  } catch (error) {
    console.error('❌ Error in manual summary creation:', error);
  }
};

// פונקציה עזר ליצירת סיכום לבריכה ספציפית
const createDailySummaryForPool = async (poolId: string) => {
  const { startOfDay, endOfDay } = getTodayRange();
  
  // בדיקה אם כבר יש סיכום
  const existingSummary = await SummaryDataModel.findOne({
    poolId: String(poolId),
    createdAt: { 
      $gte: startOfDay, 
      $lte: endOfDay 
    }
  });
  
  if (existingSummary) {
    console.log(`✅ Summary already exists for pool ${poolId} today`);
    return existingSummary;
  }
  
  // חישוב נתונים
  const totalCustomers = await UserModel.countDocuments({
    poolId: String(poolId),
    role: { $in: ['normal', 'patient'] }
  });
  
  const todayAppointments = await Appointment.find({
    poolId: String(poolId),
    date: {
      $gte: startOfDay.toISOString().split('T')[0],
      $lte: endOfDay.toISOString().split('T')[0]
    }
  });
  
  const totalTreatments = todayAppointments.length;
  const completedAppointments = todayAppointments.filter(apt => 
    apt.isConfirmed && !apt.isCanceled && !apt.isNoShow
  ).length;
  
  const dailyRevenue = completedAppointments * 250;
  
  const latestSensor = await SensorsModel.findOne({
    poolId: String(poolId)
  }).sort({ createdAt: -1 });
  
  let sensorStatus = 'תקין';
  if (latestSensor) {
    const tempOk = latestSensor.temperature >= 20 && latestSensor.temperature <= 30;
    const chlorineOk = latestSensor.chlorine >= 1 && latestSensor.chlorine <= 3;
    const acidityOk = latestSensor.acidity >= 6.5 && latestSensor.acidity <= 7.5;
    
    if (!tempOk || !chlorineOk || !acidityOk) {
      sensorStatus = 'אזהרה';
    }
  }
  
  const summaryData = {
    poolId: String(poolId),
    totalCustomers,
    totalTreatments,
    reportedIssues: 0,
    sensorStatus,
    dailyRevenue,
    date: new Date()
  };
  
  const newSummary = new SummaryDataModel(summaryData);
  await newSummary.save();
  
  console.log(`✅ Created manual summary for pool ${poolId}:`, summaryData);
  return newSummary;
};
