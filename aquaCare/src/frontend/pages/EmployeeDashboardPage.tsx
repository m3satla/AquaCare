import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";

import {
  People,
  Schedule,
  LocalHospital,
  TrendingUp,
  CheckCircle,
  Warning,
  AccessTime,
  Person,
  CalendarToday,
  Assignment
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";

interface Appointment {
  _id: string;
  clientId: string;
  date: string;
  time: string;
  type: string;
  status: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface TherapistStats {
  totalAppointments: number;
  completedToday: number;
  pendingToday: number;
  totalPatients: number;
  averageRating: number;
}

const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<TherapistStats>({
    totalAppointments: 0,
    completedToday: 0,
    pendingToday: 0,
    totalPatients: 0,
    averageRating: 4.5
  });

  useEffect(() => {
    fetchTherapistData();
  }, []);

  const fetchTherapistData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?._id) {
        setError(t('employee.noUserData'));
        return;
      }

      // שליפת תורים של המטפל
      const appointmentsResponse = await axios.get(`http://localhost:5001/api/appointments/employee/${user._id}`);
      const appointmentsData = appointmentsResponse.data.appointments || [];
      setAppointments(appointmentsData);

      // חישוב סטטיסטיקות
      const today = new Date().toDateString();
      const todayAppointments = appointmentsData.filter((apt: Appointment) => {
        const aptDate = new Date(apt.date).toDateString();
        return aptDate === today;
      });

      const completedToday = todayAppointments.filter((apt: Appointment) => apt.status === 'completed').length;
      const pendingToday = todayAppointments.filter((apt: Appointment) => apt.status === 'pending').length;

      // חישוב מספר מטופלים ייחודיים
      const uniquePatients = new Set(appointmentsData.map((apt: Appointment) => apt.clientId)).size;

      setStats({
        totalAppointments: appointmentsData.length,
        completedToday,
        pendingToday,
        totalPatients: uniquePatients,
        averageRating: 4.5 // נתון קבוע לדוגמה
      });

    } catch (err) {
      console.error('❌ Error fetching therapist data:', err);
      setError(t('employee.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <AccessTime />;
      case 'cancelled':
        return <Warning />;
      default:
        return <Assignment />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* כותרת ראשית */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary">
          {t('employee.therapistDashboard')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('employee.welcomeMessage')} {user?.firstName} {user?.lastName}
        </Typography>
      </Box>

      {/* סטטיסטיקות */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('employee.totalPatients')}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.totalAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('employee.totalAppointments')}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {stats.completedToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('employee.completedToday')}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TrendingUp color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {stats.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('employee.averageRating')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* תורים היום */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday color="primary" />
            {t('employee.todayAppointments')} ({stats.pendingToday})
          </Typography>
          
          {appointments.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              {t('employee.noAppointmentsToday')}
            </Typography>
          ) : (
            <List>
              {appointments.slice(0, 5).map((appointment, index) => (
                <React.Fragment key={appointment._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${appointment.user?.firstName || 'Unknown'} ${appointment.user?.lastName || 'User'}`}
                      secondary={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2">
                            {formatDate(appointment.date)} - {formatTime(appointment.time)}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(appointment.status)}
                            label={t(`appointments.status.${appointment.status}`)}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Stack>
                      }
                    />
                    <Chip
                      label={appointment.type}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* פעולות מהירות */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('employee.quickActions')}
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Schedule />}
                  fullWidth
                  onClick={() => window.location.href = '/appointments'}
                >
                  {t('employee.viewAllAppointments')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalHospital />}
                  fullWidth
                  onClick={() => window.location.href = '/therapist-schedule'}
                >
                  {t('employee.manageSchedule')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  fullWidth
                  onClick={() => window.location.href = '/internal-messages'}
                >
                  {t('employee.internalMessages')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('employee.todaySummary')}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('employee.appointmentsToday')}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.completedToday + stats.pendingToday}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('employee.completed')}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {stats.completedToday}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('employee.pending')}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {stats.pendingToday}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeDashboardPage;
