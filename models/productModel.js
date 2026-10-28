const products = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 18000, category: 'Minuman', image: '/images/kopi.webp' },
  { id: 2, name: 'Nasi Goreng Spesial', price: 25000, category: 'Makanan', image: '/images/nasi-goreng.jpg' },
  { id: 3, name: 'Roti Bakar Cokelat', price: 15000, category: 'Camilan', image: '/images/roti-bakar.webp' }
];

module.exports = { getAll: () => products };
