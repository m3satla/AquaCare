import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import { t } from "../services/translation";

const ProtectedEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/login"); // ❌ משתמש לא מחובר
      return;
    }

    const user = JSON.parse(storedUser);
    const userRole = user?.role;

    if (userRole && (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "therapist")) {
      setAuthorized(true); // ✅ מורשה
    } else {
      navigate("/unauthorized"); // ❌ לא מורשה
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <CircularProgress sx={{ m: 3 }} />;
  if (!authorized) return null;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>{t('employee.protectedEmployeeArea')}</Typography>
      <Typography>{t('employee.protectedWelcomeMessage')}</Typography>
    </Container>
  );
};

export default ProtectedEmployeePage;
