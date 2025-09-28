import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL, direction } = useTranslation();

  return (
    <Container sx={{ mt: 4, direction }}>
      <Typography variant="h4" sx={{ textAlign: isRTL ? 'right' : 'left' }}>
        {t('dashboard.adminPanel')}
      </Typography>

      <Box sx={{ mt: 3, display: "flex", gap: 2, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/sensor-status")}>
            {t('dashboard.sensorStatus')}
          </Button>
        </motion.div>

        <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Button variant="contained" color="secondary" onClick={() => navigate("/pool-users")}>
            {t('dashboard.poolUsers')}
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AdminPanel;
