import express from 'express';
import sendTelegramMessage from '../sendTelegram';

const router = express.Router();

// POST /send-telegram - שליחת הודעה לטלגרם
router.post('/send-telegram', async (req, res) => {
  try {
    const { message, chatId } = req.body;

    // בדיקת תקינות הקלט
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'הודעה היא שדה חובה ויכולה להיות מחרוזת בלבד'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ההודעה לא יכולה להיות ריקה'
      });
    }

    console.log('📨 קבלת בקשה לשליחת הודעה לטלגרם:');
    console.log('   💬 הודעה:', message);
    console.log('   🆔 Chat ID:', chatId || 'שימוש ב-Chat ID ברירת מחדל');

    // שליחת ההודעה לטלגרם
    const result = await sendTelegramMessage(message, chatId);

    console.log('✅ הודעה נשלחה בהצלחה לטלגרם');
    
    res.json({
      success: true,
      message: 'ההודעה נשלחה בהצלחה לטלגרם',
      data: result
    });

  } catch (error: any) {
    console.error('❌ שגיאה בשליחת הודעה לטלגרם:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'שגיאה לא ידועה בשליחת ההודעה'
    });
  }
});

// GET /telegram-status - בדיקת סטטוס הטלגרם
router.get('/telegram-status', async (req, res) => {
  try {
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'חסרים הגדרות טלגרם',
        missing: {
          token: !telegramToken,
          chatId: !telegramChatId
        }
      });
    }

    res.json({
      success: true,
      message: 'הגדרות טלגרם תקינות',
      config: {
        tokenConfigured: !!telegramToken,
        chatIdConfigured: !!telegramChatId,
        chatId: telegramChatId
      }
    });

  } catch (error: any) {
    console.error('❌ שגיאה בבדיקת סטטוס טלגרם:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'שגיאה לא ידועה בבדיקת הסטטוס'
    });
  }
});

export default router;















