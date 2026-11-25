const request = require('supertest');
const app = require('../../app');
const productModel = require('../../models/productModel');
const products = require('../fixtures/products');

describe('API produk', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mengambil daftar produk dari model', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);

    const response = await request(app).get('/api/produk');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(products);
  });

  it('menolak input produk yang tidak valid', async () => {
    const createSpy = vi.spyOn(productModel, 'create');

    const response = await request(app).post('/api/produk').send({ name: 'Produk tanpa harga' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/wajib diisi/i);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('membuat produk baru dengan harga numerik', async () => {
    const createdProduct = { ...products[0], price: 18000 };
    const createSpy = vi.spyOn(productModel, 'create').mockResolvedValue(createdProduct);

    const response = await request(app)
      .post('/api/produk')
      .send({ name: 'Kopi Susu', price: '18000', category: 'Minuman' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdProduct);
    expect(createSpy).toHaveBeenCalledWith({ name: 'Kopi Susu', price: 18000, category: 'Minuman' });
  });

  it('mengembalikan 404 saat produk tidak ditemukan', async () => {
    vi.spyOn(productModel, 'getById').mockResolvedValue(null);

    const response = await request(app).get('/api/produk/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produk tidak ditemukan');
  });

  it('memperbarui produk yang ditemukan dan menolak data update kosong', async () => {
    const updatedProduct = { ...products[0], price: 20000 };
    const updateSpy = vi.spyOn(productModel, 'update').mockResolvedValue(updatedProduct);
    const validResponse = await request(app)
      .put('/api/produk/1')
      .send({ price: '20000' });
    const invalidResponse = await request(app)
      .put('/api/produk/1')
      .send({ unknown: 'field' });

    expect(validResponse.status).toBe(200);
    expect(validResponse.body).toEqual(updatedProduct);
    expect(updateSpy).toHaveBeenCalledWith('1', { price: 20000 });
    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.message).toMatch(/tidak valid/i);
  });

  it('mengembalikan 404 saat update atau hapus produk yang tidak ada', async () => {
    vi.spyOn(productModel, 'update').mockResolvedValue(null);
    vi.spyOn(productModel, 'remove').mockResolvedValue(false);

    const updateResponse = await request(app).put('/api/produk/999').send({ name: 'Produk' });
    const deleteResponse = await request(app).delete('/api/produk/999');

    expect(updateResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);
  });

  it('menghapus produk dan menghitung subtotal serta total pesanan', async () => {
    const removeSpy = vi.spyOn(productModel, 'remove').mockResolvedValue(true);
    const deleteResponse = await request(app).delete('/api/produk/1');
    const orderResponse = await request(app)
      .post('/api/pesanan/hitung')
      .send({ items: [{ name: 'Kopi Susu', price: 18000, quantity: 2 }] });

    expect(deleteResponse.status).toBe(204);
    expect(removeSpy).toHaveBeenCalledWith('1');
    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body).toEqual({
      items: [{ name: 'Kopi Susu', price: 18000, quantity: 2, subtotal: 36000 }],
      total: 36000
    });
  });

  it('mengembalikan 500 saat model gagal mengambil produk', async () => {
    vi.spyOn(productModel, 'getAll').mockRejectedValue(new Error('database unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app).get('/api/produk');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Terjadi kesalahan server');
  });
});
