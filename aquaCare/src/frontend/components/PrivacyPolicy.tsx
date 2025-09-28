import React from "react";
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  useTheme
} from "@mui/material";
import {
  MdSecurity,
  MdInfo,
  MdShare,
  MdLock,
  MdPerson,
  MdUpdate,
  MdContactSupport
} from "react-icons/md";
import { useTranslation } from "../hooks/useTranslation";

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();
  const { currentLanguage } = useTranslation();

  const sections = [
    {
      icon: <MdInfo />,
      title: currentLanguage === 'en' ? "What information do we collect?" : "איזה מידע אנחנו אוספים?",
      description: currentLanguage === 'en' 
        ? "We may collect the following information when you use the website:"
        : "אנו עשויים לאסוף את המידע הבא כאשר אתה משתמש באתר:",
      items: [
        currentLanguage === 'en' ? "Full name" : "שם מלא",
        currentLanguage === 'en' ? "Email address" : "כתובת אימייל",
        currentLanguage === 'en' ? "Contact details" : "פרטי קשר",
        currentLanguage === 'en' ? "Details related to bookings and services" : "פרטים הקשורים להזמנות ושירותים",
        currentLanguage === 'en' ? "Statistical usage data" : "נתוני שימוש סטטיסטיים"
      ]
    },
    {
      icon: <MdPerson />,
      title: currentLanguage === 'en' ? "How do we use your information?" : "איך אנחנו משתמשים במידע שלך?",
      description: currentLanguage === 'en'
        ? "The collected information is used to improve our services, including:"
        : "המידע שנאסף משמש לשיפור השירותים שלנו, כולל:",
      items: [
        currentLanguage === 'en' ? "Providing personalized services" : "מתן שירותים מותאמים אישית",
        currentLanguage === 'en' ? "Customer support" : "תמיכת לקוחות",
        currentLanguage === 'en' ? "Improving website user experience" : "שיפור חוויית המשתמש באתר",
        currentLanguage === 'en' ? "Sending updates and notifications" : "שליחת עדכונים והודעות"
      ]
    },
    {
      icon: <MdShare />,
      title: currentLanguage === 'en' ? "Do we share information with third parties?" : "האם אנחנו משתפים מידע עם צדדים שלישיים?",
      description: currentLanguage === 'en'
        ? "We will never sell or rent your details to third parties. We may share information only in the following cases:"
        : "אנו לעולם לא נמכור או נשכיר את הפרטים שלך לצדדים שלישיים. אנו עשויים לשתף מידע רק במקרים הבאים:",
      items: [
        currentLanguage === 'en' ? "When required by law" : "כאשר נדרש על פי חוק",
        currentLanguage === 'en' ? "For website security and user experience improvement" : "לאבטחת האתר ושיפור חוויית המשתמש",
        currentLanguage === 'en' ? "As part of collaborations with third-party services (such as payment providers)" : "כחלק משיתופי פעולה עם שירותי צד שלישי (כמו ספקי תשלומים)"
      ]
    },
    {
      icon: <MdSecurity />,
      title: currentLanguage === 'en' ? "How do we protect your information?" : "איך אנחנו מגנים על המידע שלך?",
      description: currentLanguage === 'en'
        ? "We take advanced security measures to protect user privacy, including:"
        : "אנו נוקטים באמצעי אבטחה מתקדמים להגנה על פרטיות המשתמש, כולל:",
      items: [
        currentLanguage === 'en' ? "Data encryption" : "הצפנת נתונים",
        currentLanguage === 'en' ? "Limited access to information" : "גישה מוגבלת למידע",
        currentLanguage === 'en' ? "Ongoing security monitoring and updates" : "ניטור אבטחה מתמשך ועדכונים"
      ]
    },
    {
      icon: <MdLock />,
      title: currentLanguage === 'en' ? "User Rights" : "זכויות המשתמש",
      description: currentLanguage === 'en'
        ? "Website users have the following rights:"
        : "למשתמשי האתר יש את הזכויות הבאות:",
      items: [
        currentLanguage === 'en' ? "Request access to personal information stored about them" : "לבקש גישה למידע אישי המאוחסן עליהם",
        currentLanguage === 'en' ? "Request update or deletion of personal data" : "לבקש עדכון או מחיקה של נתונים אישיים",
        currentLanguage === 'en' ? "Refuse to receive marketing messages" : "לסרב לקבל הודעות שיווק"
      ]
    },
    {
      icon: <MdUpdate />,
      title: currentLanguage === 'en' ? "Privacy Policy Updates" : "עדכוני מדיניות פרטיות",
      description: currentLanguage === 'en'
        ? "We may update this policy from time to time, so it is recommended to check this page periodically to stay updated."
        : "אנו עשויים לעדכן מדיניות זו מעת לעת, ולכן מומלץ לבדוק דף זה באופן תקופתי כדי להישאר מעודכנים.",
      items: []
    },
    {
      icon: <MdContactSupport />,
      title: currentLanguage === 'en' ? "Contact" : "צור קשר",
      description: currentLanguage === 'en'
        ? "If you have questions about our privacy policy, you can contact us through the contact page."
        : "אם יש לך שאלות לגבי מדיניות הפרטיות שלנו, אתה יכול ליצור איתנו קשר דרך עמוד צור קשר.",
      items: []
    }
  ];

  return (
    <Box sx={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            textAlign: "center",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 3
          }}
        >
          <Box sx={{
            display: "inline-flex",
            alignItems: "center",
            mb: 3,
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
            border: `1px solid ${theme.palette.primary.main}30`
          }}>
            <MdSecurity size={32} color={theme.palette.primary.main} />
            <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold", color: theme.palette.primary.main }}>
              {currentLanguage === 'en' ? "Privacy Policy" : "מדיניות פרטיות"}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", lineHeight: 1.6 }}>
            {currentLanguage === 'en' 
              ? "User privacy is important to us. On this page we will explain how we collect, use and protect your information."
              : "פרטיות המשתמש חשובה לנו. בדף זה נסביר איך אנחנו אוספים, משתמשים ומגנים על המידע שלך."
            }
          </Typography>
        </Paper>

        {/* Content Sections */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sections.map((section, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 3,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}20`
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "white",
                    mr: 3
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {index + 1}. {section.title}
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {section.description}
                </Typography>

                {section.items.length > 0 && (
                  <List sx={{ pl: 2 }}>
                    {section.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: theme.palette.primary.main
                          }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "1rem",
                              lineHeight: 1.5
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Footer Note */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            textAlign: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {currentLanguage === 'en' ? "Last updated: " : "עודכן לאחרונה: "}{new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
