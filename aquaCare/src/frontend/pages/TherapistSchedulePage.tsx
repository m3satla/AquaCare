import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface ScheduleRequest {
  _id: string;
  therapistId: string;
  poolId: string;
  adminId: string;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedHours: {
    day: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }[];
  approvedHours?: {
    day: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }[];
  requestMessage?: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  responseDate?: string;
}

const TherapistSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const [schedules, setSchedules] = useState<ScheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [newRequest, setNewRequest] = useState({
    requestedHours: [{ day: '', startTime: '', endTime: '', notes: '' }],
    requestMessage: ''
  });

  const daysOfWeek = [
    { value: 'monday', label: t('therapistSchedule.monday') },
    { value: 'tuesday', label: t('therapistSchedule.tuesday') },
    { value: 'wednesday', label: t('therapistSchedule.wednesday') },
    { value: 'thursday', label: t('therapistSchedule.thursday') },
    { value: 'friday', label: t('therapistSchedule.friday') },
    { value: 'saturday', label: t('therapistSchedule.saturday') },
    { value: 'sunday', label: t('therapistSchedule.sunday') }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/therapist-schedule/requests', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    try {
      const response = await fetch('/api/therapist-schedule/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setOpenDialog(false);
      setNewRequest({
        requestedHours: [{ day: '', startTime: '', endTime: '', notes: '' }],
        requestMessage: ''
      });
      fetchSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    }
  };

  const addTimeSlot = () => {
    setNewRequest(prev => ({
      ...prev,
      requestedHours: [...prev.requestedHours, { day: '', startTime: '', endTime: '', notes: '' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setNewRequest(prev => ({
      ...prev,
      requestedHours: prev.requestedHours.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    setNewRequest(prev => ({
      ...prev,
      requestedHours: prev.requestedHours.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon />;
      case 'rejected': return <CancelIcon />;
      case 'pending': return <PendingIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (selectedTab === 0) return schedule.status === 'pending';
    if (selectedTab === 1) return schedule.status === 'approved';
    if (selectedTab === 2) return schedule.status === 'rejected';
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('therapistSchedule.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          {t('therapistSchedule.createRequest')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
            <Tab label={t('therapistSchedule.pendingRequests')} />
            <Tab label={t('therapistSchedule.approvedRequests')} />
            <Tab label={t('therapistSchedule.rejectedRequests')} />
          </Tabs>

          {filteredSchedules.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                {t('therapistSchedule.noRequests')}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredSchedules.map((schedule, index) => (
                <React.Fragment key={schedule._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            icon={getStatusIcon(schedule.status)}
                            label={t(`therapistSchedule.${schedule.status}`)}
                            color={getStatusColor(schedule.status) as any}
                            size="small"
                          />
                          <Typography variant="subtitle2">
                            {new Date(schedule.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('therapistSchedule.requestedHours')}:</strong>
                          </Typography>
                          {schedule.requestedHours.map((hour, idx) => (
                            <Typography key={idx} variant="body2" color="textSecondary">
                              {t(`therapistSchedule.${hour.day}`)}: {hour.startTime} - {hour.endTime}
                              {hour.notes && ` (${hour.notes})`}
                            </Typography>
                          ))}
                          {schedule.requestMessage && (
                            <Typography variant="body2" color="textSecondary" mt={1}>
                              <strong>{t('therapistSchedule.requestMessage')}:</strong> {schedule.requestMessage}
                            </Typography>
                          )}
                          {schedule.responseMessage && (
                            <Typography variant="body2" color="textSecondary" mt={1}>
                              <strong>{t('therapistSchedule.responseMessage')}:</strong> {schedule.responseMessage}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredSchedules.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dialog for new request */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('therapistSchedule.createRequest')}</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            {newRequest.requestedHours.map((slot, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>{t('therapistSchedule.day')}</InputLabel>
                    <Select
                      value={slot.day}
                      onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                      label={t('therapistSchedule.day')}
                    >
                      {daysOfWeek.map(day => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>{t('therapistSchedule.startTime')}</InputLabel>
                    <Select
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      label={t('therapistSchedule.startTime')}
                    >
                      {timeSlots.map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>{t('therapistSchedule.endTime')}</InputLabel>
                    <Select
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      label={t('therapistSchedule.endTime')}
                    >
                      {timeSlots.map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label={t('therapistSchedule.notes')}
                    value={slot.notes}
                    onChange={(e) => updateTimeSlot(index, 'notes', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Tooltip title="Remove time slot">
                    <IconButton
                      onClick={() => removeTimeSlot(index)}
                      disabled={newRequest.requestedHours.length === 1}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addTimeSlot}
              sx={{ mb: 2 }}
            >
              {t('therapistSchedule.selectTimes')}
            </Button>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('therapistSchedule.requestMessage')}
              value={newRequest.requestMessage}
              onChange={(e) => setNewRequest(prev => ({ ...prev, requestMessage: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('buttons.cancel')}
          </Button>
          <Button onClick={handleSubmitRequest} variant="contained">
            {t('buttons.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistSchedulePage;

