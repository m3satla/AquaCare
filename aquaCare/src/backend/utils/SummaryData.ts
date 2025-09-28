import mongoose, { Document } from 'mongoose';

// TypeScript interface for SummaryData
export interface ISummaryData extends Document {
  poolId: string;
  totalCustomers: number;
  totalTreatments: number;
  reportedIssues: number;
  sensorStatus: string;
  dailyRevenue: number;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const summaryDataSchema = new mongoose.Schema({
  poolId: { type: String, required: true },
  totalCustomers: { type: Number, required: true },
  totalTreatments: { type: Number, required: true },
  reportedIssues: { type: Number, required: true },
  sensorStatus: { type: String, required: true },
  dailyRevenue: { type: Number, required: true },
  date: { type: Date }
}, { timestamps: true });

const SummaryDataModel = mongoose.model<ISummaryData>('SummaryData', summaryDataSchema);
export default SummaryDataModel;
