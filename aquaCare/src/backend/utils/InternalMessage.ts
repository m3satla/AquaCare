import mongoose, { Document, Schema } from 'mongoose';

export interface InternalMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  senderRole: 'admin' | 'therapist';
  receiverId: mongoose.Types.ObjectId;
  receiverRole: 'admin' | 'therapist';
  poolId: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'schedule' | 'patient' | 'general' | 'emergency';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const internalMessageSchema = new Schema<InternalMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { 
    type: String, 
    enum: ['admin', 'therapist'],
    required: true 
  },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverRole: { 
    type: String, 
    enum: ['admin', 'therapist'],
    required: true 
  },
  poolId: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: { 
    type: String, 
    enum: ['schedule', 'patient', 'general', 'emergency'],
    default: 'general'
  },
  attachments: [{ type: String }]
}, {
  timestamps: true
});

// אינדקסים לביצועים טובים יותר
internalMessageSchema.index({ senderId: 1, createdAt: -1 });
internalMessageSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
internalMessageSchema.index({ poolId: 1, createdAt: -1 });
internalMessageSchema.index({ priority: 1, createdAt: -1 });

export default mongoose.model<InternalMessage>('InternalMessage', internalMessageSchema);

