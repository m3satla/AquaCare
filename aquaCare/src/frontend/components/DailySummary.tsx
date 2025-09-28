import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Stack,
  Button
} from '@mui/material';
import {
  TrendingUp,
  People,
  LocalHospital,
  Warning,
  Sensors,
  AttachMoney,
  CalendarToday,
  CheckCircle,
  Error,
  Info,
  Refresh
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';
import { getCurrentLanguage } from '../services/translation';
import axios from 'axios';

interface SummaryData {
  date: string;
  totalCustomers: number;
  totalTreatments: number;
  reportedIssues: number;
  sensorStatus: string;
  dailyRevenue: number;
}

const DailySummary = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<Partial<SummaryData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // שליפת poolId מהמשתמש המחובר
        const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
        if (!stored) {
          setError(t('summary.noUserData'));
          return;
        }
        
        const user = JSON.parse(stored);
        if (!user?.poolId) {
          setError(t('summary.noPoolId'));
          return;
        }
        
        const response = await axios.get<{ success: boolean; summary: Partial<SummaryData> }>(`http://localhost:5001/api/summary/today?poolId=${user.poolId}`);
        
        if (response.data.success) {
          setSummary(response.data.summary || {});
        } else {
          setError(t('summary.errorLoading'));
        }
      } catch (err) {
        console.error(t('summary.errorLoadingDailySummary'), err);
        setError(t('summary.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []); // הסרתי את t מהתלות כדי שלא יטען כל שנייה

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // שליפת poolId מהמשתמש המחובר
      const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      if (!stored) {
        setError(t('summary.noUserData'));
        return;
      }
      
      const user = JSON.parse(stored);
      if (!user?.poolId) {
        setError(t('summary.noPoolId'));
        return;
      }
      
      // רענון הנתונים מהמסד נתונים
      const response = await axios.get<{ success: boolean; summary: Partial<SummaryData> }>(`http://localhost:5001/api/summary/today?poolId=${user.poolId}`);
      
      if (response.data.success) {
        setSummary(response.data.summary || {});
      }
      
      console.log("✅ Summary data refreshed");
    } catch (err) {
      console.error("❌ Error refreshing data:", err);
      setError(t('summary.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // שליפת poolId מהמשתמש המחובר
      const stored = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      if (!stored) {
        setError(t('summary.noUserData'));
        return;
      }
      
      const user = JSON.parse(stored);
      if (!user?.poolId) {
        setError(t('summary.noPoolId'));
        return;
      }
      
      // יצירת סיכום חדש
      const createResponse = await axios.post(`http://localhost:5001/api/summary/create-manual`, {
        poolId: user.poolId
      });
      
      if (createResponse.data.success) {
        // רענון הנתונים
        const response = await axios.get<{ success: boolean; summary: Partial<SummaryData> }>(`http://localhost:5001/api/summary/today?poolId=${user.poolId}`);
        
        if (response.data.success) {
          setSummary(response.data.summary || {});
        }
        
        console.log("✅ New summary created and loaded");
        setSuccessMessage(t('summary.newSummaryCreatedSuccess'));
        setError(null);
      }
    } catch (err) {
      console.error("❌ Error creating summary:", err);
      setError(t('summary.errorLoading'));
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'תקין':
        return 'success';
      case 'warning':
      case 'אזהרה':
        return 'warning';
      case 'error':
      case 'שגיאה':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSensorStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'תקין':
        return <CheckCircle />;
      case 'warning':
      case 'אזהרה':
        return <Warning />;
      case 'error':
      case 'שגיאה':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const translateSensorStatus = (status: string) => {
    const currentLanguage = getCurrentLanguage();
    switch (status?.toLowerCase()) {
      case 'operational':
      case 'תקין':
        return currentLanguage === 'he' ? 'תקין' : 'Operational';
      case 'warning':
      case 'אזהרה':
        return currentLanguage === 'he' ? 'אזהרה' : 'Warning';
      case 'error':
      case 'שגיאה':
        return currentLanguage === 'he' ? 'שגיאה' : 'Error';
      default:
        return currentLanguage === 'he' ? 'לא ידוע' : 'Unknown';
    }
  };

  const formatDate = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    const currentLanguage = getCurrentLanguage();
    const locale = currentLanguage === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatCurrency = (amount: number) => {
    const currentLanguage = getCurrentLanguage();
    const locale = currentLanguage === 'he' ? 'he-IL' : 'en-US';
    const currency = currentLanguage === 'he' ? 'ILS' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (successMessage) {
    return (
      <Alert severity="success" sx={{ m: 2 }}>
        {successMessage}
      </Alert>
    );
  }

  if (!summary || Object.keys(summary).length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('summary.noDataAvailable')}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateSummary}
          disabled={loading}
          startIcon={<TrendingUp />}
        >
          {t('summary.createNewSummary')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          {t('summary.title')}
        </Typography>
        
                 <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<Refresh />}
          >
            {t('buttons.refresh')}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSummary}
            disabled={loading}
            startIcon={<TrendingUp />}
          >
            {t('summary.createNewSummary')}
          </Button>
        </Box>
      </Box>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarToday color="primary" />
            <Typography variant="h6" color="primary">
              {formatDate(summary.date)}
            </Typography>
          </Box>
          <Alert severity="success" sx={{ mt: 2 }}>
            📊 {t('summary.realDataFromSystem')} - {t('summary.customerCount')}: {summary.totalCustomers}, {t('summary.appointments')}: {summary.totalTreatments}, {t('summary.revenue')}: {formatCurrency(summary.dailyRevenue || 0)}
          </Alert>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {/* Total Customers */}
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <People color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="primary" gutterBottom>
              {summary.totalCustomers ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('summary.totalCustomers')}
            </Typography>
          </CardContent>
        </Card>

        {/* Total Treatments */}
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <LocalHospital color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="primary" gutterBottom>
              {summary.totalTreatments ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('summary.totalTreatments')}
            </Typography>
          </CardContent>
        </Card>

        {/* Reported Issues */}
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="warning.main" gutterBottom>
              {summary.reportedIssues ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('summary.reportedIssues')}
            </Typography>
          </CardContent>
        </Card>

        {/* Daily Revenue */}
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <AttachMoney color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
              {formatCurrency(summary.dailyRevenue ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('summary.dailyRevenue')}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Sensor Status */}
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sensors color="primary" />
            {t('summary.sensorStatus')}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={getSensorStatusIcon(summary.sensorStatus ?? '')}
              label={translateSensorStatus(summary.sensorStatus ?? '')}
              color={getSensorStatusColor(summary.sensorStatus ?? '')}
              size="medium"
              variant="outlined"
            />
            
            <Typography variant="body2" color="text.secondary">
              {t('summary.sensorStatusDescription')}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('summary.dailyStats')}
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('summary.avgCustomersPerTreatment')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {summary.totalCustomers && summary.totalTreatments 
                    ? (summary.totalCustomers / summary.totalTreatments).toFixed(1)
                    : '0'
                  }
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('summary.avgRevenuePerCustomer')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {summary.totalCustomers && summary.dailyRevenue
                    ? formatCurrency(summary.dailyRevenue / summary.totalCustomers)
                    : formatCurrency(0)
                  }
                </Typography>
              </Box>
            </Stack>
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('summary.issueRate')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {summary.totalCustomers && summary.reportedIssues
                    ? `${((summary.reportedIssues / summary.totalCustomers) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('summary.treatmentEfficiency')}:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {summary.totalCustomers && summary.totalTreatments
                    ? `${((summary.totalTreatments / summary.totalCustomers) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DailySummary;
