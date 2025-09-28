import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTranslation } from "../hooks/useTranslation";
import { getStatistics, getStatisticsByPool } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getCurrentLanguage } from "../services/translation";

import html2pdf from "html2pdf.js";

interface StatisticsData {
  userCount: number;
  appointmentCount: number;
  totalPayments: number;
  activeUsers: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  poolUsers: number; // משתמשים לבריכה
  connectedUsers: number; // משתמשים מחוברים
  monthlyBreakdown?: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
  selectedMonth: string | null;
}

const StatisticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // רק אם המשתמש מחובר ומנהל
    if (user && user.role === 'Admin') {
      fetchData();
    }
  }, [selectedMonth, user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("📊 Fetching statistics for pool:", user?.poolId);

      // שליפת נתונים מהשרת
      const response = await getStatistics(selectedMonth || undefined);
      
      if (response.success) {
        setStatistics(response.statistics);
        console.log("✅ Statistics loaded:", response.statistics);
      } else {
        setError(response.error || t('statistics.errorLoadingData'));
      }
      
    } catch (err: any) {
      console.error("❌ Error fetching statistics:", err);
      
      // טיפול בשגיאות ספציפיות
      if (err.response?.status === 401) {
        setError(t('statistics.loginRequired'));
      } else if (err.response?.status === 403) {
        setError(t('statistics.adminOnly'));
      } else if (err.response?.status === 404) {
        setError(t('statistics.pathNotFound'));
      } else {
        setError(err.response?.data?.error || t('statistics.errorLoadingData'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById("statistics-report");
    if (element) {
      html2pdf().from(element).save("statistics_report.pdf");
    }
  };

  const handleSendToEmail = () => {
    setSnackbar({
      open: true,
      message: `📧 ${t('statistics.fileSentSuccessfully')}`,
      severity: "success",
    });
  };

  const formatCurrency = (amount: number) => {
    const currentLanguage = getCurrentLanguage();
    const locale = currentLanguage === 'he' ? 'he-IL' : 'en-US';
    const currency = currentLanguage === 'he' ? 'ILS' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const monthIndex = parseInt(month) - 1;
    
    // Use the current language from the translation service
    const currentLanguage = getCurrentLanguage();
    const locale = currentLanguage === 'he' ? 'he-IL' : 'en-US';
    
    const date = new Date(parseInt(year), monthIndex);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  };

  // בדיקה שהמשתמש מחובר ומנהל
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('statistics.loginRequired')}
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/login'}>
          {t('buttons.login')}
        </Button>
      </Box>
    );
  }

  if (user.role !== 'Admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('statistics.adminOnly')}
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/'}>
          {t('navigation.home')}
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData} sx={{ mr: 2 }}>
          🔄 {t('statistics.tryAgain')}
        </Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          🔄 {t('statistics.refreshPage')}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('statistics.currentlyShowingRealData')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        {t('statistics.dashboardTitle')} - {t('statistics.poolStatistics')} ({t('requests.pool')}: {user?.poolId || t('summary.unknown')})
      </Typography>

      <Box mb={3} textAlign="center">
        <TextField
          label={t('statistics.monthFilter')}
          variant="outlined"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          sx={{ mr: 2, width: 200 }}
          placeholder="2024-01"
        />
        <Button variant="contained" onClick={handlePrint} sx={{ mr: 1 }}>
          🖨️ {t('statistics.print')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportPDF}
          sx={{ mr: 1 }}
        >
          📄 {t('statistics.exportPDF')}
        </Button>
        <Button variant="outlined" color="primary" onClick={handleSendToEmail}>
          📬 {t('statistics.sendToEmail')}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : statistics ? (
        <Box
          id="statistics-report"
          display="flex"
          flexDirection="column"
          gap={4}
        >
          {/* Main Statistics Cards */}
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            <Paper elevation={4} sx={{ p: 3, textAlign: "center", minWidth: 250, flex: "1 1 250px" }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {t('statistics.registeredUsers')}
              </Typography>
            <Typography variant="h4" color="primary">
                {statistics.userCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.activeUsers')}: {statistics.activeUsers}
            </Typography>
          </Paper>

            <Paper elevation={4} sx={{ p: 3, textAlign: "center", minWidth: 250, flex: "1 1 250px" }}>
              <Typography variant="h6" color="secondary" gutterBottom>
                {t('statistics.totalAppointments')}
              </Typography>
            <Typography variant="h4" color="secondary">
                {statistics.appointmentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.completed')}: {statistics.completedAppointments}
            </Typography>
          </Paper>

            <Paper elevation={4} sx={{ p: 3, textAlign: "center", minWidth: 250, flex: "1 1 250px" }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                {t('statistics.totalPayments')}
              </Typography>
            <Typography variant="h4" color="success.main">
                {formatCurrency(statistics.totalPayments)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.pendingAppointments')}: {statistics.pendingAppointments}
              </Typography>
            </Paper>

            <Paper elevation={4} sx={{ p: 3, textAlign: "center", minWidth: 250, flex: "1 1 250px" }}>
              <Typography variant="h6" color="warning.main" gutterBottom>
                {t('statistics.cancelledAppointments')}
              </Typography>
              <Typography variant="h4" color="warning.main">
                {statistics.cancelledAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.cancellationRate')}: {statistics.appointmentCount > 0 
                  ? ((statistics.cancelledAppointments / statistics.appointmentCount) * 100).toFixed(1)
                  : 0}%
              </Typography>
            </Paper>

            <Paper elevation={4} sx={{ p: 3, textAlign: "center", minWidth: 250, flex: "1 1 250px" }}>
              <Typography variant="h6" color="info.main" gutterBottom>
                {t('statistics.poolRegisteredUsers')}
              </Typography>
              <Typography variant="h4" color="info.main">
                {statistics.poolUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.currentlyConnected')}: {statistics.connectedUsers}
              </Typography>
            </Paper>
          </Box>

          {/* Monthly Breakdown */}
          {statistics.monthlyBreakdown && (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 {t('statistics.monthlyBreakdown')}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
                  {statistics.monthlyBreakdown.map((monthData, index) => (
                    <Paper elevation={2} sx={{ p: 2, textAlign: "center", minWidth: 200, flex: "1 1 200px" }} key={index}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {formatMonth(monthData.month)}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {t('statistics.appointments')}: {monthData.appointments}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {t('statistics.revenue')}: {formatCurrency(monthData.revenue)}
            </Typography>
          </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 {t('statistics.summary')}
              </Typography>
              <Typography variant="body1">
                {selectedMonth 
                  ? `${t('statistics.monthlyStatistics')} ${formatMonth(selectedMonth)}`
                  : t('statistics.generalStatistics')
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('statistics.lastLoaded')}: {new Date().toLocaleString(getCurrentLanguage() === 'he' ? 'he-IL' : 'en-US')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary">
            {t('statistics.noDataFound')}
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StatisticsDashboard;
