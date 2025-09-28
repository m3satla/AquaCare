# Translation System Integration Guide

## Quick Integration Steps

### 1. Install Translation System (Already Created)

✅ **Files already created:**
- `src/services/translation.ts` - Main translation service
- `src/hooks/useTranslation.ts` - React hook
- `src/components/LanguageSwitcher.tsx` - Language selector
- `src/utils/i18n.ts` - Utility functions

### 2. Update Your Main App Component

```tsx
// In src/App.tsx
import { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./Styles/theme";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { CustomThemeProvider, useDarkMode } from "./context/ThemeContext";
import { useTranslation } from "./hooks/useTranslation"; // Add this

const ThemedApp = () => {
  const { darkMode } = useDarkMode();
  const { direction } = useTranslation(); // Add this
  const theme = useMemo(() => ({
    ...(darkMode ? darkTheme : lightTheme),
    direction: direction // Add this for RTL/LTR support
  }), [darkMode, direction]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

// Rest remains the same...
```

### 3. Update Your Navbar (Replace existing)

```tsx
// Replace the content of src/components/Navbar.tsx with:
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import { useDarkMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, setUser } = useAuth();
  const { t, isRTL, direction } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Navigation links with translations
  const navLinks = [
    { to: "/home", label: t('navigation.home') },
    { to: "/booking", label: t('navigation.booking') },
    ...(user?.role === "Admin"
      ? [{ to: "/manager-requests", label: t('navigation.receivedRequests') }]
      : user
      ? [{ to: "/management-requests", label: t('navigation.managementRequests') }]
      : []),
    ...(user?.role === "Admin"
      ? [{ to: "/dashboard", label: t('navigation.management') }]
      : []),
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberMe");
    setUser(null);
    handleClose();
    navigate("/home");
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const getUserProfilePicture = (): string => {
    if (!user) return "assets/profile/unknown.jpeg";
    if (user.profilePicture) return user.profilePicture;
    return user.gender === "male"
      ? "assets/profile/men.jpg"
      : "assets/profile/female.jpeg";
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      navigate("/profile/login");
    } else {
      handleOpen(event);
    }
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: theme.palette.primary.main, 
          direction: direction, 
          width: "100%" 
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ [isRTL ? 'mr' : 'ml']: 2 }}
          >
            {t('general.appName')}
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                alignItems: "center",
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}>
                {navLinks.map((link) => (
                  <Button 
                    key={link.to} 
                    component={Link} 
                    to={link.to} 
                    color="inherit"
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}>
                <LanguageSwitcher variant="standard" size="small" />
                <Tooltip title={darkMode ? t('navigation.lightMode') : t('navigation.darkMode')}>
                  <IconButton onClick={toggleDarkMode} color="inherit">
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Tooltip>
                <IconButton onClick={handleProfileClick}>
                  <Avatar src={getUserProfilePicture()} sx={{ width: 36, height: 36 }} />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        sx={{ '& .MuiMenu-paper': { direction: direction } }}
      >
        <MenuItem onClick={() => { handleClose(); navigate("/profile/user-profile"); }}>
          {t('navigation.profile')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate("/settings"); }}>
          {t('navigation.settings')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate("/payments"); }}>
          {t('navigation.payments')}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          {t('navigation.logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
```

### 4. Update Individual Components

#### Example: Update HomePage

```tsx
// In src/pages/HomePage.tsx
import React from "react";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "../hooks/useTranslation";
import "../styles/home.css";

const HomePage: React.FC = () => {
  const { t, direction } = useTranslation();
  
  return (
    <Container maxWidth="md" className="waveContainer" sx={{ direction }}>
      <Typography variant="h3" className="waveHeader">
        {t('pages.welcome')}
      </Typography>
      <div className="waveWrapper">
        <div
          className="wave"
          style={{ backgroundImage: 'url("/assets/wave.svg")' }}
        />
        <div
          className="wave waveSecondary"
          style={{ backgroundImage: 'url("/assets/wave.svg")' }}
        />
      </div>
    </Container>
  );
};

export default HomePage;
```

