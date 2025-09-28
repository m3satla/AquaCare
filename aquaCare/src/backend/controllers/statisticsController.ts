import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import UserModel from '../models/user';
import RequestModel from '../models/Request';

interface StatisticsData {
  userCount: number;
  appointmentCount: number;
  totalPayments: number;
  activeUsers: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  poolUsers: number;
  connectedUsers: number;
  monthlyBreakdown: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
  selectedMonth: string | null;
}

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { poolId, selectedMonth } = req.query;
    const currentUser = (req.session as any).user;

    console.log("🔍 Statistics request - Session:", req.session);
    console.log("🔍 Statistics request - Current user:", currentUser);

    // בדיקה שהמשתמש מחובר
    if (!currentUser) {
      console.log("❌ No user in session");
      return res.status(401).json({ 
        success: false, 
        error: 'נדרש להתחבר למערכת' 
      });
    }

    // בדיקה שהמשתמש הוא מנהל
    if (currentUser.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'גישה מוגבלת - רק מנהלים יכולים לצפות בסטטיסטיקות' 
      });
    }

    // אם לא נשלח poolId, השתמש ב-poolId של המשתמש המחובר
    const targetPoolId = poolId || currentUser.poolId;

    if (!targetPoolId) {
      return res.status(400).json({ 
        success: false, 
        error: 'נדרש מזהה בריכה' 
      });
    }

    console.log(`📊 Fetching statistics for pool: ${targetPoolId}, month: ${selectedMonth || 'all'}`);

    // שליפת משתמשים לבריכה
    const poolUsers = await UserModel.find({ 
      poolId: targetPoolId,
      role: { $in: ['normal', 'patient', 'therapist'] } // לא כולל מנהלים
    });

    // שליפת תורים לבריכה
    const appointmentsQuery: any = { poolId: targetPoolId };
    if (selectedMonth) {
      const startDate = new Date(selectedMonth as string);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      appointmentsQuery.date = {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      };
    }

    const appointments = await Appointment.find(appointmentsQuery);

    // חישוב סטטיסטיקות
    const userCount = poolUsers.length;
    const appointmentCount = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.isConfirmed && !apt.isCanceled && !apt.isNoShow).length;
    const pendingAppointments = appointments.filter(apt => !apt.isConfirmed && !apt.isCanceled).length;
    const cancelledAppointments = appointments.filter(apt => apt.isCanceled).length;
    
    // משתמשים פעילים (מחוברים) - נניח שכל המשתמשים פעילים כרגע
    const activeUsers = poolUsers.length;
    const connectedUsers = poolUsers.length; // בפועל צריך לבדוק מי מחובר

    // חישוב תשלומים (250 ₪ לתור שהושלם)
    const totalPayments = completedAppointments * 250;

    // יצירת פירוט חודשי
    const monthlyBreakdown = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      // שליפת תורים לחודש ספציפי
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthAppointments = await Appointment.find({
        poolId: targetPoolId,
        date: {
          $gte: monthStart.toISOString().split('T')[0],
          $lte: monthEnd.toISOString().split('T')[0]
        },
        isConfirmed: true,
        isCanceled: { $ne: true },
        isNoShow: { $ne: true }
      });

      const monthRevenue = monthAppointments.length * 250;
      
      monthlyBreakdown.push({
        month: monthKey,
        appointments: monthAppointments.length,
        revenue: monthRevenue
      });
    }

    const statistics: StatisticsData = {
      userCount,
      appointmentCount,
      totalPayments,
      activeUsers,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      poolUsers: userCount,
      connectedUsers,
      selectedMonth: selectedMonth as string || null,
      monthlyBreakdown
    };

    console.log(`✅ Statistics generated for pool ${targetPoolId}:`, {
      users: userCount,
      appointments: appointmentCount,
      completed: completedAppointments,
      revenue: totalPayments
    });

    res.status(200).json({
      success: true,
      statistics,
      poolId: targetPoolId
    });

  } catch (error: any) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'שגיאה בטעינת סטטיסטיקות',
      details: error.message 
    });
  }
};

// פונקציה לקבלת סטטיסטיקות לפי בריכה
export const getStatisticsByPool = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;
    const currentUser = (req.session as any).user;

    // בדיקה שהמשתמש מחובר
    if (!currentUser) {
      return res.status(401).json({ 
        success: false, 
        error: 'נדרש להתחבר למערכת' 
      });
    }

    // בדיקה שהמשתמש הוא מנהל
    if (currentUser.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'גישה מוגבלת - רק מנהלים יכולים לצפות בסטטיסטיקות' 
      });
    }

    // בדיקה שהמנהל יכול לגשת לבריכה הזו
    if (currentUser.poolId !== poolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'אין לך הרשאה לצפות בסטטיסטיקות של בריכה זו' 
      });
    }

    // קריאה לפונקציה הראשית עם poolId
    req.query.poolId = poolId;
    return getStatistics(req, res);

  } catch (error: any) {
    console.error('❌ Error fetching statistics by pool:', error);
    res.status(500).json({ 
      success: false, 
      error: 'שגיאה בטעינת סטטיסטיקות',
      details: error.message 
    });
  }
};
