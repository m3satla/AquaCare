import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, ThemeProvider } from "@mui/material";
import { AuthProvider } from "../context/AuthContext";
import { CustomThemeProvider, useDarkMode } from "../context/ThemeContext";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import { lightTheme, darkTheme } from "../Styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "../Styles/accessibility.css";

// Inner component that uses the theme context
const LayoutContent: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* 🔵 ניווט ברוחב מלא */}
        <Navbar />

        {/* 🟢 תוכן מרכזי עם רוחב מוגבל ורספונסיבי */}
        <Box sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          flex: 1,
          px: 2,
          py: 3
        }}>
          <Outlet />
        </Box>

        {/* 🔵 פוטר ברוחב מלא */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

const Layout: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <CustomThemeProvider>
          <LayoutContent />
        </CustomThemeProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default Layout;
