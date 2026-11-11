const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_HISTORY = 20;

const systemPrompt = () =>
  process.env.GEMINI_SYSTEM_PROMPT ||
  'Kamu adalah asisten ChatFlow UMKM. Jawab singkat, ramah, dan dalam bahasa Indonesia. ' +
  'Bantu pelanggan soal katalog produk, harga, dan cara memesan. ' +
  'Jika ditanya hal di luar itu, arahkan kembali ke topik toko.';

const endpoint = () => {
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const key = encodeURIComponent(process.env.GEMINI_API_KEY || '');
  return `${BASE_URL}/${model}:generateContent?key=${key}`;
};

const httpError = (message, status) => Object.assign(new Error(message), { status });

const toContents = history =>
  (Array.isArray(history) ? history : [])
    .slice(-MAX_HISTORY)
    .filter(turn => turn && typeof turn.text === 'string' && turn.text.trim())
    .map(turn => ({
      role: turn.role === 'model' ? 'model' : 'user',
      parts: [{ text: turn.text.trim() }]
    }));

exports.ask = async (message, history = []) => {
  if (!process.env.GEMINI_API_KEY) throw httpError('GEMINI_API_KEY belum diatur di .env', 500);

  const contents = [...toContents(history), { role: 'user', parts: [{ text: message }] }];
  let response;
  try {
    response = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
          topP: 0.9
        }
      })
    });
  } catch (error) {
    throw httpError('Gagal menghubungi Gemini (jaringan/timeout)', 502);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw httpError(data.error?.message || 'Gemini gagal merespons', response.status);

  const candidate = data.candidates?.[0];
  const reply = (candidate?.content?.parts || [])
    .map(part => part.text)
    .filter(Boolean)
    .join('')
    .trim();

  if (!reply) {
    const reason = candidate?.finishReason || data.promptFeedback?.blockReason || 'EMPTY';
    throw httpError(`Gemini tidak memberikan jawaban (${reason})`, 502);
  }

  return { reply, model: process.env.GEMINI_MODEL || 'gemini-flash-latest', usage: data.usageMetadata || null };
};
