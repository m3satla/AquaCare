import { User } from "../models/User";
import { api } from "./auth";

// Users API Functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>(`/users/get-users`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get<User>(`/auth/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`❌ Error fetching user by ID ${id}:`, error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await api.get<User[]>(`/users?email=${email}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`❌ Error fetching user by email ${email}:`, error);
    return null;
  }
};

export const getUserByNickname = async (nickname: string): Promise<User | null> => {
  try {
    const response = await api.get<User[]>(`/users?nickname=${nickname}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`❌ Error fetching user by nickname ${nickname}:`, error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<{ success: boolean; user: User }>(`/users/update-user-by-id/${userId}`, updates);
    return response.data.user || response.data;
  } catch (error) {
    console.error(`❌ Error updating user ${userId}:`, error);
    throw error;
  }
};

export const updateUserSettings = async (
  id: number,
  settings: { email?: string; password?: string; language?: string; accessibility?: boolean }
): Promise<void> => {
  try {
    await api.patch(`/users/${id}`, settings);
  } catch (error) {
    console.error(`❌ Error updating settings for user ${id}:`, error);
    throw error;
  }
};

export const setTemporaryPassword = async (id: number, tempPassword: string): Promise<void> => {
  try {
    await api.patch(`/users/${id}`, { tempPassword });
  } catch (error) {
    console.error(`❌ Error setting temporary password for user ${id}:`, error);
    throw error;
  }
};

export const generateRandomPassword = (): string => {
  return Math.random().toString(36).slice(-8);
};

export const resetUserPassword = async (id: number): Promise<string> => {
  try {
    const tempPassword = generateRandomPassword();
    await setTemporaryPassword(id, tempPassword);
    return tempPassword;
  } catch (error) {
    console.error(`❌ Error resetting password for user ${id}:`, error);
    throw error;
  }
};

export const getUsersByPool = async (poolId: string): Promise<User[]> => {
  try {
    const response = await api.get<{ success: boolean; users: User[] }>(`/users/by-pool/${poolId}`);
    return response.data.users || response.data;
  } catch (error) {
    console.error(`❌ Error fetching users by pool ${poolId}:`, error);
    throw error;
  }
};

export const createUserByAdmin = async (
  newUserData: {
    email: string;
    password: string;
    role: 'Admin' | 'normal' | 'therapist' | 'patient';
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    dateOfBirth: string;
    username: string;
  },
  currentUser: {
    id: string;
    email: string;
    role: 'Admin' | 'normal' | 'therapist' | 'patient';
    poolId: string;
  }
) => {
  try {
    const response = await api.post('/auth/create-by-admin', {
      ...newUserData,
      currentUser
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (email: string): Promise<void> => {
  try {
    await api.delete(`/users/${email}`);
  } catch (error) {
    console.error(`❌ Error deleting user ${email}:`, error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: User["role"]): Promise<void> => {
  try {
    await api.patch(`/users/${userId}/role`, { role });
  } catch (error) {
    console.error(`❌ Error updating role for user ${userId}:`, error);
    throw error;
  }
};

export const getUserByIdM = async (id: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

export const getUsersByManager = async (managerId: string): Promise<User[]> => {
  try {
    const response = await api.get<User[]>(`/users/manager/${managerId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching users by manager ${managerId}:`, error);
    throw error;
  }
};

export const updateUserPresence = async (
  userId: string,
  isPresent: boolean
): Promise<boolean> => {
  try {
    const response = await api.post<{
      success: boolean;
      user: { isPresent: boolean };
    }>(`/users/update-presence`, {
      userId,
      isPresent,
    });

    return response.data.success;
  } catch (error) {
    console.error("❌ שגיאה בעדכון נוכחות", error);
    return false;
  }
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`❌ Error deleting user account ${userId}:`, error);
    throw error;
  }
};
