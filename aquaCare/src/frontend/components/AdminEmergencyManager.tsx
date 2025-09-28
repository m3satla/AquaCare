import React, { useEffect, useState } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { isEmergencyMode, setEmergencyMode } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";

const AdminEmergencyManager: React.FC = () => {
  const [status, setStatus] = useState<boolean | null>(null);
  const { user } = useAuth(); // Get the logged in admin's identity
  const { t, direction } = useTranslation();

  useEffect(() => {
    fetchEmergencyStatus();
  }, []);

  const fetchEmergencyStatus = async () => {
    try {
      console.log("🔍 Fetching emergency status...");
      const current = await isEmergencyMode();
      console.log("📊 Current emergency status:", current);
      setStatus(current);
    } catch (err) {
      console.error("❌ Error fetching emergency status:", err);
    }
  };

  const handleToggle = async () => {
    if (status === null) return;
    const newStatus = !status;

    try {
      await setEmergencyMode(newStatus, "manual", user?.id); // Send with admin ID
      setStatus(newStatus);
      console.log(`📢 Emergency mode ${newStatus ? "activated" : "deactivated"} by admin`);
      alert(t(newStatus ? 'emergency.activated' : 'emergency.deactivated'));
    } catch (err) {
      console.error("❌ Error updating emergency status:", err);
    }
  };

  return (
    <Container sx={{ mt: 4, direction }}>
      <Typography variant="h5" gutterBottom>
        {t('emergency.manualControl')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {t('emergency.currentStatus')}{" "}
          <strong style={{ color: status ? "red" : "green" }}>
            {status ? t('emergency.active') : t('emergency.inactive')}
          </strong>
        </Typography>
      </Box>

      <Button
        variant="contained"
        color={status ? "error" : "success"}
        onClick={handleToggle}
        sx={{ fontSize: 16, fontWeight: "bold", textTransform: "none" }}
      >
        {status ? t('emergency.deactivate') : t('emergency.activate')}
      </Button>
    </Container>
  );
};

export default AdminEmergencyManager;
