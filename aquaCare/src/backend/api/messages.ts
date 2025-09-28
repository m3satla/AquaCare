import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/messages';

export interface Message {
  _id: string;
  senderId: string | { _id: string; firstName: string; lastName: string; email: string; role: string };
  receiverId: string | { _id: string; firstName: string; lastName: string; email: string; role: string };
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

export interface Conversation {
  conversationId: string;
  lastMessage: Message;
  messageCount: number;
  unreadCount: number;
}

export interface MessageStats {
  totalInbox: number;
  unreadCount: number;
  totalSent: number;
  urgentCount: number;
}

export interface CreateMessageData {
  receiverId: string;
  subject: string;
  content: string;
  messageType?: 'internal' | 'customer_support' | 'therapist_communication';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  conversationId?: string;
}

// יצירת הודעה חדשה
export const createMessage = async (messageData: CreateMessageData): Promise<{ success: boolean; data: Message; message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, messageData, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה ביצירת הודעה');
  }
};

// שליפת הודעות נכנסות
export const getInboxMessages = async (params?: {
  page?: number;
  limit?: number;
  priority?: string;
  isRead?: boolean;
}): Promise<{ success: boolean; messages: Message[]; pagination: any }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inbox`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בשליפת הודעות נכנסות');
  }
};

// שליפת הודעות יוצאות
export const getSentMessages = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; messages: Message[]; pagination: any }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sent`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בשליפת הודעות יוצאות');
  }
};

// שליפת שיחה ספציפית
export const getConversation = async (conversationId: string): Promise<{ success: boolean; messages: Message[]; conversationId: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversation/${conversationId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בשליפת שיחה');
  }
};

// שליפת רשימת שיחות
export const getConversations = async (): Promise<{ success: boolean; conversations: Conversation[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בשליפת שיחות');
  }
};

// סמן הודעה כנקראה
export const markMessageAsRead = async (messageId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${messageId}/read`, {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בסימון הודעה');
  }
};

// מחיקת הודעה
export const deleteMessage = async (messageId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${messageId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה במחיקת הודעה');
  }
};

// שליפת סטטיסטיקות הודעות
export const getMessageStats = async (): Promise<{ success: boolean; stats: MessageStats }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'שגיאה בשליפת סטטיסטיקות');
  }
};
