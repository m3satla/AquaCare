import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // המשתמש ששלח את הפנייה - MongoDB ObjectId
  type: {
    type: String,
    required: true,
    enum: ["complaint", "positive_feedback", "cancel_subscription", "other"],
  },
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  managerId: { type: String }, // לא חובה בשלב יצירת הפנייה - MongoDB ObjectId
  poolId: { type: String, required: true },
  response: { type: String }, // מענה של מנהל (לא חובה)
}, { timestamps: true });

const RequestModel = mongoose.model('Request', requestSchema);
export default RequestModel;
