const { Telegraf } = require("telegraf");
const fs = require("fs-extra");
const path = require("path");
const JsConfuser = require("js-confuser");
const config = require("./config");
const axios = require("axios");
// webcrack removed - fitur deobfuscate dihapus untuk kemudahan instalasi
const crypto = require("crypto");
const { Client } = require("ssh2");

const bot = new Telegraf(config.BOT_TOKEN);
const userData = {};

const log = (message, error = null) => {
  const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
  const prefix = `\x1b[36m[ PANZZ Obf Botz ]\x1b[0m`;
  const timeStyle = `\x1b[33m[${timestamp}]\x1b[0m`;
  const msgStyle = `\x1b[32m${message}\x1b[0m`;
  console.log(`${prefix} ${timeStyle} ${msgStyle}`);
  if (error) {
    const errorStyle = `\x1b[31m✖ Error: ${error.message || error}\x1b[0m`;
    console.error(`${prefix} ${timeStyle} ${errorStyle}`);
    if (error.stack) console.error(`\x1b[90m${error.stack}\x1b[0m`);
  }
};

// Fungsi untuk memberikan contoh format
const example = () => {
  return "Contoh: /installpanel ipvps|pwvps|panel.com|node.com|ramserver (contoh: 100000)";
};

const CF_API_TOKEN = "CQ4aK4fwUmH3RbM52vI5myFv-IxTIFTsguvRnGpi"; // Ganti dengan API Token yang benar!
const CF_ZONE_ID = "2d45a678eab00687ebcb1111beffaf2b"; // Zone ID Anda

// Fungsi untuk memberikan contoh format
const examplee = () => {
  return "Contoh: /addsubdomain sub.domain.com|192.168.1.1 (A record) atau sub.domain.com|target.com (CNAME)";
};

// Path untuk file JSON
const USERS_FILE = "./users.json";

// Fungsi untuk memuat pengguna dari JSON
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return new Set(JSON.parse(data));
    }
    return new Set();
  } catch (error) {
    log("Gagal memuat pengguna dari JSON", error);
    return new Set();
  }
}

// Fungsi untuk menyimpan pengguna ke JSON
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify([...users], null, 2));
  } catch (error) {
    log("Gagal menyimpan pengguna ke JSON", error);
  }
}

// Muat pengguna saat bot dimulai
let users = loadUsers();

// Fungsi untuk memeriksa keanggotaan channel
async function checkChannelMembership(ctx) {
  const channelId = "@ddosera"; // ID channel
  try {
    const chatMember = await ctx.telegram.getChatMember(channelId, ctx.from.id);
    return ["member", "administrator", "creator"].includes(chatMember.status);
  } catch (error) {
    log("Gagal memeriksa keanggotaan channel", error);
    return false;
  }
}

// Konstanta fungsi async untuk obfuscation Time-Locked Encryption
const obfuscateTimeLocked = async (fileContent, days) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days));
  const expiryTimestamp = expiryDate.getTime();
  try {
    const obfuscated = await JsConfuser.obfuscate(
      `(function(){const expiry=${expiryTimestamp};if(new Date().getTime()>expiry){throw new Error('Script has expired after ${days} days');}${fileContent}})();`,
      {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: "randomized",
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        controlFlowFlattening: 0.75,
        flatten: true,
        shuffle: true,
        rgf: false,
        opaquePredicates: {
          count: 6,
          complexity: 4,
        },
        dispatcher: true,
        globalConcealing: true,
        lock: {
          selfDefending: true,
          antiDebug: (code) =>
            `if(typeof debugger!=='undefined'||process.env.NODE_ENV==='debug')throw new Error('Debugging disabled');${code}`,
          integrity: true,
          tamperProtection: (code) =>
            `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`,
        },
        duplicateLiteralsRemoval: true,
      }
    );
    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    return obfuscatedCode;
  } catch (error) {
    throw new Error(`Gagal obfuscate: ${error.message}`);
  }
};

// Command /enclocked untuk enkripsi dengan masa aktif dalam hari

