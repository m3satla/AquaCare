import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Help,
  TextFields,
  Contrast,
  DarkMode,
  Language,
  MotionPhotosOff,
  Accessibility,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close,
} from '@mui/icons-material';
import { useTranslation } from '../hooks/useTranslation';

interface AccessibilityHelpProps {
  open: boolean;
  onClose: () => void;
}

const AccessibilityHelp: React.FC<AccessibilityHelpProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <TextFields />,
      title: t('accessibility.help.fontSize.title', 'גודל טקסט'),
      description: t('accessibility.help.fontSize.description', 'שלט על גודל הטקסט באתר - קטן, בינוני או גדול'),
      shortcut: 'Ctrl + / Ctrl -',
    },
    {
      icon: <Contrast />,
      title: t('accessibility.help.contrast.title', 'ניגודיות גבוהה'),
      description: t('accessibility.help.contrast.description', 'הפעל מצב ניגודיות גבוהה לראות טוב יותר'),
      shortcut: '',
    },
    {
      icon: <DarkMode />,
      title: t('accessibility.help.darkMode.title', 'מצב כהה'),
      description: t('accessibility.help.darkMode.description', 'החלף בין מצב בהיר לכהה'),
      shortcut: '',
    },
    {
      icon: <Language />,
      title: t('accessibility.help.language.title', 'שפה'),
      description: t('accessibility.help.language.description', 'החלף בין עברית לאנגלית'),
      shortcut: '',
    },
    {
      icon: <MotionPhotosOff />,
      title: t('accessibility.help.reducedMotion.title', 'הפחתת תנועה'),
      description: t('accessibility.help.reducedMotion.description', 'הפחת אנימציות ותנועות באתר'),
      shortcut: '',
    },
  ];

  const keyboardShortcuts = [
    {
      keys: 'Tab',
      description: t('accessibility.help.shortcuts.tab', 'נווט בין רכיבים'),
    },
    {
      keys: 'Enter / Space',
      description: t('accessibility.help.shortcuts.activate', 'הפעל כפתורים וקישורים'),
    },
    {
      keys: 'Esc',
      description: t('accessibility.help.shortcuts.escape', 'סגור תפריטים ודיאלוגים'),
    },
    {
      keys: 'Alt + M',
      description: t('accessibility.help.shortcuts.menu', 'פתח תפריט ראשי'),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="accessibility-help-title"
    >
      <DialogTitle id="accessibility-help-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Accessibility sx={{ mr: 1 }} />
            {t('accessibility.help.title', 'מדריך נגישות')}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" paragraph>
          {t('accessibility.help.intro', 'האתר שלנו מספק מגוון כלים לנגישות כדי לשפר את חוויית הגלישה שלך.')}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          {t('accessibility.help.features.title', 'תכונות נגישות זמינות')}
        </Typography>

        <List>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  {feature.icon}
                </ListItemIcon>
                <ListItemText
                  primary={feature.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                      {feature.shortcut && (
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          קיצור דרך: {feature.shortcut}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < features.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          {t('accessibility.help.shortcuts.title', 'קיצורי מקלדת')}
        </Typography>

        <List>
          {keyboardShortcuts.map((shortcut, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          backgroundColor: 'grey.200',
                          padding: '4px 8px',
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          minWidth: '100px',
                          textAlign: 'center',
                        }}
                      >
                        {shortcut.keys}
                      </Box>
                      <Typography variant="body2">
                        {shortcut.description}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < keyboardShortcuts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>{t('accessibility.help.tip.title', 'טיפ:')}</strong>{' '}
            {t('accessibility.help.tip.content', 'ניתן לגשת לתפריט הנגישות בכל עת על ידי לחיצה על הסמל 🔗 בפינה הימנית העליונה.')}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t('common.close', 'סגור')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Hook for easy access to the help dialog
export const useAccessibilityHelp = () => {
  const [open, setOpen] = useState(false);

  const showHelp = () => setOpen(true);
  const hideHelp = () => setOpen(false);

  const AccessibilityHelpDialog = () => (
    <AccessibilityHelp open={open} onClose={hideHelp} />
  );

  return {
    showHelp,
    hideHelp,
    AccessibilityHelpDialog,
  };
};

export default AccessibilityHelp;
