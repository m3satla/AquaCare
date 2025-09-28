import React, { useState } from "react";
import { TextField, Button, Alert, Box } from "@mui/material";
import { getUserByNickname, updateUserPassword } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

const ChangePasswordForm: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();
  const [nickname, setNickname] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearForm = () => {
    setNickname("");
    setTempPassword("");
    setNewPassword("");
    setMessage(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    setSuccess(false);

    try {
      console.log("🔍 Searching for user with nickname:", nickname);
      const user = await getUserByNickname(nickname);
      if (!user) {
        setMessage(t('errors.userNotFound'));
        setLoading(false);
        return;
      }

      console.log("✅ Found user:", { id: user._id || user.id, email: user.email });

      if (!user.tempPassword || user.tempPassword !== tempPassword) {
        setMessage(t('errors.invalidTempPassword'));
        setLoading(false);
        return;
      }

      console.log("🔐 Updating password for user:", user._id || user.id);
      await updateUserPassword(user._id || user.id, newPassword);
      
      // הצלחה - מנקה את הטופס ומציג הודעה
      setSuccess(true);
      setMessage(t('success.passwordChanged'));
      
      // מנקה את השדות אחרי 2 שניות
      setTimeout(() => {
        clearForm();
      }, 2000);
      
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      setMessage(t('errors.passwordUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, direction }}>
      {message && (
        <Alert 
          severity={success ? "success" : "error"} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      )}
      
      <TextField 
        label={t('auth.username')}
        fullWidth 
        margin="normal" 
        value={nickname} 
        onChange={(e) => setNickname(e.target.value)} 
        required 
        disabled={loading}
        dir={isRTL ? "rtl" : "ltr"}
      />
      <TextField 
        label={t('auth.tempPassword')}
        type="password"
        fullWidth 
        margin="normal" 
        value={tempPassword} 
        onChange={(e) => setTempPassword(e.target.value)} 
        required 
        disabled={loading}
        dir={isRTL ? "rtl" : "ltr"}
      />
      <TextField 
        label={t('auth.newPassword')}
        type="password" 
        fullWidth 
        margin="normal" 
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} 
        required 
        disabled={loading}
        dir={isRTL ? "rtl" : "ltr"}
        helperText={t('validation.passwordMinLength')}
      />
      <Button 
        variant="contained" 
        color="primary" 
        type="submit" 
        fullWidth 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? t('general.updating') : t('auth.changePassword')}
      </Button>
      
      {success && (
        <Button 
          variant="outlined" 
          color="secondary" 
          fullWidth 
          onClick={clearForm}
          sx={{ mt: 1 }}
        >
          {t('buttons.clearForm')}
        </Button>
      )}
    </Box>
  );
};

export default ChangePasswordForm;