// Konstanta fungsi async untuk obfuscation Quantum Vortex Encryption
const obfuscateQuantum = async (fileContent) => {
  // Generate identifier unik berdasarkan waktu lokal
  const generateTimeBasedIdentifier = () => {
    const timeStamp = new Date().getTime().toString().slice(-5);
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$#@&*";
    let identifier = "qV_";
    for (let i = 0; i < 7; i++) {
      identifier +=
        chars[Math.floor((parseInt(timeStamp[i % 5]) + i * 2) % chars.length)];
    }
    return identifier;
  };

  // Tambahkan kode phantom berdasarkan milidetik
  const currentMilliseconds = new Date().getMilliseconds();
  const phantomCode =
    currentMilliseconds % 3 === 0
      ? `if(Math.random()>0.999)console.log('PhantomTrigger');`
      : "";

  try {
    const obfuscated = await JsConfuser.obfuscate(fileContent + phantomCode, {
      target: "node",
      compact: true,
      renameVariables: true,
      renameGlobals: true,
      identifierGenerator: generateTimeBasedIdentifier,
      stringCompression: true,
      stringConcealing: false,
      stringEncoding: true,
      controlFlowFlattening: 0.85, // Intensitas lebih tinggi untuk versi 2.0
      flatten: true,
      shuffle: true,
      rgf: true,
      opaquePredicates: {
        count: 8, // Peningkatan count untuk versi 2.0
        complexity: 5,
      },
      dispatcher: true,
      globalConcealing: true,
      lock: {
        selfDefending: true,
        antiDebug: (code) =>
          `if(typeof debugger!=='undefined'||(typeof process!=='undefined'&&process.env.NODE_ENV==='debug'))throw new Error('Debugging disabled');${code}`,
        integrity: true,
        tamperProtection: (code) =>
          `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`,
      },
      duplicateLiteralsRemoval: true,
    });
    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    // Self-evolving code dengan XOR dinamis
    const key = currentMilliseconds % 256;
    obfuscatedCode = `(function(){let k=${key};return function(c){return c.split('').map((x,i)=>String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('');}('${obfuscatedCode}');})()`;
    return obfuscatedCode;
  } catch (error) {
    throw new Error(`Gagal obfuscate: ${error.message}`);
  }
};

