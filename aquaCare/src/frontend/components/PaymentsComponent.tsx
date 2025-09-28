import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Button, TextField, FormControl, InputLabel, 
  Select, MenuItem, CircularProgress, Alert, Box 
} from '@mui/material';
import { addPayment, logActivity } from '../services/api';
import { Payment } from '../services/models/Payment';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface PaymentsComponentProps {
  setPaymentHistory: React.Dispatch<React.SetStateAction<Payment[]>>;
}

// Enhanced credit card simulation scenarios
const mockCards = [
  // ✅ כרטיסים תקינים
  { id: 'visa_success', label: 'Visa •••• 4242 (✅ תקין - יתרה גבוהה)', status: 'valid', behavior: 'success', balance: 50000 },
  { id: 'mastercard_success', label: 'Mastercard •••• 5555 (✅ תקין - יתרה בינונית)', status: 'valid', behavior: 'success', balance: 15000 },
  { id: 'amex_success', label: 'American Express •••• 3782 (✅ תקין - ללא הגבלה)', status: 'valid', behavior: 'success', balance: 999999 },
  
  // ⚠️ כרטיסים עם בעיות
  { id: 'visa_low_balance', label: 'Visa •••• 4000 (⚠️ יתרה נמוכה)', status: 'valid', behavior: 'insufficient_funds', balance: 50 },
  { id: 'mastercard_blocked', label: 'Mastercard •••• 0000 (❌ חסום על ידי הבנק)', status: 'blocked', behavior: 'blocked', balance: 0 },
  { id: 'visa_expired', label: 'Visa •••• 4001 (⏰ פג תוקף)', status: 'expired', behavior: 'expired', balance: 10000 },
  
  // 🔧 כרטיסים לבדיקות מיוחדות
  { id: 'visa_random_fail', label: 'Visa •••• 4002 (🎲 כישלון אקראי 30%)', status: 'valid', behavior: 'random_fail', balance: 20000 },
  { id: 'mastercard_slow', label: 'Mastercard •••• 5556 (🐌 עיבוד איטי)', status: 'valid', behavior: 'slow_processing', balance: 25000 },
  { id: 'amex_network_error', label: 'Amex •••• 3783 (📡 תקלת רשת)', status: 'valid', behavior: 'network_error', balance: 30000 },
  { id: 'visa_fraud_alert', label: 'Visa •••• 4003 (🚨 חשד להונאה)', status: 'valid', behavior: 'fraud_alert', balance: 40000 },
  
  // 💎 כרטיסים פרימיום
  { id: 'visa_platinum', label: 'Visa Platinum •••• 4444 (💎 פלטינום - מהיר)', status: 'premium', behavior: 'premium_fast', balance: 100000 },
  { id: 'mastercard_gold', label: 'Mastercard Gold •••• 5678 (🥇 זהב - הטבות)', status: 'premium', behavior: 'premium_benefits', balance: 75000 },
];

