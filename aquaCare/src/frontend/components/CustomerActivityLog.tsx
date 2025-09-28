import React, { useEffect, useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getActivityLogsByPool } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

interface LogEntry {
  _id: string;
  id: number;
  userId: string;
  userEmail: string;
  action: string;
  type: string;
  details?: string;
  poolId: number;
  timestamp: string;
}

const CustomerActivityLog: React.FC = () => {
  const { user } = useAuth();
  const { t, tp, isRTL, direction } = useTranslation();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  // Debug translations
  console.log("🔍 CustomerActivityLog - Current language:", t('navigation.home'));
  console.log("🔍 CustomerActivityLog - Test translation:", t('activityLog.activityLog'));
  console.log("🔍 CustomerActivityLog - isRTL:", isRTL());
  console.log("🔍 CustomerActivityLog - direction:", direction());
  console.log("🔍 CustomerActivityLog - general.all:", t('general.all'));

  const translateAction = (action: string): string => {
    // Normalize action string (remove extra spaces, lowercase for comparison)
    const normalizedAction = action.trim().toLowerCase();
    
    // Get current language from translation service
    const currentLanguage = isRTL() ? 'he' : 'en';
    
    console.log(`🔍 translateAction: "${action}" -> normalized: "${normalizedAction}" -> language: ${currentLanguage} (isRTL: ${isRTL()})`);
    
    const actionTranslations: Record<string, Record<string, string>> = {
      // Login related actions - normalize to single translation
      'login': { en: 'Login', he: 'התחברות למערכת' },
      'user logged in successfully': { en: 'Login', he: 'התחברות למערכת' },
      'user logged in succes': { en: 'Login', he: 'התחברות למערכת' },
      'connected successfully, remember me: no': { en: 'Login', he: 'התחברות למערכת' },
      'התחברות': { en: 'Login', he: 'התחברות למערכת' },
      'activitylog.login': { en: 'Login', he: 'התחברות למערכת' },
      'התחברות למערכת': { en: 'Login', he: 'התחברות למערכת' },
      
      // Logout related actions
      'logout': { en: 'Logout', he: 'התנתקות מהמערכת' },
      'user logged out': { en: 'Logout', he: 'התנתקות מהמערכת' },
      'התנתקות': { en: 'Logout', he: 'התנתקות מהמערכת' },
      'activitylog.logout': { en: 'Logout', he: 'התנתקות מהמערכת' },
      'התנתקות מהמערכת': { en: 'Logout', he: 'התנתקות מהמערכת' },
      
      // Pool related actions
      'arrival at pool': { en: 'Arrival at pool', he: 'הגעה לבריכה' },
      'הגעה לבריכה': { en: 'Arrival at pool', he: 'הגעה לבריכה' },
      'arrival at pool': { en: 'Arrival at pool', he: 'הגעה לבריכה' },
      
      'exit from pool': { en: 'Exit from pool', he: 'יציאה מהבריכה' },
      'יציאה מהבריכה': { en: 'Exit from pool', he: 'יציאה מהבריכה' },
      'exit from pool': { en: 'Exit from pool', he: 'יציאה מהבריכה' },
      
      // Presence related actions
      'mark presence': { en: 'Mark presence', he: 'סימון נוכחות' },
      'סימון נוכחות': { en: 'Mark presence', he: 'סימון נוכחות' },
      'mark presence': { en: 'Mark presence', he: 'סימון נוכחות' },
      
      'cancel presence': { en: 'Cancel presence', he: 'ביטול נוכחות' },
      'ביטול נוכחות': { en: 'Cancel presence', he: 'ביטול נוכחות' },
      'cancel presence': { en: 'Cancel presence', he: 'ביטול נוכחות' },
      
      // Profile related actions
      'view personal profile': { en: 'View personal profile', he: 'צפיה בפרופיל אישי' },
      'צפיה בפרופיל אישי': { en: 'View personal profile', he: 'צפיה בפרופיל אישי' },
      'view personal profile': { en: 'View personal profile', he: 'צפיה בפרופיל אישי' },
      
      'view user details': { en: 'View user details', he: 'צפיה בפרטי משתמש' },
      'צפיה בפרטי משתמש': { en: 'View user details', he: 'צפיה בפרטי משתמש' },
      'view user details': { en: 'View user details', he: 'צפיה בפרטי משתמש' },
      
      // Booking related actions
      'booking created': { en: 'Booking created', he: 'קביעת תור' },
      'קביעת תור': { en: 'Booking created', he: 'קביעת תור' },
      'booking created': { en: 'Booking created', he: 'קביעת תור' },
      
      // System actions
      'smart optimization performed': { en: 'Smart optimization performed', he: 'בוצעה אופטימיזציה חכמה' },
      'בוצעה אופטימיזציה חכמה': { en: 'Smart optimization performed', he: 'בוצעה אופטימיזציה חכמה' },
      'smart optimization performed': { en: 'Smart optimization performed', he: 'בוצעה אופטימיזציה חכמה' },
      
      // Light actions
      'light turned on': { en: 'Light turned on', he: 'האור נדלק' },
      'האור נדלק': { en: 'Light turned on', he: 'האור נדלק' },
      'light turned on': { en: 'Light turned on', he: 'האור נדלק' },
      
      'light turned off': { en: 'Light turned off', he: 'האור כבה' },
      'האור כבה': { en: 'Light turned off', he: 'האור כבה' },
      'light turned off': { en: 'Light turned off', he: 'האור כבה' },
      
      // Reminder actions
      'reminders sent': { en: 'Reminders sent', he: 'תזכורות נשלחו במייל' },
      'תזכורות נשלחו במייל': { en: 'Reminders sent', he: 'תזכורות נשלחו במייל' },
      'reminders sent': { en: 'Reminders sent', he: 'תזכורות נשלחו במייל' }
    };
    
    // Try to find translation for normalized action
    const translation = actionTranslations[normalizedAction];
    if (translation) {
      const result = translation[currentLanguage] || translation['en'];
      console.log(`🔍 translateAction result: "${action}" -> "${result}"`);
      return result;
    }
    
    // If no translation found, return original action
    console.log(`🔍 translateAction no translation found for: "${action}"`);
    return action;
  };

  useEffect(() => {
    if (user?.poolId) {
      fetchActivityLogs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchActivityLogs = async () => {
    if (!user?.poolId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Fetching activity logs for poolId:", user.poolId, typeof user.poolId);
      const data = await getActivityLogsByPool(Number(user.poolId));
      
      if (data.success) {
        setLogs(data.logs || []);
             } else {
         setError(data.error || t('activityLog.historyLoadError') || 'Error loading activity history');
       }
         } catch (err) {
       console.error("❌ Error loading activity logs:", err);
       setError(t('activityLog.historyLoadError') || 'Error loading activity history');
     } finally {
      setLoading(false);
    }
  };

  // Get unique actions and users for filter dropdowns
  const uniqueActions = useMemo(() => {
    console.log("🔍 uniqueActions - Processing logs:", logs.length);
    
    // Get all actions and translate them
    const translatedActions = logs.map(log => {
      const translated = translateAction(log.action);
      console.log(`🔍 uniqueActions - "${log.action}" -> "${translated}"`);
      return translated;
    });
    
    // Remove duplicates and sort
    const uniqueTranslatedActions = [...new Set(translatedActions)];
    console.log("🔍 uniqueActions - Unique actions:", uniqueTranslatedActions);
    
    // Sort actions in a logical order
    const actionOrder = [
      'התחברות למערכת',
      'התנתקות מהמערכת', 
      'הגעה לבריכה',
      'יציאה מהבריכה',
      'סימון נוכחות',
      'ביטול נוכחות',
      'צפיה בפרופיל אישי',
      'צפיה בפרטי משתמש',
      'קביעת תור',
      'בוצעה אופטימיזציה חכמה',
      'האור נדלק',
      'האור כבה',
      'תזכורות נשלחו במייל'
    ];
    
    // Sort based on predefined order, then alphabetically for any remaining items
    const sortedActions = uniqueTranslatedActions.sort((a, b) => {
      const aIndex = actionOrder.indexOf(a);
      const bIndex = actionOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });
    
    console.log("🔍 uniqueActions - Final sorted actions:", sortedActions);
    return sortedActions;
  }, [logs]);

  const uniqueUsers = useMemo(() => {
    const users = [...new Set(logs.map(log => log.userEmail))];
    return users.sort();
  }, [logs]);

  // Debug unique actions after they're calculated
  console.log("🔍 CustomerActivityLog - Raw actions from logs:", logs.map(log => log.action));
  console.log("🔍 CustomerActivityLog - Unique actions after translation:", uniqueActions);

  // Filter logs based on search and filter criteria
  const filteredLogs = useMemo(() => {
    console.log("🔍 filteredLogs - Filtering with:", { searchTerm, selectedAction, selectedUser });
    
    const filtered = logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAction = selectedAction === 'all' || translateAction(log.action) === selectedAction;
      const matchesUser = selectedUser === 'all' || log.userEmail === selectedUser;
      
      console.log(`🔍 filteredLogs - Log "${log.action}" -> translated: "${translateAction(log.action)}" -> matchesAction: ${matchesAction} (selected: "${selectedAction}")`);
      
      return matchesSearch && matchesAction && matchesUser;
    });
    
    console.log("🔍 filteredLogs - Final filtered count:", filtered.length);
    return filtered;
  }, [logs, searchTerm, selectedAction, selectedUser]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAction('all');
    setSelectedUser('all');
  };

  const getActionColor = (type?: string): "primary" | "secondary" | "success" | "warning" | "error" | "default" => {
    switch (type) {
      case 'login': return 'primary';
      case 'logout': return 'secondary';
      case 'booking': return 'success';
      case 'cancellation': return 'warning';
      case 'request': return 'info';
      case 'payment': return 'success';
      case 'emergency': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      if (isRTL) {
        return date.toLocaleString('he-IL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, direction: direction() }}>
                   <Typography variant="h4" gutterBottom>
        {t('activityLog.activityLog') || 'Activity Log'} 📊
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('activityLog.activityDescription') || 'View activity history of all users in your pool'}
      </Typography>

      {/* Search and Filter Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
                               <Typography variant="h6" gutterBottom>
            🔍 {t('general.search') || 'Search'} & {t('general.filter') || 'Filter'}
            <br />
            <small>Debug: search="{t('general.search')}" filter="{t('general.filter')}"</small>
          </Typography>
          
          <Grid container spacing={2}>
            {/* Search by text */}
            <Grid item xs={12} md={6}>
                            <TextField
                fullWidth
                label={t('activityLog.searchPlaceholder') || 'Search by user, action or details...'}
                placeholder={`Debug: ${t('activityLog.searchPlaceholder')}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm('')}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Filter by action */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                                                                   <InputLabel>
                  {t('activityLog.filterByAction') || 'Filter by Action'}
                  <small> (Debug: {t('activityLog.filterByAction')})</small>
                </InputLabel>
                <Select
                  value={selectedAction}
                  label={t('activityLog.filterByAction') || 'Filter by Action'}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="all">{t('general.all') || 'All'}</MenuItem>
                  {uniqueActions.map((action) => (
                     <MenuItem key={action} value={action}>
                       {action}
                     </MenuItem>
                   ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filter by user */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                                                                   <InputLabel>
                  {t('activityLog.filterByUser') || 'Filter by User'}
                  <small> (Debug: {t('activityLog.filterByUser')})</small>
                </InputLabel>
                <Select
                  value={selectedUser}
                  label={t('activityLog.filterByUser') || 'Filter by User'}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  inputProps={{ dir: isRTL ? 'rtl' : 'ltr' }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="all">{t('general.all') || 'All'}</MenuItem>
                  {uniqueUsers.map((userEmail) => (
                    <MenuItem key={userEmail} value={userEmail}>
                      {userEmail}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Clear filters button */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<Clear />}
                >
                                     {t('activityLog.clearFilters') || 'Clear Filters'}
                  <small> (Debug: {t('activityLog.clearFilters')})</small>
                </Button>
                
                                                 <Typography variant="body2" color="text.secondary">
                  {searchTerm || selectedAction !== 'all' || selectedUser !== 'all' 
                    ? tp('activityLog.filteredActivities', { count: filteredLogs.length }) || `Found ${filteredLogs.length} activities`
                    : tp('activityLog.totalActivities', { count: logs.length }) || `Total ${logs.length} activities`
                  }
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {filteredLogs.length === 0 ? (
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                     <Typography variant="h6" color="text.secondary">
              {searchTerm || selectedAction !== 'all' || selectedUser !== 'all'
                ? t('activityLog.noResultsFound') || 'No results found'
                : t('activityLog.noActivitiesToShow') || 'No activities to show'
              } 📭
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedAction !== 'all' || selectedUser !== 'all'
                ? t('activityLog.tryDifferentSearch') || 'Try a different search or change filters'
                : t('activityLog.allActivitiesProcessed') || 'All activities processed successfully'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={3}>
          <CardContent>
            <List>
              {filteredLogs.map((log, index) => (
                <React.Fragment key={log._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                     <Chip 
                             label={translateAction(log.action)} 
                             color={getActionColor(log.type)}
                             size="small"
                           />
                          <Typography variant="body2" color="text.secondary">
                            • {log.userEmail}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {formatDate(log.timestamp)}
                          </Typography>
                                                     {log.details && (
                             <Typography component="span" variant="body2" sx={{ display: 'block', mt: 1, color: 'text.primary' }}>
                               {translateAction(log.details)}
                             </Typography>
                           )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < filteredLogs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CustomerActivityLog;