const getSiuCalcrickObfuscationConfig = () => {
  const generateSiuCalcrickName = () => {
    // Identifier generator pseudo-random tanpa crypto
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      // 6 karakter untuk keseimbangan
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
    return `CalceKarik和SiuSiu无与伦比的帅气${randomPart}`;
  };

  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    rgf: false,
    flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

const getCustomObfuscationConfig = (customString) => {
  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    stringCompression: true,
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    rgf: false,
    flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    identifierGenerator: function () {
      return `${customString}` + Math.random().toString(36).substring(7);
    },
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

const getNebulaObfuscationConfig = () => {
  const generateNebulaName = () => {
    // Identifier generator pseudo-random tanpa crypto atau timeHash
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const prefix = "NX";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${prefix}${randomPart}`;
  };

  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateNebulaName,
    stringCompression: true,
    stringConcealing: false,
    stringEncoding: true,
    stringSplitting: false,
    controlFlowFlattening: 0.75,
    flatten: true,
    shuffle: true,
    rgf: true,
    deadCode: true,
    opaquePredicates: true,
    dispatcher: true,
    globalConcealing: true,
    objectExtraction: true,
    duplicateLiteralsRemoval: true,
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

const getNovaObfuscationConfig = () => {
  const generateNovaName = () => {
    return "var_" + Math.random().toString(36).substring(7);
  };

  return {
    target: "node",
    calculator: false,
    compact: true,
    controlFlowFlattening: 1,
    deadCode: 1,
    dispatcher: true,
    duplicateLiteralsRemoval: 1,
    es5: true,
    flatten: true,
    globalConcealing: true,
    hexadecimalNumbers: 1,
    identifierGenerator: generateNovaName,
    lock: {
      antiDebug: true,
      integrity: true,
      selfDefending: true,
    },
    minify: true,
    movedDeclarations: true,
    objectExtraction: true,
    opaquePredicates: true,
    renameGlobals: true,
    renameVariables: true,
    shuffle: true,
    stack: true,
    stringCompression: true,
    stringConcealing: true,
  };
};

const getStrongObfuscationConfig = () => {
  return {
    target: "node",
    calculator: true,
    compact: true,
    hexadecimalNumbers: true,
    controlFlowFlattening: 0.75,
    deadCode: 0.2,
    dispatcher: true,
    duplicateLiteralsRemoval: 0.75,
    flatten: true,
    globalConcealing: true,
    identifierGenerator: "zeroWidth",
    minify: true,
    movedDeclarations: true,
    objectExtraction: true,
    opaquePredicates: 0.75,
    renameVariables: true,
    renameGlobals: true,
    stringConcealing: true,
    stringCompression: true,
    stringEncoding: true,
    stringSplitting: 0.75,
    rgf: false,
  };
};

const getArabObfuscationConfig = () => {
  const arabicChars = [
    "أ",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
  ];

  const generateArabicName = () => {
    const length = Math.floor(Math.random() * 4) + 3;
    let name = "";
    for (let i = 0; i < length; i++) {
      name += arabicChars[Math.floor(Math.random() * arabicChars.length)];
    }
    return name;
  };

  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: () => generateArabicName(),
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

const getJapanxArabObfuscationConfig = () => {
  const japaneseXArabChars = [
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "た",
    "ち",
    "つ",
    "て",
    "と",
    "な",
    "に",
    "ぬ",
    "ね",
    "の",
    "は",
    "ひ",
    "ふ",
    "へ",
    "ほ",
    "ま",
    "み",
    "む",
    "め",
    "も",
    "や",
    "ゆ",
    "よ",
    "أ",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
    "ら",
    "り",
    "る",
    "れ",
    "ろ",
    "わ",
    "を",
    "ん",
  ];

  const generateJapaneseXArabName = () => {
    const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
    let name = "";
    for (let i = 0; i < length; i++) {
      name +=
        japaneseXArabChars[
        Math.floor(Math.random() * japaneseXArabChars.length)
        ];
    }
    return name;
  };

  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: () => generateJapaneseXArabName(),
    stringCompression: true, // Kompresi string
    stringConcealing: true, // Menyembunyikan string
    stringEncoding: true, // Enkripsi string
    stringSplitting: true, // Memecah string
    controlFlowFlattening: 0.95, // Sedikit lebih rendah untuk variasi
    flatten: true, // Metode baru: mengganti struktur kontrol
    shuffle: true,
    rgf: false,
    dispatcher: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

const getJapanObfuscationConfig = () => {
  const japaneseChars = [
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "た",
    "ち",
    "つ",
    "て",
    "と",
    "な",
    "に",
    "ぬ",
    "ね",
    "の",
    "は",
    "ひ",
    "ふ",
    "へ",
    "ほ",
    "ま",
    "み",
    "む",
    "め",
    "も",
    "や",
    "ゆ",
    "よ",
    "ら",
    "り",
    "る",
    "れ",
    "ろ",
    "わ",
    "を",
    "ん",
  ];

  const generateJapaneseName = () => {
    const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
    let name = "";
    for (let i = 0; i < length; i++) {
      name += japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
    }
    return name;
  };

  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: () => generateJapaneseName(),
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.9, // Sedikit lebih rendah untuk variasi
    flatten: true, // Metode baru: mengganti struktur kontrol
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
      selfDefending: true,
      antiDebug: true,
      integrity: true,
      tamperProtection: true,
    },
  };
};

// Progress bar
const createProgressBar = (percentage) => {
  const total = 10;
  const filled = Math.round((percentage / 100) * total);
  return "▰".repeat(filled) + "▱".repeat(total - filled);
};

// Update progress
async function updateProgress(ctx, message, percentage, status) {
  const bar = createProgressBar(percentage);
  const levelText = percentage === 100 ? "✅ Selesai" : `⚙️ ${status}`;
  try {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      message.message_id,
      null,
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ${levelText} (${percentage}%)\n` +
      ` ${bar}\n` +
      "```\n" +
      "PROSES ENCRYPT",
      { parse_mode: "Markdown" }
    );
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(800, percentage * 8))
    );
  } catch (error) {
    log("Gagal memperbarui progres", error);
  }
}

// Command /start untuk menyapa pengguna dan menampilkan menu
bot.start(async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);
  await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

  const userName = ctx.from.first_name || "User";

  setTimeout(async () => {
    await ctx.replyWithPhoto("https://i.ibb.co.com/C5rd95Sm/Gemini-Generated-Image-sbcrn0sbcrn0sbcr.png", {
      caption: `🔐 *PANZZ OBFUSCATOR* 🔐

👋 Halo, *${userName}*! Selamat datang!

⚡ *PERINTAH:*
• \`/zenc\` - Invisible
• \`/enc [hari]\` - Time-Locked
• \`/enc2 変Panzz日OBF変\` - Custom Name
• \`/enc3\` - Chinese
• \`/enc4\` - Arabic
• \`/enc5\` - Siu+Calcrick
• \`/enc6\` - Japanese
• \`/enc7\` - Quantum
• \`/enc8\` - Nova
• \`/enc9\` - Nebula

📝 *Cara Pakai:*
Kirim file .js → Reply dgn command

_Klik 📚 Bantuan utk info lengkap_
`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📚 Bantuan", callback_data: "help" },
            { text: "📊 Status", callback_data: "status" }
          ],
          [
            { text: "👤 Developer", url: "https://t.me/irfanff9" }
          ]
        ]
      },
    });
  }, 100);
});

