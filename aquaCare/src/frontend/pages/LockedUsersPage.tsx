import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  Divider
} from '@mui/material';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface LockedUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isLocked?: boolean;
  lockUntil?: string | Date | null;
  failedLoginAttempts?: number;
  role?: string;
}

const LockedUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { t, tp, currentLanguage } = useTranslation();
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // פונקציה לעיצוב תאריכים
  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const locale = currentLanguage === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchLockedUsers = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // בדיקה שיש למשתמש poolId
      if (!user?.poolId) {
        setMessage(t('lockedUsers.noPoolId'));
        return;
      }
      
      const res = await api.get(`/api/users/locked?poolId=${user.poolId}`);
      setLockedUsers(res.data.users || []);
    } catch (e) {
      setMessage(t('lockedUsers.errorFetchingLockedUsers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  // React to language changes
  useEffect(() => {
    console.log("🔄 Language changed to:", currentLanguage);
  }, [currentLanguage]);

  const unlockExpired = async () => {
    try {
      setLoading(true);
      setMessage(null);
      await api.post(`/api/users/unlock-all`);
      await fetchLockedUsers();
      setMessage(t('lockedUsers.unlockExpiredSuccess'));
    } catch (e) {
      setMessage(t('lockedUsers.errorUnlockingExpired'));
    } finally {
      setLoading(false);
    }
  };

  const sendResetLink = async (email: string) => {
    try {
      setLoading(true);
      setMessage(null);
      await api.post(`/api/users/forgot-password`, { email });
      setMessage(tp('lockedUsers.resetEmailSent', { email }));
    } catch (e) {
      setMessage(t('lockedUsers.errorSendingResetEmail'));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{t('lockedUsers.noPermissionToView')}</Alert>
      </Container>
    );
  }

    // Mobile Card View
  const renderMobileView = () => (
    <Box>
      {lockedUsers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {t('lockedUsers.noLockedUsers')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {lockedUsers.map((u) => (
            <Card elevation={2} key={u._id}>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {u.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || t('lockedUsers.noName')}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('lockedUsers.lockedUntil')}:
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(u.lockUntil)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('lockedUsers.failedAttempts')}:
                    </Typography>
                    <Typography variant="body1">
                      {u.failedLoginAttempts ?? 0}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('lockedUsers.status')}:
                    </Typography>
                    <Chip 
                      label={u.isLocked ? t('lockedUsers.locked') : t('lockedUsers.unlocked')} 
                      color={u.isLocked ? 'error' : 'success'}
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => sendResetLink(u.email)}
                      fullWidth
                    >
                      {t('lockedUsers.sendResetLink')}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );

  // Desktop Table View
  const renderDesktopView = () => (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('lockedUsers.email')}</TableCell>
            <TableCell>{t('lockedUsers.name')}</TableCell>
            <TableCell>{t('lockedUsers.lockedUntil')}</TableCell>
            <TableCell>{t('lockedUsers.failedAttempts')}</TableCell>
            <TableCell>{t('lockedUsers.status')}</TableCell>
            <TableCell>{t('lockedUsers.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lockedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">{t('lockedUsers.noLockedUsers')}</TableCell>
            </TableRow>
          ) : (
            lockedUsers.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{[u.firstName, u.lastName].filter(Boolean).join(' ') || t('lockedUsers.noName')}</TableCell>
                <TableCell>{formatDate(u.lockUntil)}</TableCell>
                <TableCell>{u.failedLoginAttempts ?? 0}</TableCell>
                <TableCell>
                  <Chip label={u.isLocked ? t('lockedUsers.locked') : t('lockedUsers.unlocked')} color={u.isLocked ? 'error' : 'success'} />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => sendResetLink(u.email)}>{t('lockedUsers.sendResetLink')}</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('lockedUsers.lockedUsers')}
        </Typography>

        {/* Buttons - Responsive Layout */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 1 : 2}
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            onClick={fetchLockedUsers}
            fullWidth={isMobile}
          >
            {t('buttons.refresh')}
          </Button>
          <Button
            variant="contained"
            onClick={unlockExpired}
            color="secondary"
            fullWidth={isMobile}
          >
            {t('lockedUsers.unlockExpired')}
          </Button>
        </Stack>
      </Box>

      {/* Message Alert */}
      {message && (
        <Alert
          severity={message.includes('error') || message.includes('שגיאה') ? 'error' : 'success'}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        isMobile ? renderMobileView() : renderDesktopView()
      )}
    </Container>
  );
};

export default LockedUsersPage;