import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Paper, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box, IconButton,
  useTheme, useMediaQuery, Card, CardContent, Chip, Avatar, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select,
  FormControl, InputLabel, Fab, Tooltip
} from "@mui/material";
import "../Styles/PoolUsersList.css";
import { MdDelete, MdPerson, MdEmail, MdWork, MdLocationOn } from "react-icons/md";
import { Add as AddIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { getUsersByPool, deleteUserFromPool, createUserByAdmin, updateUser } from "../services/api";
import { User } from "../services/models/User";
import EditUserModal from "./EditUserModal";
import { useTranslation } from "../hooks/useTranslation";

const PoolUsersList: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  
  // דיאלוג הוספת משתמש
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    role: 'normal',
    gender: 'male',
    dateOfBirth: '',
    language: 'he'
  });
  
  // דיאלוג עריכת תפקיד
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  
  // State for full edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

        if (!storedUser) {
          setError(t('errors.userNotLoggedIn', '⚠ משתמש לא מחובר.'));
          setLoading(false);
          return;
        }

        const parsedUser: User = JSON.parse(storedUser);
        if (!parsedUser || (!parsedUser._id && !parsedUser.id)) {
          setError(t('errors.cannotIdentifyUser', '⚠ לא ניתן לזהות את המשתמש המחובר.'));
          setLoading(false);
          return;
        }

        setCurrentUser(parsedUser);

        if (parsedUser.role && parsedUser.role.toLowerCase() !== "admin") {
          setError(t('errors.noAccessToUsers', '⚠ אין לך גישה לצפות במשתמשים הרשומים לבריכה.'));
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        if (!parsedUser.poolId) {
          setError(t('errors.noPoolIdForManager', '⚠ לא נמצא מזהה בריכה עבור מנהל זה.'));
          setLoading(false);
          return;
        }

        const poolUsers = await getUsersByPool(parsedUser.poolId);
        setUsers(poolUsers);
        setRetryCount(0); // Reset retry count on success
      } catch (error: any) {
        console.error("❌ שגיאה בשליפת המשתמשים:", error);
        
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          setError(t('errors.slowConnection', `❌ חיבור איטי לשרת. נסיון ${retryCount + 1}/3`));
          if (retryCount < 2) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => fetchUsers(), 2000); // Retry after 2 seconds
            return;
          }
        }
        
        setError(t('errors.fetchUsersError', '❌ אירעה שגיאה בעת שליפת המשתמשים. בדוק את החיבור לשרת.'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [retryCount]); // Remove t and currentLanguage from dependencies to prevent infinite loops

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(t('confirmations.deleteUser', `האם אתה בטוח שברצונך למחוק את המשתמש ${userEmail}?`));
      if (!confirmed) return;

      // Delete from database
      await deleteUserFromPool(userId);
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      
      // Show success message
      alert(t('success.userDeleted', '✅ המשתמש נמחק בהצלחה!'));
    } catch (error) {
      console.error("❌ שגיאה במחיקת המשתמש:", error);
      alert(t('errors.deleteUserError', '❌ שגיאה במחיקת המשתמש. נסה שוב.'));
    }
  };

  // הוספת משתמש חדש
  const handleAddUser = async () => {
    try {
      if (!currentUser?.poolId) {
        alert(t('errors.noPoolId', '❌ לא נמצא מזהה בריכה'));
        return;
      }

      // בדיקות ולידציה
      if (!newUser.firstName.trim() || !newUser.lastName.trim() || !newUser.email.trim() || !newUser.username.trim()) {
        alert(t('errors.fillAllRequiredFields', '❌ אנא מלא את כל השדות הנדרשים'));
        return;
      }

      // יצירת סיסמה זמנית
      const tempPassword = `temp${Math.random().toString(36).substring(2, 8)}`;

      const newUserData = {
        email: newUser.email,
        password: tempPassword,
        role: newUser.role as 'Admin' | 'normal' | 'therapist' | 'patient',
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender as 'male' | 'female',
        dateOfBirth: newUser.dateOfBirth || '1990-01-01',
        username: newUser.username,
        phone: newUser.phone,
        language: newUser.language
      };

      const currentUserData = {
        id: currentUser._id || currentUser.id || '',
        email: currentUser.email,
        role: currentUser.role as 'Admin' | 'normal' | 'therapist' | 'patient',
        poolId: currentUser.poolId.toString(),
      };

      const createdUser = await createUserByAdmin(newUserData, currentUserData);
      
      // עדכון הרשימה
      setUsers(prevUsers => [...prevUsers, createdUser as User]);
      
      // איפוס הטופס
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        phone: '',
        role: 'normal',
        gender: 'male',
        dateOfBirth: '',
        language: 'he'
      });
      
      setOpenAddDialog(false);
      alert(t('success.userCreated', `✅ המשתמש נוצר בהצלחה!\nהסיסמה נשלחה למייל: ${newUser.email}`));
      
    } catch (error: any) {
      console.error("❌ שגיאה ביצירת משתמש:", error);
      alert(error.response?.data?.message || t('errors.createUserError', '❌ שגיאה ביצירת המשתמש'));
    }
  };

  // עריכת תפקיד משתמש
  const handleEditRole = async () => {
    try {
      if (!editingUser?._id) return;

      await updateUser(editingUser._id, { role: editingUser.role });
      
      // עדכון הרשימה המקומית
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === editingUser._id 
            ? { ...user, role: editingUser.role }
            : user
        )
      );
      
      setOpenEditDialog(false);
      setEditingUser(null);
      alert(t('success.roleUpdated', '✅ התפקיד עודכן בהצלחה!'));
      
    } catch (error) {
      console.error("❌ שגיאה בעדכון תפקיד:", error);
      alert(t('errors.updateRoleError', '❌ שגיאה בעדכון התפקיד'));
    }
  };

  // פונקציות למודל עריכה מלא
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = async () => {
    // רענון רשימת המשתמשים
    try {
      console.log("🔄 Refreshing user list after update...");
      if (currentUser?.poolId) {
        const poolUsers = await getUsersByPool(currentUser.poolId);
        setUsers(poolUsers);
        console.log("✅ User list refreshed successfully");
      }
    } catch (err) {
      console.error("❌ שגיאה ברענון רשימת המשתמשים:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  const getRoleLabel = useMemo(() => {
    return (role: string) => {
      switch (role?.toLowerCase()) {
        case "admin":
          return currentLanguage === 'en' ? "Manager" : "מנהל";
        case "therapist":
          return currentLanguage === 'en' ? "Therapist" : "מטפל";
        case "patient":
          return currentLanguage === 'en' ? "Patient" : "מטופל";
        case "normal":
          return currentLanguage === 'en' ? "Regular Client" : "לקוח רגיל";
        default:
          return currentLanguage === 'en' ? "Unknown" : "לא ידוע";
      }
    };
  }, [currentLanguage]);

  const getRoleColor = useMemo(() => {
    return (role: string) => {
      switch (role?.toLowerCase()) {
        case "admin":
          return "#d32f2f"; // אדום כהה
        case "therapist":
          return "#1976d2"; // כחול
        case "patient":
          return "#388e3c"; // ירוק
        case "normal":
          return "#f57c00"; // כתום
        default:
          return "#757575"; // אפור
      }
    };
  }, []);

  const getRoleBackgroundColor = useMemo(() => {
    return (role: string) => {
      switch (role?.toLowerCase()) {
        case "admin":
          return "#ffebee"; // אדום בהיר
        case "therapist":
          return "#e3f2fd"; // כחול בהיר
        case "patient":
          return "#e8f5e8"; // ירוק בהיר
        case "normal":
          return "#fff3e0"; // כתום בהיר
        default:
          return "#f5f5f5"; // אפור בהיר
      }
    };
  }, []);

  return (
    <Container maxWidth="xl" className="pool-users-container" sx={{ mt: 4, mb: 4 }}>
      <Paper className="pool-users-paper" sx={{ p: { xs: 2, md: 3 }, textAlign: "center" }}>
        <Typography className="pool-users-title" variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
          {currentLanguage === 'en' ? "Registered Pool Users" : "משתמשים רשומים לבריכה"}
        </Typography>

        {loading && (
          <Box className="pool-users-loading" sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {error && (
          <Alert 
            className="pool-users-error"
            severity="error" 
            sx={{ mt: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                {currentLanguage === 'en' ? "Retry" : "נסה שוב"}
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {isAdmin && users.length > 0 && (
          <>
            {/* Desktop/Tablet View - Table */}
            {!isMobile && (
              <TableContainer component={Paper} className="pool-users-table" sx={{ 
                mt: 3, 
                overflow: "hidden"
              }}>
                <Table>
                  <TableHead className="pool-users-table-header" sx={{ 
                    "& .MuiTableCell-head": {
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "16px 12px"
                    }
                  }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", minWidth: "60px" }}>#</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: "120px" }}>
                        {currentLanguage === 'en' ? "Username" : "שם משתמש"}
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", minWidth: "200px" }}>
                        {currentLanguage === 'en' ? "Email" : "אימייל"}
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", minWidth: "100px" }}>
                        {currentLanguage === 'en' ? "Role" : "תפקיד"}
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", minWidth: "100px" }}>
                        {currentLanguage === 'en' ? "Presence" : "נוכחות"}
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center", minWidth: "120px" }}>
                        {currentLanguage === 'en' ? "Actions" : "פעולות"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => {
                      return (
                        <TableRow 
                          key={user._id || user.id} 
                          className="pool-users-table-row"
                          sx={{ 
                            "& .MuiTableCell-body": {
                              borderBottom: "1px solid #e0e0e0",
                              padding: "12px 8px"
                            }
                          }}
                        >
                          <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: "500", color: "#2c3e50" }}>
                            {user.username}
                          </TableCell>
                          <TableCell sx={{ color: "#34495e", wordBreak: "break-word" }}>
                            {user.email}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={getRoleLabel(user.role)}
                              className="pool-users-role-chip"
                              sx={{
                                backgroundColor: getRoleBackgroundColor(user.role),
                                color: getRoleColor(user.role),
                                fontWeight: "bold",
                                border: `2px solid ${getRoleColor(user.role)}`,
                                "&:hover": {
                                  backgroundColor: getRoleColor(user.role),
                                  color: "white"
                                }
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={user.isPresent ? (currentLanguage === 'en' ? "Present" : "נמצא") : (currentLanguage === 'en' ? "Not Present" : "לא נמצא")}
                              color={user.isPresent ? "success" : "error"}
                              variant="outlined"
                              className="pool-users-presence-chip"
                              sx={{
                                fontWeight: "bold",
                                borderWidth: "2px"
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", minWidth: "120px" }}>
                            <Tooltip title={currentLanguage === 'en' ? "Edit user" : "ערוך משתמש"} arrow>
                              <IconButton 
                                color="primary" 
                                className="pool-users-action-button"
                                onClick={() => handleEditUser(user)}
                                sx={{ mr: 1 }}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={currentLanguage === 'en' ? "Delete user" : "מחק משתמש"} arrow>
                              <IconButton 
                                color="error" 
                                className="pool-users-action-button"
                                onClick={() => handleDeleteUser(user._id, user.email)}
                                size="small"
                              >
                                <MdDelete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Mobile View - Cards */}
            {isMobile && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {users.map((user, index) => (
                  <Card key={user._id || user.id} className={`pool-users-card ${user.isPresent ? 'present' : 'not-present'}`} sx={{ 
                    boxShadow: 2, 
                    borderRadius: 2
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar className="pool-users-avatar" sx={{ mr: 2 }}>
                          <MdPerson />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {user.username}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            #{index + 1}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={currentLanguage === 'en' ? "Edit user" : "ערוך משתמש"}>
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleEditUser(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={currentLanguage === 'en' ? "Delete user" : "מחק משתמש"}>
                            <IconButton 
                               color="error" 
                               size="small"
                               onClick={() => handleDeleteUser(user._id, user.email)}
                             >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MdEmail style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {user.email}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MdWork style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                        <Chip 
                          label={getRoleLabel(user.role)} 
                          sx={{
                            backgroundColor: getRoleBackgroundColor(user.role),
                            color: getRoleColor(user.role),
                            fontWeight: "bold"
                          }}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MdLocationOn style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                        <Chip 
                          label={user.isPresent ? (currentLanguage === 'en' ? "Present" : "נמצא") : (currentLanguage === 'en' ? "Not Present" : "לא נמצא")}
                          color={user.isPresent ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}

        {isAdmin && users.length === 0 && !loading && (
          <Box className="pool-users-empty">
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              {currentLanguage === 'en' ? "⚠ No users found in this pool." : "⚠ לא נמצאו משתמשים בבריכה זו."}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* כפתור הוספת משתמש */}
      {isAdmin && (
        <Tooltip title={currentLanguage === 'en' ? "Add new user" : "הוסף משתמש חדש"}>
          <Fab
            className="pool-users-fab"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      {/* דיאלוג הוספת משתמש */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth className="pool-users-dialog">
        <DialogTitle className="pool-users-dialog-title">
          {currentLanguage === 'en' ? "Add New User" : "הוספת משתמש חדש"}
        </DialogTitle>
                <DialogContent className="pool-users-dialog-content">
          <Alert severity="info" sx={{ mb: 2 }}>
            {currentLanguage === 'en' 
              ? "The new user will be automatically assigned to your pool and will receive an email with their login credentials and temporary password." 
              : "המשתמש החדש יוקצה אוטומטית לבריכה שלך ויקבל מייל עם פרטי ההתחברות והסיסמה הזמנית שלו."}
          </Alert>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={currentLanguage === 'en' ? "First Name" : "שם פרטי"}
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                required
              />
              <TextField
                label={currentLanguage === 'en' ? "Last Name" : "שם משפחה"}
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={currentLanguage === 'en' ? "Email" : "אימייל"}
                type="email"
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <TextField
                label={currentLanguage === 'en' ? "Username" : "שם משתמש"}
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={currentLanguage === 'en' ? "Phone" : "טלפון"}
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
              <FormControl sx={{ flex: 1, minWidth: '200px' }}>
                <InputLabel>{currentLanguage === 'en' ? "Role" : "תפקיד"}</InputLabel>
                <Select
                  value={newUser.role}
                  label={currentLanguage === 'en' ? "Role" : "תפקיד"}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <MenuItem value="normal">{currentLanguage === 'en' ? "Regular Client" : "לקוח רגיל"}</MenuItem>
                  <MenuItem value="therapist">{currentLanguage === 'en' ? "Therapist" : "מטפל"}</MenuItem>
                  <MenuItem value="Admin">{currentLanguage === 'en' ? "Manager" : "מנהל"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={currentLanguage === 'en' ? "Date of Birth" : "תאריך לידה"}
                type="date"
                className="pool-users-form-field"
                sx={{ flex: 1, minWidth: '200px' }}
                value={newUser.dateOfBirth}
                onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl sx={{ flex: 1, minWidth: '200px' }}>
                <InputLabel>{currentLanguage === 'en' ? "Language" : "שפה"}</InputLabel>
                <Select
                  value={newUser.language}
                  label={currentLanguage === 'en' ? "Language" : "שפה"}
                  onChange={(e) => setNewUser({ ...newUser, language: e.target.value })}
                >
                  <MenuItem value="he">{currentLanguage === 'en' ? "Hebrew" : "עברית"}</MenuItem>
                  <MenuItem value="en">{currentLanguage === 'en' ? "English" : "אנגלית"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <InputLabel>{currentLanguage === 'en' ? "Gender" : "מגדר"}</InputLabel>
              <Select
                value={newUser.gender}
                label={currentLanguage === 'en' ? "Gender" : "מגדר"}
                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
              >
                <MenuItem value="male">{currentLanguage === 'en' ? "Male" : "זכר"}</MenuItem>
                <MenuItem value="female">{currentLanguage === 'en' ? "Female" : "נקבה"}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} startIcon={<CancelIcon />}>
            {currentLanguage === 'en' ? "Cancel" : "ביטול"}
          </Button>
          <Button onClick={handleAddUser} variant="contained" startIcon={<SaveIcon />}>
            {currentLanguage === 'en' ? "Add User" : "הוסף משתמש"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עריכת תפקיד */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="xs" fullWidth className="pool-users-dialog">
        <DialogTitle className="pool-users-dialog-title">
          {currentLanguage === 'en' ? "Edit User Role" : "עריכת תפקיד משתמש"}
        </DialogTitle>
        <DialogContent className="pool-users-dialog-content">
          {editingUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentLanguage === 'en' ? 'Editing role for:' : 'עריכת תפקיד עבור:'} <strong>{editingUser.firstName} {editingUser.lastName}</strong>
              </Typography>
              <FormControl fullWidth>
                <InputLabel>{currentLanguage === 'en' ? "Role" : "תפקיד"}</InputLabel>
                <Select
                  value={editingUser.role}
                  label={currentLanguage === 'en' ? "Role" : "תפקיד"}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <MenuItem value="normal">{currentLanguage === 'en' ? "Regular Client" : "לקוח רגיל"}</MenuItem>
                  <MenuItem value="therapist">{currentLanguage === 'en' ? "Therapist" : "מטפל"}</MenuItem>
                  <MenuItem value="Admin">{currentLanguage === 'en' ? "Manager" : "מנהל"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} startIcon={<CancelIcon />}>
            {currentLanguage === 'en' ? "Cancel" : "ביטול"}
          </Button>
          <Button onClick={handleEditRole} variant="contained" startIcon={<SaveIcon />}>
            {currentLanguage === 'en' ? "Save Changes" : "שמור שינויים"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal - Full Edit */}
      <EditUserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
    </Container>
  );
};

export default PoolUsersList;
