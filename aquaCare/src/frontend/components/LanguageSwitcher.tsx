import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { Language } from '../services/translation';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'outlined',
  size = 'small',
  showLabel = false
}) => {
  const { currentLanguage, changeLanguage, availableLanguages, t, isReady } = useTranslation();

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value as Language;
    await changeLanguage(selectedLanguage);
  };

  if (!isReady) {
    return (
      <Box sx={{ minWidth: 80, height: 40, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
      <FormControl fullWidth size={size}>
        {showLabel && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('general.language')}
          </Typography>
        )}
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          variant={variant}
          renderValue={(value) => {
            const language = availableLanguages.find(lang => lang.code === value);
            return language ? language.nativeName : value;
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {availableLanguages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {language.nativeName}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher; 