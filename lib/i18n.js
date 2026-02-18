// Internationalization utility functions

// Supported locales
export const locales = ['en', 'th', 'zh'];
export const defaultLocale = 'en';

// Locale configurations
export const localeConfig = {
  en: {
    name: 'English',
    flag: '🇬🇧',
    direction: 'ltr'
  },
  th: {
    name: 'ไทย',
    flag: '🇹🇭',
    direction: 'ltr'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    direction: 'ltr'
  }
};

// Get dictionary for a specific locale
export async function getDictionary(locale) {
  // Validate locale
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  
  try {
    const dictionary = await import(`@/dictionaries/${validLocale}.json`);
    return dictionary.default;
  } catch (error) {
    console.error(`Error loading dictionary for ${validLocale}:`, error);
    // Fallback to default locale
    const fallbackDict = await import(`@/dictionaries/${defaultLocale}.json`);
    return fallbackDict.default;
  }
}

// Helper function to get localized field from database row
export function getLocalizedField(row, fieldName, locale) {
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  const localizedFieldName = `${fieldName}_${validLocale}`;
  
  // Return localized field if it exists, otherwise fallback to English
  return row[localizedFieldName] || row[`${fieldName}_en`] || row[fieldName] || '';
}

// Helper to replace locale in pathname
export function replaceLocaleInPath(pathname, newLocale) {
  const segments = pathname.split('/').filter(Boolean);
  
  // If first segment is a locale, replace it
  if (segments.length > 0 && locales.includes(segments[0])) {
    segments[0] = newLocale;
    return '/' + segments.join('/');
  }
  
  // Otherwise, prepend the new locale
  return `/${newLocale}${pathname}`;
}
