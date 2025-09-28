import mongoose from 'mongoose';

export interface ConsentRecord {
  id: string;
  userId: number;
  consentType: 'registration' | 'marketing' | 'analytics' | 'therapeutic' | 'data_sharing';
  purpose: string;
  granted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  version: string; // Privacy policy version
  withdrawnAt?: Date;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
}

const consentSchema = new mongoose.Schema({
  userId: { type: Number, required: true, ref: 'User' },
  consentType: { 
    type: String, 
    required: true,
    enum: ['registration', 'marketing', 'analytics', 'therapeutic', 'data_sharing']
  },
  purpose: { type: String, required: true },
  granted: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  version: { type: String, required: true }, // Privacy policy version
  withdrawnAt: { type: Date },
  legalBasis: {
    type: String,
    required: true,
    enum: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']
  }
}, {
  timestamps: true,
  collection: 'user_consents'
});

// Indexes for efficient querying
consentSchema.index({ userId: 1, consentType: 1 });
consentSchema.index({ timestamp: 1 });
consentSchema.index({ withdrawnAt: 1 });

const UserConsentModel = mongoose.model('UserConsent', consentSchema);
export default UserConsentModel; 