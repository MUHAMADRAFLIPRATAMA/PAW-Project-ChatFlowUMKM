# ChatFlow UMKM

Aplikasi katalog produk dan pemesanan sederhana untuk UMKM menggunakan Express, EJS, Sequelize, dan PostgreSQL.

## Instalasi

```bash
npm install
```

Buat file `.env` di root project:

```env
DB_NAME=nama_database
DB_USER=postgres
DB_PASS=password_postgres
DB_HOST=localhost
DB_PORT=5432
PORT=3000
GEMINI_API_KEY=isi_api_key_dari_google_ai_studio
GEMINI_MODEL=gemini-flash-lite-latest
GEMINI_TIMEOUT_MS=20000
GEMINI_MAX_MESSAGE_LENGTH=500
```

Pastikan PostgreSQL aktif dan database pada `DB_NAME` sudah dibuat.

## Menjalankan aplikasi

```bash
npm start
```

Mode pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Halaman aplikasi

### Pelanggan

`/`

Pelanggan dapat melihat katalog, memilih jumlah produk, mengonfirmasi pesanan, mengubah jumlah item di keranjang, menghapus item, dan melanjutkan pemesanan.

### Admin

`/admin/produk`

Admin dapat:

- Menambah produk
- Melihat daftar produk
- Mengedit produk
- Menghapus produk

Halaman admin digunakan untuk mengelola katalog, bukan untuk mengonfirmasi pesanan pelanggan.

## API Produk

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/produk` | Menampilkan semua produk |
| GET | `/api/produk/:id` | Menampilkan satu produk |
| POST | `/api/produk` | Menambah produk |
| PUT | `/api/produk/:id` | Mengubah produk |
| DELETE | `/api/produk/:id` | Menghapus produk |

Contoh menambah produk:

```json
{
  "name": "Brownies Mini",
  "price": 25000,
  "category": "Camilan",
  "image": "/images/brownies.jpg"
}
```

## AI Assistant (Google Gemini)

Fitur AI Assistant memakai Google Gemini sebagai LLM, dipanggil **hanya dari backend Express**. API key disimpan di `.env` dan tidak pernah dikirim ke frontend.

### Endpoint

`POST /api/chat`

```json
{ "message": "Produk apa saja yang tersedia?" }
```

Response sukses:

```json
{ "success": true, "data": { "reply": "...", "model": "gemini-flash-lite-latest" } }
```

Response gagal (validasi atau layanan AI bermasalah):

```json
{ "success": false, "data": null, "message": "Pesan tidak boleh kosong." }
```

Field `history` bersifat opsional, berisi array `{ "role": "user" | "model", "text": "..." }` (maksimal 20 giliran terakhir).

### Alur context

1. `middlewares/validateChatInput.js` memvalidasi tipe, panjang (maks. 500 karakter), pesan kosong, dan menolak percobaan prompt injection.
2. `services/gemini.service.js` mengambil data katalog dari database (`productModel.getAll()`) sebagai satu-satunya sumber context.
3. Context katalog, penjelasan fitur aplikasi, ruang lingkup, dan aturan keamanan dirangkai menjadi system instruction.
4. Jika database gagal dibaca, permintaan dihentikan dengan status 503 supaya AI tidak mengarang jawaban.

### Batasan AI

- Hanya menjawab seputar produk, harga, kategori, cara pemesanan, panduan, dan bantuan aplikasi.
- Menolak pertanyaan di luar konteks, misalnya permintaan membuat kode program.
- Tidak menyebut produk atau harga yang tidak ada di database.
- Instruksi pengguna tidak dapat mengubah aturan sistem; backend juga memblokir pola prompt injection.

### Pengujian manual

```bash
# sesuai context
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d "{\"message\":\"Produk apa saja yang tersedia di aplikasi ini?\"}"

# di luar context
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d "{\"message\":\"Buatkan saya kode program untuk membuat game.\"}"

# validasi input
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d "{\"message\":\"   \"}"
```



## Struktur utama

```text
config/database.js              Konfigurasi PostgreSQL
config/gemini.js                Konfigurasi integrasi Google Gemini
models/productModel.js          Model dan operasi CRUD produk
services/gemini.service.js      Komunikasi dengan Gemini + penyusunan context katalog
controllers/productController.js Controller API dan halaman produk
controllers/chat.controller.js  Controller AI Assistant
middlewares/logger.js           Logger request
middlewares/validateChatInput.js Validasi input chat dan penolakan prompt injection
routes/apiRoutes.js             Route API produk
routes/chat.routes.js           Route endpoint AI Assistant
routes/webRoutes.js             Route halaman web
views/index.ejs                 Katalog pelanggan + AI Assistant
views/products.ejs              Dashboard admin CRUD
public/images/                  Gambar produk
tests/api.test.js               Pengujian endpoint produk dan chat
```

## Pengujian

```bash
npm test
```

Pengujian mencakup daftar produk, pesan kosong, tipe pesan yang salah, pesan melebihi batas, penolakan prompt injection, jawaban sesuai context, dan penolakan pertanyaan di luar context.



<img width="1280" height="654" alt="image" src="https://github.com/user-attachments/assets/67dbf45f-820c-48fc-b4d1-55001f4f1aab" />

<img width="1280" height="603" alt="image" src="https://github.com/user-attachments/assets/37c5dfe1-2ff3-4d9a-b9a7-fcd605df62ee" />

<img width="1280" height="649" alt="image" src="https://github.com/user-attachments/assets/337a3ba5-8d36-4c05-ab45-64bf35b3c1c7" />

<img width="1280" height="616" alt="image" src="https://github.com/user-attachments/assets/1d4e60c5-bf94-4709-b173-38692fc68057" />




