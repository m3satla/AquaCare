import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../context/AuthContext";
import {
  Pool as PoolIcon,
  HealthAndSafety as SafetyIcon,
  People as PeopleIcon,
  Spa as SpaIcon,
  AdminPanelSettings as AdminIcon,
  MedicalServices as TherapistIcon,
  Person as PatientIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon
} from "@mui/icons-material";
import "../styles/home.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  // פונקציה לקביעת סוג המשתמש
  const getUserType = () => {
    if (!isAuthenticated || !user) return 'guest';
    return user.role;
  };

  const userType = getUserType();

  // תוכן למנהל
  const AdminHomeContent = () => (
    <Box sx={{ minHeight: '100vh', direction }}>
      <Container maxWidth="lg" className="waveContainer">
        <Box sx={{
          textAlign: 'center',
          pt: 8,
          pb: 4,
          position: 'relative',
          zIndex: 2
        }}>
          <Typography
            variant="h2"
            component="h1"
            className="waveHeader"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('home.admin.welcomeTitle') || 'ברוכים הבאים למנהל המערכת'}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('home.admin.welcomeSubtitle') || 'ניהול מרכז הטיפולים והמתקנים'}
          </Typography>
        </Box>

        {/* Wave Animation */}
        <div className="waveWrapper">
          <div
            className="wave"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
          <div
            className="wave waveSecondary"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
        </div>
      </Container>

      {/* Admin Dashboard Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          {t('home.admin.dashboardTitle') || 'לוח בקרה מנהל'}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/admin')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.admin.dashboard') || 'לוח בקרה'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.admin.dashboardDesc') || 'ניהול כללי של המערכת'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/statistics')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.admin.statistics') || 'סטטיסטיקות'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.admin.statisticsDesc') || 'צפייה בסטטיסטיקות המערכת'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/admin/emergency')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <SafetyIcon sx={{ fontSize: 40, color: 'error.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'error.main' }}>
                  {t('home.admin.emergency') || 'ניהול חירום'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.admin.emergencyDesc') || 'ניהול מצבי חירום'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/admin/users')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.admin.users') || 'ניהול משתמשים'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.admin.usersDesc') || 'ניהול משתמשי המערכת'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // תוכן למטפל
  const TherapistHomeContent = () => (
    <Box sx={{ minHeight: '100vh', direction }}>
      <Container maxWidth="lg" className="waveContainer">
        <Box sx={{
          textAlign: 'center',
          pt: 8,
          pb: 4,
          position: 'relative',
          zIndex: 2
        }}>
          <Typography
            variant="h2"
            component="h1"
            className="waveHeader"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('home.therapist.welcomeTitle') || 'ברוכים הבאים למטפל'}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('home.therapist.welcomeSubtitle') || 'ניהול הטיפולים והמטופלים שלך'}
          </Typography>
        </Box>

        {/* Wave Animation */}
        <div className="waveWrapper">
          <div
            className="wave"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
          <div
            className="wave waveSecondary"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
        </div>
      </Container>

      {/* Therapist Dashboard Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          {t('home.therapist.dashboardTitle') || 'לוח בקרה מטפל'}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/therapist/schedule')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.therapist.schedule') || 'לוח זמנים'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.therapist.scheduleDesc') || 'ניהול לוח הזמנים שלך'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/appointments')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <TherapistIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.therapist.appointments') || 'תורים'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.therapist.appointmentsDesc') || 'ניהול התורים שלך'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/statistics')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.therapist.statistics') || 'סטטיסטיקות'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.therapist.statisticsDesc') || 'צפייה בסטטיסטיקות הטיפולים'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // תוכן למטופל
  const PatientHomeContent = () => (
    <Box sx={{ minHeight: '100vh', direction }}>
      <Container maxWidth="lg" className="waveContainer">
        <Box sx={{
          textAlign: 'center',
          pt: 8,
          pb: 4,
          position: 'relative',
          zIndex: 2
        }}>
          <Typography
            variant="h2"
            component="h1"
            className="waveHeader"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('home.patient.welcomeTitle') || 'ברוכים הבאים למטופל'}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('home.patient.welcomeSubtitle') || 'ניהול הטיפולים והתורים שלך'}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/booking')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              boxShadow: 3,
              mr: 2
            }}
          >
            {t('navigation.booking')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/appointments')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            {t('home.patient.myAppointments') || 'התורים שלי'}
          </Button>
        </Box>

        {/* Wave Animation */}
        <div className="waveWrapper">
          <div
            className="wave"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
          <div
            className="wave waveSecondary"
            style={{ backgroundImage: 'url("/assets/wave.svg")' }}
          />
        </div>
      </Container>

      {/* Patient Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          {t('home.patient.featuresTitle') || 'שירותים זמינים'}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/booking')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <PoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.patient.bookTherapy') || 'קביעת תור לטיפול'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.patient.bookTherapyDesc') || 'קבע תור לטיפול במים'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/appointments')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.patient.myAppointments') || 'התורים שלי'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.patient.myAppointmentsDesc') || 'צפייה וניהול התורים שלך'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/profile')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <PatientIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.patient.profile') || 'הפרופיל שלי'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.patient.profileDesc') || 'ניהול הפרופיל האישי'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate('/feedback')}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('home.patient.feedback') || 'משוב'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('home.patient.feedbackDesc') || 'שלח משוב על הטיפולים'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // תוכן למשתמש לא מחובר
  const GuestHomeContent = () => {
    const features = [
      {
        icon: <PoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: t('home.features.therapy'),
        description: t('home.features.therapyDesc')
      },
      {
        icon: <SpaIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: t('home.features.wellness'),
        description: t('home.features.wellnessDesc')
      },
      {
        icon: <SafetyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: t('home.features.safety'),
        description: t('home.features.safetyDesc')
      },
      {
        icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: t('home.features.community'),
        description: t('home.features.communityDesc')
      }
    ];

    return (
      <Box sx={{ minHeight: '100vh', direction }}>
        {/* Hero Section */}
        <Container maxWidth="lg" className="waveContainer">
          <Box sx={{
            textAlign: 'center',
            pt: 8,
            pb: 4,
            position: 'relative',
            zIndex: 2
          }}>
            <Typography
              variant="h2"
              component="h1"
              className="waveHeader"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('home.welcomeTitle')}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              {t('home.welcomeSubtitle')}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              {t('home.description')}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/booking')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                boxShadow: 3,
                mr: 2
              }}
            >
              {t('navigation.booking')}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/profile/register')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              {t('auth.register')}
            </Button>
          </Box>

          {/* Wave Animation */}
          <div className="waveWrapper">
            <div
              className="wave"
              style={{ backgroundImage: 'url("/assets/wave.svg")' }}
            />
            <div
              className="wave waveSecondary"
              style={{ backgroundImage: 'url("/assets/wave.svg")' }}
            />
          </div>
        </Container>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {t('home.features.title')}
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        color: 'primary.main'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Call to Action Section */}
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mt: 4
        }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 3,
                  fontWeight: 'bold'
                }}
              >
                {t('home.cta.title')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9
                }}
              >
                {t('home.cta.subtitle')}
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/profile/register')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {t('auth.register')}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  };

  // בחירת התוכן המתאים לפי סוג המשתמש
  const renderContent = () => {
    switch (userType) {
      case 'Admin':
        return <AdminHomeContent />;
      case 'therapist':
        return <TherapistHomeContent />;
      case 'patient':
        return <PatientHomeContent />;
      case 'normal':
        return <PatientHomeContent />; // משתמש רגיל יראה כמו מטופל
      default:
        return <GuestHomeContent />;
    }
  };

  return renderContent();
};

export default HomePage;
