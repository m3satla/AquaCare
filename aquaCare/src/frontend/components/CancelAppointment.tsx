import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import { logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

const CancelAppointment: React.FC = () => {
  const { id } = useParams();
  const { t, direction } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cancel = async () => {
      try {
        const res = await axios.patch<string>(`http://localhost:5001/api/appointments/decline/${id}`);
        setMessage(res.data || t('success.appointmentCancelled'));

        // ✅ Log appointment cancellation
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
            await logActivity(
              currentUser._id,
              currentUser.email,
              t('appointments.cancelAppointment'),
              "delete",
              currentUser.poolId,
              t('appointments.appointmentCancelledLog', { appointmentId: id })
            );
            console.log("✅ Activity logged: Appointment cancelled");
          }
        } catch (logError) {
          console.error("❌ Error logging appointment cancellation:", logError);
        }
      } catch (err) {
        setMessage(t('errors.appointmentCancellationFailed'));
      } finally {
        setLoading(false);
      }
    };
    cancel();
  }, [id, t]);

  if (loading) return (
    <Box p={4} textAlign="center" sx={{ direction }}>
      <CircularProgress />
      <Typography mt={2}>{t('general.processing')}</Typography>
    </Box>
  );

  return (
    <Box p={4} textAlign="center" sx={{ direction }}>
      <Typography variant="h5">{message}</Typography>
    </Box>
  );
};

export default CancelAppointment;
