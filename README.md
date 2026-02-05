# 🔐 PANZZ OBFUSCATOR

<p align="center">
  <img src="https://i.ibb.co.com/C5rd95Sm/Gemini-Generated-Image-sbcrn0sbcrn0sbcr.png" alt="PANZZ Obfuscator" width="200"/>
</p>

<p align="center">
  <strong>Telegram Bot untuk Obfuscate/Enkripsi Kode JavaScript</strong>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green?style=flat-square&logo=node.js" alt="Node.js"></a>
  <a href="https://telegram.org/"><img src="https://img.shields.io/badge/Platform-Telegram-blue?style=flat-square&logo=telegram" alt="Telegram"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"></a>
</p>

---

## 📖 Deskripsi

**PANZZ OBFUSCATOR** adalah bot Telegram yang memungkinkan Anda untuk mengenkripsi dan melindungi kode JavaScript dengan berbagai metode obfuscation yang kuat. Bot ini menggunakan library [js-confuser](https://github.com/MichaelXF/js-confuser) untuk menghasilkan kode yang sulit dibaca dan di-reverse engineer.

---

## ⚡ Fitur

| Command | Deskripsi |
|---------|-----------|
| `/zenc` | **Invisible** - Variable dengan karakter zero-width |
| `/enc [hari]` | **Time-Locked** - Kode expired setelah X hari |
| `/enc2 [nama]` | **Custom Name** - Variable dengan nama custom |
| `/enc3` | **Chinese** - Variable karakter Chinese |
| `/enc4` | **Arabic** - Variable karakter Arabic |
| `/enc5` | **Siu+Calcrick** - Hybrid + calculator obfuscation |
| `/enc6` | **Japanese** - Variable karakter Japanese |
| `/enc7` | **Quantum** - XOR + self-evolving code |
| `/enc8` | **Nova** - Stack-based obfuscation |
| `/enc9` | **Nebula** - Polymorphic encryption |

### 🛡️ Fitur Keamanan

- ✅ **Self-Defending** - Kode melindungi diri dari modifikasi
- ✅ **Anti-Debug** - Mencegah debugging
- ✅ **Integrity Check** - Memastikan integritas kode
- ✅ **Tamper Protection** - Mendeteksi perubahan kode
- ✅ **String Encoding** - Enkripsi semua string
- ✅ **Control Flow Flattening** - Mengacak alur eksekusi

---

## 🚀 Instalasi

### Prasyarat

- [Node.js](https://nodejs.org/) v14.0.0 atau lebih baru
- Token Bot Telegram dari [@BotFather](https://t.me/BotFather)

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/irfanstore014-create/PANZZOBF
   cd PANZZOBF
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi**
   
   Edit file `config.js` dan masukkan token bot Anda:
   ```javascript
   module.exports = {
     BOT_TOKEN: "YOUR_BOT_TOKEN_HERE"
   };
   ```

4. **Jalankan bot**
   ```bash
   npm start
   ```

---

## 📝 Cara Penggunaan

1. **Mulai bot** - Kirim `/start` ke bot
2. **Kirim file** - Upload file `.js` yang ingin dienkripsi
3. **Reply dengan command** - Balas file tersebut dengan command enkripsi yang diinginkan

### Contoh:

```
📎 Kirim: script.js
💬 Reply: /enc7
✅ Hasil: script_obfuscated.js
```

---

## 📦 Dependencies

| Package | Versi | Deskripsi |
|---------|-------|-----------|
| [telegraf](https://www.npmjs.com/package/telegraf) | ^4.16.3 | Framework bot Telegram |
| [js-confuser](https://www.npmjs.com/package/js-confuser) | latest | Library obfuscation |
| [fs-extra](https://www.npmjs.com/package/fs-extra) | ^11.2.0 | Extended file system |
| [axios](https://www.npmjs.com/package/axios) | ^1.8.2 | HTTP client |
| [ssh2](https://www.npmjs.com/package/ssh2) | ^1.16.0 | SSH client |

---

## 📁 Struktur Project

```
PANZZOBF/
├── bot.js          # File utama bot
├── config.js       # Konfigurasi (token, dll)
├── users.json      # Database pengguna
├── package.json    # Dependencies
└── README.md       # Dokumentasi
```

---

## 👤 Developer

<p align="center">
  <a href="https://t.me/irfanff9">
    <img src="https://img.shields.io/badge/Telegram-@irfanff9-blue?style=for-the-badge&logo=telegram" alt="Telegram">
  </a>
</p>

---

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](./LICENSE).

---

## ⭐ Support

Jika project ini bermanfaat, berikan ⭐ pada repository ini!

---

<p align="center">
  <strong>🚀 Powered by PANZZ OBFUSCATOR</strong>
</p>