#### Example: Update LoginForm

```tsx
// In src/components/LoginForm.tsx (key changes)
import { useTranslation } from "../hooks/useTranslation";

const LoginForm: React.FC = () => {
  const { t, isRTL } = useTranslation();
  
  // Replace hardcoded strings with t() calls:
  return (
    <Box sx={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Typography variant="h4" gutterBottom>
        {t('auth.loginForm')}
      </Typography>
      
      <TextField
        label={t('auth.email')}
        // ... other props
      />
      
      <TextField
        label={t('auth.password')}
        type="password"
        // ... other props
      />
      
      <Button type="submit" variant="contained">
        {t('buttons.submit')}
      </Button>
      
      {/* Error messages */}
      {error && (
        <Alert severity="error">
          {t('validation.invalidCredentials')}
        </Alert>
      )}
    </Box>
  );
};
```

### 5. Quick Find & Replace Guide

Use these patterns to quickly update your existing components:

```bash
# Find hardcoded Hebrew text
grep -r "עמוד הבית" src/
grep -r "התחברות" src/
grep -r "הרשמה" src/

# Replace common patterns:
"עמוד הבית" → {t('navigation.home')}
"התחברות" → {t('auth.login')}
"הרשמה" → {t('auth.register')}
"אימייל" → {t('auth.email')}
"סיסמה" → {t('auth.password')}
"שלח" → {t('buttons.submit')}
"ביטול" → {t('buttons.cancel')}
```

### 6. Add Translation Hook to Components

Add this import and hook to any component using translations:

```tsx
import { useTranslation } from "../hooks/useTranslation";

const MyComponent: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();
  
  // Use t() for all text
  return (
    <div style={{ direction }}>
      <h1>{t('pages.title')}</h1>
    </div>
  );
};
```

### 7. RTL/LTR Styling

Add direction support to your components:

```tsx
const { isRTL, direction } = useTranslation();

// For containers
<Box sx={{ direction }}>

// For text alignment
<Typography sx={{ textAlign: isRTL ? 'right' : 'left' }}>

// For margins/padding
<Box sx={{ 
  marginLeft: isRTL ? 0 : 2,
  marginRight: isRTL ? 2 : 0 
}}>

// For flex direction
<Box sx={{ 
  display: 'flex',
  flexDirection: isRTL ? 'row-reverse' : 'row'
}}>
```

## Testing Your Integration

### 1. Start both servers:

```bash
# Terminal 1 - Backend
cd backend
npm run start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Test translation endpoints:

```bash
# Test Hebrew translations
curl http://localhost:5001/lang/he

# Test English translations
curl http://localhost:5001/lang/en

# Test specific namespace
curl http://localhost:5001/lang/he/navigation
```

### 3. Test in browser:

1. Open `http://localhost:5173`
2. Look for the language switcher in the navbar
3. Switch between Hebrew/English
4. Verify text changes and RTL/LTR layout
5. Check that language preference persists on reload

## Common Issues & Solutions

### Issue: "Translation key not found"
**Solution:** Check the key exists in your JSON files and matches exactly.

### Issue: "Backend not responding" 
**Solution:** Ensure backend is running on port 5001 and CORS allows frontend origin.

### Issue: "Text not updating when switching languages"
**Solution:** Make sure you're using the `useTranslation` hook, not direct service calls.

### Issue: "RTL layout broken"
**Solution:** Add `direction` prop to parent containers and check CSS for hardcoded text-align values.

## Rollback Plan

If you need to rollback:

1. Keep your original component files as `.backup`
2. Only the translation service files are new additions
3. Simply remove translation imports and restore hardcoded strings

---

**Your translation system is now ready!** 🎉

The backend serves comprehensive dictionaries for Hebrew and English, and your frontend can dynamically switch languages with proper RTL/LTR support. 