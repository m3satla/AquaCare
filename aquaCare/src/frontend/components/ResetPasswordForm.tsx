import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordByToken } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

const ResetPasswordForm: React.FC = () => {
  const { token: urlToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t, isRTL, direction } = useTranslation();
  
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // בדיקה אם יש token ב-URL parameters או ב-query string
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get('token') || '';
    const finalToken = urlToken || queryToken;
    setToken(finalToken);
  }, [urlToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSuccess(false);

    if (!token) {
      setMessage(t('errors.resetLinkNotAvailable'));
      return;
    }

    if (!password || !confirm) {
      setMessage(t('validation.fillAllFields'));
      return;
    }

    if (password.length < 8) {
      setMessage(t('validation.passwordMinLength'));
      return;
    }

    if (password !== confirm) {
      setMessage(t('validation.passwordsMismatch'));
      return;
    }

    try {
      setSubmitting(true);
      await resetPasswordByToken(token, password);
      
      setSuccess(true);
      setMessage(t('success.passwordReset'));
      
      setTimeout(() => {
        navigate("/profile/login");
      }, 3000);
      
    } catch (error: any) {
      console.error("❌ Error resetting password:", error);
      setMessage(
        error.response?.data?.message || t('errors.passwordResetFailed')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ direction }}>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {t('auth.resetPassword')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth.enterNewPassword')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {message && (
            <Alert 
              severity={success ? 'success' : 'error'} 
              sx={{ mb: 2 }}
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          )}
          
          {!token && (
            <Box sx={{ my: 2 }}>
              <Typography color="error">
                {t('errors.resetLinkNotAvailable')}
              </Typography>
            </Box>
          )}
          
          <TextField
            label={t('auth.newPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
            dir="rtl"
            helperText={t('validation.passwordMinLength')}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label={t('auth.confirmPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={submitting}
            dir="rtl"
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={submitting || !token}
            sx={{ mb: 2 }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('auth.resetPassword')
            )}
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate("/profile/login")}
          >
            {t('auth.backToLogin')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;


