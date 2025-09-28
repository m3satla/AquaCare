import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  setFontSize: () => {},
  toggleHighContrast: () => {},
  toggleReducedMotion: () => {},
  resetSettings: () => {},
});

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    console.log('🔧 Applying accessibility settings:', settings);
    
    // Font size
    switch (settings.fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }

    // High contrast - remove any existing filter styles that might conflict
    const body = document.body;
    if (settings.highContrast) {
      console.log('🎨 Enabling high contrast mode');
      root.classList.add('high-contrast');
      // Remove any old filter styles
      body.style.filter = '';
    } else {
      console.log('🎨 Disabling high contrast mode');
      root.classList.remove('high-contrast');
      // Clean up any old filter styles
      body.style.filter = '';
    }

    // Reduced motion
    if (settings.reducedMotion) {
      console.log('🏃‍♂️ Enabling reduced motion');
      root.classList.add('reduced-motion');
    } else {
      console.log('🏃‍♂️ Disabling reduced motion');
      root.classList.remove('reduced-motion');
    }

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    console.log('💾 Saved accessibility settings to localStorage');
  }, [settings]);

  const setFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  };

  const value: AccessibilityContextType = {
    settings,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;
