// src/components/FeedbackForm.tsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Rating, Alert } from "@mui/material";
import axios from "axios";
import { logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

interface FeedbackFormProps {
  appointmentId: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ appointmentId }) => {
  const { t, isRTL, direction } = useTranslation();
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (!rating) {
        setError(t('feedback.pleaseSelectRating'));
        return;
      }

      await axios.post("http://localhost:5001/api/feedback", {
        appointmentId,
        rating,
        comments,
      });

      // ✅ Log feedback submission
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
        if (currentUser._id && currentUser.email && currentUser.poolId) {
          await logActivity(
            currentUser._id,
            currentUser.email,
            t('feedback.submitFeedback'),
            "create",
            currentUser.poolId,
            t('feedback.feedbackLogMessage', { 
              appointmentId, 
              rating, 
              comments: comments ? ` - ${t('feedback.comments')}: ${comments}` : '' 
            })
          );
          console.log("✅ Activity logged: Feedback submitted");
        }
      } catch (logError) {
        console.error("❌ Error logging feedback submission:", logError);
      }

      setSuccess(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError(t('feedback.errorSendingFeedback'));
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" p={4} sx={{ direction }}>
      <Typography variant="h4" gutterBottom>{t('feedback.feedbackTitle')}</Typography>

      {success ? (
        <Alert severity="success">{t('feedback.thankYouForFeedback')}</Alert>
      ) : (
        <>
          <Typography gutterBottom>{t('feedback.rateExperience')}</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />

          <TextField
            label={t('feedback.additionalComments')}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
            {t('feedback.submitFeedback')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default FeedbackForm;
