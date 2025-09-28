import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  messageType: 'internal' | 'customer_support' | 'therapist_communication';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read' | 'archived';
  conversationId: string;
  poolId: string;
  attachments?: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['internal', 'customer_support', 'therapist_communication'],
    default: 'internal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'archived'],
    default: 'sent'
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  poolId: {
    type: String,
    required: true
  },
  attachments: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// אינדקסים לביצועים טובים יותר
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ poolId: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
