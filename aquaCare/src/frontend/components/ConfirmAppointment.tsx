import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";

const ConfirmAppointment: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirm = async () => {
      try {
        // מצהירים ש-res.data הוא מסוג string (מונע שגיאת טיפוס)
        const res = await axios.patch<string>(`http://localhost:5001/api/appointments/confirm/${id}`);
        setMessage(res.data || "✅ ההגעה אושרה בהצלחה.");
      } catch (err) {
        setMessage("❌ שגיאה באישור ההגעה.");
      } finally {
        setLoading(false);
      }
    };
    confirm();
  }, [id]);

  if (loading) return (
    <Box p={4} textAlign="center">
      <CircularProgress />
      <Typography mt={2}>מעבד בקשה...</Typography>
    </Box>
  );

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h5">{message}</Typography>
    </Box>
  );
};

export default ConfirmAppointment;
