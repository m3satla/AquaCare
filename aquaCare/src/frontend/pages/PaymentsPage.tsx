import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  AccountBalance, 
  History, 
  Payment as PaymentIcon
} from '@mui/icons-material';
import PaymentsComponent from '../components/PaymentsComponent';
import { getPayments, getPaymentsByPool } from '../services/api';
import { Payment } from '../services/models/Payment';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';



const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [tabValue, setTabValue] = useState(0);

  // פונקציה למיסוך מספרי כרטיס אשראי
  const maskCardNumber = (method: string): string => {
    // חיפוש מספר כרטיס אשראי (16 ספרות)
    const cardNumberRegex = /(\d{16})/g;
    return method.replace(cardNumberRegex, (match) => {
      const lastFour = match.slice(-4);
      return `•••• •••• •••• ${lastFour}`;
    });
  };

  const fetchPayments = async () => {
    try {
      if (!user?._id) {
        console.log('⚠️ No user logged in');
        return;
      }
      
      if (user?.role?.toLowerCase() === 'admin' && user?.poolId) {
        // מנהל - שליפת תשלומים של כל הבריכה
        const poolData = await getPaymentsByPool(user.poolId) as any;
        setPaymentHistory(poolData.payments || []);
        console.log(`📊 Loaded ${poolData.totalPayments || 0} payments for pool ${user.poolId}`);
        console.log(`💰 Total amount: ₪${poolData.totalAmount || 0}`);
      } else {
        // משתמש רגיל - רק התשלומים שלו
        const data = await getPayments();
        const userPayments = data.filter((payment: Payment) => payment.userId === user._id);
        setPaymentHistory(userPayments);
        console.log(`📋 Loaded ${userPayments.length} payments for user ${user._id}`);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);



  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // מנהלים רואים רק היסטוריית תשלומים של הבריכה
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {t('paymentSystemTitle')}
      </Typography>



      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          {!isAdmin && <Tab icon={<PaymentIcon />} label={t('newPayment')} />}
          <Tab icon={<History />} label={isAdmin ? (t('poolPayments')) : (t('paymentHistory'))} />
        </Tabs>
      </Paper>

      {/* תשלום חדש - רק למשתמשים רגילים */}
      {tabValue === 0 && !isAdmin && (
        <Box>
          <PaymentsComponent 
            setPaymentHistory={setPaymentHistory} 
          />
        </Box>
      )}

      {/* היסטוריית תשלומים */}
      {((!isAdmin && tabValue === 1) || (isAdmin && tabValue === 0)) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {isAdmin 
              ? `${t('poolPayments')} (${paymentHistory.length})`
              : `${t('myPayments')} (${paymentHistory.length})`
            }
          </Typography>

          {/* הודעה מיוחדת למנהלים */}
          {isAdmin && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>{t('adminView')}:</strong> {t('showingAllPayments')}
              </Typography>
            </Alert>
          )}
          
          {paymentHistory.length === 0 ? (
            <Alert severity="info">{t('noPaymentsToShow')}</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('date')}</TableCell>
                    <TableCell>{t('amount')}</TableCell>
                    <TableCell>{t('paymentMethod')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString(t('dateLocale'), {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccountBalance sx={{ mr: 1, fontSize: 16 }} />
                          ₪{payment.amount}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={maskCardNumber(payment.method)} 
                          color="primary" 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status === "שולם" ? (t('paid')) : (t('pending'))} 
                          color={payment.status === "שולם" ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}


    </Container>
  );
};

export default PaymentsPage;
