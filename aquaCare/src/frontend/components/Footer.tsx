
import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

const Footer: React.FC = () => {
  const { t, isRTL, direction } = useTranslation();

  return (
    <Box sx={{
      width: '100%',
      bgcolor: 'primary.main',
      color: '#fff',
      py: 2,
      px: 2,
      textAlign: 'center'
    }}>
      <Typography variant="body2">{t('footer.copyright')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
        <Link to="/privacy" style={{ color: 'white' }}>{t('footer.privacy')}</Link>
        <Link to="/terms" style={{ color: 'white' }}>{t('footer.terms')}</Link>
        <Link to="/developer-contact" style={{ color: 'white' }}>{t('footer.contact')}</Link>
      </Box>
    </Box>
  );
};

export default Footer;
