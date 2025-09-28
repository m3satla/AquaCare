import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { GDPRConsentManager } from '../components/GDPRConsentManager';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';

const GDPRConsentManagerPage: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          {t('auth.please_login', 'יש להתחבר כדי לצפות בדף זה')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          {t('gdprConsent.title', 'ניהול הסכמות GDPR')}
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('gdprConsent.subtitle', 'ניהול ההסכמות שלך לשימוש בנתונים')}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'background.default'
          }}
        >
          <GDPRConsentManager 
            userId={Number(user._id || user.id)}
            showDetailsDialog={false}
          />
        </Paper>

        {/* מידע נוסף */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper 
            elevation={2} 
            sx={{ 
              mt: 4, 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h6" gutterBottom color="primary.main">
              {t('gdprConsent.info.title', 'מידע על הסכמות GDPR')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('gdprConsent.info.description', 'דף זה מאפשר לך לנהל את ההסכמות שלך לשימוש בנתונים בהתאם לתקנות GDPR.')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('gdprConsent.info.note', 'אתה יכול לשנות את ההסכמות שלך בכל עת. השינויים ייכנסו לתוקף מיד.')}
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default GDPRConsentManagerPage;






