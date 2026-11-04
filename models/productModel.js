const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  category: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'products', timestamps: true });

const defaultProducts = [
  { name: 'Kopi Susu Gula Aren', price: 18000, category: 'Minuman', image: '/images/kopi.webp' },
  { name: 'Nasi Goreng Spesial', price: 25000, category: 'Makanan', image: '/images/nasi-goreng.jpg' },
  { name: 'Roti Bakar Cokelat', price: 15000, category: 'Camilan', image: '/images/roti-bakar.webp' }
];

module.exports = {
  getAll: () => Product.findAll({ order: [['id', 'ASC']] }),
  getById: id => Product.findByPk(id),
  create: data => Product.create(data),
  update: async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
  },
  remove: async id => {
    const product = await Product.findByPk(id);
    if (!product) return false;
    await product.destroy();
    return true;
  },
  sync: async () => {
    await sequelize.sync();
    if (await Product.count() === 0) await Product.bulkCreate(defaultProducts);
  }
};