// Handler untuk tombol inline keyboard
bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(`
📚 *PANDUAN PANZZ OBFUSCATOR*

🔐 *JENIS ENKRIPSI:*

*1. /zenc* - Zero-Width
Karakter invisible untuk variable

*2. /enc [hari]* - Time-Locked
Kode expired setelah X hari

*3. /enc2 変Panzz日OBF変* - Custom Name
Variable custom, cth: \`/enc2 MyApp\`

*4. /enc3* - Chinese
Variable karakter Chinese

*5. /enc4* - Arabic
Variable karakter Arabic

*6. /enc5* - Siu+Calcrick
Hybrid + calculator obfuscation

*7. /enc6* - Japanese
Variable karakter Japanese

*8. /enc7* - Quantum
XOR + self-evolving code

*9. /enc8* - Nova
Stack-based obfuscation

*10. /enc9* - Nebula
Polymorphic encryption

💡 *TIPS:*
• Kode harus valid (bebas error)
• File harus .js
• Reply file dengan command
`);
});

bot.action("status", async (ctx) => {
  await ctx.answerCbQuery();
  const totalUsers = users.size;
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  await ctx.replyWithMarkdown(`
📊 *STATUS BOT PANZZ OBFUSCATOR*

━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Info Bot*
━━━━━━━━━━━━━━━━━━━━━━━━
📛 Nama: PANZZ Obfuscator
🔧 Versi: 1.0.0
🟢 Status: Online

━━━━━━━━━━━━━━━━━━━━━━━━
📈 *Statistik*
━━━━━━━━━━━━━━━━━━━━━━━━
👥 Total Users: ${totalUsers}
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
💾 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB

━━━━━━━━━━━━━━━━━━━━━━━━
🚀 *Powered by PANZZ*
━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// Command /enceval (diperkuat dengan pemeriksaan channel)
bot.command("eval", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/eval [level]`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const args = ctx.message.text.split(" ");
  const encryptionLevel = ["low", "medium", "high"].includes(args[1])
    ? args[1]
    : "high";
  const encryptedPath = path.join(
    __dirname,
    `eval-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai Evaluasi (${encryptionLevel}) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk evaluasi: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    const fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    let evalResult;
    try {
      await updateProgress(ctx, progressMessage, 30, "Mengevaluasi Kode Asli");
      evalResult = eval(fileContent);
      if (typeof evalResult === "function") {
        evalResult = "Function detected (cannot display full output)";
      } else if (evalResult === undefined) {
        evalResult = "No return value";
      }
    } catch (evalError) {
      evalResult = `Evaluation error: ${evalError.message}`;
    }

    log(`Memvalidasi kode: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 40, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi dan mengevaluasi file dengan level: ${encryptionLevel}`);
    await updateProgress(
      ctx,
      progressMessage,
      50,
      "Inisialisasi Hardened Enkripsi"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getObfuscationConfig(encryptionLevel)
    );
    await updateProgress(ctx, progressMessage, 70, "Transformasi Kode");
    await fs.writeFile(encryptedPath, obfuscated.code);
    await updateProgress(ctx, progressMessage, 90, "Finalisasi Enkripsi");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscated.code);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    log(`Mengirim file terenkripsi dan hasil evaluasi: ${file.file_name}`);
    await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot - Evaluation Result\n" +
      "```\n" +
      `✨ *Original Code Result:* \n\`\`\`javascript\n${evalResult}\n\`\`\`\n` +
      `_Level: ${encryptionLevel} | Powered by Xhinn`
    );
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `eval-encrypted-${file.file_name}` },
      {
        caption: "✅ *File terenkripsi siap!*\n_SUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      `Evaluasi & Enkripsi (${encryptionLevel})`
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat mengenkripsi/evaluasi", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

// Command /encchina (diperkuat dengan pemeriksaan channel)
bot.command("enc3", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(`
╭━━━「 ❌ ERROR 」━━━⬣
│ Terjadi kesalahan saat
│ memproses file!
╰━━━━━━━━━━━━━━━━⬣`);
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown(`
╭━━━「 ❌ ERROR 」━━━⬣
│ File harus berekstensi .js!
╰━━━━━━━━━━━━━━━━⬣`);
  }

  const encryptedPath = path.join(
    __dirname,
    `china-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (Hardened Mandarin) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Mandarin obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Mandarin yang diperkuat`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Hardened Mandarin Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getMandarinObfuscationConfig()
    );
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
    await fs.writeFile(encryptedPath, obfuscated.code);
    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscated.code);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    log(`Mengirim file terenkripsi gaya Mandarin: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `china-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *File terenkripsi (Hardened Mandarin) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Hardened Mandarin Obfuscation Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Mandarin obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("broadcast", async (ctx) => {
  // Tambahkan pengguna ke daftar broadcast
  users.add(ctx.from.id);
  saveUsers(users);

  // Hanya admin yang bisa broadcast (ambil dari config.js)
  if (ctx.from.id !== config.ADMIN_ID) {
    return ctx.replyWithMarkdown(
      "❌ *Akses Ditolak:* Hanya admin yang bisa menggunakan perintah ini!"
    );
  }

  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Tulis pesan untuk broadcast, contoh: `/broadcast Halo semua!`"
    );
  }

  log(`Mengirim broadcast: ${message}`);
  let successCount = 0;
  let failCount = 0;

  for (const userId of users) {
    try {
      await bot.telegram.sendMessage(userId, message, {
        parse_mode: "Markdown",
      });
      successCount++;
    } catch (error) {
      log(`Gagal mengirim ke ${userId}`, error);
      failCount++;
    }
  }

  await ctx.replyWithMarkdown(
    `📢 *Broadcast Selesai:*\n` +
    `- Berhasil dikirim ke: ${successCount} pengguna\n` +
    `- Gagal dikirim ke: ${failCount} pengguna`
  );
});

// Command /encarab (diperkuat dengan pemeriksaan channel)
bot.command("enc4", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enc4`!");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `arab-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (Hardened Arab) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Arab obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Arab yang diperkuat`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Hardened Arab Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getArabObfuscationConfig()
    );
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
    await fs.writeFile(encryptedPath, obfuscated.code);
    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscated.code);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    log(`Mengirim file terenkripsi gaya Arab: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `arab-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *File terenkripsi (Hardened Arab) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Hardened Arab Obfuscation Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Arab obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

// Command /encjapan (Japan-style obfuscation baru, diperkuat dengan pemeriksaan channel)
bot.command("enc6", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enc6`!");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `japan-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (Hardened Japan) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Japan obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Japan yang diperkuat`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Hardened Japan Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getJapanObfuscationConfig()
    );
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");
    await fs.writeFile(encryptedPath, obfuscated.code);
    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscated.code);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    log(`Mengirim file terenkripsi gaya Japan: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `japan-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *File terenkripsi (Hardened Japan) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Hardened Japan Obfuscation Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Japan obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

// Command /deobfuscate dihapus - membutuhkan webcrack yang sulit di-install
// Untuk mengaktifkan kembali, install webcrack: npm install webcrack
// Lalu uncomment kode di bawah dan import webcrack di atas

// Command /encstrong (Obfuscation baru dengan metode Strong)
bot.command("zenc", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/zenc`!");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `invisible-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (InvisiBle) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Strong obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Strong`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Hardened Invisible Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getStrongObfuscationConfig()
    );
    let obfuscatedCode = obfuscated.code || obfuscated; // Pastikan string
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi gaya Invisible: ${file.file_name}`);
    await ctx.replyWithDocument(
      {
        source: encryptedPath,
        filename: `Invisible-encrypted-${file.file_name}`,
      },
      {
        caption: "✅ *File terenkripsi (Invisible) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Hardened Invisible Obfuscation Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Invisible obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("xx", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  // Ambil nama kustom dari perintah
  const args = ctx.message.text.split(" ");
  if (args.length < 2 || !args[1]) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Gunakan format `/enc <nama>` dengan nama kustom!"
    );
  }
  const customName = args[1].replace(/[^a-zA-Z0-9_]/g, ""); // Sanitasi input, hanya huruf, angka, dan underscore
  if (!customName) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Nama kustom harus berisi huruf, angka, atau underscore!"
    );
  }

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc <nama>`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `custom-${customName}-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (Hardened Custom: ${customName}) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Custom obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Custom (${customName}) yang diperkuat`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Hardened Custom Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getCustomObfuscationConfig(customName)
    );
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscated.code.substring(
        0,
        50
      )}...`
    );
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Memvalidasi kode hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscated.code);
    } catch (postObfuscationError) {
      log(
        `Kode hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await fs.writeFile(encryptedPath, obfuscated.code);
    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");

    log(`Mengirim file terenkripsi gaya Custom: ${file.file_name}`);
    await ctx.replyWithDocument(
      {
        source: encryptedPath,
        filename: `custom-${customName}-encrypted-${file.file_name}`,
      },
      {
        caption: `✅ *File terenkripsi (Hardened Custom: ${customName}) siap!*\nSUKSES ENCRYPT 🕊`,
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      `Hardened Custom (${customName}) Obfuscation Selesai`
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Custom obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("enc7", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc7`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `quantum-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (Quantum Vortex Encryption) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Quantum Vortex Encryption: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan Quantum Vortex Encryption`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Quantum Vortex Encryption"
    );
    const obfuscatedCode = await obfuscateQuantum(fileContent);
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    log(
      `Ukuran file setelah obfuscation: ${Buffer.byteLength(
        obfuscatedCode,
        "utf-8"
      )} bytes`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi quantum: ${file.file_name}`);
    await ctx.replyWithDocument(
      {
        source: encryptedPath,
        filename: `quantum-encrypted-${file.file_name}`,
      },
      {
        caption:
          "✅ *File terenkripsi (Quantum Vortex Encryption) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Quantum Vortex Encryption Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Quantum obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

// Command /encnova
bot.command("enc8", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ *Error:* Balas file .js dengan `/enc8`!");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(__dirname, `var-encrypted-${file.file_name}`);

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (Var) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Var obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Var`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Var Dynamic Obfuscation"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getNovaObfuscationConfig()
    );
    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi gaya Var: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `Var-encrypted-${file.file_name}` },
      {
        caption: "✅ *File terenkripsi (Var) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(ctx, progressMessage, 100, "Var Obfuscation Selesai");

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Nova obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("enc9", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc9`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `nebula-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (Nebula Polymorphic Storm) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Nebula obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Nebula`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Nebula Polymorphic Storm"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getNebulaObfuscationConfig()
    );
    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    log(
      `Ukuran file setelah obfuscation: ${Buffer.byteLength(
        obfuscatedCode,
        "utf-8"
      )} bytes`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi gaya Nebula: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `nebula-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *File terenkripsi (Nebula Polymorphic Storm) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Nebula Polymorphic Storm Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Nebula obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("enc5", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc5`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `siucalcrick-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (Calcrick Chaos Core) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Siu+Calcrick obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Siu+Calcrick`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Calcrick Chaos Core"
    );
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getSiuCalcrickObfuscationConfig()
    );
    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    log(
      `Ukuran file setelah obfuscation: ${Buffer.byteLength(
        obfuscatedCode,
        "utf-8"
      )} bytes`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi gaya Siu+Calcrick: ${file.file_name}`);
    await ctx.replyWithDocument(
      {
        source: encryptedPath,
        filename: `siucalcrick-encrypted-${file.file_name}`,
      },
      {
        caption:
          "✅ *File terenkripsi (Calcrick Chaos Core) siap!*\nSUKSES ENCRYPT 🕊",
        parse_mode: "Markdown",
      }
    );
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Calcrick Chaos Core Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Siu+Calcrick obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("enc2", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  const customString = ctx.message.text.split(" ")[1];

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc2 <text>`!"
    );
  }

  if (!customString) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc2 <text>`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `custom-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (custom enc) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk custom obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya custom (${customString})`);
    await updateProgress(ctx, progressMessage, 40, `Inisialisasi custom (${customString})`);

    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getCustomObfuscationConfig(customString)
    );

    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    log(
      `Ukuran file setelah obfuscation: ${Buffer.byteLength(
        obfuscatedCode,
        "utf-8"
      )} bytes`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi gaya custom (${customString}): ${file.file_name}`);
    await ctx.replyWithDocument(
      {
        source: encryptedPath,
        filename: `custom-encrypted-${file.file_name}`,
      },
      {
        caption: `✅ *File terenkripsi custom (${customString}) siap!*\nSUKSES ENCRYPT 🕊`,
        parse_mode: "Markdown",
      }
    );
    await updateProgress(ctx, progressMessage, 100, `custom (${customString}) Selesai`);

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat custom enc obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("enc", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  const args = ctx.message.text.split(" ").slice(1);
  if (
    args.length !== 1 ||
    !/^\d+$/.test(args[0]) ||
    parseInt(args[0]) < 1 ||
    parseInt(args[0]) > 365
  ) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Gunakan format `/locked [1-365]` untuk jumlah hari (misal: `/enc 7`)!"
    );
  }

  const days = args[0];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days));
  const expiryFormatted = expiryDate.toLocaleDateString();

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown(
      "❌ *Error:* Balas file .js dengan `/enc [1-365]`!"
    );
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ *Error:* Hanya file .js yang didukung!");
  }

  const encryptedPath = path.join(
    __dirname,
    `locked-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
      "🔒 EncryptBot\n" +
      " ⚙️ Memulai (Time-Locked Encryption) (1%)\n" +
      " " +
      createProgressBar(1) +
      "\n" +
      "```\n" +
      "PROSES ENCRYPT "
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file untuk Time-Locked Encryption: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode awal tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan Time-Locked Encryption`);
    await updateProgress(
      ctx,
      progressMessage,
      40,
      "Inisialisasi Time-Locked Encryption"
    );
    const obfuscatedCode = await obfuscateTimeLocked(fileContent, days);
    log(
      `Hasil obfuscation (50 char pertama): ${obfuscatedCode.substring(
        0,
        50
      )}...`
    );
    log(
      `Ukuran file setelah obfuscation: ${Buffer.byteLength(
        obfuscatedCode,
        "utf-8"
      )} bytes`
    );

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      log(`Detail kode bermasalah: ${obfuscatedCode.substring(0, 100)}...`);
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi time-locked: ${file.file_name}`);
    await ctx.replyWithMarkdown(
      `✅ *File terenkripsi (Time-Locked Encryption) siap!*\n` +
      `⏰ Masa aktif: ${days} hari (Kedaluwarsa: ${expiryFormatted})\n` +
      `_Powered by XHINN_`,
      { parse_mode: "Markdown" }
    );
    await ctx.replyWithDocument({
      source: encryptedPath,
      filename: `locked-encrypted-${file.file_name}`,
    });
    await updateProgress(
      ctx,
      progressMessage,
      100,
      "Time-Locked Encryption Selesai"
    );

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Time-Locked obfuscation", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"
      }\n_Coba lagi dengan kode Javascript yang valid!_`
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

// Perintah installpanel

// Perintah installpanel
bot.command("installpanel", (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) {
    return ctx.reply(example());
  }

  const vii = text.split("|");
  if (vii.length < 5) {
    return ctx.reply(example());
  }

  // Simpan data pengguna
  userData[ctx.from.id] = {
    ip: vii[0],
    password: vii[1],
    domainpanel: vii[2],
    domainnode: vii[3],
    ramserver: vii[4],
    step: "installing",
  };

  ctx.reply(
    "Memproses instalasi server panel...\nTunggu 1-10 menit hingga proses selesai."
  );
  startInstallation(ctx);
});

// Fungsi instalasi
function startInstallation(ctx) {
  const userId = ctx.from.id;
  if (!userData[userId]) {
    ctx.reply("Data pengguna tidak ditemukan, silakan ulangi perintah.");
    return;
  }

  const { ip, password, domainpanel, domainnode, ramserver } = userData[userId];

  const ress = new Client();
  const connSettings = {
    host: ip,
    port: 22,
    username: "root",
    password: password,
  };

  const passwordPanel = `admin${Math.random().toString(36).substring(7)}`; // Random password
  const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;

  // Fungsi untuk instal wings
  const installWings = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi wings: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on("close", (code, signal) => {
          conn.exec(
            "bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)",
            (err, stream) => {
              if (err) {
                ctx.reply(`Gagal menjalankan pembuatan node: ${err.message}`);
                delete userData[userId];
                return;
              }
              stream
                .on("close", async (code, signal) => {
                  const teks = `
