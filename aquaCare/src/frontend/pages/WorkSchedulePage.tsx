import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

interface WorkSchedule {
  poolId: string;
  dayOff: string;
  workHours: {
    start: string;
    end: string;
  };
  specialDates: Array<{
    date: string;
    reason: string;
    isClosed: boolean;
  }>;
  timeSlots: Array<{
    time: string;
    isActive: boolean;
  }>;
}

const WorkSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { t, tp } = useTranslation();
  const [schedule, setSchedule] = useState<WorkSchedule>({
    poolId: '',
    dayOff: 'Friday',
    workHours: { start: '08:00', end: '18:00' },
    specialDates: [],
    timeSlots: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [newSpecialDate, setNewSpecialDate] = useState({ date: '', reason: '', isClosed: true });
  const [showAddDateDialog, setShowAddDateDialog] = useState(false);

  useEffect(() => {
    if (user?.poolId) {
      fetchSchedule();
    }
  }, [user]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching schedule for user:', user);
      console.log('🔍 User poolId:', user?.poolId, 'Type:', typeof user?.poolId);
      
      const response = await axios.get(`http://localhost:5001/api/work-schedule/${user?.poolId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setSchedule(response.data.schedule);
      }
    } catch (error: any) {
      console.error('❌ Error fetching schedule:', error);
      if (error.response) {
        console.error('❌ Error response:', error.response.data);
        console.error('❌ Error status:', error.response.status);
      }
      setMessage({ type: 'error', text: t('workSchedule.errorLoadingSchedule') });
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    if (!user?.poolId) {
      setMessage({ type: 'error', text: t('workSchedule.noPoolId') });
      return;
    }
    
    try {
      setLoading(true);
      console.log('💾 Saving schedule for user:', user);
      console.log('💾 User poolId:', user?.poolId, 'Type:', typeof user?.poolId);
      console.log('💾 Schedule data:', schedule);
      
      // בדיקה שה-axios מוגדר עם credentials
      console.log('🔍 Axios config:', axios.defaults);
      
      const response = await axios.post(`http://localhost:5001/api/work-schedule/${user?.poolId}`, schedule, {
        withCredentials: true
      });
             if (response.data.success) {
         setMessage({ type: 'success', text: t('workSchedule.scheduleSavedSuccess') });
         
         // עדכון אוטומטי של זמנים זמינים
         setTimeout(() => {
           updateAvailableSlots();
         }, 1000);
       }
    } catch (error: any) {
      console.error('❌ Error saving schedule:', error);
      if (error.response) {
        console.error('❌ Error response:', error.response.data);
        console.error('❌ Error status:', error.response.status);
      }
      setMessage({ type: 'error', text: t('workSchedule.errorSavingSchedule') });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: Array<{ time: string; isActive: boolean }> = [];
    const start = new Date(`2000-01-01T${schedule.workHours.start}`);
    const end = new Date(`2000-01-01T${schedule.workHours.end}`);
    
    while (start < end) {
      slots.push({
        time: start.toTimeString().slice(0, 5),
        isActive: true
      });
      start.setMinutes(start.getMinutes() + 60); // כל שעה
    }
    
    setSchedule(prev => ({ ...prev, timeSlots: slots }));
  };

  const updateAvailableSlots = async () => {
    if (!user?.poolId) {
      setMessage({ type: 'error', text: t('workSchedule.noPoolId') });
      return;
    }
    
    try {
      setLoading(true);
      
      // עדכון זמנים זמינים לחודש הקרוב
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      
      const response = await axios.post(`http://localhost:5001/api/work-schedule/${user?.poolId}/update-slots`, {
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0]
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: tp('workSchedule.slotsUpdatedSuccess', { 
            created: response.data.createdCount, 
            deleted: response.data.deletedCount 
          })
        });
      }
    } catch (error: any) {
      console.error('❌ Error updating available slots:', error);
      if (error.response) {
        console.error('❌ Error response:', error.response.data);
      }
      setMessage({ type: 'error', text: t('workSchedule.errorUpdatingSlots') });
    } finally {
      setLoading(false);
    }
  };

  const addSpecialDate = () => {
    if (!newSpecialDate.date || !newSpecialDate.reason) {
      setMessage({ type: 'error', text: t('workSchedule.fillAllFields') });
      return;
    }

    setSchedule(prev => ({
      ...prev,
      specialDates: [...prev.specialDates, { ...newSpecialDate }]
    }));
    
    setNewSpecialDate({ date: '', reason: '', isClosed: true });
    setShowAddDateDialog(false);
  };

  const removeSpecialDate = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      specialDates: prev.specialDates.filter((_, i) => i !== index)
    }));
  };

  const toggleTimeSlot = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, isActive: !slot.isActive } : slot
      )
    }));
  };

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {t('workSchedule.adminOnly')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <ScheduleIcon color="primary" />
        {t('workSchedule.title')}
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* הגדרות בסיסיות */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('workSchedule.basicSettings')}
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('workSchedule.weeklyDayOff')}</InputLabel>
              <Select
                value={schedule.dayOff}
                onChange={(e) => setSchedule(prev => ({ ...prev, dayOff: e.target.value }))}
              >
                <MenuItem value="Sunday">{t('workSchedule.days.sunday')}</MenuItem>
                <MenuItem value="Monday">{t('workSchedule.days.monday')}</MenuItem>
                <MenuItem value="Tuesday">{t('workSchedule.days.tuesday')}</MenuItem>
                <MenuItem value="Wednesday">{t('workSchedule.days.wednesday')}</MenuItem>
                <MenuItem value="Thursday">{t('workSchedule.days.thursday')}</MenuItem>
                <MenuItem value="Friday">{t('workSchedule.days.friday')}</MenuItem>
                <MenuItem value="Saturday">{t('workSchedule.days.saturday')}</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('workSchedule.startTime')}
                type="time"
                value={schedule.workHours.start}
                onChange={(e) => setSchedule(prev => ({ 
                  ...prev, 
                  workHours: { ...prev.workHours, start: e.target.value }
                }))}
                fullWidth
              />
              <TextField
                label={t('workSchedule.endTime')}
                type="time"
                value={schedule.workHours.end}
                onChange={(e) => setSchedule(prev => ({ 
                  ...prev, 
                  workHours: { ...prev.workHours, end: e.target.value }
                }))}
                fullWidth
              />
            </Box>

                         <Button
               variant="contained"
               onClick={generateTimeSlots}
               startIcon={<ScheduleIcon />}
               fullWidth
               sx={{ mb: 2 }}
             >
               {t('workSchedule.generateTimeSlots')}
             </Button>
             
             <Button
               variant="outlined"
               color="secondary"
               onClick={updateAvailableSlots}
               disabled={loading}
               fullWidth
             >
               {t('workSchedule.updateAvailableSlots')}
             </Button>
          </CardContent>
        </Card>

        {/* זמני תור */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('workSchedule.timeSlots')}
            </Typography>
            
            {schedule.timeSlots.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {schedule.timeSlots.map((slot, index) => (
                  <Chip
                    key={index}
                    label={slot.time}
                    color={slot.isActive ? 'primary' : 'default'}
                    onClick={() => toggleTimeSlot(index)}
                    variant={slot.isActive ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                {t('workSchedule.clickToGenerateSlots')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* תאריכים מיוחדים */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t('workSchedule.specialDates')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddDateDialog(true)}
            >
              {t('workSchedule.addSpecialDate')}
            </Button>
          </Box>

          {schedule.specialDates.length > 0 ? (
            <List>
              {schedule.specialDates.map((specialDate, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={new Date(specialDate.date).toLocaleDateString('he-IL')}
                    secondary={specialDate.reason}
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label={specialDate.isClosed ? t('workSchedule.isClosed') : t('workSchedule.isOpen')} 
                      color={specialDate.isClosed ? 'error' : 'success'}
                      size="small"
                    />
                    <IconButton 
                      edge="end" 
                      onClick={() => removeSpecialDate(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary" align="center">
              {t('workSchedule.noSpecialDates')}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* כפתור שמירה */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={saveSchedule}
          disabled={loading}
          startIcon={<SaveIcon />}
        >
          {t('workSchedule.saveSchedule')}
        </Button>
      </Box>

      {/* דיאלוג הוספת תאריך מיוחד */}
      <Dialog open={showAddDateDialog} onClose={() => setShowAddDateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('workSchedule.addSpecialDate')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('workSchedule.date')}
            type="date"
            value={newSpecialDate.date}
            onChange={(e) => setNewSpecialDate(prev => ({ ...prev, date: e.target.value }))}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label={t('workSchedule.reason')}
            value={newSpecialDate.reason}
            onChange={(e) => setNewSpecialDate(prev => ({ ...prev, reason: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newSpecialDate.isClosed}
                onChange={(e) => setNewSpecialDate(prev => ({ ...prev, isClosed: e.target.checked }))}
              />
            }
            label={t('workSchedule.poolClosedOnThisDate')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDateDialog(false)}>{t('workSchedule.cancel')}</Button>
          <Button onClick={addSpecialDate} variant="contained">{t('workSchedule.add')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkSchedulePage;
