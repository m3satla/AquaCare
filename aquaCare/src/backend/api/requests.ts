import { api } from "./auth";

// Request Management API Functions
export const createRequest = async (requestData: {
  type: string;
  message: string;
  userId: string;
  poolId: number;
}) => {
  try {
    const response = await api.post('/api/requests', requestData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating request:', error);
    throw error;
  }
};

export const getRequestsByPool = async (poolId: number) => {
  try {
    const response = await api.get(`/api/requests?poolId=${poolId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    throw error;
  }
};

export const respondToRequest = async (requestId: string, response: string) => {
  try {
    console.log("🔍 Sending response to request:", requestId, "Response:", response);
    const responseData = await api.patch(`/api/requests/${requestId}`, { response });
    console.log("✅ Response sent successfully:", responseData.data);
    return responseData.data;
  } catch (error) {
    console.error('❌ Error responding to request:', error);
    throw error;
  }
};

export const getUserRequests = async (userId: string) => {
  try {
    const response = await api.get(`/api/requests/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user requests:', error);
    throw error;
  }
};
