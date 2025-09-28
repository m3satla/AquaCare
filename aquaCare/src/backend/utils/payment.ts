import mongoose, { Document, Schema } from "mongoose";

// טיפוס TypeScript שמתאים לפונקציה שלך
export interface Payment extends Document {
  userId: string;  // שים לב שזה string, ולא number
  date: string;
  amount: string;
  status: string;
  method: string;
  cardDetails?: {
    number?: string;
    holder?: string;
    cvv?: string;
    expiry?: string;
  };
  directDebitDetails?: {
    accountNumber?: string;
    holder?: string;
    bankName?: string;
    branchNumber?: string;
  };
  transactionId?: string;
}

const paymentSchema = new Schema<Payment>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, required: true },
  method: { type: String, required: true },

  cardDetails: {
    number: { type: String },
    holder: { type: String },
    cvv: { type: String },
    expiry: { type: String }
  },

  directDebitDetails: {
    accountNumber: { type: String },
    holder: { type: String },
    bankName: { type: String },
    branchNumber: { type: String }
  },

  transactionId: { type: String } // אופציונלי
});

const PaymentModel = mongoose.model<Payment>("Payment", paymentSchema);

export default PaymentModel;
