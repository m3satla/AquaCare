import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Card,
  CardContent,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getRequestsByPool, respondToRequest, logActivity } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

interface Request {
  _id: string;
  userId: string;
  type: string;
  message: string;
  date: string;
  managerId?: string;
  poolId: string;
  response?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ManagerRequestsViewer: React.FC = () => {
  const { user } = useAuth();
  const { t, currentLanguage, isRTL } = useTranslation();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [sendingResponse, setSendingResponse] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAnsweredRequests, setShowAnsweredRequests] = useState(false);

  // לוגים לבדיקת תרגומים
  console.log("🔍 Translation test - pendingRequests:", t('requests.pendingRequests'));
  console.log("🔍 Translation test - allRequests:", t('requests.allRequests'));
  console.log("🔍 Translation test - receivedRequests:", t('requests.receivedRequests'));
  console.log("🔍 Current language:", currentLanguage);
  console.log("🔍 Is RTL:", isRTL);
  
  // בדיקה נוספת של תרגומים
  console.log("🔍 Translation test - buttons.sendResponse:", t('buttons.sendResponse'));
  console.log("🔍 Translation test - general.sending:", t('general.sending'));
  console.log("🔍 Translation test - buttons.refreshList:", t('buttons.refreshList'));
  
  // בדיקה עם fallback
  console.log("🔍 Translation with fallback - pendingRequests:", t('requests.pendingRequests', 'FALLBACK_PENDING'));
  console.log("🔍 Translation with fallback - allRequests:", t('requests.allRequests', 'FALLBACK_ALL'));
  
  // בדיקה של המבנה
  console.log("🔍 Testing direct access - navigation.home:", t('navigation.home'));
  console.log("🔍 Testing direct access - buttons.submit:", t('buttons.submit'));

  useEffect(() => {
    fetchRequests();
  }, []);

  // React to language changes
  useEffect(() => {
    console.log("🔄 Language changed to:", currentLanguage);
  }, [currentLanguage]);

  // פילטר פניות - הצג רק פניות שלא נענו
  const filteredRequests = requests.filter(request => 
    showAnsweredRequests ? true : !request.response
  );

  const fetchRequests = async () => {
    console.log("🔍 Debug - User:", user);
    console.log("🔍 Debug - User poolId:", user?.poolId);
    
    if (!user?.poolId) {
      console.log("❌ No poolId found for user, using default poolId = 1");
      // Use default poolId for testing
      try {
        const data = await getRequestsByPool(1);
        
        if (data.success) {
          setRequests(data.requests || []);
        } else {
          setError(data.error || t('requests.errorFetchingRequests'));
        }
      } catch (err) {
        console.error("❌ Error fetching requests with default poolId:", err);
        setError(t('requests.serverConnectionError'));
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      console.log("🔍 Fetching requests for poolId:", user.poolId);
      const data = await getRequestsByPool(user.poolId);
      
      if (data.success) {
        console.log("✅ Successfully fetched requests:", data.requests);
        setRequests(data.requests || []);
      } else {
        console.error("❌ API returned error:", data.error);
        setError(data.error || t('requests.errorFetchingRequests'));
      }
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      setError(t('requests.serverConnectionError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (requestId: string, value: string) => {
    setResponses({ ...responses, [requestId]: value });
  };

  const handleSendResponse = async (request: Request) => {
    const response = responses[request._id];
    if (!response?.trim()) {
      setError(t('requests.noResponseToSend'));
      return;
    }

    setSendingResponse(request._id);
    setError(null);

    try {
      const data = await respondToRequest(request._id, response);

      if (data.success) {
        const userName = request.user ? `${request.user.firstName} ${request.user.lastName}` : t('requests.unknownUser');
        setSuccess(`${t('requests.responseSent')} ${t('requests.forUser')} ${userName}`);
        
        // Log the activity
        if (user) {
          await logActivity(
            user._id,
            user.email,
            t('activityLog.response'),
            'response',
             Number(user.poolId) || 1,
             `Responded to request from ${userName}: ${response.substring(0, 50)}...`
          );
        }
        
        // Update the request in the list
        setRequests(prev => prev.map(req => 
          req._id === request._id 
            ? { ...req, response } 
            : req
        ));
        // Clear the response input
        setResponses(prev => ({ ...prev, [request._id]: "" }));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || t('requests.errorSendingResponse'));
      }
    } catch (err) {
      console.error("❌ Error sending response:", err);
      setError(t('requests.serverConnectionError'));
    } finally {
      setSendingResponse(null);
    }
  };

  const translateType = (type: string): string => {
    switch (type) {
      case "complaint": return t('requests.complaint');
      case "positive_feedback": return t('requests.positiveFeedback');
      case "cancel_subscription": return t('requests.cancelSubscription');
      default: return t('requests.other');
    }
  };

  const getTypeColor = (type: string): "error" | "success" | "warning" | "default" => {
    switch (type) {
      case "complaint": return "error";
      case "positive_feedback": return "success";
      case "cancel_subscription": return "warning";
      default: return "default";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("he-IL", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = (request: Request): string => {
    if (request.user?.firstName && request.user?.lastName) {
      return `${request.user.firstName} ${request.user.lastName}`;
    } else if (request.user?.firstName) {
      return request.user.firstName;
    } else if (request.user?.email) {
      return request.user.email;
    } else {
      return t('requests.unknownUser');
    }
  };

  const getUserEmail = (request: Request): string => {
    return request.user?.email || t('requests.noEmail');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('requests.receivedRequests')} 🎯
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('requests.pool')} {user?.poolId || t('requests.notDefined')}
      </Typography>

      {/* כפתורי פילטר */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={!showAnsweredRequests ? "contained" : "outlined"}
          onClick={() => setShowAnsweredRequests(false)}
          color="primary"
        >
          {t('requests.pendingRequests')} ({requests.filter(r => !r.response).length})
        </Button>
        <Button
          variant={showAnsweredRequests ? "contained" : "outlined"}
          onClick={() => setShowAnsweredRequests(true)}
          color="secondary"
        >
          {t('requests.allRequests')} ({requests.length})
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {filteredRequests.length === 0 ? (
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {showAnsweredRequests 
                ? t('requests.noRequestsToDisplay') 
                : t('requests.noPendingRequests')
              } 📭
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {showAnsweredRequests 
                ? t('requests.allActivitiesProcessed')
                : t('requests.allRequestsAnswered')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredRequests.map((request) => (
            <Card key={request._id} elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {getUserDisplayName(request)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getUserEmail(request)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('requests.requestId')}{request._id}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDate(request.date)}
                    </Typography>
                    <Chip 
                      label={translateType(request.type)} 
                      color={getTypeColor(request.type)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                  {request.message}
                </Typography>

                {request.response && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {t('requests.managerResponse')}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {request.response}
                    </Typography>
                  </Box>
                )}

                {!request.response && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label={t('requests.responseToRequest')}
                      multiline
                      rows={3}
                      value={responses[request._id] || ''}
                      onChange={(e) => handleResponseChange(request._id, e.target.value)}
                      placeholder={t('requests.writeYourResponse')}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSendResponse(request)}
                      disabled={sendingResponse === request._id || !responses[request._id]?.trim()}
                      startIcon={sendingResponse === request._id ? <CircularProgress size={16} /> : null}
                    >
                      {sendingResponse === request._id ? t('general.sending') : t('buttons.sendResponse')}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={fetchRequests}
          disabled={loading}
        >
          {t('buttons.refreshList')}
        </Button>
      </Box>
    </Box>
  );
};

export default ManagerRequestsViewer;




