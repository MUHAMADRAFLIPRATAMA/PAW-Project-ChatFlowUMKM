const geminiService = require('../../../services/gemini.service');
const chatController = require('../../../controllers/chat.controller');

const createResponse = () => ({
  json: vi.fn(),
  status: vi.fn()
});

describe('chatController.sendMessage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mengembalikan jawaban service dengan response sukses', async () => {
    vi.spyOn(geminiService, 'ask').mockResolvedValue({ reply: 'Silakan lihat katalog.', model: 'test-model' });
    const res = createResponse();

    await chatController.sendMessage({ chat: { message: 'Apa produk tersedia?', history: [] } }, res);

    expect(geminiService.ask).toHaveBeenCalledWith('Apa produk tersedia?', []);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { reply: 'Silakan lihat katalog.', model: 'test-model' }
    });
  });

  it('mengembalikan status dan pesan saat service gagal', async () => {
    vi.spyOn(geminiService, 'ask').mockRejectedValue(Object.assign(new Error('Kuota penuh'), { status: 429 }));
    const res = createResponse();
    res.status.mockReturnValue(res);

    await chatController.sendMessage({ chat: { message: 'Apa produk tersedia?', history: [] } }, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      message: 'Kuota penuh'
    });
  });
});
