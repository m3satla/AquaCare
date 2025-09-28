import axios from "axios";
import { User } from "../models/User";

const API_URL = "http://localhost:5001";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // הגדלתי מ-5000 ל-30000 (30 שניות)
  withCredentials: true
});

// Authentication API Functions
export const login = async (email: string, password: string, rememberMe: boolean = false) => {
  try {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/current-user');
    return response.data;
  } catch (error) {
    console.error('❌ Get current user error:', error);
    throw error;
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/current-user');
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    throw error;
  }
};
