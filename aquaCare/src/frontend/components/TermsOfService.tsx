import React from "react";
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  Card,
  CardContent,
  useTheme
} from "@mui/material";
import {
  MdGavel,
  MdCheckCircle,
  MdBlock,
  MdSecurity,
  MdUpdate,
  MdContactSupport
} from "react-icons/md";
import { useTranslation } from "../hooks/useTranslation";

const TermsOfService: React.FC = () => {
  const theme = useTheme();
  const { currentLanguage } = useTranslation();

  const sections = [
    {
      icon: <MdCheckCircle />,
      title: currentLanguage === 'en' ? "User Commitment" : "התחייבות המשתמש",
      description: currentLanguage === 'en'
        ? "The user must agree to all terms appearing on this page before using our services. Any illegal or inappropriate use of the website may lead to blocking from our services."
        : "על המשתמש להסכים לכל התנאים המופיעים בדף זה לפני השימוש בשירותים שלנו. כל שימוש לא חוקי או לא הולם באתר עלול להוביל לחסימה משירותינו."
    },
    {
      icon: <MdBlock />,
      title: currentLanguage === 'en' ? "Permitted and Prohibited Use" : "שימוש מותר ואסור",
      description: currentLanguage === 'en'
        ? "It is permitted to use the website for information and service booking purposes only. Do not use the website for offensive purposes, fraud, copying content without permission, or copyright infringement."
        : "מותר להשתמש באתר לצורכי מידע והזמנת שירותים בלבד. אין להשתמש באתר למטרות פוגעניות, הונאה, העתקת תכנים ללא רשות או הפרת זכויות יוצרים."
    },
    {
      icon: <MdSecurity />,
      title: currentLanguage === 'en' ? "Privacy and Data Security" : "פרטיות ואבטחת מידע",
      description: currentLanguage === 'en'
        ? "User privacy is important to us. We maintain personal information according to our privacy policy, but we are not responsible for data loss or unauthorized system intrusion."
        : "פרטיות המשתמש חשובה לנו. אנו שומרים על מידע אישי בהתאם למדיניות הפרטיות שלנו, אך איננו אחראים לאובדן נתונים או חדירה בלתי מורשית למערכת."
    },
    {
      icon: <MdUpdate />,
      title: currentLanguage === 'en' ? "Changes to Terms" : "שינויים בתנאים",
      description: currentLanguage === 'en'
        ? "We reserve the right to change the terms of use at any time. Term changes will take effect immediately upon publication on the website."
        : "אנו שומרים לעצמנו את הזכות לשנות את תנאי השימוש בכל עת. שינויי תנאים ייכנסו לתוקף מיד עם פרסומם באתר."
    },
    {
      icon: <MdContactSupport />,
      title: currentLanguage === 'en' ? "Contact" : "יצירת קשר",
      description: currentLanguage === 'en'
        ? "For any questions or clarifications regarding the terms of use, you can contact us through the contact page."
        : "בכל שאלה או הבהרה בנוגע לתנאי השימוש, ניתן לפנות אלינו דרך עמוד צור קשר."
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
            <MdGavel size={32} color={theme.palette.primary.main} />
            <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold", color: theme.palette.primary.main }}>
              {currentLanguage === 'en' ? "Terms of Service" : "תנאי שימוש"}
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto", lineHeight: 1.6 }}>
            {currentLanguage === 'en'
              ? "Welcome to our website. The use of the website and its services is subject to the terms and limitations detailed below."
              : "ברוך הבא לאתר שלנו. השימוש באתר ובשירותיו כפוף לתנאים ולהגבלות המפורטים להלן."
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

                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Important Notice */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.warning.light}10)`,
            border: `1px solid ${theme.palette.warning.main}30`,
            borderRadius: 3
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MdGavel size={24} color={theme.palette.warning.main} />
            <Typography variant="h6" fontWeight="bold" color="warning.main" sx={{ ml: 2 }}>
              {currentLanguage === 'en' ? "Important Notice" : "הודעה חשובה"}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {currentLanguage === 'en'
              ? "By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
              : "בשימוש בשירותים שלנו, אתה מאשר שקראת, הבנת ומסכים להיות מחויב לתנאי השימוש הללו. אם אינך מסכים לתנאים אלה, אנא אל תשתמש בשירותים שלנו."
            }
          </Typography>
        </Paper>

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

export default TermsOfService;
