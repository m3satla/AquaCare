/**
 * Utility functions for managing localStorage and sessionStorage
 */

export const clearUserStorage = (): void => {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
  localStorage.removeItem("rememberMe");
  console.log("🧹 User storage cleared");
};

export const validateUserData = (userData: any): boolean => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }
  
  // Check if userId is numeric (old format)
  if (typeof userData._id === 'number' || (typeof userData._id === 'string' && /^\d+$/.test(userData._id))) {
    console.log("🔄 User ID is numeric (old format), clearing storage...");
    return false;
  }
  
  // Check if userId is a valid MongoDB ObjectId (24 character hex string)
  if (!userData._id || typeof userData._id !== 'string' || userData._id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(userData._id)) {
    console.log("❌ User ID is not a valid MongoDB ObjectId, clearing storage...");
    return false;
  }
  
  return true;
};

export const getUserFromStorage = (): any | null => {
  const rememberMe = localStorage.getItem("rememberMe") === "true";
  console.log("🔍 Getting user from storage, rememberMe:", rememberMe);
  
  const storedUser = rememberMe 
    ? localStorage.getItem("currentUser") 
    : sessionStorage.getItem("currentUser");
  
  console.log("🔍 Stored user string:", storedUser ? "exists" : "null");
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      console.log("🔍 Parsed user data:", userData?.email, "role:", userData?.role);
      
      if (validateUserData(userData)) {
        console.log("✅ User data is valid");
        return userData;
      } else {
        console.log("❌ User data is invalid, clearing storage");
        clearUserStorage();
        return null;
      }
    } catch (error) {
      console.error("❌ Error parsing stored user:", error);
      clearUserStorage();
      return null;
    }
  }
  
  console.log("❌ No stored user found");
  return null;
};

export const saveUserToStorage = (user: any, rememberMe: boolean = false): void => {
  console.log("💾 Saving user to storage:", user?.email, "role:", user?.role, "rememberMe:", rememberMe);
  const userString = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem("currentUser", userString);
    localStorage.setItem("rememberMe", "true");
    console.log("💾 User saved to localStorage");
  } else {
    sessionStorage.setItem("currentUser", userString);
    localStorage.removeItem("rememberMe");
    console.log("💾 User saved to sessionStorage");
  }
  console.log("💾 User saved to storage");
};
