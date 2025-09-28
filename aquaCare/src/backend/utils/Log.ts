import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  userId: string;
  userEmail: string;
  action: string;
  type: 'login' | 'logout' | 'view' | 'create' | 'update' | 'delete' | 'booking' | 'payment' | 'presence' | 'navigation' | 'error' | 'response';
  details?: string;
  poolId: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  userEmail: { 
    type: String, 
    required: true,
    index: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['login', 'logout', 'view', 'create', 'update', 'delete', 'booking', 'payment', 'presence', 'navigation', 'error', 'response'],
    index: true
  },
  details: { 
    type: String 
  },
  poolId: { 
    type: String, 
    required: true,
    index: true 
  },
  ip: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}, {
  timestamps: true,
  collection: 'log' // שם הקולקשן יהיה 'log' בדיוק כמו שביקשת
});

// אינדקסים לביצועים טובים יותר
LogSchema.index({ poolId: 1, timestamp: -1 });
LogSchema.index({ userId: 1, timestamp: -1 });
LogSchema.index({ type: 1, timestamp: -1 });

const Log = mongoose.model<ILog>('Log', LogSchema);

export default Log;