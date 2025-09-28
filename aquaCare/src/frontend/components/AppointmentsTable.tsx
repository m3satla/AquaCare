// src/components/AppointmentsTable.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { cancelAppointment, getUserById } from "../services/api";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Chip,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Alert,
  Button,
  IconButton
} from "@mui/material";
import { CalendarToday, AccessTime, Person, LocalHospital, Cancel } from "@mui/icons-material";

interface Appointment {
  _id: string;
  clientId: string;
  employeeId: string;
  poolId: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  isCanceled?: boolean;
}

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments, onCancelAppointment }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [usersCache, setUsersCache] = useState<Map<string, UserInfo>>(new Map());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAppointmentInFuture = (date: string, time: string) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime > now;
  };

  const fetchUserInfo = async (userId: string): Promise<UserInfo | null> => {
    // Check cache first
    if (usersCache.has(userId)) {
      return usersCache.get(userId)!;
    }

    try {
      const userInfo = await getUserById(userId);
      if (userInfo) {
        const userData: UserInfo = {
          _id: userInfo._id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email
        };
        // Cache the user info
        setUsersCache(prev => new Map(prev.set(userId, userData)));
        return userData;
      }
    } catch (error) {
      console.error(`❌ Error fetching user info for ${userId}:`, error);
    }
    return null;
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm(t('appointments.confirmCancelAppointment'))) {
      return;
    }

    try {
      const success = await cancelAppointment(appointmentId);
      if (success) {
        alert(t('appointments.appointmentCancelledSuccess'));
        // רענון רשימת התורים
        // setAppointments(prev => prev.filter(appt => appt._id !== appointmentId)); // This line is removed as per new_code
        onCancelAppointment(appointmentId); // Call the prop function
      } else {
        alert(t('appointments.errorCancellingAppointment'));
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(t('appointments.errorCancellingAppointment'));
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      // This part of the logic is now handled by the parent component
      // if (!user) return;
      
      // בדיקה שיש poolId למנהל
      // if (user.role && user.role.toLowerCase() === "admin" && !user.poolId) {
      //   console.error("❌ Admin user has no poolId");
      //   return;
      // }

      try {
        // let url = "";

        // if (user.role && user.role.toLowerCase() === "admin") {
        //   // מנהל - תורים של הבריכה שלו בלבד
        //   url = `http://localhost:5001/api/appointments/all?poolId=${user.poolId}`;
        // } else if (user.role && user.role.toLowerCase() === "therapist") {
        //   url = `http://localhost:5001/api/appointments/employee/${user._id}`;
        // } else {
        //   // משתמש רגיל - תורים שלו בלבד
        //   url = `http://localhost:5001/api/appointments/client/${user._id}`;
        // }

        // const res = await axios.get(url);
        // let allAppointments = res.data.appointments || [];
        
        // // סינון לתורים עתידיים ולא מבוטלים בלבד
        // const futureAppointments = allAppointments.filter((appt: Appointment) => 
        //   isAppointmentInFuture(appt.date, appt.time) && !appt.isCanceled
        // );
        
        // setAppointments(futureAppointments);
        
        // // אם המשתמש הוא מנהל, שלוף פרטי לקוחות
        // if (user.role && user.role.toLowerCase() === "admin") {
        //   const uniqueClientIds = [...new Set(futureAppointments.map((appt: Appointment) => appt.clientId))];
          
        //   // שלוף פרטי כל הלקוחות באופן מקבילי
        //   await Promise.all(
        //     uniqueClientIds.map((clientId: any) => fetchUserInfo(clientId as string))
        //   );
        // }
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    // fetchAppointments(); // This line is removed as per new_code
  }, [appointments]); // Dependency array updated

  const getPatientDisplayName = (clientId: string): string => {
    const userInfo = usersCache.get(clientId);
    if (userInfo) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }
    return clientId; // fallback to ID if name not found
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
    </Box>
  );

  if (appointments.length === 0)
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        {t('appointments.noFutureAppointments')}
      </Alert>
    );

  // תצוגה מובייל - כרטיסים
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          {t('appointments.myAppointments')} ({appointments.length})
        </Typography>
        {appointments.map((appt) => (
          <Card key={appt._id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  {new Date(appt.date).toLocaleDateString(t('locale') === 'en' ? 'en-US' : 'he-IL')}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTime sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="body1">
                  {appt.time}
                </Typography>
              </Box>
              
                             <Box display="flex" alignItems="center" mb={1}>
                 <LocalHospital sx={{ mr: 1, color: 'success.main' }} />
                 <Chip 
                     label={appt.type === 'הידרותרפיה' ? t('appointments.hydrotherapy') :
                            appt.type === 'פיזיותרפיה' ? t('appointments.physiotherapy') :
                            appt.type === 'עיסוי טיפולי' ? t('appointments.therapeuticMassage') :
                            appt.type === 'אחר' ? t('appointments.other') : appt.type} 
                     color="primary" 
                     variant="outlined"
                   />
               </Box>
              
              {/* {user?.role?.toLowerCase() === "admin" && ( // This block is removed as per new_code
                <Box display="flex" alignItems="center" mb={1}>
                  <Person sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('appointments.patient')} {getPatientDisplayName(appt.clientId)}
                  </Typography>
                </Box>
              )} */}
              
              {appt.notes && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {t('appointments.notes')} {appt.notes}
                </Typography>
              )}
              
              {/* כפתור ביטול - רק למשתמשים רגילים וגם למנהלים */}
              {true && (
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleCancelAppointment(appt._id)}
                  >
                    {t('appointments.cancelAppointment')}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

     // תצוגה דסקטופ - טבלה
   return (
     <Paper sx={{ padding: 3, overflowX: 'auto', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>
        {t('appointments.listOfFutureAppointments')} ({appointments.length})
      </Typography>
             <Table sx={{ minWidth: 650 }}>
                 <TableHead sx={{ backgroundColor: 'grey.50' }}>
          <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.date')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.time')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.treatmentType')}</TableCell>
              {/* {user?.role?.toLowerCase() === "admin" && ( // This block is removed as per new_code
                <>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.patientName')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.employeeId')}</TableCell>
                </>
              )} */}
              <TableCell sx={{ fontWeight: 'bold' }}>{t('appointments.notes')}</TableCell>
              {/* Actions column removed as per new code */}
          </TableRow>
        </TableHead>
        <TableBody>
                     {appointments.map((appt) => (
             <TableRow key={appt._id} hover sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                             <TableCell sx={{ padding: '12px 16px' }}>
                 <Box display="flex" alignItems="center">
                   <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                   {new Date(appt.date).toLocaleDateString(t('locale') === 'en' ? 'en-US' : 'he-IL')}
                 </Box>
               </TableCell>
                             <TableCell sx={{ padding: '12px 16px' }}>
                 <Box display="flex" alignItems="center">
                   <AccessTime sx={{ mr: 1, fontSize: 16, color: 'secondary.main' }} />
                   {appt.time}
                 </Box>
               </TableCell>
                             <TableCell sx={{ padding: '12px 16px' }}>
                 <Chip 
                   label={appt.type === 'הידרותרפיה' ? t('appointments.hydrotherapy') :
                          appt.type === 'פיזיותרפיה' ? t('appointments.physiotherapy') :
                          appt.type === 'עיסוי טיפולי' ? t('appointments.therapeuticMassage') :
                          appt.type === 'אחר' ? t('appointments.other') : appt.type} 
                   color="primary" 
                   size="small"
                   variant="outlined"
                   sx={{ fontWeight: 'medium' }}
                 />
               </TableCell>
              {/* {user?.role?.toLowerCase() === "admin" && ( // This block is removed as per new_code
                <>
                  <TableCell>{getPatientDisplayName(appt.clientId)}</TableCell>
                  <TableCell>{appt.employeeId}</TableCell>
                </>
              )} */}
                             <TableCell sx={{ padding: '12px 16px' }}>{appt.notes || "-"}</TableCell>
              {/* Actions column removed as per new code */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AppointmentsTable;
