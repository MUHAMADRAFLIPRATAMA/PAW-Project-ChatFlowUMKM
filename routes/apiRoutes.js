const express = require('express');
const controller = require('../controllers/productController');
const router = express.Router();
router.get('/status', controller.getStatus);
router.get('/produk', controller.getProducts);
router.post('/pesanan/hitung', controller.calculateOrder);
router.post('/chat', controller.chatGemini);
module.exports = router;
