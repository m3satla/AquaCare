import React, { useEffect, useState } from "react";
import { Container, Button, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getAppointments, deleteAppointment, getPools } from "../services/api";
import { Appointment } from "../services/models/Appointment";
import BookingForm from "../components/BookingForm";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "../hooks/useTranslation";

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const { t, tp } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workSchedule, setWorkSchedule] = useState<any>(null);

  // 🔍 Debug logging
  console.log("📱 BookingPage loaded, user:", user);
  console.log("📅 Current month:", currentMonth);
  console.log("🔗 IsDialogOpen:", isDialogOpen);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchWorkSchedule();
    }
  }, [user]);

  // רענון לוח העבודה כשהדף מקבל פוקוס
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchWorkSchedule();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchAppointments = async () => {
    try {
      console.log("🔍 Fetching appointments for user:", user);
      const data = await getAppointments();
      console.log("✅ Received appointments:", data);
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    }
  };

  const fetchWorkSchedule = async () => {
    try {
      if (!user?.poolId) return;

      console.log("🔍 Fetching work schedule for poolId:", user.poolId);
      const response = await fetch(`http://localhost:5001/api/work-schedule/${user.poolId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("✅ Work schedule loaded:", data.schedule);
          setWorkSchedule(data.schedule);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching work schedule:", error);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    if (!user) {
      alert(t('booking.mustLoginToBook'));
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert(t('booking.cannotBookPastDates'));
      return;
    }
    
    // בדיקה אם זה יום חופש
    if (workSchedule?.dayOff) {
      const dayMapping: { [key: string]: number } = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
      };
      const dayOffNumber = dayMapping[workSchedule.dayOff];
      if (dayOffNumber !== undefined && date.getDay() === dayOffNumber) {
        alert(t('booking.cannotBookDayOff'));
        return;
      }
    }
    
    // בדיקה אם זה תאריך מיוחד סגור
    const dateString = date.toISOString().split('T')[0];
    const specialDate = workSchedule?.specialDates?.find((sd: any) => sd.date === dateString);
    if (specialDate && specialDate.isClosed) {
      alert(tp('booking.cannotBookSpecialDate', { reason: specialDate.reason }));
      return;
    }
    
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleCancelAppointment = async (id: number) => {
    if (!user) {
      alert(t('booking.mustLoginToBook'));
      return;
    }

    if (!window.confirm(t('booking.confirmCancelAppointment'))) return;

    try {
      await deleteAppointment(id);
      alert(t('booking.appointmentCancelledSuccess'));
      fetchAppointments();
    } catch (error) {
      console.error("❌ Cancel error:", error);
      alert(t('booking.errorCancellingAppointment'));
    }
  };

  console.log("🎯 Rendering BookingPage, user exists:", !!user);

  if (!user) {
    console.log("❌ No user found, redirecting to login");
    return (
      <Container>
        <Typography variant="h5" align="center" color="error" sx={{ mt: 5 }}>
          ❌ {t("You must login to view appointments and book appointments!")}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      {user ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            {t(`months.${currentMonth.toLocaleString("en-US", { month: "long" }).toLowerCase()}`)} {currentMonth.getFullYear()}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button variant="contained" onClick={goToPreviousMonth}>{t('booking.previousMonth')}</Button>
            <Button variant="contained" onClick={goToNextMonth}>{t('booking.nextMonth')}</Button>
          </Box>

          <Typography variant="h5" align="center" mt={4} gutterBottom>{t('booking.myAppointments')}</Typography>
          
          {/* הסבר צבעים */}
          <Box display="flex" justifyContent="center" gap={2} mb={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={20} height={20} bgcolor="green" borderRadius={1}></Box>
              <Typography variant="body2">{t('booking.available')}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={20} height={20} bgcolor="orange" borderRadius={1}></Box>
              <Typography variant="body2">{t('booking.hasAppointment')}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={20} height={20} bgcolor="red" borderRadius={1}></Box>
              <Typography variant="body2">{t('booking.pastDate')}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={20} height={20} bgcolor="gray" borderRadius={1}></Box>
              <Typography variant="body2">{t('booking.dayOff')}</Typography>
            </Box>
          </Box>
          {appointments.length > 0 ? (
            <List>
              {appointments
                .filter((app) => String(app.clientId) === String(user?.id))
                .map((app) => {
                  const status = app.isCanceled ? 'Canceled' : app.isNoShow ? 'No Show' : app.isConfirmed ? 'Confirmed' : 'Pending';
                  return (
                    <ListItem key={app.id || app._id}>
                      <ListItemText
                        primary={`📅 ${new Date(app.date).toLocaleString()}`}
                        secondary={`🟢 ${t("Status")}: ${t(status === 'Canceled' ? 'Canceled' : status === 'No Show' ? 'No Show' : status === 'Confirmed' ? 'Confirmed' : 'Pending')}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="error" onClick={() => handleCancelAppointment(app.id || 0)}>
                          <MdDelete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          ) : (
            <Typography align="center" color="textSecondary">
              {t("You have no scheduled appointments.")}
            </Typography>
          )}

          {/* לוח שנה */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} textAlign="center" mb={4}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <Box key={index} fontWeight="bold">{t(`days.${day.toLowerCase()}`)}</Box>
                ))}
            {Array.from({ length: 42 }).map((_, index) => {
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1);
              
              // בדיקה אם זה יום חופש לפי לוח העבודה
              let isDayOff = false;
              if (workSchedule?.dayOff) {
                const dayMapping: { [key: string]: number } = {
                  Sunday: 0,
                  Monday: 1,
                  Tuesday: 2,
                  Wednesday: 3,
                  Thursday: 4,
                  Friday: 5,
                  Saturday: 6,
                };
                const dayOffNumber = dayMapping[workSchedule.dayOff];
                isDayOff = dayOffNumber !== undefined && date.getDay() === dayOffNumber;
              }
              
              // בדיקה אם זה תאריך מיוחד סגור
              const dateString = date.toISOString().split('T')[0];
              const specialDate = workSchedule?.specialDates?.find((sd: any) => sd.date === dateString);
              if (specialDate && specialDate.isClosed) {
                isDayOff = true;
              }
              
              // בדיקה אם התאריך עבר
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const selectedDate = new Date(date);
              selectedDate.setHours(0, 0, 0, 0);
              const isPastDate = selectedDate < today;

              // בדיקה אם יש תור בתאריך זה
              const hasAppointment = appointments.some(app => {
                const appointmentDate = new Date(app.date);
                return appointmentDate.getDate() === date.getDate() && 
                       appointmentDate.getMonth() === date.getMonth() && 
                       appointmentDate.getFullYear() === date.getFullYear();
              });

              return date.getMonth() === currentMonth.getMonth() ? (
                <Box
                  key={index}
                  p={1}
                  border={1}
                  borderRadius={2}
                  sx={{
                    backgroundColor: isPastDate ? "red" : isDayOff ? "gray" : hasAppointment ? "orange" : "green",
                    color: "white",
                    height: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: (isDayOff || isPastDate) ? "default" : "pointer",
                    opacity: isPastDate ? 0.6 : 1,
                    position: "relative",
                  }}
                  onClick={() => !isDayOff && !isPastDate && handleDateClick(date)}
                >
                  <span>{date.getDate()}</span>
                  {hasAppointment && (
                    <span style={{ fontSize: "12px", marginTop: "2px" }}>
                      📅
                    </span>
                  )}
                </Box>
              ) : <Box key={index} />;
            })}
          </Box>

          {/* חלון קביעת תור */}
          <BookingForm 
            selectedDate={selectedDate} 
            open={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)} 
            onBookingSuccess={fetchAppointments} 
          />
        </>
      ) : (
        <Container>
          <Typography variant="h5" align="center" color="error" sx={{ mt: 5 }}>
            ❌ {t('booking.mustLoginToView')}
          </Typography>
        </Container>
      )}
    </Container>
  );
};

export default BookingPage;
