// Translation utility using free Google Translate gtx endpoint
// This module provides automatic translation functionality for tours and announcements

/**
 * Translate text using Google Translate's free gtx endpoint
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code ('th' or 'zh')
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, targetLang, sourceLang = 'en') {
  // Return original text if no translation needed
  if (!text || sourceLang === targetLang) {
    return text;
  }

  try {
    // Google Translate free gtx endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Translation failed for "${text}" to ${targetLang}:`, response.statusText);
      return text; // Return original text on error
    }
    
    const data = await response.json();
    
    // The gtx endpoint returns an array structure: [[[translated_text, original_text, ...]]]
    // We need to extract the translated text from the first element
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    
    console.warn(`Unexpected translation response format for "${text}" to ${targetLang}`);
    return text; // Return original text if response format is unexpected
  } catch (error) {
    console.error(`Translation error for "${text}" to ${targetLang}:`, error.message);
    return text; // Return original text on error
  }
}

/**
 * Translate tour fields (title, description, location) into Thai and Chinese
 * @param {Object} tourData - Tour data with English fields
 * @returns {Promise<Object>} - Tour data with all language fields
 */
async function translateTourFields(tourData) {
  const { title, description, location } = tourData;
  
  try {
    // Translate to Thai (th)
    const [title_th, description_th, location_th] = await Promise.all([
      translateText(title, 'th'),
      translateText(description, 'th'),
      translateText(location, 'th')
    ]);
    
    // Translate to Chinese (zh)
    const [title_zh, description_zh, location_zh] = await Promise.all([
      translateText(title, 'zh'),
      translateText(description, 'zh'),
      translateText(location, 'zh')
    ]);
    
    return {
      ...tourData,
      // English fields
      title_en: title,
      description_en: description,
      location_en: location,
      // Thai fields
      title_th,
      description_th,
      location_th,
      // Chinese fields
      title_zh,
      description_zh,
      location_zh
    };
  } catch (error) {
    console.error('Error translating tour fields:', error);
    // Return original data with English fields set if translation fails
    return {
      ...tourData,
      title_en: title,
      description_en: description,
      location_en: location,
      title_th: title,
      description_th: description,
      location_th: location,
      title_zh: title,
      description_zh: description,
      location_zh: location
    };
  }
}

/**
 * Translate announcement message into Thai and Chinese
 * @param {string} message - Announcement message in English
 * @returns {Promise<Object>} - Object with message in all languages
 */
async function translateAnnouncementMessage(message) {
  try {
    // Translate to Thai and Chinese in parallel
    const [message_th, message_zh] = await Promise.all([
      translateText(message, 'th'),
      translateText(message, 'zh')
    ]);
    
    return {
      message_en: message,
      message_th,
      message_zh
    };
  } catch (error) {
    console.error('Error translating announcement message:', error);
    // Return original message for all languages if translation fails
    return {
      message_en: message,
      message_th: message,
      message_zh: message
    };
  }
}

module.exports = {
  translateText,
  translateTourFields,
  translateAnnouncementMessage
};
