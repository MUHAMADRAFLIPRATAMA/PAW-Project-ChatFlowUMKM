const config = require('../../../config/gemini');
const productModel = require('../../../models/productModel');
const geminiService = require('../../../services/gemini.service');
const products = require('../../fixtures/products');

describe('gemini.service', () => {
  afterEach(() => vi.restoreAllMocks());

  it('membangun context katalog dari produk yang tersedia', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);

    await expect(geminiService.buildCatalogContext()).resolves.toContain('Kopi Susu');
    expect(productModel.getAll).toHaveBeenCalledOnce();
  });

  it('menandai context katalog sebagai unavailable saat database gagal', async () => {
    vi.spyOn(productModel, 'getAll').mockRejectedValue(new Error('database unavailable'));

    await expect(geminiService.buildCatalogContext()).rejects.toMatchObject({ status: 503 });
  });

  it('meminta jawaban AI dengan context katalog dan history', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'Katalog berisi kopi.' }] } }] })
    });

    await expect(geminiService.ask('Apa produknya?', [{ role: 'user', text: 'Halo' }]))
      .resolves.toEqual({ reply: 'Katalog berisi kopi.', model: config.model });

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.contents).toHaveLength(2);
    expect(payload.systemInstruction.parts[0].text).toContain('Kopi Susu');
  });

  it('mengubah kegagalan API Gemini menjadi error terstruktur', async () => {
    vi.spyOn(productModel, 'getAll').mockResolvedValue(products);
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'rate limited' } })
    });

    await expect(geminiService.ask('Apa produknya?')).rejects.toMatchObject({
      status: 429,
      message: expect.stringMatching(/Kuota/)
    });
  });
});
