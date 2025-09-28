import { useState, useEffect } from 'react';
import translationService, { Language } from '../services/translation';
import React from 'react';

/**
 * React hook for translation functionality
 * Provides reactive translations that update when language changes
 */
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    translationService.getCurrentLanguage()
  );
  const [isReady, setIsReady] = useState<boolean>(translationService.isReady());

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setCurrentLanguage(event.detail);
    };

    // Listen for translation readiness
    const handleTranslationReady = () => {
      setIsReady(true);
    };

    // Add event listeners
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    window.addEventListener('translationsReady', handleTranslationReady);
    
    // Check initial readiness
    if (translationService.isReady()) {
      setIsReady(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      window.removeEventListener('translationsReady', handleTranslationReady);
    };
  }, []);

  // Translation function - recreate when language changes
  const t = React.useCallback((keyPath: string, fallback?: string, p0?: { count: number; }): string => {
    const result = translationService.t(keyPath, fallback);
    return result;
  }, [currentLanguage]);

  // Translation with parameters - recreate when language changes
  const tp = React.useCallback((keyPath: string, params: Record<string, string | number>, fallback?: string): string => {
    const result = translationService.tp(keyPath, params, fallback);
    return result;
  }, [currentLanguage]);

  // Change language
  const changeLanguage = React.useCallback(async (language: Language): Promise<void> => {
    await translationService.setLanguage(language);
    setCurrentLanguage(language);
  }, []);

  // Get namespace
  const getNamespace = React.useCallback((namespace: string) => {
    return translationService.getNamespace(namespace);
  }, [currentLanguage]);

  // Reload translations
  const reloadTranslations = React.useCallback(async (): Promise<void> => {
    await translationService.reloadTranslations();
  }, []);



  // Utility functions - recreate when language changes
  const isRTL = React.useMemo(() => () => translationService.isRTL(), [currentLanguage]);
  const direction = React.useMemo(() => () => translationService.getDirection(), [currentLanguage]);
  const formatDate = React.useMemo(() => translationService.formatDate.bind(translationService), [currentLanguage]);
  const formatNumber = React.useMemo(() => translationService.formatNumber.bind(translationService), [currentLanguage]);
  const formatCurrency = React.useMemo(() => translationService.formatCurrency.bind(translationService), [currentLanguage]);

  // Available languages - recreate when language changes
  const availableLanguages = React.useMemo(() => translationService.getAvailableLanguages(), [currentLanguage]);

  return {
    // Translation functions
    t,
    tp,
    getNamespace,

    // Language management
    currentLanguage,
    changeLanguage,
    reloadTranslations,
    availableLanguages,

    // Utility functions
    isRTL,
    direction,
    formatDate,
    formatNumber,
    formatCurrency,

    // State
    isReady,
    isLoading: !isReady
  };
}; 