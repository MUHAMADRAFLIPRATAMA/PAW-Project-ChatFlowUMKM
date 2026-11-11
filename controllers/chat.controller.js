const geminiService = require('../services/gemini.service');

/**
 * Controller AI Assistant.
 * Hanya menerima request yang sudah lolos validasi, lalu mengembalikan response.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { reply, model } = await geminiService.ask(req.chat.message, req.chat.history);
    res.json({ success: true, data: { reply, model } });
  } catch (error) {
    res.status(error.status || 502).json({
      success: false,
      data: null,
      message: error.status ? error.message : 'Layanan AI sedang bermasalah. Silakan coba lagi.'
    });
  }
};
