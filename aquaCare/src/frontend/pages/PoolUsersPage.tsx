import React from "react";
import { Container, Typography } from "@mui/material";
import PoolUsersList from "../components/PoolUsersList";
import { useTranslation } from "../hooks/useTranslation";

const PoolUsersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t('poolUsers.registeredPoolUsers')}
      </Typography>
      <PoolUsersList />
    </Container>
  );
};

export default PoolUsersPage;
