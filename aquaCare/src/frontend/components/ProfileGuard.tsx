import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("👤 בודק אם יש משתמש מחובר...");

    const checkUserAuth = () => {
      const storedUser =
        sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");

      if (!storedUser) {
        console.warn("🚫 לא נמצא משתמש בלוקאל/סשן - מפנה לדף התחברות");
        navigate("/profile/login");
        setIsChecking(false);
        return;
      }

      console.log("✅ נמצא משתמש בזיכרון המקומי");

      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if user has MongoDB ObjectId format
        if (!parsedUser._id || typeof parsedUser._id !== 'string' || parsedUser._id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(parsedUser._id)) {
          console.error("❌ User ID in storage is not in MongoDB ObjectId format:", parsedUser._id);
          // Clear corrupted data
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          localStorage.removeItem("rememberMe");
          navigate("/profile/login");
          setIsChecking(false);
          return;
        }
        
        // Check if userId is numeric (old format) and clear storage if needed
        if (typeof parsedUser._id === 'number' || (typeof parsedUser._id === 'string' && /^\d+$/.test(parsedUser._id))) {
          console.log("🔄 User ID is numeric, clearing storage...");
          // Clear corrupted data
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          localStorage.removeItem("rememberMe");
          navigate("/profile/login");
          setIsChecking(false);
          return;
        }
        
        // Only set user if not already set or if it's different
        if (!user || user._id !== parsedUser._id) {
          setUser(parsedUser);
          console.log("📥 משתמש נטען לקונטקסט:", parsedUser);
        } else {
          console.log("👤 משתמש כבר קיים בקונטקסט:", user);
        }
      } catch (err) {
        console.error("❌ שגיאה בפריסת המשתמש מהאחסון:", err);
        // Clear corrupted data
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem("rememberMe");
        navigate("/profile/login");
        setIsChecking(false);
        return;
      }
      
      setIsChecking(false);
    };

    checkUserAuth();
  }, [navigate]); // Remove setUser from dependencies to prevent infinite loop

  // Show loading while checking authentication
  if (isChecking) {
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

  return <>{children}</>;
};

export default ProfileGuard;
