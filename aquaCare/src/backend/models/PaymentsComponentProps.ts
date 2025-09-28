import { Payment } from "../models/Payment";

export interface PaymentsComponentProps {
  paymentHistory: Payment[];
  setPaymentHistory: React.Dispatch<React.SetStateAction<Payment[]>>;
}