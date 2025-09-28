/**
 * Internationalization utilities for AquaCare Frontend
 */

import { Language } from '../services/translation';

/**
 * Get CSS text direction based on language
 */
export const getTextDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'he' ? 'rtl' : 'ltr';
};

/**
 * Get CSS text alignment based on language
 */
export const getTextAlign = (language: Language): 'left' | 'right' => {
  return language === 'he' ? 'right' : 'left';
};

/**
 * Get opposite text alignment (useful for icons, numbers)
 */
export const getOppositeAlign = (language: Language): 'left' | 'right' => {
  return language === 'he' ? 'left' : 'right';
};

/**
 * Get locale string for date/number formatting
 */
export const getLocale = (language: Language): string => {
  const locales = {
    en: 'en-US',
    he: 'he-IL'
  };
  return locales[language];
};

/**
 * Get currency code for language
 */
export const getCurrency = (language: Language): string => {
  const currencies = {
    en: 'USD',
    he: 'ILS'
  };
  return currencies[language];
};

/**
 * Apply RTL/LTL styles to MUI theme or component
 */
export const getDirectionalStyles = (language: Language) => {
  const isRTL = language === 'he';
  
  return {
    direction: getTextDirection(language),
    textAlign: getTextAlign(language),
    // Margin/padding helpers
    marginLeft: isRTL ? 'marginRight' : 'marginLeft',
    marginRight: isRTL ? 'marginLeft' : 'marginRight',
    paddingLeft: isRTL ? 'paddingRight' : 'paddingLeft',
    paddingRight: isRTL ? 'paddingLeft' : 'paddingRight',
    // Positioning helpers
    left: isRTL ? 'right' : 'left',
    right: isRTL ? 'left' : 'right',
    // Transform for icons/arrows
    transform: isRTL ? 'scaleX(-1)' : 'none'
  };
};

/**
 * Format date according to language
 */
export const formatDate = (date: Date, language: Language, options?: Intl.DateTimeFormatOptions): string => {
  const locale = getLocale(language);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
};

/**
 * Format time according to language
 */
export const formatTime = (date: Date, language: Language): string => {
  const locale = getLocale(language);
  return date.toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Format number according to language
 */
export const formatNumber = (number: number, language: Language): string => {
  const locale = getLocale(language);
  return number.toLocaleString(locale);
};

/**
 * Format currency according to language
 */
export const formatCurrency = (amount: number, language: Language): string => {
  const locale = getLocale(language);
  const currency = getCurrency(language);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Get appropriate font family for language
 */
export const getFontFamily = (language: Language): string => {
  const fonts = {
    en: '"Roboto", "Helvetica", "Arial", sans-serif',
    he: '"Assistant", "Rubik", "Arial", sans-serif'
  };
  return fonts[language];
};

/**
 * Helper to create language-aware MUI theme direction
 */
export const createMuiDirection = (language: Language) => {
  return getTextDirection(language);
};

/**
 * Pluralization helper (basic implementation)
 */
export const pluralize = (count: number, singular: string, plural: string, language: Language): string => {
  // Hebrew has different pluralization rules, but for simplicity using basic logic
  if (language === 'he') {
    // Hebrew: 1 = singular, 2 = dual (often same as plural), 3+ = plural
    return count === 1 ? singular : plural;
  } else {
    // English: 1 = singular, everything else = plural
    return count === 1 ? singular : plural;
  }
};

/**
 * Get reading order (for layout positioning)
 */
export const getFlexDirection = (language: Language): 'row' | 'row-reverse' => {
  return language === 'he' ? 'row-reverse' : 'row';
};

/**
 * Helper for conditional styling based on language direction
 */
export const conditionalStyle = <T>(
  language: Language,
  ltrStyle: T,
  rtlStyle: T
): T => {
  return language === 'he' ? rtlStyle : ltrStyle;
};

/**
 * Convert English digits to Hebrew digits (if needed)
 */
export const localizeDigits = (text: string, language: Language): string => {
  if (language !== 'he') return text;
  
  // Hebrew doesn't typically use different digits, but this could be extended
  return text;
};

/**
 * Get appropriate keyboard layout direction
 */
export const getInputDirection = (language: Language): 'ltr' | 'rtl' => {
  return getTextDirection(language);
}; 