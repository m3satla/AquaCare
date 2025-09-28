# Translation System Documentation

## Overview

The AquaCare frontend includes a comprehensive translation system that supports Hebrew and English languages. The system provides:

- **Centralized translation management** via backend API
- **React hooks** for reactive translations
- **RTL/LTR support** for proper text direction
- **Automatic language persistence** in localStorage
- **Fallback translations** when API is unavailable
- **Type-safe translation keys**

## File Structure

```
frontend/src/
├── services/
│   └── translation.ts        # Main translation service
├── hooks/
│   └── useTranslation.ts     # React hook for translations
├── components/
│   └── LanguageSwitcher.tsx  # Language selection component
└── utils/
    └── i18n.ts              # Internationalization utilities
```

## Quick Start

### 1. Basic Usage with Hook

```tsx
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const MyComponent: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('pages.welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>
        {t('navigation.home')}
      </button>
    </div>
  );
};
```

### 2. Direct Service Usage

```tsx
import { t, setLanguage } from '../services/translation';

// Simple translation
const welcomeText = t('pages.welcome');

// Translation with fallback
const title = t('pages.title', 'Default Title');

// Change language
await setLanguage('en');
```

### 3. Language Switcher Component

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

const Navbar: React.FC = () => {
  return (
    <div>
      <LanguageSwitcher variant="outlined" size="small" showLabel />
    </div>
  );
};
```

## Translation Keys

### Available Namespaces

- **navigation** - Menu items, navigation links
- **auth** - Login, registration, authentication
- **validation** - Form validation messages
- **buttons** - Common button labels
- **dashboard** - Admin dashboard items
- **sensors** - Sensor status and controls
- **emergency** - Emergency messages
- **booking** - Appointment booking
- **messages** - User messaging system
- **forms** - Form labels and options
- **pages** - Page titles and content
- **footer** - Footer content
- **groups** - User group management
- **requests** - User requests/complaints
- **summary** - Daily summary data
- **history** - Action history
- **settings** - Settings page
- **admin** - Admin functionality
- **general** - General UI elements

### Key Examples

```tsx
// Navigation
t('navigation.home')           // "עמוד הבית" / "Home"
t('navigation.booking')        // "הזמנת תור" / "Book Appointment"

// Authentication
t('auth.login')               // "התחברות" / "Login"
t('auth.email')              // "אימייל" / "Email"

// Validation
t('validation.fillAllFields') // "❌ יש למלא את כל השדות." / "Please fill all required fields."

// Buttons
t('buttons.submit')          // "שלח" / "Submit"
t('buttons.cancel')          // "ביטול" / "Cancel"

// With parameters
tp('booking.bookingSuccess', { date: '2024-01-15', time: '14:00' })
// "✅ התור נקבע בהצלחה בתאריך 2024-01-15 בשעה 14:00"
```

## Advanced Features

### 1. Translation with Parameters

```tsx
const { tp } = useTranslation();

// Template: "Hello {name}, you have {count} messages"
const message = tp('messages.welcome', { 
  name: 'John', 
  count: 5 
});
```

### 2. RTL/LTR Support

```tsx
const { isRTL, direction } = useTranslation();

const styles = {
  textAlign: isRTL ? 'right' : 'left',
  direction: direction, // 'rtl' or 'ltr'
};
```

### 3. Namespace Loading

```tsx
const { getNamespace } = useTranslation();

// Get all navigation translations
const navTranslations = getNamespace('navigation');
```

### 4. Date/Number Formatting

```tsx
const { formatDate, formatNumber, formatCurrency } = useTranslation();

const date = formatDate(new Date());     // "15 בינואר 2024" / "January 15, 2024"
const number = formatNumber(1234.56);    // "1,234.56" / "1,234.56"
const price = formatCurrency(99.99);     // "₪99.99" / "$99.99"
```

## Component Examples

### 1. Form with Translations

```tsx
import { TextField, Button } from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';

const LoginForm: React.FC = () => {
  const { t, isRTL } = useTranslation();

  return (
    <form style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <TextField
        label={t('auth.email')}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label={t('auth.password')}
        type="password"
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        {t('auth.login')}
      </Button>
    </form>
  );
};
```

### 2. Conditional Content

```tsx
const { t, currentLanguage } = useTranslation();

return (
  <div>
    <h1>{t('pages.welcome')}</h1>
    {currentLanguage === 'he' ? (
      <p>תוכן בעברית</p>
    ) : (
      <p>English content</p>
    )}
  </div>
);
```

### 3. Error Handling

```tsx
const MyComponent: React.FC = () => {
  const { t, isReady, isLoading } = useTranslation();

  if (isLoading) {
    return <div>{t('general.loading')}</div>;
  }

  if (!isReady) {
    return <div>Translation service not ready</div>;
  }

  return <div>{t('pages.content')}</div>;
};
```

## Styling for RTL/LTR

### 1. Using Utility Functions

```tsx
import { getDirectionalStyles, conditionalStyle } from '../utils/i18n';
import { useTranslation } from '../hooks/useTranslation';

