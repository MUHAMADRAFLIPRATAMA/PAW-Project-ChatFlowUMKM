const productModel = require('../models/productModel');
const gemini = require('../utils/gemini');

const fields = ['name', 'price', 'category', 'image'];
const productData = body => Object.fromEntries(fields.filter(field => body[field] !== undefined).map(field => [field, body[field]]));
const validateProduct = data => !data.name || !data.category || data.price === undefined || Number.isNaN(Number(data.price)) || Number(data.price) < 0;

exports.getStatus = (req, res) => res.json({ status: 'success', message: 'ChatFlow UMKM aktif', timestamp: new Date().toISOString() });
exports.getProducts = async (req, res, next) => {
  try { res.json(await productModel.getAll()); } catch (error) { next(error); }
};
exports.getProduct = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (error) { next(error); }
};
exports.createProduct = async (req, res, next) => {
  try {
    const data = productData(req.body);
    if (validateProduct(data)) return res.status(400).json({ message: 'name, price, dan category wajib diisi; price harus angka positif' });
    res.status(201).json(await productModel.create({ ...data, price: Number(data.price) }));
  } catch (error) { next(error); }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const data = productData(req.body);
    if (!Object.keys(data).length || (data.price !== undefined && (Number.isNaN(Number(data.price)) || Number(data.price) < 0))) return res.status(400).json({ message: 'Data produk tidak valid' });
    if (data.price !== undefined) data.price = Number(data.price);
    const product = await productModel.update(req.params.id, data);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (error) { next(error); }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!await productModel.remove(req.params.id)) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(204).send();
  } catch (error) { next(error); }
};
exports.renderHome = async (req, res, next) => {
  try { res.render('index', { products: await productModel.getAll() }); } catch (error) { next(error); }
};
exports.renderAdmin = async (req, res, next) => {
  try { res.render('products', { products: await productModel.getAll() }); } catch (error) { next(error); }
};
exports.calculateOrder = (req, res) => {
  const items = (req.body.items || []).map(item => ({ ...item, subtotal: item.price * item.quantity }));
  res.json({ items, total: items.reduce((sum, item) => sum + item.subtotal, 0) });
};

exports.chatGemini = async (req, res) => {
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ message: 'Pesan wajib diisi' });
  if (message.length > 1000) return res.status(400).json({ message: 'Pesan maksimal 1000 karakter' });

  try {
    res.json(await gemini.ask(message, req.body.history));
  } catch (error) {
    res.status(error.status || 502).json({ message: error.message || 'Gagal menghubungi Gemini' });
  }
};
