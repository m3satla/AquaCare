import React from "react";
import { Container, Typography } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useTranslation } from "../hooks/useTranslation";

const ChangePasswordPage: React.FC = () => {
  const { t, direction } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ direction }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('auth.changePassword')}
      </Typography>
      <ChangePasswordForm />
    </Container>
  );
};

export default ChangePasswordPage;
