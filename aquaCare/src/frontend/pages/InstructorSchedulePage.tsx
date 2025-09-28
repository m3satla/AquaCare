import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import InstructorSchedule from '../components/InstructorSchedule';
import { useTranslation } from '../hooks/useTranslation';

const InstructorSchedulePage: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();

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
          {t('instructorSchedule.title', 'לוח זמנים מדריכים')}
        </Typography>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('instructorSchedule.subtitle', 'צפייה בלוח הזמנים של המדריכים בבריכות השונות')}
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'background.default'
          }}
        >
          <InstructorSchedule />
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
              {t('instructorSchedule.info.title', 'מידע על לוח זמנים')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('instructorSchedule.info.description', 'לוח הזמנים מציג את המדריכים הפעילים בכל בריכה ואת שעות העבודה שלהם.')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('instructorSchedule.info.note', 'המידע מתעדכן בזמן אמת ומשקף את המצב הנוכחי של הצוות.')}
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default InstructorSchedulePage;






