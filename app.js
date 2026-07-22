const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const logFile = path.join(__dirname, 'ziyaretciler.txt');
const SECRET_PATH = '/check';   // ← Daha basit ve güvenli yaptım

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    return ip || 'Bilinmiyor';
}

// Ana IP Logger Sayfası
app.get(SECRET_PATH, (req, res) => {
    const ip = getClientIP(req);
    const time = new Date().toLocaleString('tr-TR');
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

    const log = `[${time}] IP: ${ip} | UA: ${userAgent}\n`;

    console.log("=== YENİ ZİYARETÇİ ===");
    console.log(log);

    try {
        fs.appendFileSync(logFile, log);
    } catch (e) {}

    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>System Check</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body { background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: white; font-family: system-ui; min-height: 100vh; }
                .card { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
                .glitch { animation: glitch 2s infinite; }
                @keyframes glitch {
                    0%,100% { transform: translate(0); }
                    20% { transform: translate(-3px, 3px); }
                    40% { transform: translate(3px, -3px); }
                }
            </style>
        </head>
        <body class="flex items-center justify-center p-4">
            <div class="card max-w-md w-full p-10 rounded-3xl text-center">
                <h1 class="text-5xl font-bold mb-2 glitch">🔍 SYSTEM CHECK</h1>
                <p class="text-purple-400 mb-6">Bağlantı doğrulanıyor...</p>
                
                <div class="bg-black/40 p-5 rounded-2xl mb-4">
                    <p class="text-sm opacity-70">IP Adresin</p>
                    <p class="text-3xl font-mono text-green-400 break-all">${ip}</p>
                </div>
                
                <div class="text-sm opacity-70">${time}</div>
                
                <div class="mt-10 text-6xl">😈</div>
                <p class="mt-2 text-xs opacity-50">Seni bekliyorduk...</p>
            </div>
        </body>
        </html>
    `);
});

// Root sayfaya girerse yönlendirsin
app.get('/', (req, res) => {
    res.send('<h1>Access Denied</h1><p>Wrong path.</p>');
});

// Diğer tüm yollar 404
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Aktif → ${SECRET_PATH}`);
});