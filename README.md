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
GEMINI_API_KEY=isi_jika_menggunakan_chatbot
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

## Struktur utama

```text
config/database.js              Konfigurasi PostgreSQL
models/productModel.js           Model dan operasi CRUD produk
controllers/productController.js Controller API dan halaman produk
routes/apiRoutes.js              Route API
routes/webRoutes.js              Route halaman web
views/index.ejs                  Katalog pelanggan
views/products.ejs               Dashboard admin CRUD
public/images/                   Gambar produk
```

## Pengujian

```bash
npm test
```

Aplikasi otomatis membuat tabel `products` melalui Sequelize dan mengisi tiga produk awal jika tabel masih kosong.



<img width="1280" height="654" alt="image" src="https://github.com/user-attachments/assets/67dbf45f-820c-48fc-b4d1-55001f4f1aab" />

<img width="1280" height="603" alt="image" src="https://github.com/user-attachments/assets/37c5dfe1-2ff3-4d9a-b9a7-fcd605df62ee" />


