import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, isRTL, direction } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    if (!email.trim()) {
      setMessage(t('validation.fillAllFields'));
      return;
    }

    // בדיקת פורמט מייל בסיסי
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage(t('validation.invalidEmail'));
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      
      setIsSuccess(true);
      setMessage(t('auth.resetEmailSent'));
      
      // איפוס השדה
      setEmail("");
      
    } catch (error: any) {
      console.error("❌ Error requesting password reset:", error);
      setMessage(error.response?.data?.message || t('auth.resetEmailError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ direction }}>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {t('auth.forgotPassword')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth.enterEmailForReset')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {message && (
            <Alert 
              severity={isSuccess ? 'success' : 'error'} 
              sx={{ mb: 2 }}
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          )}
          
          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            dir="rtl"
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('buttons.send')
            )}
          </Button>
          
          <Button
            variant="text"
            onClick={() => navigate("/profile/login")}
            fullWidth
          >
            {t('auth.backToLogin')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm;
