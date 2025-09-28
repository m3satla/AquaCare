import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Button, TextField, Select, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Switch, FormControlLabel,
  Typography, Box, Divider, Alert, Snackbar
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { getUserById, updateUserPassword } from '../services/api';
import { UserSettings } from '../services/models/UserSettings';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsComponentProps {
  userId: string;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  handleSave: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({
  userId,
  settings,
  setSettings,
  handleSave
}) => {
  const { t, isRTL, direction } = useTranslation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const clearPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordMessage(null);
  };

  const handlePasswordChange = async () => {
    // בדיקות תקינות
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage(t('validation.fillAllFields'));
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage(t('validation.passwordMinLength'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage(t('validation.passwordsMismatch'));
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      // כאן צריך להוסיף בדיקה של הסיסמה הנוכחית
      // כרגע נעדכן ישירות את הסיסמה החדשה
      await updateUserPassword(userId, passwordData.newPassword);
      
      setPasswordMessage(t('success.passwordChanged'));
      setShowSnackbar(true);
      
      // מנקה את הטופס וסוגר את הדיאלוג
      setTimeout(() => {
        clearPasswordForm();
        setIsPasswordDialogOpen(false);
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error changing password:', error);
      setPasswordMessage(t('errors.passwordUpdateFailed'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordDialog = () => {
    if (!passwordLoading) {
      clearPasswordForm();
      setIsPasswordDialogOpen(false);
    }
  };

  return (
    <Box sx={{ direction }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{t('settings.personalSettings')}</Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              {t('settings.changePassword')}
            </Button>
          </Box>

          {/* User Settings Section */}
          <Box id="user-settings-section" sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{t('settings.userSettings')}</Typography>
            
            {/* Language Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('settings.language')}</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => setSettings((prev: any) => ({ ...prev, language: e.target.value }))}
              >
                <MenuItem value="he">{t('settings.hebrew')}</MenuItem>
                <MenuItem value="en">{t('settings.english')}</MenuItem>
              </Select>
            </FormControl>

            {/* Notification Settings */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications ?? true}
                  onChange={(e) => setSettings((prev: any) => ({ ...prev, notifications: e.target.checked }))}
                />
              }
              label={t('settings.notifications')}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            {t('settings.saveSettings')}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('settings.changePassword')}</DialogTitle>
        <DialogContent>
          {passwordMessage && (
            <Alert 
              severity={passwordMessage.includes('❌') ? 'error' : 'success'} 
              sx={{ mb: 2 }}
              onClose={() => setPasswordMessage(null)}
            >
              {passwordMessage}
            </Alert>
          )}
          
          <TextField
            label={t('settings.currentPassword')}
            type="password"
            fullWidth
            margin="dense"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            disabled={passwordLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <TextField
            label={t('settings.newPassword')}
            type="password"
            fullWidth
            margin="dense"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            disabled={passwordLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
            helperText={t('validation.passwordMinLength')}
          />
          <TextField
            label={t('settings.confirmNewPassword')}
            type="password"
            fullWidth
            margin="dense"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            disabled={passwordLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} disabled={passwordLoading}>
            {t('buttons.cancel')}
          </Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained" 
            disabled={passwordLoading}
          >
            {passwordLoading ? t('general.updating') : t('settings.changePassword')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={t('success.passwordChanged')}
      />
    </Box>
  );
};

export default SettingsComponent;
