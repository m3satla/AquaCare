import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WaterQualityMonitor from '../components/WaterQualityMonitor';
import ChlorineCheck from '../components/ChlorineCheck';
import ShowerTempCheck from '../components/ShowerTempCheck';
import { useTranslation } from '../hooks/useTranslation';

const PersonalSensorsPage: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sensorType = searchParams.get('type');

  const getSensorTitle = (type: string) => {
    switch (type) {
      case 'waterTemp':
        return t('personalSensors.waterTemp.title', 'חיישן טמפרטורת מים');
      case 'chlorine':
        return t('personalSensors.chlorine.title', 'חיישן רמת כלור');
      case 'acidity':
        return t('personalSensors.acidity.title', 'חיישן רמת חומציות');
      case 'showerTemp':
        return t('personalSensors.showerTemp.title', 'חיישן טמפרטורת מקלחת');
      default:
        return t('personalSensors.title', 'חיישנים אישיים');
    }
  };

  const getSensorSubtitle = (type: string) => {
    switch (type) {
      case 'waterTemp':
        return t('personalSensors.waterTemp.subtitle', 'בדיקת טמפרטורת המים בבריכה');
      case 'chlorine':
        return t('personalSensors.chlorine.subtitle', 'בדיקת רמת הכלור במים');
      case 'acidity':
        return t('personalSensors.acidity.subtitle', 'בדיקת רמת החומציות במים');
      case 'showerTemp':
        return t('personalSensors.showerTemp.subtitle', 'בדיקת טמפרטורת המים במקלחות');
      default:
        return t('personalSensors.subtitle', 'בדיקת מצב החיישנים האישיים שלך');
    }
  };

  const getSensorComponent = (type: string) => {
    switch (type) {
      case 'waterTemp':
        return <WaterQualityMonitor />;
      case 'chlorine':
        return <ChlorineCheck />;
      case 'acidity':
        return <WaterQualityMonitor />; // או קומפוננטה ספציפית לחומציות
      case 'showerTemp':
        return <ShowerTempCheck />;
      default:
        return <WaterQualityMonitor />;
    }
  };

  const getSensorInfoTitle = (type: string) => {
    switch (type) {
      case 'waterTemp':
        return t('personalSensors.waterTemp.infoTitle', 'מידע על חיישן טמפרטורת מים');
      case 'chlorine':
        return t('personalSensors.chlorine.infoTitle', 'מידע על חיישן רמת כלור');
      case 'acidity':
        return t('personalSensors.acidity.infoTitle', 'מידע על חיישן רמת חומציות');
      case 'showerTemp':
        return t('personalSensors.showerTemp.infoTitle', 'מידע על חיישן טמפרטורת מקלחת');
      default:
        return t('personalSensors.info.title', 'מידע על החיישנים');
    }
  };

  const getSensorInfo = (type: string) => {
    switch (type) {
      case 'waterTemp':
        return t('personalSensors.waterTemp.info', 'חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה. הטמפרטורה האופטימלית היא בין 26-30 מעלות צלזיוס.');
      case 'chlorine':
        return t('personalSensors.chlorine.info', 'חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים. הרמה האופטימלית היא בין 1-3 ppm. רמה גבוהה מדי עלולה לגרום לגירוי בעור.');
      case 'acidity':
        return t('personalSensors.acidity.info', 'חיישן רמת חומציות - בודק את רמת ה-pH במים. הרמה האופטימלית היא בין 7.2-7.6. רמה נמוכה מדי עלולה לגרום לקורוזיה.');
      case 'showerTemp':
        return t('personalSensors.showerTemp.info', 'חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות. הטמפרטורה האופטימלית היא בין 35-40 מעלות צלזיוס.');
      default:
        return t('personalSensors.info.general', 'מידע כללי על החיישנים');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {sensorType ? getSensorTitle(sensorType) : t('personalSensors.title', 'חיישנים אישיים')}
          </Typography>
          
          {sensorType && (
            <Button 
              variant="outlined" 
              onClick={() => navigate('/personal-sensors')}
              sx={{ minWidth: 120 }}
            >
              {t('personalSensors.showAll', 'הצג הכל')}
            </Button>
          )}
        </Box>

        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {sensorType ? getSensorSubtitle(sensorType) : t('personalSensors.subtitle', 'בדיקת מצב החיישנים האישיים שלך')}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {!sensorType && (
            <>
              {/* חיישן טמפרטורת מים בבריכה */}
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease-in-out'
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <WaterQualityMonitor />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* חיישן רמת כלור */}
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease-in-out'
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <ChlorineCheck />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* חיישן טמפרטורת מים במקלחות */}
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease-in-out'
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <ShowerTempCheck />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </>
          )}

          {/* הצג חיישן ספציפי */}
          {sensorType && (
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    {getSensorComponent(sensorType)}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          )}
        </Grid>

        {/* מידע נוסף */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper 
            elevation={2} 
            sx={{ 
              mt: 6, 
              p: 4, 
              borderRadius: 3,
              backgroundColor: 'background.default'
            }}
          >
            <Typography variant="h5" gutterBottom color="primary.main">
              {sensorType ? getSensorInfoTitle(sensorType) : t('personalSensors.info.title', 'מידע על החיישנים')}
            </Typography>
            {sensorType ? (
              <Typography variant="body1" paragraph>
                {getSensorInfo(sensorType)}
              </Typography>
            ) : (
              <>
                <Typography variant="body1" paragraph>
                  {t('personalSensors.info.waterTemp', 'חיישן טמפרטורת מים בבריכה - בודק את הטמפרטורה האופטימלית לפעילות בבריכה')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t('personalSensors.info.chlorine', 'חיישן רמת כלור - מבטיח רמה בטוחה של כלור במים')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {t('personalSensors.info.showerTemp', 'חיישן טמפרטורת מים במקלחות - מבטיח טמפרטורה נוחה במקלחות')}
                </Typography>
              </>
            )}
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default PersonalSensorsPage;
