// src/pages/FeedbackPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import { Box, Typography } from "@mui/material";

const FeedbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const appointmentId = params.get("appointmentId");

  return (
    <Box>
      {appointmentId ? (
        <FeedbackForm appointmentId={appointmentId} />
      ) : (
        <Typography variant="h6" textAlign="center" mt={4}>
          ⚠️ מזהה הפגישה חסר.
        </Typography>
      )}
    </Box>
  );
};

export default FeedbackPage;
