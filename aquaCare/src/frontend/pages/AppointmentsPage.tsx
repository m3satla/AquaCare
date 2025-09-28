// src/pages/AppointmentsPage.tsx

import React from "react";
import AppointmentsTable from "../components/AppointmentsTable";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "../hooks/useTranslation";

const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('appointments.title')}
      </Typography>
      <AppointmentsTable />
    </Container>
  );
};

export default AppointmentsPage;
