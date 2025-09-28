import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { User } from '../services/models/User';
import { updateUser } from '../services/api/users';
import { useTranslation } from '../hooks/useTranslation';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, open, onClose, onUserUpdated }) => {
  const { t } = useTranslation();
  
  const roleValues = [
    { value: 'Admin', label: t('userManagement.manager') },
    { value: 'normal', label: t('userManagement.regularUser') },
    { value: 'therapist', label: t('userManagement.therapist') },
    { value: 'patient', label: t('userManagement.patient') }
  ];
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    role: 'normal',
    gender: 'male',
    dateOfBirth: '',
    poolId: '',
    therapyPool: '',
    language: 'he',
    accessibility: false,
    highContrast: false,
    textSize: 'medium'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // עדכון הנתונים כאשר המשתמש משתנה
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        role: user.role || 'normal',
        gender: user.gender || 'male',
        dateOfBirth: user.dateOfBirth || '',
        poolId: user.poolId || '',
        therapyPool: user.therapyPool || '',
        language: user.language || 'he',
        accessibility: user.accessibility || false,
        highContrast: user.highContrast || false,
        textSize: user.textSize || 'medium'
      });
    }
  }, [user]);

  const handleChange = (field: keyof User, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    // בדיקת תקינות הנתונים
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.dateOfBirth || !formData.gender) {
      setError(t('All required fields must be filled'));
      return;
    }

    // בדיקת פורמט אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('Invalid email format'));
      return;
    }

    // בדיקת שם משתמש (לא ריק ולא מכיל רווחים)
    if (formData.username.trim().length === 0 || formData.username.includes(' ')) {
      setError(t('שם משתמש לא יכול להיות ריק או להכיל רווחים'));
      return;
    }

    // בדיקת תאריך לידה (לא יכול להיות בעתיד)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      setError(t('תאריך לידה לא יכול להיות בעתיד'));
      return;
    }

    // בדיקת גיל מינימלי (לפחות 1 שנה)
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    if (ageInYears < 1) {
      setError(t('המשתמש חייב להיות לפחות בן שנה אחת'));
      return;
    }

    // בדיקת גיל מקסימלי (לא יותר מ-120 שנה)
    if (ageInYears > 120) {
      setError(t('המשתמש לא יכול להיות בן יותר מ-120 שנה'));
      return;
    }

    // בדיקת טלפון (אם מלא, חייב להיות תקין)
    if (formData.phone && formData.phone.trim() !== '') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError(t('פורמט טלפון לא תקין'));
        return;
      }
    }

    // בדיקת מזהה בריכה (אם מלא, חייב להיות מספר)
    if (formData.poolId && formData.poolId.trim() !== '') {
      if (!/^\d+$/.test(formData.poolId)) {
        setError(t('מזהה בריכה חייב להיות מספר'));
        return;
      }
    }

    // בדיקת שמות (יכולים להכיל אותיות בעברית או באנגלית)
    const nameRegex = /^[א-תa-zA-Z\s]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      setError(t('שם פרטי ושם משפחה יכולים להכיל רק אותיות בעברית או באנגלית'));
      return;
    }

    // בדיקת אורך שמות (לפחות 2 תווים, לא יותר מ-50)
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      setError(t('שם פרטי חייב להיות בין 2 ל-50 תווים'));
      return;
    }
    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      setError(t('שם משפחה חייב להיות בין 2 ל-50 תווים'));
      return;
    }

    // בדיקת אורך שם משתמש (לפחות 3 תווים, לא יותר מ-30)
    if (formData.username.length < 3 || formData.username.length > 30) {
      setError(t('שם משתמש חייב להיות בין 3 ל-30 תווים'));
      return;
    }

    // בדיקת אורך אימייל (לא יותר מ-100 תווים)
    if (formData.email.length > 100) {
      setError(t('אימייל לא יכול להיות ארוך מ-100 תווים'));
      return;
    }

    // בדיקת אורך טלפון (לא יותר מ-20 תווים)
    if (formData.phone && formData.phone.length > 20) {
      setError(t('מספר טלפון לא יכול להיות ארוך מ-20 תווים'));
      return;
    }

    // בדיקת אורך מזהה בריכה (לא יותר מ-10 ספרות)
    if (formData.poolId && formData.poolId.length > 10) {
      setError(t('מזהה בריכה לא יכול להיות ארוך מ-10 ספרות'));
      return;
    }

    // בדיקת אורך בריכת טיפול (לא יותר מ-50 תווים)
    if (formData.therapyPool && formData.therapyPool.length > 50) {
      setError(t('בריכת טיפול לא יכולה להיות ארוכה מ-50 תווים'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = user._id || user.id;
      if (!userId) {
        throw new Error(t('Cannot identify user'));
      }

      // הסרת שדות שלא צריכים להתעדכן
      const { password, tempPassword, ...updateData } = formData;

      await updateUser(userId, updateData);

      setSuccess(t('✅ User updated successfully!'));
      setShowSnackbar(true);
      
      // קריאה לפונקציה לעדכון הרשימה
      onUserUpdated();
      
      // סגירת המודל אחרי 2 שניות
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      console.error('❌ Error updating user:', err);
      setError(err.response?.data?.error || (t('Error updating user')));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('Edit User:')} {user.firstName} {user.lastName}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success">
                {success}
              </Alert>
            )}

            <Typography variant="h6" gutterBottom>
              {t('Personal Details')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('First Name')}
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              />
              <TextField
                label={t('Last Name')}
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              />
              <TextField
                label={t('Username')}
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Phone')}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label={t('Date of Birth')}
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Gender')}
                select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="male">{t('Male')}</MenuItem>
                <MenuItem value="female">{t('Female')}</MenuItem>
              </TextField>
              <TextField
                label={t('Role')}
                select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                required
                sx={{ minWidth: 200 }}
              >
                {roleValues.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('Pool Details')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Pool ID')}
                value={formData.poolId}
                onChange={(e) => handleChange('poolId', e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label={t('Therapy Pool')}
                value={formData.therapyPool}
                onChange={(e) => handleChange('therapyPool', e.target.value)}
                sx={{ minWidth: 200 }}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {t('Accessibility Settings')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Language')}
                select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="he">{t('Hebrew')}</MenuItem>
                <MenuItem value="en">{t('English')}</MenuItem>
              </TextField>
              <TextField
                label={t('Text Size')}
                select
                value={formData.textSize}
                onChange={(e) => handleChange('textSize', e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="small">{t('Small')}</MenuItem>
                <MenuItem value="medium">{t('Medium')}</MenuItem>
                <MenuItem value="large">{t('Large')}</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('Accessibility')}
                select
                value={formData.accessibility ? 'true' : 'false'}
                onChange={(e) => handleChange('accessibility', e.target.value === 'true')}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="true">{t('Active')}</MenuItem>
                <MenuItem value="false">{t('Inactive')}</MenuItem>
              </TextField>
              <TextField
                label={t('High Contrast')}
                select
                value={formData.highContrast ? 'true' : 'false'}
                onChange={(e) => handleChange('highContrast', e.target.value === 'true')}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="true">{t('Active')}</MenuItem>
                <MenuItem value="false">{t('Inactive')}</MenuItem>
              </TextField>
            </Box>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('Cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? (t('Updating...')) : (t('Update User'))}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUserModal;
