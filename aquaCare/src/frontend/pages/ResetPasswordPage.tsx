import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useTranslation } from "../hooks/useTranslation";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { token: urlToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');

  // בדיקה אם יש token ב-URL parameters או ב-query string
  const hasToken = urlToken || queryToken;

  // אם יש token, זה אומר שמגיעים מקישור במייל - מציגים טופס איפוס סיסמה
  if (hasToken) {
    return <ResetPasswordForm />;
  }

  // אם אין token, זה אומר שמגיעים מ"שכחתי סיסמה" - מציגים טופס שליחת מייל
  return <ForgotPasswordForm />;
};

export default ResetPasswordPage;
