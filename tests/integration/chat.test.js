const request = require('supertest');
const app = require('../../app');
const productModel = require('../../models/productModel');
const products = require('../fixtures/products');

describe('API chat', () => {
  afterEach(() => vi.restoreAllMocks());

  it('memvalidasi pesan dan membalas melalui service Gemini dengan dependency di-mock', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Produk tersedia di katalog.' }] } }]
      })
    });

    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Produk apa saja?', history: [] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { reply: 'Produk tersedia di katalog.', model: expect.any(String) }
    });
    expect(productModel.getAll).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('menolak input chat tidak valid tanpa memanggil layanan eksternal', async () => {
    const fetchMock = vi.spyOn(global, 'fetch');

    const response = await request(app).post('/api/chat').send({ message: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mengembalikan error layanan jika Gemini gagal dihubungi', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network unavailable'));

    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Produk apa saja?' });

    expect(response.status).toBe(502);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Gagal menghubungi layanan AI/i);
  });
});
