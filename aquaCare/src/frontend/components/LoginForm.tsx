import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login, requestPasswordReset, logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";
import { saveUserToStorage } from "../utils/storageUtils";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm: React.FC = () => {
  const { setUser, user } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkExistingAuth = () => {
      const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
      const rememberMeStored = localStorage.getItem("rememberMe") === "true";
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Check if user has MongoDB ObjectId format
          if (!userData._id || typeof userData._id !== 'string' || userData._id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(userData._id)) {
            console.error("❌ User ID in storage is not in MongoDB ObjectId format:", userData._id);
            // Clear corrupted data
            localStorage.removeItem("currentUser");
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("rememberMe");
            setIsCheckingAuth(false);
            return;
          }
          
          // Check if userId is numeric (old format) and clear storage if needed
          if (typeof userData._id === 'number' || (typeof userData._id === 'string' && /^\d+$/.test(userData._id))) {
            console.log("🔄 User ID is numeric, clearing storage...");
            // Clear corrupted data
            localStorage.removeItem("currentUser");
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("rememberMe");
            setIsCheckingAuth(false);
            return;
          }
          
          setUser(userData);
          setRememberMe(rememberMeStored);

          console.log("👤 User loaded from storage:", userData.email, "Role:", userData.role);
        } catch (error) {
          console.error("❌ Error parsing stored user:", error);
          // Clear corrupted data
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          localStorage.removeItem("rememberMe");
        }
      }
      setIsCheckingAuth(false);
    };

    checkExistingAuth();
  }, []); // Remove setUser dependency to prevent infinite loop

  // Don't render the form while checking authentication
  if (isCheckingAuth) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Don't render the form if user is already authenticated
  if (user) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!form.email || !form.password) {
      setError(t('validation.fillAllFields'));
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(form.email)) {
      setError(t('validation.invalidEmail'));
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔐 Attempting login with rememberMe:", rememberMe);
      const user = await login(form.email, form.password, rememberMe);

      if (!user) {
        setError(t('validation.invalidCredentials'));
        setIsLoading(false);
        return;
      }

      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = user as any;

      // Store user data based on rememberMe preference
      saveUserToStorage(userWithoutPassword, rememberMe);

      setUser(userWithoutPassword);

      // Log the login activity
      try {
        await logActivity(
          userWithoutPassword._id,
          userWithoutPassword.email,
          t('activityLog.login'),
          'login',
          userWithoutPassword.poolId || 1,
          `User logged in successfully`
        );
      } catch (error) {
        console.error('❌ Error logging login activity:', error);
      }

      console.log("✅ Login successful, navigating...");
      
      // Navigate based on role
      if (userWithoutPassword.role && userWithoutPassword.role.toLowerCase() === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile/user-profile", { replace: true });
      }

    } catch (error: any) {
      console.error("❌ Login failed:", error);
      const msg = error?.response?.data?.error || t('validation.invalidCredentials');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {t('auth.loginForm')}
      </Typography>
      <form onSubmit={handleLogin}>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label={t('auth.email')}
          name="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label={t('auth.password')}
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label={t('auth.rememberMe')}
        />
        <Button 
          type="submit"
          variant="contained" 
          color="primary" 
          fullWidth 
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : t('auth.login')}
        </Button>

        <Button
          variant="text"
          color="secondary"
          fullWidth
          onClick={handleForgotPassword}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {t('auth.forgotPassword')}
        </Button>


      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        {t('auth.noAccount')} {" "}
        <Button
          color="primary"
          onClick={() => navigate("/profile/register")}
          sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
        >
          {t('auth.register')}
        </Button>
      </Typography>
    </Container>
  );
};

export default LoginForm;
