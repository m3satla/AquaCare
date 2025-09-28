import { api } from "./auth";

// Statistics API Functions
export const getPoolStatistics = async (managerId: string, month?: string) => {
  try {
    console.log("📊 API: Fetching statistics for manager:", managerId, "month:", month);
    
    const params = new URLSearchParams({ managerId });
    if (month) {
      params.append('month', month);
    }
    
    const url = `/api/statistics/pool?${params.toString()}`;
    console.log("📊 API: Making request to:", url);
    
    const response = await api.get(url);
    console.log("📊 API: Response received:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching pool statistics:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('❌ Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Request error:', error.request);
    } else {
      console.error('❌ Error message:', error.message);
    }
    
    throw error;
  }
};

export const getAllPoolsStatistics = async (month?: string) => {
  try {
    console.log("📊 API: Fetching all pools statistics, month:", month);
    
    const params = month ? `?month=${month}` : '';
    const url = `/api/statistics/all${params}`;
    console.log("📊 API: Making request to:", url);
    
    const response = await api.get(url);
    console.log("📊 API: Response received:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching all pools statistics:', error);
    
    // Log more details about the error
    if (error.response) {
      console.error('❌ Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Request error:', error.request);
    } else {
      console.error('❌ Error message:', error.message);
    }
    
    throw error;
  }
};
