import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Notifications,
  Send,
  Refresh,
  CalendarToday,
  AccessTime,
  Person,
  CheckCircle,
  Warning,
  Info,
  Email
} from "@mui/icons-material";
import { logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";
import { getCurrentLanguage } from "../services/translation";

interface Appointment {
  _id: string;
  clientId: string;
  date: string;
  time: string;
  type: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const ReminderSenderPage = () => {
  const { t, tp } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [lastSentCount, setLastSentCount] = useState<number>(0);

  useEffect(() => {
    // Check if user is logged in and has poolId
    const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!stored) {
      setError(t('reminders.noUserData'));
      return;
    }
    
    const user = JSON.parse(stored);
    if (!user?.poolId) {
      setError(t('reminders.noPoolId'));
      return;
    }
    
    fetchTomorrowAppointments();
  }, []);

  const fetchTomorrowAppointments = async () => {
    try {
      setLoading(true);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get poolId from logged in user
      const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      if (!stored) {
        setError(t('reminders.noUserData'));
        return;
      }
      
      const user = JSON.parse(stored);
      if (!user?.poolId) {
        setError(t('reminders.noPoolId'));
        return;
      }
      
      const response = await axios.get(`http://localhost:5001/api/appointments/all?poolId=${user.poolId}`);
      const allAppointments = response.data.appointments || [];
      
      const tomorrowAppointments = allAppointments.filter((appt: Appointment) => {
        const apptDate = new Date(appt.date);
        return apptDate.toDateString() === tomorrow.toDateString();
      });
      
      setAppointments(tomorrowAppointments);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError(t('reminders.errorLoadingAppointments'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.post("http://localhost:5001/api/reminders/send-tomorrow");
      
      if (response.data.success) {
        const count = response.data.count;
        setLastSentCount(count);
        setMessage(tp('reminders.sentSuccessfully', { count }));
        
        // ✅ Log reminder sending activity
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
            await logActivity(
              currentUser._id,
              currentUser.email,
              t('activityLog.remindersSent'),
              "create",
              currentUser.poolId,
              tp('reminders.sentSuccessfully', { count })
            );
            console.log("✅ Activity logged: Reminders sent");
          }
        } catch (logError) {
          console.error("❌ Error logging reminder sending:", logError);
        }
      } else {
        setError(t('reminders.errorSending'));
      }
    } catch (err) {
      console.error("❌ Error sending reminders:", err);
      setError(t('reminders.errorSending'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendTelegramReminder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

              // Send general reminder via telegram
      const locale = getCurrentLanguage() === 'he' ? 'he-IL' : 'en-US';
      const telegramMessage = `📅 ${t('reminders.telegramHeader')}\n\n` +
        `📊 ${t('reminders.appointments')}: ${appointments.length}\n` +
        `📅 ${t('reminders.date')}: ${new Date().toLocaleDateString(locale)}\n\n` +
        t('reminders.telegramFooter');

      await axios.post("http://localhost:5001/send-telegram", {
        message: telegramMessage
      });

      setMessage(t('reminders.telegramSentSuccess'));
      
      // ✅ Log telegram reminder activity
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
        if (currentUser._id && currentUser.email && currentUser.poolId) {
          await logActivity(
            currentUser._id,
            currentUser.email,
            t('activityLog.telegramReminderSent'),
            "create",
            currentUser.poolId,
            tp('reminders.telegramSentSuccess') + ` - ${appointments.length} ${t('reminders.appointments')}`
          );
          console.log("✅ Activity logged: Telegram reminder sent");
        }
      } catch (logError) {
        console.error("❌ Error logging telegram reminder:", logError);
      }
    } catch (err) {
      console.error("❌ Error sending telegram reminder:", err);
      setError(t('reminders.telegramError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailReminder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      // Send email reminders to all customers
      const response = await axios.post("http://localhost:5001/api/reminders/send-tomorrow");
      
      if (response.data.success) {
        const count = response.data.count;
        setMessage(tp('reminders.emailSentSuccess', { count }));
        
        // ✅ Log email reminder activity
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
                      await logActivity(
            currentUser._id,
            currentUser.email,
            t('activityLog.emailRemindersSent'),
            "create",
            currentUser.poolId,
            tp('reminders.emailSentSuccess', { count }) + ` - ${count} ${t('reminders.customers')}`
          );
            console.log("✅ Activity logged: Email reminders sent");
          }
        } catch (logError) {
          console.error("❌ Error logging email reminder:", logError);
        }
      } else {
        setError(t('reminders.emailError'));
      }
    } catch (err) {
      console.error("❌ Error sending email reminders:", err);
      setError(t('reminders.emailError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendBothReminders = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      // Send reminders via email and telegram
      const response = await axios.post("http://localhost:5001/api/reminders/send-tomorrow");
      
      if (response.data.success) {
        const count = response.data.count;
        
        // Send general reminder via telegram
        try {
          const locale2 = getCurrentLanguage() === 'he' ? 'he-IL' : 'en-US';
          const telegramMessage = `📅 ${t('reminders.telegramHeader')}\n\n` +
            `📊 ${t('reminders.appointments')}: ${appointments.length}\n` +
            `📧 ${tp('reminders.emailCount', { count })}\n` +
            `📅 ${t('reminders.date')}: ${new Date().toLocaleDateString(locale2)}\n\n` +
            t('reminders.telegramFooter');

          await axios.post("http://localhost:5001/send-telegram", {
            message: telegramMessage
          });
        } catch (telegramError) {
          console.warn("⚠️ Error sending telegram reminder:", telegramError);
        }

        setMessage(tp('reminders.bothSentSuccess', { count }));
        
        // ✅ Log both reminders activity
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
            await logActivity(
              currentUser._id,
              currentUser.email,
              t('activityLog.bothRemindersSent'),
              "create",
              currentUser.poolId,
              tp('reminders.bothSentSuccess', { count }) + ` - ${count} ${t('reminders.customers')}`
            );
            console.log("✅ Activity logged: Both reminders sent");
          }
        } catch (logError) {
          console.error("❌ Error logging both reminders:", logError);
        }
      } else {
        setError(t('reminders.genericError'));
      }
    } catch (err) {
      console.error("❌ Error sending both reminders:", err);
      setError(t('reminders.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const locale = getCurrentLanguage() === 'he' ? 'he-IL' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale);
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'therapy':
      case 'טיפול':
        return 'primary';
      case 'consultation':
      case 'ייעוץ':
        return 'secondary';
      case 'assessment':
      case 'הערכה':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Notifications color="primary" />
        {t('reminders.title')}
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Actions Panel */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Send color="primary" />
                {t('reminders.actions')}
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSendReminders}
                  disabled={loading || appointments.length === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  fullWidth
                >
                  {loading ? t('reminders.sending') : t('reminders.sendReminders')}
                </Button>
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleSendTelegramReminder}
                  disabled={loading || appointments.length === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Notifications />}
                  fullWidth
                >
                  {loading ? t('reminders.sending') : t('reminders.sendTelegram')}
                </Button>
                
                <Button
                  variant="contained"
                  color="info"
                  size="large"
                  onClick={handleSendEmailReminder}
                  disabled={loading || appointments.length === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Email />}
                  fullWidth
                >
                  {loading ? t('reminders.sending') : t('reminders.sendEmail')}
                </Button>
                
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleSendBothReminders}
                  disabled={loading || appointments.length === 0}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  fullWidth
                >
                  {loading ? t('reminders.sending') : t('reminders.sendBoth')}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={fetchTomorrowAppointments}
                  disabled={loading}
                  startIcon={<Refresh />}
                  fullWidth
                >
                  {t('reminders.refreshList')}
                </Button>
              </Stack>

              {lastSentCount > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {tp('reminders.lastSent', { count: lastSentCount })}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Appointments List */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday color="primary" />
                {tp('reminders.tomorrowAppointments', { count: appointments.length })}
              </Typography>

              {loading && !message ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : appointments.length === 0 ? (
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                  {t('reminders.noAppointmentsTomorrow')}
                </Alert>
              ) : (
                <List>
                  {appointments.map((appt, index) => (
                    <React.Fragment key={appt._id}>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                  label={appt.type}
                                  color={getAppointmentTypeColor(appt.type)}
                                  size="small"
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {appt.time}
                                </Typography>
                              </Box>
                              
                              <Typography variant="body1" gutterBottom>
                                {tp('reminders.appointmentType', { type: appt.type })}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarToday fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(appt.date)}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Person fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    {t('reminders.id')}: {appt.clientId}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Tooltip title={t('reminders.viewDetails')}>
                                  <IconButton size="small" color="primary">
                                    <Info />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      {index < appointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReminderSenderPage;