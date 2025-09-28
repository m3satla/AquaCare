import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../services/models/User";
import { logout as apiLogout } from "../services/api";
import { clearUserStorage, getUserFromStorage } from "../utils/storageUtils";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);



  useEffect(() => {
    // Load user from storage on app start
    const loadUserFromStorage = () => {
      console.log("🔄 Loading user from storage...");
      const userData = getUserFromStorage();
      
      if (userData) {
        console.log("✅ User found in storage:", userData.email, "Role:", userData.role);
        setUser(userData);
        setIsAuthenticated(true);
        console.log("👤 User loaded from storage:", userData.email, "Role:", userData.role);
      } else {
        console.log("❌ No user found in storage");
      }
      
      setIsInitialized(true);
    };

    loadUserFromStorage();
  }, []);

  const logout = async () => {
    try {
      // Call server logout to destroy session
      await apiLogout();
    } catch (error) {
      console.error("❌ Server logout failed:", error);
    } finally {
      // Always clear local storage regardless of server response
      setUser(null);
      setIsAuthenticated(false);
      clearUserStorage();
      console.log("👋 User logged out");
    }
  };

  const handleSetUser = (newUser: User | null) => {
    console.log("🔄 Setting user:", newUser?.email || "null");
    setUser(newUser);
    setIsAuthenticated(!!newUser);
  };

  // Don't render children until initialization is complete
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth חייב להיות בשימוש בתוך AuthProvider");
  }
  return context;
};