const MyComponent: React.FC = () => {
  const { currentLanguage } = useTranslation();
  
  const styles = {
    ...getDirectionalStyles(currentLanguage),
    marginLeft: conditionalStyle(currentLanguage, '10px', '0px'),
    marginRight: conditionalStyle(currentLanguage, '0px', '10px'),
  };

  return <div style={styles}>Content</div>;
};
```

### 2. MUI Theme Integration

```tsx
import { createTheme, ThemeProvider } from '@mui/material';
import { createMuiDirection } from '../utils/i18n';
import { useTranslation } from '../hooks/useTranslation';

const App: React.FC = () => {
  const { currentLanguage } = useTranslation();
  
  const theme = createTheme({
    direction: createMuiDirection(currentLanguage),
  });

  return (
    <ThemeProvider theme={theme}>
      {/* Your app content */}
    </ThemeProvider>
  );
};
```

## Best Practices

### 1. Key Naming Convention

```
namespace.specific_key
```

Examples:
- `navigation.home` ✅
- `auth.loginForm` ✅
- `validation.emailRequired` ✅
- `home_page_title` ❌ (no namespace)

### 2. Always Use Fallbacks

```tsx
// Good
t('some.key', 'Default text')

// Better
t('some.key', 'Default text that makes sense in context')
```

### 3. Handle Loading States

```tsx
const { t, isReady } = useTranslation();

if (!isReady) {
  return <Skeleton />; // or loading component
}

return <div>{t('content.text')}</div>;
```

### 4. Avoid Hardcoded Strings

```tsx
// Bad
<Button>Submit</Button>

// Good
<Button>{t('buttons.submit')}</Button>
```

## API Integration

The translation system automatically loads translations from your backend API:

```
GET /lang/en     # Get all English translations
GET /lang/he     # Get all Hebrew translations
GET /lang/en/auth # Get English translations for 'auth' namespace
```

### Backend Response Format

```json
{
  "navigation": {
    "home": "Home",
    "login": "Login"
  },
  "auth": {
    "email": "Email",
    "password": "Password"
  }
}
```

## Configuration

### Change Backend URL

```tsx
// In translation.ts
private baseUrl: string = 'http://your-api-url';
```

### Default Language

```tsx
// In translation.ts
private currentLanguage: Language = 'he'; // Default to Hebrew
```

## Troubleshooting

### Common Issues

1. **Translation key not found**
   ```
   ⚠️ Translation key not found: navigation.unknown for language: he
   ```
   - Check if the key exists in your JSON files
   - Verify the key path is correct

2. **API connection failed**
   ```
   ❌ Error loading translations for he: Failed to fetch
   ```
   - Check backend is running on correct port
   - Verify CORS settings allow frontend origin

3. **Translations not updating**
   - Clear localStorage: `localStorage.removeItem('selectedLanguage')`
   - Reload translations: `translationService.reloadTranslations()`

### Debug Mode

```tsx
// Enable debug logging
localStorage.setItem('translation-debug', 'true');
```

## Migration Guide

### From Hardcoded Strings

1. **Find all hardcoded text**
   ```bash
   grep -r "ברוך הבא" src/
   ```

2. **Add to translation files**
   ```json
   {
     "pages": {
       "welcome": "ברוך הבא ל-AquaCare"
     }
   }
   ```

3. **Replace in components**
   ```tsx
   // Before
   <h1>ברוך הבא ל-AquaCare</h1>
   
   // After
   <h1>{t('pages.welcome')}</h1>
   ```

### Update Existing Components

1. Import the hook
2. Replace hardcoded strings
3. Add RTL/LTR support
4. Test in both languages

---

## Example: Complete Translated Component

```tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box,
  TextField 
} from '@mui/material';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ExampleComponent: React.FC = () => {
  const { 
    t, 
    tp, 
    currentLanguage, 
    isRTL, 
    direction,
    formatDate,
    formatCurrency 
  } = useTranslation();

  return (
    <Paper 
      sx={{ 
        p: 3, 
        direction: direction,
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      {/* Language Switcher */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <LanguageSwitcher />
      </Box>

      {/* Translated Content */}
      <Typography variant="h4" gutterBottom>
        {t('pages.welcome')}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {tp('general.currentDate', { 
          date: formatDate(new Date()) 
        })}
      </Typography>

      {/* Form Fields */}
      <TextField
        label={t('auth.email')}
        fullWidth
        margin="normal"
        sx={{ mb: 2 }}
      />

      <TextField
        label={t('auth.password')}
        type="password"
        fullWidth
        margin="normal"
        sx={{ mb: 3 }}
      />

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <Button variant="contained">
          {t('buttons.submit')}
        </Button>
        <Button variant="outlined">
          {t('buttons.cancel')}
        </Button>
      </Box>

      {/* Language-specific content */}
      {currentLanguage === 'he' && (
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          {t('general.hebrewNote')}
        </Typography>
      )}
    </Paper>
  );
};

export default ExampleComponent;
```

This translation system provides a robust foundation for internationalization in your AquaCare application! 