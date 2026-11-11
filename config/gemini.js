require('dotenv').config();

/**
 * Konfigurasi integrasi Google Gemini.
 * API key hanya dibaca di sisi server, tidak pernah dikirim ke frontend.
 */
module.exports = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || 20000,
  maxHistoryTurns: 20,
  maxMessageLength: Number(process.env.GEMINI_MAX_MESSAGE_LENGTH) || 500,
  maxProductsInContext: 50,
  generationConfig: {
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 400
  }
};
