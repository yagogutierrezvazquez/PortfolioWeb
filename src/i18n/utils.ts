/**
 * @file utils.ts
 * @description Helper functions for internationalization (i18n).
 * Provides logic to detect the current language from the URL and 
 * retrieve the corresponding translations from the dictionary.
 */

import { ui, defaultLang } from './ui';

/**
 * Extracts the language code from the current URL.
 * * @param {URL} url - The URL object (Astro.url).
 * @returns {keyof typeof ui} The detected language code (e.g., 'es' or 'en').
 * @example 
 * getLangFromUrl(new URL('/es/about')) // returns 'es'
 * getLangFromUrl(new URL('/about'))    // returns 'en' (default)
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  
  // Checks if the first segment of the path is a supported language
  if (lang in ui) return lang as keyof typeof ui;
  
  // Fallback to the default language defined in ui.ts
  return defaultLang;
}

/**
 * Higher-order function that returns a translation tool for a specific language.
 * * @param {keyof typeof ui} lang - The current language code.
 * @returns {Function} The translation function 't'.
 * @example
 * const t = useTranslations('es');
 * t('nav.home') // returns 'Inicio'
 */
export function useTranslations(lang: keyof typeof ui) {
  /**
   * Retrieves a string from the dictionary based on a key.
   * * @param {keyof typeof ui[typeof defaultLang]} key - The dictionary key.
   * @returns {string} The translated string or the fallback in default language.
   */
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    // Returns the translation for the current lang, or falls back to defaultLang if missing
    return ui[lang][key] || ui[defaultLang][key];
  };
}