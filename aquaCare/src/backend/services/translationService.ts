import fs from 'fs';
import path from 'path';

export type Language = 'en' | 'he';

interface TranslationDictionary {
  [key: string]: any;
}

class BackendTranslationService {
  private translations: Record<Language, TranslationDictionary> = {
    en: {},
    he: {}
  };
  private defaultLanguage: Language = 'he';
  private langDir: string;

  constructor() {
    this.langDir = path.join(__dirname, '../lang');
    this.loadAllTranslations();
  }

  /**
   * Load all translation files
   */
  private loadAllTranslations(): void {
    try {
      const languages: Language[] = ['en', 'he'];
      
      languages.forEach(lang => {
        const langPath = path.join(this.langDir, `${lang}.json`);
        if (fs.existsSync(langPath)) {
          const content = fs.readFileSync(langPath, 'utf-8');
          this.translations[lang] = JSON.parse(content);
          console.log(`✅ Loaded ${lang} translations`);
        } else {
          console.warn(`⚠️ Translation file not found: ${langPath}`);
        }
      });
    } catch (error) {
      console.error('❌ Error loading translations:', error);
    }
  }

  /**
   * Reload translations from files (useful for dynamic updates)
   */
  public reloadTranslations(): void {
    this.loadAllTranslations();
  }

  /**
   * Get translation by key path
   * @param keyPath - dot notation key path (e.g., "auth.loginSuccess")
   * @param language - target language
   * @param fallback - fallback text if key not found
   */
  public t(keyPath: string, language: Language = this.defaultLanguage, fallback?: string): string {
    const keys = keyPath.split('.');
    let current: any = this.translations[language];

    // Navigate through nested keys
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Key not found, try fallback language
        if (language !== 'en') {
          return this.t(keyPath, 'en', fallback);
        }
        
        console.warn(`⚠️ Translation key not found: ${keyPath} for language: ${language}`);
        return fallback || keyPath;
      }
    }

    return typeof current === 'string' ? current : (fallback || keyPath);
  }

  /**
   * Get translation with parameters
   * @param keyPath - dot notation key path
   * @param params - parameters to replace in translation
   * @param language - target language
   * @param fallback - fallback text
   */
  public tp(
    keyPath: string, 
    params: Record<string, string | number>, 
    language: Language = this.defaultLanguage, 
    fallback?: string
  ): string {
    let translation = this.t(keyPath, language, fallback);
    
    // Replace parameters in the translation
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(`{${key}}`, String(value));
    });

    return translation;
  }

  /**
   * Get all translations for a namespace
   * @param namespace - namespace key (e.g., "validation")
   * @param language - target language
   */
  public getNamespace(namespace: string, language: Language = this.defaultLanguage): TranslationDictionary {
    const current = this.translations[language];
    return (current && current[namespace]) || {};
  }

  /**
   * Check if a translation key exists
   * @param keyPath - dot notation key path
   * @param language - target language
   */
  public hasTranslation(keyPath: string, language: Language = this.defaultLanguage): boolean {
    const keys = keyPath.split('.');
    let current: any = this.translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return false;
      }
    }

    return typeof current === 'string';
  }

  /**
   * Get available languages
   */
  public getAvailableLanguages(): Language[] {
    return Object.keys(this.translations) as Language[];
  }

  /**
   * Set default language
   * @param language - default language to use
   */
  public setDefaultLanguage(language: Language): void {
    this.defaultLanguage = language;
  }

  /**
   * Get current default language
   */
  public getDefaultLanguage(): Language {
    return this.defaultLanguage;
  }

  /**
   * Get translations for multiple keys at once
   * @param keyPaths - array of key paths
   * @param language - target language
   */
  public getMultiple(keyPaths: string[], language: Language = this.defaultLanguage): Record<string, string> {
    const result: Record<string, string> = {};
    
    keyPaths.forEach(keyPath => {
      result[keyPath] = this.t(keyPath, language);
    });

    return result;
  }

  /**
   * Get formatted error message with translation
   * @param errorKey - error key in translations
   * @param language - target language
   * @param details - additional error details
   */
  public getErrorMessage(errorKey: string, language: Language = this.defaultLanguage, details?: string): string {
    const baseMessage = this.t(`errors.${errorKey}`, language);
    return details ? `${baseMessage}: ${details}` : baseMessage;
  }

  /**
   * Get formatted success message with translation
   * @param successKey - success key in translations
   * @param language - target language
   * @param details - additional success details
   */
  public getSuccessMessage(successKey: string, language: Language = this.defaultLanguage, details?: string): string {
    const baseMessage = this.t(`success.${successKey}`, language);
    return details ? `${baseMessage}: ${details}` : baseMessage;
  }

  /**
   * Format response with translated messages
   * @param success - whether operation was successful
   * @param messageKey - key for the message
   * @param language - target language
   * @param data - additional data to include
   */
  public formatResponse(
    success: boolean, 
    messageKey: string, 
    language: Language = this.defaultLanguage,
    data?: any
  ) {
    const namespace = success ? 'success' : 'errors';
    const message = this.t(`${namespace}.${messageKey}`, language);
    
    return {
      success,
      message,
      data,
      language
    };
  }

  /**
   * Get validation messages for forms
   * @param language - target language
   */
  public getValidationMessages(language: Language = this.defaultLanguage): Record<string, string> {
    return this.getNamespace('validation', language);
  }

  /**
   * Get field labels for forms
   * @param language - target language
   */
  public getFieldLabels(language: Language = this.defaultLanguage): Record<string, string> {
    return this.getNamespace('fields', language);
  }

  /**
   * Debug method to get all loaded translations
   */
  public debugGetAllTranslations(): Record<Language, TranslationDictionary> {
    return this.translations;
  }
}

// Create singleton instance
const translationService = new BackendTranslationService();

// Export convenience functions
export const t = (keyPath: string, language?: Language, fallback?: string) => 
  translationService.t(keyPath, language, fallback);

export const tp = (keyPath: string, params: Record<string, string | number>, language?: Language, fallback?: string) => 
  translationService.tp(keyPath, params, language, fallback);

export const getNamespace = (namespace: string, language?: Language) => 
  translationService.getNamespace(namespace, language);

export const hasTranslation = (keyPath: string, language?: Language) => 
  translationService.hasTranslation(keyPath, language);

export const getErrorMessage = (errorKey: string, language?: Language, details?: string) => 
  translationService.getErrorMessage(errorKey, language, details);

export const getSuccessMessage = (successKey: string, language?: Language, details?: string) => 
  translationService.getSuccessMessage(successKey, language, details);

export const formatResponse = (success: boolean, messageKey: string, language?: Language, data?: any) => 
  translationService.formatResponse(success, messageKey, language, data);

export const getValidationMessages = (language?: Language) => 
  translationService.getValidationMessages(language);

export const getFieldLabels = (language?: Language) => 
  translationService.getFieldLabels(language);

export const reloadTranslations = () => translationService.reloadTranslations();

export default translationService; 