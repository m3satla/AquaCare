import { Request, Response } from 'express';
import WorkSchedule, { IWorkSchedule } from '../models/WorkSchedule';
import AvailableSlot from '../models/AvailableSlot';

// שליפת לוח עבודה לפי בריכה
export const getWorkSchedule = async (req: Request, res: Response) => {
  console.log('🚀 getWorkSchedule called');
  console.log('📥 Request params:', req.params);
  
  try {
    const { poolId } = req.params;
    
    console.log('🔍 Fetching work schedule for poolId:', poolId);
    
    let schedule = await WorkSchedule.findOne({ poolId });
    
    // אם אין לוח עבודה, צור אחד ברירת מחדל
    if (!schedule) {
      console.log('📝 Creating default work schedule for poolId:', poolId);
      schedule = new WorkSchedule({
        poolId,
        dayOff: 'Friday',
        workHours: { start: '08:00', end: '18:00' },
        specialDates: [],
        timeSlots: []
      });
      await schedule.save();
    }
    
    console.log('✅ Work schedule found/created:', schedule);
    
    res.status(200).json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('❌ Error in getWorkSchedule:', error);
    res.status(500).json({
      success: false,
      error: 'שגיאה בשליפת לוח העבודה'
    });
  }
};

// שמירת לוח עבודה
export const saveWorkSchedule = async (req: Request, res: Response) => {
  console.log('🚀 saveWorkSchedule called at:', new Date().toISOString());
  console.log('📥 Request params:', req.params);
  console.log('📥 Request body:', req.body);
  console.log('📥 Request session:', req.session);
  console.log('📥 Request headers:', req.headers);
  
  try {
    const { poolId } = req.params;
    const scheduleData = req.body;
    
    console.log('💾 Saving work schedule for poolId:', poolId);
    console.log('📋 Schedule data:', scheduleData);
    
    // בדיקה שהמשתמש הוא מנהל
    console.log('🔍 Session ID:', req.sessionID);
    console.log('🔍 Session exists:', !!req.session);
    console.log('🔍 Session keys:', Object.keys(req.session || {}));
    
    const currentUser = (req.session as any).user;
    console.log('👤 Current user:', currentUser);
    console.log('🔍 User poolId:', currentUser?.poolId, 'Type:', typeof currentUser?.poolId);
    console.log('🔍 Request poolId:', poolId, 'Type:', typeof poolId);
    console.log('🔍 Checking admin access for user:', currentUser?.email, 'Role:', currentUser?.role);
    
    if (!currentUser) {
      console.log('❌ No user found in session');
      return res.status(403).json({
        success: false,
        error: 'לא מחובר למערכת'
      });
    }
    
    if (currentUser.role?.toLowerCase() !== 'admin') {
      console.log('❌ User is not admin, role:', currentUser.role);
      return res.status(403).json({
        success: false,
        error: 'גישה מוגבלת למנהלים בלבד'
      });
    }
    
    console.log('✅ User is admin, checking pool access');
    
    // בדיקה שהמנהל שייך לבריכה הזו
    console.log('🔍 Raw poolId values:', {
      userPoolId: currentUser.poolId,
      requestPoolId: poolId,
      userPoolIdType: typeof currentUser.poolId,
      requestPoolIdType: typeof poolId
    });
    
    const userPoolId = String(currentUser.poolId);
    const requestPoolId = String(poolId);
    
    console.log('🔍 Comparing pool IDs:', { 
      userPoolId, 
      requestPoolId, 
      match: userPoolId === requestPoolId,
      userPoolIdType: typeof currentUser.poolId,
      requestPoolIdType: typeof poolId
    });
    
    if (userPoolId !== requestPoolId) {
      console.log('❌ Pool ID mismatch, access denied');
      console.log('❌ User poolId:', currentUser.poolId, 'Request poolId:', poolId);
      return res.status(403).json({
        success: false,
        error: 'אין לך הרשאה לערוך לוח עבודה של בריכה אחרת'
      });
    }
    
    console.log('✅ Pool access granted');
    
    let schedule = await WorkSchedule.findOne({ poolId });
    
    if (schedule) {
      // עדכון לוח עבודה קיים
      schedule.dayOff = scheduleData.dayOff;
      schedule.workHours = scheduleData.workHours;
      schedule.specialDates = scheduleData.specialDates;
      schedule.timeSlots = scheduleData.timeSlots;
    } else {
      // יצירת לוח עבודה חדש
      schedule = new WorkSchedule({
        poolId,
        ...scheduleData
      });
    }
    
    await schedule.save();
    
    console.log('✅ Work schedule saved successfully');
    
    res.status(200).json({
      success: true,
      message: 'לוח העבודה נשמר בהצלחה',
      schedule
    });
  } catch (error) {
    console.error('❌ Error in saveWorkSchedule:', error);
    res.status(500).json({
      success: false,
      error: 'שגיאה בשמירת לוח העבודה'
    });
  }
};

