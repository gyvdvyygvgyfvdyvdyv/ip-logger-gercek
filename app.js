const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const logFile = path.join(__dirname, 'ziyaretciler.txt');

// Rastgele gizli path (her seferinde değiştirebilirsin)
const SECRET_PATH = '/x7k9p2m';   // ← Bunu istediğin gibi değiştir, çok bariz olmasın

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    return ip || 'Bilinmiyor';
}

app.get(SECRET_PATH, (req, res) => {
    const ip = getClientIP(req);
    const time = new Date().toLocaleString('tr-TR');
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

    const log = `[${time}] IP: ${ip} | UA: ${userAgent}\n`;

    console.log("=== YENİ ZİYARETÇİ ===");
    console.log(log);

    try {
        fs.appendFileSync(logFile, log);
    } catch (e) {
        console.log("Dosya yazma hatası (Render ücretsiz planda normal)");
    }

    // Eğlenceli ve şık sayfa
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>System Check</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    font-family: 'Segoe UI', sans-serif;
                    min-height: 100vh;
                }
                .card {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .glitch {
                    animation: glitch 2s infinite;
                }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
            </style>
        </head>
        <body class="flex items-center justify-center">
            <div class="card max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl">
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold mb-2 glitch">🔍 SYSTEM CHECK</h1>
                    <p class="text-purple-400">Bağlantı doğrulanıyor...</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-black/30 p-4 rounded-2xl">
                        <p class="text-sm text-gray-400">IP Adresin</p>
                        <p class="text-2xl font-mono text-green-400">${ip}</p>
                    </div>
                    
                    <div class="bg-black/30 p-4 rounded-2xl">
                        <p class="text-sm text-gray-400">Zaman</p>
                        <p class="font-mono">${time}</p>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <p class="text-xs text-gray-500">• Seni bekliyorduk •</p>
                    <div class="mt-4 text-5xl">😈</div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Diğer yollara girerse 404 versin (gizliliği artırmak için)
app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`✅ IP Logger aktif → http://localhost:${PORT}${SECRET_PATH}`);
});