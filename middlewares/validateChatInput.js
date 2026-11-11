const config = require('../config/gemini');

/**
 * Pola percobaan prompt injection yang ditolak sebelum sampai ke Gemini.
 * System instruction tetap dipakai, tapi backend tidak hanya bergantung padanya.
 */
const injectionPatterns = [
  /abaikan\s+(semua\s+)?(instruksi|aturan|perintah)/i,
  /lupakan\s+(semua\s+)?(instruksi|aturan|perintah)/i,
  /lupakan\s+peran(kan)?\s*(kamu|mu)?/i,
  /ignore\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+|any\s+)?(previous|prior|above)\s+(instructions|rules)/i,
  /(tampilkan|bocorkan|tunjukkan|berikan)\s+(isi\s+)?(system\s*)?(prompt|instruksi\s+sistem)/i,
  /(reveal|show|print|repeat)\s+(me\s+)?(your\s+)?(system\s+)?(prompt|instructions)/i,
  /\b(jailbreak|developer\s*mode|prompt\s*injection)\b/i,
  /\b(kamu\s+sekarang\s+(adalah|berperan\s+sebagai)|mulai\s+sekarang\s+kamu\s+adalah)\b/i,
  /\b(act|pretend|behave)\s+as\s+(a|an)?\s*(developer|programmer|hacker|engineer|coder)/i,
  /\b(kamu|anda)\s+(bukan|tidak\s+lagi)\s+(asisten|chatbot|bot)\b/i,
  /^\s*(sudo|system|assistant)\s*:/i
];

const rejectInjection = message => injectionPatterns.some(pattern => pattern.test(message));

module.exports = (req, res, next) => {
  const body = req.body || {};
  const raw = body.message;

  if (typeof raw !== 'string') {
    return res.status(400).json({ success: false, message: 'Field "message" wajib berupa teks.' });
  }

  const message = raw.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!message) {
    return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong.' });
  }

  if (message.length > config.maxMessageLength) {
    return res.status(400).json({
      success: false,
      message: `Pesan maksimal ${config.maxMessageLength} karakter.`
    });
  }

  if (rejectInjection(message)) {
    return res.status(400).json({
      success: false,
      message: 'Pesan mengandung instruksi yang tidak diizinkan. Silakan tanyakan seputar produk, pemesanan, atau fitur ChatFlow UMKM.'
    });
  }

  req.chat = {
    message,
    history: Array.isArray(body.history) ? body.history : []
  };

  next();
};
