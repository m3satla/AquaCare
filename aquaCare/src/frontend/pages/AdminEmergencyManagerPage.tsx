import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AdminEmergencyManager from '../components/AdminEmergencyManager';
import { useTranslation } from '../hooks/useTranslation';

const AdminEmergencyManagerPage: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          {t('adminEmergency.title', 'ניהול מצבי חירום - מנהל')}
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('adminEmergency.subtitle', 'בקרה ידנית על מצבי חירום במערכת')}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'background.default'
          }}
        >
          <AdminEmergencyManager />
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
              {t('adminEmergency.info.title', 'מידע על ניהול מצבי חירום')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('adminEmergency.info.description', 'דף זה מאפשר למנהלים לשלוט במצבי חירום במערכת באופן ידני.')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('adminEmergency.info.note', 'השתמש בזהירות - הפעלת מצב חירום תשלח התראות לכל הגורמים הרלוונטיים.')}
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default AdminEmergencyManagerPage;