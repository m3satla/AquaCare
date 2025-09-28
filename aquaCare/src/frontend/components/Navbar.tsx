import React, { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { useTranslation } from "../hooks/useTranslation";
import { logActivity } from "../services/api";
import LanguageSwitcher from "./LanguageSwitcher";
import AccessibilityMenu from "./AccessibilityMenu";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();
  const { t, direction } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getNavLinks = () => {
    if (!user) {
      return [
        { to: "/booking", label: t("navigation.booking") },
        { to: "/profile/login", label: t("navigation.login") },
      ];
    }

    if (user.role && user.role.toLowerCase() === "admin") {
      return [
        { to: "/dashboard", label: t("navigation.management") },
        { to: "/messages", label: t("navigation.messages", "הודעות") },
        { to: "/home", label: t("navigation.home") },
      ];
    }

    if (user.role && user.role.toLowerCase() === "therapist") {
      return [
        { to: "/employee-dashboard", label: t("navigation.employeeDashboard", "לוח בקרה עובדים") },
        { to: "/messages", label: t("navigation.messages", "הודעות") },
        { to: "/home", label: t("navigation.home") },
      ];
    }

    // ✅ משתמש רגיל (normal) - רק הקישורים החשובים
    return [
      { to: "/home", label: t("navigation.home") },
      { to: "/booking", label: t("navigation.booking") },
      { to: "/messages", label: t("navigation.messages", "הודעות") },
    ];
  };

  const navLinks = useMemo(() => getNavLinks(), [user, t]);

  const handleLogout = async () => {
    // Log the logout activity before logging out
    if (user) {
      try {
        await logActivity(
          user._id,
          user.email,
          t('activityLog.logout'),
          'logout',
          Number(user.poolId) || 1,
          `User logged out`
        );
      } catch (error) {
        console.error('❌ Error logging logout activity:', error);
      }
    }
    
    logout(); // Use AuthContext logout function
    handleClose();
    navigate("/home");
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const getUserProfilePicture = (): string => {
    if (!user) return "/assets/default-avatar.svg";
    
    // אם יש תמונה מותאמת אישית
    if (user.profilePicture) return user.profilePicture;
    
    // תמונות ברירת מחדל לפי מגדר
    if (user.gender === "male") {
      return "/assets/avatar-male.svg";
    } else if (user.gender === "female") {
      return "/assets/avatar-female.svg";
    }
    
    // ברירת מחדל כללית
    return "/assets/default-avatar.svg";
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
          width: "100%",
        }}
      >
        <Toolbar>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            {t('general.appName', 'AquaCare')}
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  color="inherit"
                  onClick={() => navigate(link.to)}
                  sx={{ textTransform: "none" }}
                >
                  {link.label}
                </Button>
              ))}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Accessibility Menu */}
              <AccessibilityMenu />

              {/* User Profile */}
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                sx={{ ml: 1 }}
              >
                {user ? (
                  <Avatar
                    src={getUserProfilePicture()}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.to}
                component="div"
                onClick={() => {
                  navigate(link.to);
                  setDrawerOpen(false);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}

            {/* Language Switcher in Mobile */}
            <ListItem>
              <LanguageSwitcher />
            </ListItem>

            {/* Accessibility Menu in Mobile */}
            <ListItem>
              <AccessibilityMenu />
            </ListItem>

            {/* User Profile in Mobile */}
            <ListItem 
              component="div" 
              onClick={handleProfileClick}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={user ? `${user.firstName} ${user.lastName}` : "התחברות"}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => {
          navigate("/profile/user-profile");
          handleClose();
        }}>
          {t('navigation.profile')}
        </MenuItem>
        {/* קישור התורים שלי - רק למשתמשים רגילים */}
        {user?.role?.toLowerCase() === 'normal' && (
          <MenuItem onClick={() => {
            navigate("/appointments");
            handleClose();
          }}>
            {t('navigation.myAppointments')}
          </MenuItem>
        )}
        {/* קישור תשלומים - רק למשתמשים רגילים */}
        {user?.role?.toLowerCase() === 'normal' && (
          <MenuItem onClick={() => {
            navigate("/payments");
            handleClose();
          }}>
            {t('navigation.payments')}
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          navigate("/settings");
          handleClose();
        }}>
          {t('navigation.settings')}
        </MenuItem>
      
        <MenuItem onClick={handleLogout}>
          {t('navigation.logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