𝗕𝗘𝗥𝗜𝗞𝗨𝗧 𝗗𝗔𝗧𝗔 𝗣𝗔𝗡𝗘𝗟 𝗔𝗡𝗗𝗔 📎 :

💋 ᴜsᴇʀɴᴀᴍᴇ : admin
💋 ᴘᴀssᴡᴏʀᴅ : ${passwordPanel}
💋 ᴅᴏᴍᴀɪɴ : ${domainpanel}

Note : Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Di Buat Oleh Bot Untuk Menjalankan Wings         `;
                  await ctx.reply(teks);
                  delete userData[userId]; // Bersihkan data setelah selesai
                })
                .on("data", (data) => {
                  const output = data.toString();
                  console.log(output);
                  if (output.includes("Masukkan nama lokasi:"))
                    stream.write("Singapore\n");
                  if (output.includes("Masukkan deskripsi lokasi:"))
                    stream.write("Node By PrelXz\n");
                  if (output.includes("Masukkan domain:"))
                    stream.write(`${domainnode}\n`);
                  if (output.includes("Masukkan nama node:"))
                    stream.write("Node By PrelXz\n");
                  if (output.includes("Masukkan RAM (dalam MB):"))
                    stream.write(`${ramserver}\n`);
                  if (
                    output.includes(
                      "Masukkan jumlah maksimum disk space (dalam MB):"
                    )
                  )
                    stream.write(`${ramserver}\n`);
                  if (output.includes("Masukkan Locid:")) stream.write("1\n");
                })
                .stderr.on("data", (data) => console.log("Stderr: " + data));
            }
          );
        })
        .on("data", (data) => {
          const output = data.toString();
          console.log("Logger: " + output);
          if (output.includes("Input 0-6")) stream.write("1\n");
          if (output.includes("(y/N)")) stream.write("y\n");
          if (output.includes("Enter the panel address"))
            stream.write(`${domainpanel}\n`);
          if (output.includes("Database host username"))
            stream.write("admin\n");
          if (output.includes("Database host password"))
            stream.write("admin\n");
          if (output.includes("Set the FQDN to use for Let's Encrypt"))
            stream.write(`${domainnode}\n`);
          if (output.includes("Enter email address for Let's Encrypt"))
            stream.write("admin@gmail.com\n");
        })
        .stderr.on("data", (data) => console.log("STDERR: " + data));
    });
  };

  // Fungsi untuk instal panel
  const installPanel = (conn) => {
    conn.exec(commandPanel, (err, stream) => {
      if (err) {
        ctx.reply(`Gagal menjalankan instalasi panel: ${err.message}`);
        delete userData[userId];
        return;
      }
      stream
        .on("close", (code, signal) => installWings(conn))
        .on("data", (data) => {
          const output = data.toString();
          console.log("Logger: " + output);
          if (output.includes("Input 0-6")) stream.write("0\n");
          if (output.includes("(y/N)")) stream.write("y\n");
          if (output.includes("Database name")) stream.write("\n");
          if (output.includes("Database username")) stream.write("admin\n");
          if (
            output.includes(
              "Password (press enter to use randomly generated password)"
            )
          )
            stream.write("admin\n");
          if (output.includes("Select timezone"))
            stream.write("Asia/Jakarta\n");
          if (output.includes("Provide the email address"))
            stream.write("admin@gmail.com\n");
          if (output.includes("Email address for the initial admin account"))
            stream.write("admin@gmail.com\n");
          if (output.includes("Username for the initial admin account"))
            stream.write("admin\n");
          if (output.includes("First name")) stream.write("admin\n");
          if (output.includes("Last name")) stream.write("admin\n");
          if (output.includes("Password for the initial admin account"))
            stream.write(`${passwordPanel}\n`);
          if (output.includes("Set the FQDN of this panel"))
            stream.write(`${domainpanel}\n`);
          if (output.includes("Do you want to automatically configure UFW"))
            stream.write("y\n");
          if (output.includes("Do you want to automatically configure HTTPS"))
            stream.write("y\n");
          if (output.includes("Select the appropriate number [1-2]"))
            stream.write("1\n");
          if (output.includes("I agree that this HTTPS request"))
            stream.write("y\n");
          if (output.includes("Proceed anyways")) stream.write("y\n");
          if (output.includes("(yes/no)")) stream.write("y\n");
          if (output.includes("Initial configuration completed"))
            stream.write("y\n");
          if (output.includes("Still assume SSL")) stream.write("y\n");
          if (output.includes("Please read the Terms of Service"))
            stream.write("y\n");
          if (output.includes("(A)gree/(C)ancel:")) stream.write("A\n");
        })
        .stderr.on("data", (data) => console.log("STDERR: " + data));
    });
  };

  // Mulai koneksi SSH
  ress
    .on("ready", () => {
      installPanel(ress);
    })
    .connect(connSettings);

  ress.on("error", (err) => {
    ctx.reply(`Gagal koneksi ke server: ${err.message}`);
    delete userData[userId];
  });
}

// Cloudflare API settings

// Perintah untuk menambahkan subdomain
bot.command("addsubdomain", async (ctx) => {
  users.add(ctx.from.id);
  saveUsers(users);

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) {
    return ctx.reply(examplee());
  }

  const [subdomain, target] = text.split("|");
  if (!subdomain || !target) {
    return ctx.reply(examplee());
  }

  // Untuk kasus spesifik Anda: varrtzy.xyz
  const finalSubdomain = subdomain || "varrtzy.xyz"; // Default ke varrtzy.xyz jika tidak ada input
  ctx.reply(`Memproses penambahan subdomain ${finalSubdomain}...`);

  // Tentukan tipe record (A atau CNAME) berdasarkan target
  const recordType = target.match(/^\d+\.\d+\.\d+\.\d+$/) ? "A" : "CNAME";
  const apiUrl = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        type: recordType,
        name: finalSubdomain,
        content: target,
        ttl: 1, // Auto TTL
        proxied: false, // Proxy melalui Cloudflare
      },
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      ctx.reply(
        `Subdomain ${finalSubdomain}.varrtzy.xyz berhasil ditambahkan dengan ${recordType} record ke ${target}!`
      );
    } else {
      ctx.reply(
        `Gagal menambahkan subdomain: ${response.data.errors[0].message}`
      );
    }
  } catch (error) {
    ctx.reply(`Error: ${error.message}`);
  }
});

// Jalankan bot
bot.launch(() => log("Encrypt Bot by PANZZ berjalan..."));
process.on("unhandledRejection", (reason) =>
  log("Unhandled Rejection", reason)
);
