import React from "react";
import { Container, Typography } from "@mui/material";
import { t } from "../services/translation";

const NotFound: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" color="error">
        {t('pages.notFound')}
      </Typography>
    </Container>
  );
};

export default NotFound;
