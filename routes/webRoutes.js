const express = require('express');
const controller = require('../controllers/productController');
const router = express.Router();
router.get('/', controller.renderHome);
router.get('/admin/produk', controller.renderAdmin);
module.exports = router;
