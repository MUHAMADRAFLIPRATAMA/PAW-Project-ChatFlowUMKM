const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);
app.use('/api/chat', chatRoutes);
app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

app.use((error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') return res.status(400).json({ message: error.errors[0].message });
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

if (require.main === module) {
  const productModel = require('./models/productModel');
  productModel.sync().then(() => app.listen(port, '0.0.0.0', () => console.log(`Server berjalan di http://localhost:${port}`))).catch(error => {
    console.error('Database gagal terhubung:', error.message);
    process.exit(1);
  });
}

module.exports = app;
