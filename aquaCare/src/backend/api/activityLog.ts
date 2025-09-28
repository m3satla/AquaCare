import { api } from "./auth";

// Activity Log API Functions
export const getActivityLogsByPool = async (poolId: number) => {
  try {
    const response = await api.get(`/api/activity-log/pool?poolId=${poolId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching activity logs by pool:', error);
    throw error;
  }
};

export const getActivityLogsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/api/activity-log/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching activity logs by user:', error);
    throw error;
  }
};

export const createActivityLog = async (logData: {
  userId: string;
  userEmail: string;
  action: string;
  type: string;
  details?: string;
  poolId: number;
}) => {
  try {
    const response = await api.post('/api/activity-log', logData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating activity log:', error);
    throw error;
  }
};

export const getAllActivityLogs = async () => {
  try {
    const response = await api.get('/api/activity-log/all');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching all activity logs:', error);
    throw error;
  }
};
