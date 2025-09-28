import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
  Chip
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";
import { logActivity } from "../services/api";
import { createAppointment } from "../services/api";

interface Slot {
  _id: string;
  date: string;
  time: string;
  employeeId: string;
  isBooked: boolean;
}

interface BookingFormProps {
  selectedDate: Date | null;
  open: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ open, onClose, selectedDate, onBookingSuccess }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState("הידרותרפיה");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/appointments/available-slots");
        console.log("📦 זמני טיפול שהתקבלו:", res.data.slots);
        setAvailableSlots(res.data.slots);
      } catch (err) {
        console.error("❌ שגיאה בשליפת שעות פנויות", err);
      }
    };

    if (open) {
      fetchSlots();
    }
  }, [open]);

  const handleBooking = async () => {
    if (!user || !selectedSlot) {
      alert(t('booking.selectTimeAndLogin'));
      return;
    }
    
    try {
      const appointmentData = {
        date: selectedDate?.toISOString().split('T')[0],
        time: selectedSlot.time,
        type: type,
        notes: notes,
        userId: user._id,
        poolId: user.poolId
      };

      console.log("📅 Booking appointment:", appointmentData);
      await createAppointment(appointmentData);

      alert(t('booking.appointmentBookedSuccess'));
      console.log("✅ Calling onBookingSuccess to refresh appointments");
      onBookingSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert(t('booking.errorBookingAppointment'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('booking.bookAppointment')}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          {t('booking.chooseTimeFromSlots')}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {availableSlots.map((slot) => (
            <Chip
              key={slot.time}
              label={slot.time}
              onClick={() => setSelectedSlot(slot)}
              color={selectedSlot?.time === slot.time ? 'primary' : 'default'}
              variant={selectedSlot?.time === slot.time ? 'filled' : 'outlined'}
            />
          ))}
        </Box>

        <TextField
          select
          label={t('booking.treatmentType')}
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="הידרותרפיה">{t('booking.hydrotherapy')}</MenuItem>
          <MenuItem value="פיזיותרפיה">{t('booking.physiotherapy')}</MenuItem>
          <MenuItem value="עיסוי טיפולי">{t('booking.therapeuticMassage')}</MenuItem>
          <MenuItem value="אחר">{t('booking.other')}</MenuItem>
        </TextField>

        <TextField
          label={t('booking.notesOptional')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">{t('booking.cancel')}</Button>
        <Button
          onClick={handleBooking}
          variant="contained"
          color="primary"
          disabled={!selectedSlot}
        >
          {t('booking.bookAppointmentButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;
