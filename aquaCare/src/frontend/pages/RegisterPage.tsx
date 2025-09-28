import React from "react";
import { Container, Typography } from "@mui/material";
import RegisterForm from "../components/RegisterForm";
import { t } from "../services/translation";

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {t('auth.registrationForm')}
      </Typography>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