// יצירת זמני תור אוטומטית לפי לוח העבודה
export const generateTimeSlots = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;
    const { startDate, endDate } = req.body;
    
    console.log('🎯 Generating time slots for poolId:', poolId);
    console.log('📅 Date range:', { startDate, endDate });
    
    const schedule = await WorkSchedule.findOne({ poolId });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: 'לוח עבודה לא נמצא'
      });
    }
    
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // בדיקה אם זה יום חופש
      if (dayOfWeek === schedule.dayOff) {
        continue;
      }
      
      // בדיקה אם זה תאריך מיוחד סגור
      const dateString = date.toISOString().split('T')[0];
      const specialDate = schedule.specialDates.find(sd => sd.date === dateString);
      if (specialDate && specialDate.isClosed) {
        continue;
      }
      
      // יצירת זמני תור ליום זה
      for (const timeSlot of schedule.timeSlots) {
        if (timeSlot.isActive) {
          slots.push({
            date: dateString,
            time: timeSlot.time,
            poolId,
            isBooked: false
          });
        }
      }
    }
    
    console.log('✅ Generated', slots.length, 'time slots');
    
    res.status(200).json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('❌ Error in generateTimeSlots:', error);
    res.status(500).json({
      success: false,
      error: 'שגיאה ביצירת זמני תור'
    });
  }
};

// עדכון זמנים זמינים לפי לוח העבודה
export const updateAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;
    const { startDate, endDate } = req.body;
    
    console.log('🔄 Updating available slots for poolId:', poolId);
    console.log('📅 Date range:', { startDate, endDate });
    
    const schedule = await WorkSchedule.findOne({ poolId });
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: 'לוח עבודה לא נמצא'
      });
    }
    
    // מחיקת זמנים קיימים בטווח התאריכים
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // מחיקת זמנים קיימים שלא תואמים ללוח העבודה
    const existingSlots = await AvailableSlot.find({
      poolId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    console.log('🗑️ Deleting', existingSlots.length, 'existing slots');
    await AvailableSlot.deleteMany({
      poolId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // יצירת זמנים חדשים לפי לוח העבודה
    const newSlots = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // בדיקה אם זה יום חופש
      if (dayOfWeek === schedule.dayOff) {
        console.log('🚫 Skipping day off:', dayOfWeek, date.toISOString().split('T')[0]);
        continue;
      }
      
      // בדיקה אם זה תאריך מיוחד סגור
      const dateString = date.toISOString().split('T')[0];
      const specialDate = schedule.specialDates.find(sd => sd.date === dateString);
      if (specialDate && specialDate.isClosed) {
        console.log('🚫 Skipping special closed date:', dateString, specialDate.reason);
        continue;
      }
      
      // יצירת זמני תור ליום זה
      for (const timeSlot of schedule.timeSlots) {
        if (timeSlot.isActive) {
          newSlots.push({
            employeeId: 'default', // או employeeId ספציפי
            poolId,
            date: dateString,
            time: timeSlot.time,
            isBooked: false
          });
        }
      }
    }
    
    // שמירת הזמנים החדשים
    if (newSlots.length > 0) {
      await AvailableSlot.insertMany(newSlots);
      console.log('✅ Created', newSlots.length, 'new available slots');
    }
    
    res.status(200).json({
      success: true,
      message: `עודכנו ${newSlots.length} זמנים זמינים`,
      deletedCount: existingSlots.length,
      createdCount: newSlots.length
    });
  } catch (error) {
    console.error('❌ Error in updateAvailableSlots:', error);
    res.status(500).json({
      success: false,
      error: 'שגיאה בעדכון זמנים זמינים'
    });
  }
};
