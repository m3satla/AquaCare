import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography,
  Alert, Autocomplete, Checkbox, FormControlLabel, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPools, createUser, logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";
import { tp } from "../services/translation";

const strongPasswordRegx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^05\d{8}$/;

interface Pool {
  id: string;
  name: string;
}

// Fallback pools data in case API fails
const fallbackPools: Pool[] = [
  { id: "101", name: "Pool 1" },
  { id: "102", name: "Pool 2" },
  { id: "103", name: "Pool 3" }
];

const RegisterForm: React.FC = () => {
  const { t, tp } = useTranslation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    poolId: "",
    gender: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pools, setPools] = useState<Pool[]>(fallbackPools); // Start with fallback pools
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      setPoolsLoading(true);
      try {
        console.log("🔍 Fetching pools from API...");
        const data = await getPools();
        console.log("📊 Pools data received:", data);
        const cleanedData = data.filter(
          (pool): pool is Pool => !!pool.id && typeof pool.id === "string"
        );
        console.log("🧹 Cleaned pools data:", cleanedData);
        
        // Use API data if available, otherwise keep fallback
        if (cleanedData.length > 0) {
        setPools(cleanedData);
          console.log("✅ Using pools from API");
        } else {
          console.log("⚠️ No pools from API, using fallback");
          setPools(fallbackPools);
        }
      } catch (error) {
        console.error("❌ Error fetching pools:", error);
        console.log("🔄 Using fallback pools due to API error");
        setPools(fallbackPools);
        // Don't show error to user since we have fallback pools
      } finally {
        setPoolsLoading(false);
      }
    };
    fetchPools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: "",
      poolId: "",
      gender: "",
    });
    setAgreedToTerms(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (
      !form.username ||
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.password ||
      !form.dateOfBirth ||
      !form.poolId
    ) {
      setError(t('validation.requiredField'));
      return;
    }

    if (!emailRegex.test(form.email)) {
      setError(t('validation.invalidEmail'));
      return;
    }

    if (!strongPasswordRegx.test(form.password)) {
      setError(t('validation.passwordRequirements'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('validation.passwordsDoNotMatch'));
      return;
    }

    if (form.phone && !phoneRegex.test(form.phone)) {
      setError(t('validation.invalidPhone'));
      return;
    }

    if (!form.gender) {
      setError(t('auth.gender') + " " + t('validation.requiredField'));
      return;
    }

    if (!agreedToTerms) {
      setError(t('validation.termsNotAccepted'));
      return;
    }

    // Check if a pool is selected
    if (!form.poolId) {
      setError(t('pools.selectPool') + " " + t('validation.requiredField'));
      return;
    }

    const newUser = {
      username: form.username,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      phone: form.phone || undefined,
      dateOfBirth: form.dateOfBirth,
      poolId: form.poolId,
      gender: form.gender,
    };

    setSubmitLoading(true);
    try {
      // Use API service instead of direct fetch
      const createdUser = await createUser({
        user: newUser,
        role: "normal",
      });

      console.log("✅ User created successfully:", createdUser);

      // Log the registration activity
      try {
        await logActivity(
          createdUser._id,
          createdUser.email,
          t('activityLog.userRegistered'),
          'create',
          parseInt(newUser.poolId) || 1,
          `User registered with email: ${newUser.email}`
        );
      } catch (error) {
        console.error('❌ Error logging registration activity:', error);
        // Don't fail registration if logging fails
      }

      setSuccess(t('auth.registrationSuccess'));
      
      // Reset form after successful registration
      clearForm();
      
      setTimeout(() => navigate("/profile/login"), 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || t('validation.unexpectedError'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {t('auth.registrationForm')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField 
          label={t('auth.username')} 
          name="username" 
          fullWidth 
          margin="normal" 
          value={form.username} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label={t('auth.email')} 
          name="email" 
          type="email"
          fullWidth 
          margin="normal" 
          value={form.email} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label={t('auth.firstName')} 
          name="firstName" 
          fullWidth 
          margin="normal" 
          value={form.firstName} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label={t('auth.lastName')} 
          name="lastName" 
          fullWidth 
          margin="normal" 
          value={form.lastName} 
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
          helperText={t('validation.passwordRequirements')}
        />
        <TextField 
          label={t('auth.confirmPassword')} 
          name="confirmPassword" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={form.confirmPassword} 
          onChange={handleChange} 
          required 
        />
        <TextField 
          label={t('auth.phone')} 
          name="phone" 
          fullWidth 
          margin="normal" 
          value={form.phone} 
          onChange={handleChange}
          placeholder="05XXXXXXXX"
        />
        
        <TextField
          label={t('auth.dateOfBirth')}
          name="dateOfBirth"
          type="date"
          fullWidth
          margin="normal"
          value={form.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Autocomplete
          options={[
            { value: "male", label: t('auth.male') },
            { value: "female", label: t('auth.female') },
          ]}
          getOptionLabel={(option) => option.label}
          onChange={(_, newValue) => setForm({ ...form, gender: newValue?.value ?? "" })}
          renderInput={(params) => (
            <TextField {...params} label={t('auth.gender')} fullWidth margin="normal" required />
          )}
        />
        <Autocomplete
          options={pools}
          getOptionLabel={(option) => option.name}
          onChange={(_, newValue) => setForm({ ...form, poolId: newValue?.id ?? "" })}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label={t('auth.selectPool')} 
              fullWidth 
              margin="normal" 
              required 
              helperText={poolsLoading ? t('pools.loading') : tp('pools.available', { count: pools.length })}
            />
          )}
          loading={poolsLoading}
          loadingText={t('pools.loading')}
          noOptionsText={t('pools.noOptions')}
          disabled={poolsLoading}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              name="gdprConsent"
              color="primary"
            />
          }
          label={t('auth.termsAndPrivacy')}
        />

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={submitLoading || poolsLoading}
        >
          {submitLoading ? t('auth.registering') : t('auth.register')}
        </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearForm}
            disabled={submitLoading || poolsLoading}
          >
            {t('buttons.clear')}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {t('auth.haveAccount')}{" "}
          <Button
            color="primary"
            onClick={() => navigate("/profile/login")}
            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
          >
            {t('auth.login')}
          </Button>
        </Typography>
      </form>
    </Container>
  );
};

export default RegisterForm;
