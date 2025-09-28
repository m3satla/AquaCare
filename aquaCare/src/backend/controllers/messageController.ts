import { Request, Response } from "express";
import Message from "../models/Message";
import User from "../models/user";
import { sendNewMessageNotificationEmail } from "../config/mail";

// יצירת הודעה חדשה
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, subject, content, messageType, priority, conversationId } = req.body;
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    if (!receiverId || !subject || !content) {
      return res.status(400).json({ success: false, error: "חסרים פרטים נדרשים" });
    }

    // בדיקה שהמקבל קיים
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, error: "המקבל לא נמצא" });
    }

    // יצירת ID שיחה אם לא קיים
    const finalConversationId = conversationId || `${user._id}_${receiverId}_${Date.now()}`;

    const message = new Message({
      senderId: user._id,
      receiverId,
      subject,
      content,
      messageType: messageType || 'internal',
      priority: priority || 'medium',
      conversationId: finalConversationId,
      poolId: user.poolId
    });

    await message.save();

    console.log(`✅ הודעה נשלחה מ-${user.email} ל-${receiver.email}`);

    // שליחת התראה במייל למקבל
    try {
      await sendNewMessageNotificationEmail(
        receiver.email,
        receiver.firstName,
        receiver.lastName,
        user.firstName,
        user.lastName,
        subject,
        content,
        priority || 'medium'
      );
      console.log(`📧 התראה נשלחה במייל ל-${receiver.email}`);
    } catch (emailError) {
      console.error(`❌ שגיאה בשליחת התראה במייל ל-${receiver.email}:`, emailError);
      // לא נכשל את הפעולה אם המייל נכשל
    }

    res.status(201).json({ 
      success: true, 
      message: "ההודעה נשלחה בהצלחה",
      data: message 
    });

  } catch (error: any) {
    console.error('❌ שגיאה ביצירת הודעה:', error);
    res.status(500).json({ success: false, error: "שגיאה ביצירת הודעה" });
  }
};

// שליפת הודעות נכנסות
export const getInboxMessages = async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;
    const { page = 1, limit = 20, priority, isRead } = req.query;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const query: any = { receiverId: user._id };
    
    if (priority) query.priority = priority;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role');

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליפת הודעות נכנסות:', error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת הודעות" });
  }
};

// שליפת הודעות יוצאות
export const getSentMessages = async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;
    const { page = 1, limit = 20 } = req.query;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const messages = await Message.find({ senderId: user._id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role');

    const total = await Message.countDocuments({ senderId: user._id });

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליפת הודעות יוצאות:', error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת הודעות" });
  }
};

// שליפת שיחה ספציפית
export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const messages = await Message.find({ 
      conversationId,
      $or: [{ senderId: user._id }, { receiverId: user._id }]
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'firstName lastName email role')
      .populate('receiverId', 'firstName lastName email role');

    if (messages.length === 0) {
      return res.status(404).json({ success: false, error: "שיחה לא נמצאה" });
    }

    // סמן הודעות כנקראו אם המשתמש הוא המקבל
    const unreadMessages = messages.filter(msg => 
      msg.receiverId.toString() === user._id && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(msg => msg._id) } },
        { isRead: true, readAt: new Date() }
      );
    }

    res.status(200).json({
      success: true,
      messages,
      conversationId
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליפת שיחה:', error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת שיחה" });
  }
};

// שליפת רשימת שיחות
export const getConversations = async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    // מצא את כל השיחות של המשתמש
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: user._id }, { receiverId: user._id }]
        }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $last: "$$ROOT" },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiverId", user._id] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    // הוסף פרטי משתמשים
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findById(conv.lastMessage._id)
          .populate('senderId', 'firstName lastName email role')
          .populate('receiverId', 'firstName lastName email role');

        return {
          conversationId: conv._id,
          lastMessage,
          messageCount: conv.messageCount,
          unreadCount: conv.unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: conversationsWithUsers
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליפת שיחות:', error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת שיחות" });
  }
};

// סמן הודעה כנקראה
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: "הודעה לא נמצאה" });
    }

    if (message.receiverId.toString() !== user._id) {
      return res.status(403).json({ success: false, error: "אין הרשאה לסמן הודעה זו" });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: "ההודעה סומנה כנקראה"
    });

  } catch (error: any) {
    console.error('❌ שגיאה בסימון הודעה כנקראה:', error);
    res.status(500).json({ success: false, error: "שגיאה בסימון הודעה" });
  }
};

// מחיקת הודעה
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: "הודעה לא נמצאה" });
    }

    if (message.senderId.toString() !== user._id) {
      return res.status(403).json({ success: false, error: "אין הרשאה למחוק הודעה זו" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: "ההודעה נמחקה בהצלחה"
    });

  } catch (error: any) {
    console.error('❌ שגיאה במחיקת הודעה:', error);
    res.status(500).json({ success: false, error: "שגיאה במחיקת הודעה" });
  }
};

// שליפת סטטיסטיקות הודעות
export const getMessageStats = async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: "משתמש לא מחובר" });
    }

    const [totalInbox, unreadCount, totalSent, urgentCount] = await Promise.all([
      Message.countDocuments({ receiverId: user._id }),
      Message.countDocuments({ receiverId: user._id, isRead: false }),
      Message.countDocuments({ senderId: user._id }),
      Message.countDocuments({ 
        receiverId: user._id, 
        priority: 'urgent',
        isRead: false 
      })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalInbox,
        unreadCount,
        totalSent,
        urgentCount
      }
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליפת סטטיסטיקות:', error);
    res.status(500).json({ success: false, error: "שגיאה בשליפת סטטיסטיקות" });
  }
};
