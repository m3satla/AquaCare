import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Logout,
  DeleteForever,
  Person,
  Email,
  Pool,
  Language,
  Work,
  Cake,
  Wc,
} from "@mui/icons-material";
import { User } from "../services/models/User";
import UserPresenceToggle from "./UserPresenceToggle";
import { deleteUserAccount, getUserById, logActivity } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";

const UserProfile: React.FC = () => {
  const { user: contextUser, logout } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const loadUser = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        setError(null);
        
        // Get user ID from context or localStorage
        let userId: string | null = null;
        
        if (contextUser && contextUser._id) {
          userId = contextUser._id;
          console.log("🔍 Using user ID from context:", userId);
        } else {
          // Fallback to localStorage
          const stored = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
          if (stored) {
            try {
              const parsedUser = JSON.parse(stored);
              userId = parsedUser._id || parsedUser.id;
              console.log("🔍 Using user ID from localStorage:", userId);
            } catch (parseError) {
              console.error("❌ Error parsing stored user:", parseError);
            }
          }
        }

        if (!userId) {
          console.log("🔒 No user logged in - redirecting to login");
          if (isMounted) {
            navigate("/profile/login");
          }
          return;
        }

        // Check if userId is numeric (old format) and clear storage if needed
        if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
          console.log("🔄 User ID is numeric, clearing storage and redirecting to login...");
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          localStorage.removeItem("rememberMe");
          if (isMounted) {
            navigate("/profile/login");
          }
          return;
        }

        // Check if userId is a valid MongoDB ObjectId (24 character hex string)
        if (typeof userId !== 'string' || userId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(userId)) {
          console.error("❌ User ID is not a valid MongoDB ObjectId:", userId);
          if (isMounted) {
            setError(t('errors.invalidUserId'));
            setIsLoading(false);
          }
          return;
        }

        // Load user data from database
        console.log("📡 Loading user data from database...");
        const userData = await getUserById(userId);
        
        if (!isMounted) return; // Check again after async operation
        
        if (userData) {
          setUser(userData);
          console.log("✅ User data loaded from database:", userData);
        
        // רישום לוג פעילות - צפיה בפרופיל
        try {
          await logActivity(
            userData._id,
            userData.email,
            "צפיה בפרופיל אישי",
            "view",
            Number(userData.poolId) || 1,
            "משתמש צפה בפרופיל האישי שלו"
          );
        } catch (logError) {
          console.error("❌ Error logging profile view:", logError);
        }
        } else {
          console.log("❌ User not found in database - this might be a server or database issue");
          setError(t('errors.cannotLoadUserDetails'));
        }
      } catch (err: any) {
        console.error(t('profile.errorLoadingUserFromServer'), err);
        
        if (!isMounted) return;
        
        // Check if it's a database connection error
        if (err.message && err.message.includes("Database not available")) {
          setError(t('errors.serverConnectionProblem'));
        } else {
          setError(t('errors.loadingUserDetails'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [contextUser?._id, navigate, t]); // Only depend on user ID, not the full contextUser object

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/profile/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback logout
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("rememberMe");
    setUser(null);
    navigate("/profile/login");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(t('profile.confirmDeleteAccount'));
    if (!confirmed) return;

    try {
      await deleteUserAccount(user._id);
              alert(t('profile.accountDeletedSuccess'));
      await logout();
      navigate("/profile/login");
    } catch (error) {
      console.error("Error deleting account:", error);
              alert(t('profile.errorDeletingAccount'));
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    // Trigger re-render by updating a dependency
    window.location.reload();
  };

  const getUserProfilePicture = (): string => {
    if (user?.profilePicture) return user.profilePicture;
    
    // תמונות ברירת מחדל לפי מגדר
    if (user?.gender === "male") {
      return "/assets/avatar-male.svg";
    } else if (user?.gender === "female") {
      return "/assets/avatar-female.svg";
    }
    
    return "/assets/default-avatar.svg";
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('profile.loadingUserDetails')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleRetry}>
              {t('Try Again')}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/profile/login")}>
              {t('Login Again')}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {t('No user data found')}
          </Alert>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={() => navigate("/profile/login")}>
              {t('Login Again')}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* כותרת יפה */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: 'white', 
          p: 3, 
          textAlign: 'center' 
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('Personal Profile')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {t('Your personal details')}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {user.tempPassword && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              ⚠️ {t('You logged in with a temporary password – please update your password soon')}
            </Alert>
          )}

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, 
            gap: 4 
          }}>
            {/* צד שמאל - תמונת פרופיל */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('Profile Picture')}
              </Typography>
              
              <Avatar
                src={getUserProfilePicture()}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mx: 'auto', 
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.main',
                  boxShadow: 3
                }}
              />
              
              <Chip 
                icon={<Work />}
                label={user.role === 'Admin' ? (t('Admin')) : 
                       user.role === 'therapist' ? (t('Therapist')) : 
                       (t('Regular User'))}
                color={user.role === 'Admin' ? 'error' : user.role === 'therapist' ? 'warning' : 'primary'}
                variant="filled"
              />
            </Box>

            {/* צד ימין - פרטים אישיים */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('Personal Details')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Full Name')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Username')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Email')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Pool sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Pool')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.poolId || (t('Not set'))}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Language')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.language === 'he' ? (t('Hebrew')) : (t('English'))}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Cake sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Date of Birth')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.dateOfBirth}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Wc sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('Gender')}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.gender === 'male' ? (t('Male')) : (t('Female'))}
                    </Typography>
                  </Box>
                </Box>

                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                                          <Typography variant="body2" color="text.secondary">
                      {t('Phone')}
                    </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* UserPresenceToggle */}
              <Box sx={{ mt: 3 }}>
                <UserPresenceToggle
                  userId={user._id}
                  initialPresence={user.isPresent ?? false}
                />
              </Box>
            </Box>
          </Box>

          {/* כפתורים */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
              gap: 2 
            }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Edit />}
                onClick={() => navigate("/profile/edit")}
                sx={{ height: 48 }}
              >
                {t('Edit Details')}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                fullWidth
                size="large"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ height: 48 }}
              >
                {t('Logout')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="large"
                startIcon={<DeleteForever />}
                onClick={handleDelete}
                sx={{ height: 48 }}
              >
                {t('Delete Account')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default UserProfile;