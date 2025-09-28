import React, { useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useTranslation();

  const items = useMemo(() => [
    // ניהול משתמשים ובריכות
    { label: t('dashboard.poolUsers'), path: "/pool-users", color: "secondary" as const },
    { label: t('navigation.receivedRequests'), path: "/manager-requests", color: "info" as const },
    { label: t('lockedUsers.lockedUsers'), path: "/locked-users", color: "error" as const },
    
    // ניהול תורים ופעילות
    { label: t('appointments.showAppointments'), path: "/appointments", color: "primary" as const },
    { label: t('activityLog.activityLog'), path: "/activity-log", color: "warning" as const },
    { label: t('dashboard.workSchedule'), path: "/work-schedule", color: "info" as const },
    
    // ניהול מערכות
    { label: t('dashboard.sensorStatus'), path: "/sensor-status", color: "success" as const },
    { label: t('dashboard.facilityStatus'), path: "/facility-status", color: "info" as const },
    { label: t('dashboard.optimizationManagement'), path: "/optimizationmanager", color: "primary" as const },
    
    // דוחות וסטטיסטיקות
    { label: t('dashboard.detailedReports'), path: "/StatisticsDashboard", color: "success" as const },
    { label: t('dashboard.dailySummary'), path: "/dailysummary", color: "secondary" as const },
    
    // ניהול תקשורת
    { label: t('dashboard.sendReminders'), path: "/reminder", color: "warning" as const },
    { label: t('dashboard.emergencyManagement'), path: "/admin-emergency-manager", color: "error" as const },
  ], [t]);

  return (
    <Container sx={{ mt: 4, direction }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: isRTL ? "right" : "left", mb: 3 }}
      >
        {t('dashboard.adminPanel')} - {t('dashboard.allToolsInOnePlace')}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {items.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 + i * 0.1 }}
            style={{ flex: "1 1 250px", maxWidth: 300 }}
          >
            <Button
              fullWidth
              variant="contained"
              color={item.color}
              onClick={() => navigate(item.path)}
              sx={{ py: 2 }}
            >
              {item.label}
            </Button>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
