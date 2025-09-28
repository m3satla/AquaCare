import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  ButtonGroup,
  Button,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Accessibility,
  TextFields,
  Contrast,
  MotionPhotosOff,
  Brightness4,
  Brightness7,
  Language,
  Refresh,
  Help,
} from '@mui/icons-material';
import { useAccessibility } from '../context/AccessibilityContext';
import { useDarkMode } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import { useAccessibilityHelp } from './AccessibilityHelp';

const AccessibilityMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { settings, setFontSize, toggleHighContrast, toggleReducedMotion, resetSettings } = useAccessibility();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { t, currentLanguage } = useTranslation();
  const { showHelp, AccessibilityHelpDialog } = useAccessibilityHelp();

  // Force re-render when language changes
  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setForceUpdate(prev => prev + 1); // Force re-render when opening menu
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFontSizeLabel = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return t('accessibility.fontSize.small', 'קטן');
      case 'medium': return t('accessibility.fontSize.medium', 'בינוני');
      case 'large': return t('accessibility.fontSize.large', 'גדול');
    }
  };

  return (
    <>
      <Tooltip key={`${currentLanguage}-${forceUpdate}-tooltip`} title={t('accessibility.menu.title', 'תפריט נגישות')}>
        <IconButton
          key={`${currentLanguage}-${forceUpdate}`} // Force re-render when language changes
          onClick={handleOpen}
          color="inherit"
          aria-label={t('accessibility.menu.title', 'תפריט נגישות')}
          sx={{ ml: 1 }}
        >
          <Accessibility />
        </IconButton>
      </Tooltip>

      <Menu
        key={`${currentLanguage}-${forceUpdate}`} // Force re-render when language changes
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 280, p: 1 }
        }}
      >
        <Paper key={`${currentLanguage}-${forceUpdate}-paper`} sx={{ p: 2, mb: 1 }}>
          <Typography key={`${currentLanguage}-${forceUpdate}-title`} variant="h6" gutterBottom>
            {t('accessibility.menu.title', 'נגישות')}
          </Typography>

          {/* Font Size Controls */}
          <Box sx={{ mb: 2 }}>
            <Typography key={`${currentLanguage}-${forceUpdate}-fontSize-title`} variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TextFields sx={{ mr: 1 }} />
              {t('accessibility.fontSize.title', 'גודל טקסט')}
            </Typography>
            <ButtonGroup size="small" fullWidth>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={`${currentLanguage}-${forceUpdate}-${size}`}
                  variant={settings.fontSize === size ? 'contained' : 'outlined'}
                  onClick={() => setFontSize(size)}
                >
                  {getFontSizeLabel(size)}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* High Contrast Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.highContrast}
                onChange={toggleHighContrast}
                icon={<Contrast />}
                checkedIcon={<Contrast />}
              />
            }
            label={
              <Box key={`${currentLanguage}-${forceUpdate}-highContrast-label`} sx={{ display: 'flex', alignItems: 'center' }}>
                <Contrast sx={{ mr: 1 }} />
                {t('accessibility.highContrast', 'ניגודיות גבוהה')}
              </Box>
            }
            sx={{ mb: 1, width: '100%' }}
          />

          {/* Dark Mode Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                icon={<Brightness7 />}
                checkedIcon={<Brightness4 />}
              />
            }
            label={
              <Box key={`${currentLanguage}-${forceUpdate}-darkMode-label`} sx={{ display: 'flex', alignItems: 'center' }}>
                {darkMode ? <Brightness4 sx={{ mr: 1 }} /> : <Brightness7 sx={{ mr: 1 }} />}
                {t('accessibility.darkMode', 'מצב כהה')}
              </Box>
            }
            sx={{ mb: 1, width: '100%' }}
          />

          {/* Reduced Motion Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.reducedMotion}
                onChange={toggleReducedMotion}
                icon={<MotionPhotosOff />}
                checkedIcon={<MotionPhotosOff />}
              />
            }
            label={
              <Box key={`${currentLanguage}-${forceUpdate}-reducedMotion-label`} sx={{ display: 'flex', alignItems: 'center' }}>
                <MotionPhotosOff sx={{ mr: 1 }} />
                {t('accessibility.reducedMotion', 'הפחתת תנועה')}
              </Box>
            }
            sx={{ mb: 2, width: '100%' }}
          />

          <Divider sx={{ my: 1 }} />

          {/* Language Switcher */}
          <Box sx={{ mb: 2 }}>
            <Typography key={`${currentLanguage}-${forceUpdate}-language-title`} variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Language sx={{ mr: 1 }} />
              {t('accessibility.language', 'שפה')}
            </Typography>
            <LanguageSwitcher key={`${currentLanguage}-${forceUpdate}-switcher`} variant="outlined" size="small" showLabel={false} />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Help Button */}
          <Button
            key={`${currentLanguage}-${forceUpdate}-help`}
            fullWidth
            variant="text"
            onClick={() => {
              showHelp();
              handleClose();
            }}
            startIcon={<Help />}
            size="small"
            sx={{ mb: 1 }}
          >
            {t('accessibility.help', 'עזרה')}
          </Button>

          {/* Reset Button */}
          <Button
            key={`${currentLanguage}-${forceUpdate}-reset`}
            fullWidth
            variant="outlined"
            onClick={() => {
              resetSettings();
              handleClose();
            }}
            startIcon={<Refresh />}
            size="small"
          >
            {t('accessibility.reset', 'איפוס הגדרות')}
          </Button>
        </Paper>
      </Menu>

      {/* Help Dialog */}
      <AccessibilityHelpDialog key={`${currentLanguage}-${forceUpdate}-help-dialog`} />
    </>
  );
};

export default AccessibilityMenu;
