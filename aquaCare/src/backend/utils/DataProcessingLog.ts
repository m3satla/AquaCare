import mongoose from 'mongoose';

export interface DataProcessingLogEntry {
  id: string;
  userId?: number;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'anonymize';
  dataType: 'user' | 'appointment' | 'payment' | 'pool' | 'message' | 'sensor_data';
  dataFields: string[]; // Which fields were accessed/modified
  purpose: string;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  performedBy: number; // User ID who performed the action
  automated: boolean; // Whether this was an automated process
  retentionDate?: Date; // When this data should be deleted
}

const dataProcessingLogSchema = new mongoose.Schema({
  userId: { type: Number, ref: 'User' },
  action: { 
    type: String, 
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'export', 'anonymize']
  },
  dataType: {
    type: String,
    required: true,
    enum: ['user', 'appointment', 'payment', 'pool', 'message', 'sensor_data']
  },
  dataFields: [{ type: String }],
  purpose: { type: String, required: true },
  legalBasis: {
    type: String,
    required: true,
    enum: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']
  },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  performedBy: { type: Number, required: true, ref: 'User' },
  automated: { type: Boolean, default: false },
  retentionDate: { type: Date }
}, {
  timestamps: true,
  collection: 'data_processing_logs'
});

// Indexes for efficient querying and compliance reports
dataProcessingLogSchema.index({ userId: 1, timestamp: -1 });
dataProcessingLogSchema.index({ action: 1, timestamp: -1 });
dataProcessingLogSchema.index({ dataType: 1, timestamp: -1 });
dataProcessingLogSchema.index({ retentionDate: 1 });
dataProcessingLogSchema.index({ timestamp: 1 }); // For automatic cleanup

const DataProcessingLogModel = mongoose.model('DataProcessingLog', dataProcessingLogSchema);
export default DataProcessingLogModel; 