const PaymentsComponent: React.FC<PaymentsComponentProps> = ({ setPaymentHistory }) => {
  const { user } = useAuth();
  const { currentLanguage } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('visa_success');
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [simulationDetails, setSimulationDetails] = useState<string>('');

  // פרטי אשראי
  const [newCreditCard, setNewCreditCard] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  // הסרנו פרטי הוראת קבע - רק כרטיס אשראי



  // סימולציה של התנהגות כרטיס אשראי
  const simulateCardBehavior = async (cardId: string, amount: number): Promise<{success: boolean, message: string, details: string}> => {
    const selectedCard = mockCards.find(card => card.id === cardId);
    if (!selectedCard) {
      return { success: false, message: currentLanguage === 'en' ? '❌ Card not found' : '❌ כרטיס לא נמצא', details: '' };
    }

    const behavior = selectedCard.behavior;
    const balance = selectedCard.balance;
    
    // הוסף דיליי למשוב ריאליסטי
    const delay = behavior === 'slow_processing' ? 3000 : behavior === 'premium_fast' ? 500 : 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    switch (behavior) {
      case 'success':
        if (amount > balance) {
          return { 
            success: false, 
            message: currentLanguage === 'en' ? '❌ Insufficient balance' : '❌ יתרה לא מספקת', 
            details: currentLanguage === 'en' ? `Available balance: ₪${balance.toLocaleString()}` : `יתרה זמינה: ₪${balance.toLocaleString()}` 
          };
        }
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '✅ Payment approved successfully!' : '✅ התשלום אושר בהצלחה!', 
          details: currentLanguage === 'en' ? `Fee: ₪${(amount * 0.025).toFixed(2)} | Remaining balance: ₪${(balance - amount).toLocaleString()}` : `עמלה: ₪${(amount * 0.025).toFixed(2)} | יתרה נותרת: ₪${(balance - amount).toLocaleString()}` 
        };

      case 'insufficient_funds':
        return { 
          success: false, 
          message: currentLanguage === 'en' ? '❌ Insufficient balance' : '❌ יתרה לא מספקת', 
          details: currentLanguage === 'en' ? `Available balance: ₪${balance} | Required: ₪${amount}` : `יתרה זמינה: ₪${balance} | נדרש: ₪${amount}` 
        };

      case 'blocked':
        return { 
          success: false, 
          message: currentLanguage === 'en' ? '❌ Card blocked by bank' : '❌ הכרטיס חסום על ידי הבנק', 
          details: currentLanguage === 'en' ? 'Please contact your bank to unblock' : 'נא פנה לבנק לביטול החסימה' 
        };

      case 'expired':
        return { 
          success: false, 
          message: currentLanguage === 'en' ? '❌ Card expired' : '❌ הכרטיס פג תוקף', 
          details: currentLanguage === 'en' ? 'Please update card details' : 'נא עדכן את פרטי הכרטיס' 
        };

      case 'random_fail':
        const randomSuccess = Math.random() > 0.3; // 70% הצלחה
        if (randomSuccess) {
          return { 
            success: true, 
            message: currentLanguage === 'en' ? '✅ Payment approved (random)' : '✅ התשלום אושר (אקראי)', 
            details: currentLanguage === 'en' ? `Fee: ₪${(amount * 0.025).toFixed(2)}` : `עמלה: ₪${(amount * 0.025).toFixed(2)}` 
          };
        } else {
          return { 
            success: false, 
            message: currentLanguage === 'en' ? '❌ Payment declined (random)' : '❌ התשלום נדחה (אקראי)', 
            details: currentLanguage === 'en' ? 'Temporary card network issue' : 'בעיה זמנית ברשת הכרטיסים' 
          };
        }

      case 'slow_processing':
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '✅ Payment approved (slow processing)' : '✅ התשלום אושר (עיבוד איטי)', 
          details: currentLanguage === 'en' ? `Processing time: ${delay/1000} seconds | Fee: ₪${(amount * 0.03).toFixed(2)}` : `זמן עיבוד: ${delay/1000} שניות | עמלה: ₪${(amount * 0.03).toFixed(2)}` 
        };

      case 'network_error':
        return { 
          success: false, 
          message: currentLanguage === 'en' ? '❌ Network error - try again' : '❌ תקלת רשת - נסה שוב', 
          details: currentLanguage === 'en' ? 'Error 503: Service temporarily unavailable' : 'שגיאה 503: שירות זמנית לא זמין' 
        };

      case 'fraud_alert':
        if (amount > 1000) {
          return { 
            success: false, 
            message: currentLanguage === 'en' ? '🚨 Fraud alert - payment blocked' : '🚨 חשד להונאה - התשלום נחסם', 
            details: currentLanguage === 'en' ? 'Payments over ₪1000 require phone verification' : 'תשלומים מעל ₪1000 דורשים אישור טלפוני' 
          };
        }
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '✅ Payment approved (security checked)' : '✅ התשלום אושר (נבדק בטחון)', 
          details: currentLanguage === 'en' ? `Security check completed | Fee: ₪${(amount * 0.02).toFixed(2)}` : `בדיקת בטחון הושלמה | עמלה: ₪${(amount * 0.02).toFixed(2)}` 
        };

      case 'premium_fast':
        const cashback = amount * 0.02; // 2% cashback
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '💎 Payment approved - Platinum' : '💎 התשלום אושר - פלטינום', 
          details: currentLanguage === 'en' ? `Fast processing | Cashback: ₪${cashback.toFixed(2)} | No fees` : `עיבוד מהיר | Cashback: ₪${cashback.toFixed(2)} | ללא עמלות` 
        };

      case 'premium_benefits':
        const points = Math.floor(amount / 10); // נקודות זכות
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '🥇 Payment approved - Gold' : '🥇 התשלום אושר - זהב', 
          details: currentLanguage === 'en' ? `Reward points: ${points} | Benefit: Free travel insurance` : `נקודות זכות: ${points} | הטבה: ביטוח נסיעות חינם` 
        };

      default:
        return { 
          success: true, 
          message: currentLanguage === 'en' ? '✅ Payment approved' : '✅ התשלום אושר', 
          details: currentLanguage === 'en' ? `Fee: ₪${(amount * 0.025).toFixed(2)}` : `עמלה: ₪${(amount * 0.025).toFixed(2)}` 
        };
    }
  };

  const handlePayment = async () => {
    if (!user) {
      alert(currentLanguage === 'en' ? 'Cannot make payment – no user logged in' : 'לא ניתן לבצע תשלום – אין משתמש מחובר');
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      alert(currentLanguage === 'en' ? 'Please enter a valid amount' : 'אנא הזן סכום חוקי');
      return;
    }
    // בדיקות כרטיס אשראי (רק אפשרות זמינה)
    if (!newCreditCard || !cardHolder || !cardCVV || !cardExpiry) {
      alert(currentLanguage === 'en' ? 'Please fill in all card details' : 'אנא מלא את כל פרטי הכרטיס');
      return;
    }

    const paymentDetails: Payment & { selectedCardId?: string } = {
      date: new Date().toLocaleDateString(),
      amount: `${amount} ₪`,
      status: "שולם",
      method: `כרטיס אשראי (•••• •••• •••• ${newCreditCard.slice(-4)})`,
      cardDetails: {
        number: newCreditCard,
        holder: cardHolder,
        cvv: cardCVV,
        expiry: cardExpiry
      },
      userId: user._id || user.id, // ✅ שימוש במשתמש המחובר - MongoDB ID
      transactionId: Math.floor(Math.random() * 1000000).toString(),
      selectedCardId: selectedCardId
    };

    try {
      setLoading(true);
      setServerMessage(null);
      setSimulationDetails('');

      // הרץ סימולציה כרטיס אשראי
      const simulation = await simulateCardBehavior(selectedCardId, Number(amount));
      
      if (!simulation.success) {
        setServerMessage(simulation.message);
        setSimulationDetails(simulation.details);
        return;
      }
      
      setServerMessage(simulation.message);
      setSimulationDetails(simulation.details);
      
      // עדכן סטטוס התשלום בהתאם לתוצאה
      paymentDetails.status = "שולם";

      const res = await addPayment(paymentDetails as any);
      const newPayment = (res as any).payment || res;
      // עדכון ההיסטוריה בדף הראשי
      setPaymentHistory(prevHistory => [...prevHistory, newPayment]);

      // ✅ Log payment activity
      try {
        if (user._id && user.email && user.poolId) {
          await logActivity(
            user._id,
            user.email,
            "ביצוע תשלום",
            "payment",
            Number(user.poolId),
            `תשלום של ${amount} ₪ בוצע באמצעות ${paymentDetails.method}. מזהה עסקה: ${paymentDetails.transactionId}`
          );
          console.log("✅ Activity logged: Payment completed");
        }
      } catch (logError) {
        console.error("❌ Error logging payment:", logError);
      }

      resetForm();
    } catch (err: any) {
      console.error("❌ שגיאה בביצוע תשלום:", err);
      setServerMessage(err?.response?.data?.error || 'שגיאה בביצוע התשלום');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setNewCreditCard('');
    setCardHolder('');
    setCardCVV('');
    setCardExpiry('');
    setSimulationDetails('');
  };

  // קבלת פרטי הכרטיס הנבחר
  const getSelectedCardInfo = () => {
    const card = mockCards.find(c => c.id === selectedCardId);
    return card;
  };

  // מילוי אוטומטי של פרטי הכרטיס כשבוחרים כרטיס
  const handleCardSelection = (cardId: string) => {
    setSelectedCardId(cardId);
    const card = mockCards.find(c => c.id === cardId);
    
    if (card) {
      // מילוי אוטומטי של הפרטים בהתאם לכרטיס
      switch (cardId) {
        case 'visa_success':
          setNewCreditCard('4242424242424242');
          setCardHolder('John Doe');
          setCardCVV('123');
          setCardExpiry('12/25');
          break;
        case 'mastercard_success':
          setNewCreditCard('5555555555554444');
          setCardHolder('Jane Smith');
          setCardCVV('456');
          setCardExpiry('11/26');
          break;
        case 'amex_success':
          setNewCreditCard('378282246310005');
          setCardHolder('David Cohen');
          setCardCVV('789');
          setCardExpiry('10/27');
          break;
        case 'visa_low_balance':
          setNewCreditCard('4000000000000002');
          setCardHolder('Low Balance');
          setCardCVV('111');
          setCardExpiry('09/24');
          break;
        case 'mastercard_blocked':
          setNewCreditCard('0000000000000000');
          setCardHolder('Blocked Card');
          setCardCVV('000');
          setCardExpiry('01/20');
          break;
        case 'visa_expired':
          setNewCreditCard('4000000000000069');
          setCardHolder('Expired Card');
          setCardCVV('222');
          setCardExpiry('01/20');
          break;
        case 'visa_random_fail':
          setNewCreditCard('4000000000000259');
          setCardHolder('Random Fail');
          setCardCVV('333');
          setCardExpiry('08/25');
          break;
        case 'mastercard_slow':
          setNewCreditCard('5555555555556666');
          setCardHolder('Slow Process');
          setCardCVV('444');
          setCardExpiry('07/25');
          break;
        case 'amex_network_error':
          setNewCreditCard('378734493671000');
          setCardHolder('Network Error');
          setCardCVV('555');
          setCardExpiry('06/25');
          break;
        case 'visa_fraud_alert':
          setNewCreditCard('4000000000000127');
          setCardHolder('Fraud Alert');
          setCardCVV('666');
          setCardExpiry('05/25');
          break;
        case 'visa_platinum':
          setNewCreditCard('4444444444444448');
          setCardHolder('Platinum Member');
          setCardCVV('777');
          setCardExpiry('04/26');
          break;
        case 'mastercard_gold':
          setNewCreditCard('5678567856785678');
          setCardHolder('Gold Member');
          setCardCVV('888');
          setCardExpiry('03/26');
          break;
        default:
          // ברירת מחדל
    setNewCreditCard('');
    setCardHolder('');
    setCardCVV('');
    setCardExpiry('');
      }
    }
  };

  // מילוי אוטומטי בפתיחה הראשונה
  useEffect(() => {
    // מאחר ורק כרטיס אשראי זמין, נמלא אוטומטית
    if (selectedCardId) {
      handleCardSelection(selectedCardId);
    }
  }, []);

  // בדיקת הרשאות - רק משתמשים רגילים
  if (!user || user.role?.toLowerCase() !== 'normal') {
    return (
      <Card className="w-full max-w-lg p-6 bg-white rounded-xl shadow-md">
        <CardContent>
          <Alert severity="warning">
            <strong>{currentLanguage === 'en' ? "Access Restricted" : "גישה מוגבלת"}</strong><br/>
            {currentLanguage === 'en' ? "Only regular users can make payments. Therapists and admins can only view payment history." : "רק משתמשים רגילים יכולים לבצע תשלומים. מטפלים ומנהלים יכולים רק לצפות בהיסטוריית תשלומים."}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 bg-white rounded-xl shadow-md">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-center">{currentLanguage === 'en' ? "Make Payment - Credit Card" : "בצע תשלום - כרטיס אשראי"}</h2>

        {serverMessage && (
          <Alert severity={serverMessage.includes('❌') || serverMessage.includes('שגיאה') || serverMessage.includes('אין') || serverMessage.includes('נדחה') || serverMessage.includes('חסום') || serverMessage.includes('פג') || serverMessage.includes('תקלת') || serverMessage.includes('חשד') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {serverMessage}
            {simulationDetails && (
              <Box sx={{ mt: 1, fontSize: '0.875rem', opacity: 0.9 }}>
                {simulationDetails}
              </Box>
            )}
          </Alert>
        )}

        <div className="mb-4">
          <TextField 
            label={currentLanguage === 'en' ? "Payment Amount (₪)" : "סכום לתשלום (₪)"} 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            fullWidth 
          />
        </div>

        {/* הסרנו בחירת שיטת תשלום - רק כרטיס אשראי */}

        {/* שדות כרטיס אשראי */}
        <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{currentLanguage === 'en' ? "Select Credit Card for Simulation" : "בחר כרטיס אשראי לסימולציה"}</InputLabel>
              <Select value={selectedCardId} label={currentLanguage === 'en' ? "Select Credit Card for Simulation" : "בחר כרטיס אשראי לסימולציה"} onChange={(e) => handleCardSelection(e.target.value)}>
                {mockCards.map((c) => (
                  <MenuItem key={c.id} value={c.id} sx={{ 
                    color: c.status === 'blocked' || c.status === 'expired' ? 'error.main' : 
                           c.status === 'premium' ? 'primary.main' : 'text.primary'
                  }}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* מידע על הכרטיס הנבחר */}
            {selectedCardId && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>{currentLanguage === 'en' ? "Card Information:" : "מידע כרטיס:"}</strong><br/>
                {currentLanguage === 'en' ? "Available Balance:" : "יתרה זמינה"}: ₪{getSelectedCardInfo()?.balance?.toLocaleString()}<br/>
                {currentLanguage === 'en' ? "Status:" : "סטטוס"}: {getSelectedCardInfo()?.status === 'valid' ? (currentLanguage === 'en' ? '✅ Valid' : '✅ תקין') : 
                         getSelectedCardInfo()?.status === 'blocked' ? (currentLanguage === 'en' ? '❌ Blocked' : '❌ חסום') : 
                         getSelectedCardInfo()?.status === 'expired' ? (currentLanguage === 'en' ? '⏰ Expired' : '⏰ פג תוקף') : 
                         getSelectedCardInfo()?.status === 'premium' ? (currentLanguage === 'en' ? '💎 Premium' : '💎 פרימיום') : (currentLanguage === 'en' ? 'Unknown' : 'לא ידוע')}<br/>
                <small>{currentLanguage === 'en' ? "📝 Card details filled automatically for simulation" : "📝 פרטי הכרטיס מולאו אוטומטית לסימולציה"}</small>
              </Alert>
            )}
            <TextField label={currentLanguage === 'en' ? "Card Number" : "מספר כרטיס"} value={newCreditCard} onChange={(e) => setNewCreditCard(e.target.value)} fullWidth />
            <TextField label={currentLanguage === 'en' ? "Cardholder Name" : "שם בעל הכרטיס"} value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} fullWidth />
            <TextField label="CVV" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} fullWidth />
            <TextField label={currentLanguage === 'en' ? "Expiry (MM/YY)" : "תוקף (MM/YY)"} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} fullWidth />
          </>

        <Button variant="contained" color="primary" fullWidth onClick={handlePayment} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (currentLanguage === 'en' ? 'Pay Now' : 'שלם עכשיו')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentsComponent;
