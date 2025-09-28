import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, Chip, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import UserPresenceToggle from '../components/UserPresenceToggle';

const UserPresencePage: React.FC = () => {
  const { user } = useAuth();
  const { t, isRTL, direction } = useTranslation();
  const [isPresent, setIsPresent] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    if (user) {
      // בדיקה אם המשתמש נוכח (אפשר להוסיף לוגיקה נוספת כאן)
      setIsPresent(user.isPresent || false);
      setLastUpdate(new Date().toLocaleString(isRTL ? 'he-IL' : 'en-US'));
    }
  }, [user, isRTL]);

  const handlePresenceChange = (newPresence: boolean) => {
    setIsPresent(newPresence);
    setLastUpdate(new Date().toLocaleString(isRTL ? 'he-IL' : 'en-US'));
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          {t('userPresence.loginRequired', 'יש להתחבר כדי לצפות בדף זה')}
        </Alert>
      </Container>
    );
  }

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
          {t('userPresence.title', 'נוכחות בבריכה')}
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('userPresence.subtitle', 'עדכן את מצב הנוכחות שלך בבריכה')}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'background.default'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('userPresence.currentStatus', 'מצב נוכחי')}
            </Typography>
            
            <Chip 
              label={isPresent ? t('userPresence.present', 'נוכח בבריכה') : t('userPresence.notPresent', 'לא נוכח בבריכה')}
              color={isPresent ? 'success' : 'default'}
              size="large"
              sx={{ fontSize: '1.1rem', p: 1 }}
            />
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('userPresence.updateStatus', 'עדכן מצב')}
            </Typography>
            
            {user._id && (
              <UserPresenceToggle 
                userId={user._id}
                initialPresence={isPresent}
              />
            )}
          </Box>

          {lastUpdate && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('userPresence.lastUpdate', 'עדכון אחרון')}: {lastUpdate}
              </Typography>
            </Box>
          )}
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
              {t('userPresence.info.title', 'מידע על נוכחות')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('userPresence.info.description', 'עדכון מצב הנוכחות שלך עוזר למנהלי הבריכה לדעת מי נמצא בבריכה כרגע.')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('userPresence.info.note', 'המצב מתעדכן בזמן אמת ונרשם בהיסטוריית הפעילות.')}
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default UserPresencePage;






