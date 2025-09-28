export interface Payment {
  userId: string; // ✅ תוקן ל-lowercase string
  id?: String; // מזהה אופציונלי אם תשתמש בעתיד
  date: string;
  amount: string;
  status: string;
  method: string;

  cardDetails?: {
    number: string;
    holder: string;
    cvv: string;
    expiry: string;
  };

  directDebitDetails?: {
    accountNumber: string;
    holder: string;
    bankName: string;
    branchNumber: string;
  };

  transactionId?: string; // ✅ מזהה עסקה אופציונלי
}
