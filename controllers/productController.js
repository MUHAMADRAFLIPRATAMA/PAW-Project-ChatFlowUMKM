const productModel = require('../models/productModel');

exports.getStatus = (req, res) => res.json({ status: 'success', message: 'ChatFlow UMKM aktif', timestamp: new Date().toISOString() });
exports.getProducts = (req, res) => res.json(productModel.getAll());
exports.renderHome = (req, res) => res.render('index', { products: productModel.getAll() });
exports.calculateOrder = (req, res) => {
  const items = (req.body.items || []).map(item => ({ ...item, subtotal: item.price * item.quantity }));
  res.json({ items, total: items.reduce((sum, item) => sum + item.subtotal, 0) });
};

exports.chatGemini = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!apiKey) return res.status(500).json({ message: 'GEMINI_API_KEY belum diatur' });
  if (!message) return res.status(400).json({ message: 'Pesan wajib diisi' });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Jawab singkat dalam bahasa Indonesia sebagai bot UMKM: ${message}` }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 80 } })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.error?.message || 'Gemini gagal merespons' });
    res.json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini tidak memberikan jawaban.' });
  } catch (error) {
    res.status(502).json({ message: 'Gagal menghubungi Gemini' });
  }
};
