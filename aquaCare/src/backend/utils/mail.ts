import nodemailer from "nodemailer";
import { config } from "./index";

const { user, pass, host, port, secure } = config().email;

export const sendEmail = async (email: string, subject: string, text: string, html: string) => {
  const transporterOptions = {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  };

  console.log("📧 Email configuration for sending:");
  console.log("  Host:", host);
  console.log("  Port:", port);
  console.log("  Secure:", secure);
  console.log("  User:", user ? "SET" : "NOT SET");
  console.log("  Pass:", pass ? "SET" : "NOT SET");

  const transporter = nodemailer.createTransport(transporterOptions);

  const mailOptions = {
    from: user,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// פונקציה לשליחת מייל עם פרטי התחברות למשתמש חדש
export const sendWelcomeEmail = async (
  userEmail: string, 
  firstName: string, 
  lastName: string, 
  password: string,
  role: string
) => {
  const subject = "ברוכים הבאים למערכת AquaCare - פרטי התחברות";
  
  const text = `
שלום ${firstName} ${lastName},

ברוכים הבאים למערכת AquaCare!

פרטי ההתחברות שלך:
אימייל: ${userEmail}
סיסמה: ${password}
תפקיד: ${getRoleInHebrew(role)}

אנא התחבר למערכת בכתובת: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

לאחר ההתחברות הראשונה, מומלץ לשנות את הסיסמה בהגדרות החשבון.

בברכה,
צוות AquaCare
  `;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ברוכים הבאים למערכת AquaCare</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2196F3;
        }
        .welcome-text {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .credentials {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
        }
        .credential-item {
            margin: 10px 0;
            font-weight: bold;
        }
        .credential-value {
            color: #2196F3;
            font-weight: normal;
        }
        .login-link {
            text-align: center;
            margin: 30px 0;
        }
        .login-button {
            display: inline-block;
            background-color: #2196F3;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏊‍♂️ ברוכים הבאים למערכת AquaCare</h1>
        </div>
        
        <div class="welcome-text">
            שלום ${firstName} ${lastName},
            <br><br>
            ברוכים הבאים למערכת AquaCare! החשבון שלך נוצר בהצלחה.
        </div>
        
        <div class="credentials">
            <h3>📋 פרטי ההתחברות שלך:</h3>
            <div class="credential-item">
                אימייל: <span class="credential-value">${userEmail}</span>
            </div>
            <div class="credential-item">
                סיסמה: <span class="credential-value">${password}</span>
            </div>
            <div class="credential-item">
                תפקיד: <span class="credential-value">${getRoleInHebrew(role)}</span>
            </div>
        </div>
        
        <div class="login-link">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="login-button">
                🔐 התחבר למערכת
            </a>
        </div>
        
        <div class="warning">
            <strong>⚠️ חשוב:</strong> לאחר ההתחברות הראשונה, מומלץ לשנות את הסיסמה בהגדרות החשבון.
        </div>
        
        <div class="footer">
            <p>בברכה,<br>צוות AquaCare</p>
            <p>אם יש לך שאלות, אנא פנה אלינו דרך מערכת התמיכה.</p>
        </div>
    </div>
</body>
</html>
  `;

  try {
    await sendEmail(userEmail, subject, text, html);
    console.log(`✅ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${userEmail}:`, error);
    throw error;
  }
};

// פונקציה לשליחת מייל עם סיסמה זמנית למשתמש קיים
export const sendTemporaryPasswordEmail = async (
  userEmail: string, 
  firstName: string, 
  lastName: string, 
  tempPassword: string
) => {
  const subject = "סיסמה זמנית חדשה - מערכת AquaCare";
  
  const text = `
שלום ${firstName} ${lastName},

הסיסמה שלך אופסה על ידי מנהל המערכת.

הסיסמה הזמנית החדשה שלך היא: ${tempPassword}

אנא התחבר למערכת בכתובת: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

⚠️ חשוב: לאחר ההתחברות, אנא שנה את הסיסמה בהגדרות החשבון.

בברכה,
צוות AquaCare
  `;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>סיסמה זמנית חדשה - AquaCare</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #FF9800;
        }
        .content {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .temp-password {
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #FF9800;
            text-align: center;
        }
        .temp-password h3 {
            margin: 0 0 10px 0;
            color: #E65100;
        }
        .password-display {
            font-size: 24px;
            font-weight: bold;
            color: #FF9800;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            letter-spacing: 2px;
        }
        .login-link {
            text-align: center;
            margin: 30px 0;
        }
        .login-button {
            display: inline-block;
            background-color: #FF9800;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 סיסמה זמנית חדשה</h1>
        </div>
        
        <div class="content">
            שלום ${firstName} ${lastName},
            <br><br>
            הסיסמה שלך אופסה על ידי מנהל המערכת.
        </div>
        
        <div class="temp-password">
            <h3>🔑 הסיסמה הזמנית החדשה שלך:</h3>
            <div class="password-display">${tempPassword}</div>
        </div>
        
        <div class="login-link">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="login-button">
                🔐 התחבר למערכת
            </a>
        </div>
        
        <div class="warning">
            <strong>⚠️ חשוב:</strong> לאחר ההתחברות, אנא שנה את הסיסמה בהגדרות החשבון.
        </div>
        
        <div class="footer">
            <p>בברכה,<br>צוות AquaCare</p>
            <p>אם יש לך שאלות, אנא פנה אלינו דרך מערכת התמיכה.</p>
        </div>
    </div>
</body>
</html>
  `;

  try {
    await sendEmail(userEmail, subject, text, html);
    console.log(`✅ Temporary password email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending temporary password email to ${userEmail}:`, error);
    throw error;
  }
};

// פונקציה עזר להמרת תפקיד לעברית
const getRoleInHebrew = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'מנהל';
    case 'normal':
      return 'משתמש רגיל';
    case 'therapist':
      return 'מטפל';
    case 'patient':
      return 'מטופל';
    default:
      return role;
  }
};

// פונקציה לשליחת תזכורת לתור
export const sendAppointmentReminderEmail = async (
  userEmail: string,
  firstName: string,
  lastName: string,
  appointmentDate: string,
  appointmentTime: string,
  appointmentType: string
) => {
  const subject = "📅 תזכורת לתור מחר - מערכת AquaCare";
  
  const text = `
שלום ${firstName} ${lastName},

זוהי תזכורת לתור שלך מחר:

📅 תאריך: ${new Date(appointmentDate).toLocaleDateString('he-IL')}
🕐 שעה: ${appointmentTime}
🏥 סוג טיפול: ${appointmentType}

אנא וודאו שאתם מגיעים בזמן!

בברכה,
צוות AquaCare
  `;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>תזכורת לתור - AquaCare</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2196F3;
        }
        .content {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .appointment-details {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
        }
        .detail-item {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .detail-icon {
            margin-left: 10px;
            font-size: 18px;
        }
        .reminder-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 תזכורת לתור מחר</h1>
        </div>
        
        <div class="content">
            שלום ${firstName} ${lastName},
            <br><br>
            זוהי תזכורת לתור שלך מחר:
        </div>
        
        <div class="appointment-details">
            <div class="detail-item">
                <span class="detail-icon">📅</span>
                <strong>תאריך:</strong> ${new Date(appointmentDate).toLocaleDateString('he-IL')}
            </div>
            <div class="detail-item">
                <span class="detail-icon">🕐</span>
                <strong>שעה:</strong> ${appointmentTime}
            </div>
            <div class="detail-item">
                <span class="detail-icon">🏥</span>
                <strong>סוג טיפול:</strong> ${appointmentType}
            </div>
        </div>
        
        <div class="reminder-note">
            <strong>⚠️ חשוב:</strong> אנא וודאו שאתם מגיעים בזמן!
        </div>
        
        <div class="footer">
            <p>בברכה,<br>צוות AquaCare</p>
            <p>אם יש לך שאלות, אנא פנה אלינו דרך מערכת התמיכה.</p>
        </div>
    </div>
</body>
</html>
  `;

  try {
    await sendEmail(userEmail, subject, text, html);
    console.log(`✅ Appointment reminder email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Error sending appointment reminder email to ${userEmail}:`, error);
    throw error;
  }
};

// פונקציה לשליחת התראה על הודעה חדשה
export const sendNewMessageNotificationEmail = async (
  receiverEmail: string,
  receiverFirstName: string,
  receiverLastName: string,
  senderFirstName: string,
  senderLastName: string,
  messageSubject: string,
  messageContent: string,
  priority: string
) => {
  const subject = "📬 הודעה חדשה - מערכת AquaCare";
  
  const text = `
שלום ${receiverFirstName} ${receiverLastName},

קיבלת הודעה חדשה מ-${senderFirstName} ${senderLastName}:

📧 נושא: ${messageSubject}
📝 תוכן: ${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}
⚡ עדיפות: ${getPriorityInHebrew(priority)}

לצפייה בהודעה המלאה, התחבר למערכת בכתובת: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/messages

בברכה,
צוות AquaCare
  `;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>הודעה חדשה - AquaCare</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2196F3;
        }
        .content {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .message-details {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
        }
        .detail-item {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .detail-icon {
            margin-left: 10px;
            font-size: 18px;
        }
        .priority-urgent {
            color: #f44336;
            font-weight: bold;
        }
        .priority-high {
            color: #ff9800;
            font-weight: bold;
        }
        .priority-medium {
            color: #2196f3;
            font-weight: bold;
        }
        .priority-low {
            color: #4caf50;
            font-weight: bold;
        }
        .view-message {
            text-align: center;
            margin: 30px 0;
        }
        .view-button {
            display: inline-block;
            background-color: #2196F3;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 הודעה חדשה</h1>
        </div>
        
        <div class="content">
            שלום ${receiverFirstName} ${receiverLastName},
            <br><br>
            קיבלת הודעה חדשה מ-<strong>${senderFirstName} ${senderLastName}</strong>:
        </div>
        
        <div class="message-details">
            <div class="detail-item">
                <span class="detail-icon">📧</span>
                <strong>נושא:</strong> ${messageSubject}
            </div>
            <div class="detail-item">
                <span class="detail-icon">📝</span>
                <strong>תוכן:</strong> ${messageContent.substring(0, 100)}${messageContent.length > 100 ? '...' : ''}
            </div>
            <div class="detail-item">
                <span class="detail-icon">⚡</span>
                <strong>עדיפות:</strong> <span class="priority-${priority}">${getPriorityInHebrew(priority)}</span>
            </div>
        </div>
        
        <div class="view-message">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/messages" class="view-button">
                📬 צפה בהודעה
            </a>
        </div>
        
        <div class="footer">
            <p>בברכה,<br>צוות AquaCare</p>
            <p>אם יש לך שאלות, אנא פנה אלינו דרך מערכת התמיכה.</p>
        </div>
    </div>
</body>
</html>
  `;

  try {
    await sendEmail(receiverEmail, subject, text, html);
    console.log(`✅ New message notification email sent to ${receiverEmail}`);
  } catch (error) {
    console.error(`❌ Error sending new message notification email to ${receiverEmail}:`, error);
    throw error;
  }
};

// פונקציה עזר להמרת עדיפות לעברית
const getPriorityInHebrew = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'דחופה';
    case 'high':
      return 'גבוהה';
    case 'medium':
      return 'בינונית';
    case 'low':
      return 'נמוכה';
    default:
      return priority;
  }
}; 