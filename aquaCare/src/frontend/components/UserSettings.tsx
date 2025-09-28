import React from "react";
import { Box, Typography, ButtonGroup, Button, FormControlLabel, Switch } from "@mui/material";
import { useAccessibility, FontSize } from "../context/AccessibilityContext";

const UserSettings = () => {
  const { settings, setFontSize, toggleHighContrast, toggleReducedMotion } = useAccessibility();

  const getFontSizeLabel = (size: FontSize) => {
    switch (size) {
      case 'small': return 'קטן';
      case 'medium': return 'בינוני';
      case 'large': return 'גדול';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">הגדרות נגישות</Typography>

      {/* Font Size Controls */}
      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom>גודל טקסט</Typography>
        <ButtonGroup fullWidth>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <Button
              key={size}
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
          />
        }
        label="ניגודיות גבוהה"
        sx={{ mt: 3, display: 'block' }}
      />

      {/* Reduced Motion Toggle */}
      <FormControlLabel
        control={
          <Switch 
            checked={settings.reducedMotion} 
            onChange={toggleReducedMotion} 
          />
        }
        label="הפחתת תנועה"
        sx={{ mt: 2, display: 'block' }}
      />

    </Box>
  );
};

export default UserSettings;