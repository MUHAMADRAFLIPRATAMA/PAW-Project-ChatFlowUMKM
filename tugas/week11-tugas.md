# Week 11: Unit Testing, Integration Testing, dan Code Coverage

## Screenshot 1 - Unit Testing

Unit test memverifikasi format mata uang, validasi input chat, perilaku service Gemini saat berhasil/gagal, dan response controller chat. Dependency model serta API eksternal di-mock.

![Hasil unit testing](images/unit.png)

## Screenshot 2 - Integration Testing

Integration test mengirim request melalui Express app untuk alur API produk dan chat, mencakup response sukses, input tidak valid, data tidak ditemukan, dan kegagalan server/layanan.

![Hasil integration testing](images/integration.png)

## Screenshot 3 - Code Coverage

Laporan coverage mencakup controller, middleware, route, service, utilitas, dan `app.js`, menggunakan provider V8 dengan laporan teks dan HTML.

![Hasil code coverage](images/coverage.png)
