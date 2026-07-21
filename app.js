const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const logFile = path.join(__dirname, 'ziyaretciler.txt');

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    return ip || 'Bilinmiyor';
}

app.get('/', (req, res) => {
    const ip = getClientIP(req);
    const time = new Date().toLocaleString('tr-TR');
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

    const log = `[${time}] IP: ${ip} | UA: ${userAgent}\n`;

    console.log("=== YENİ ZİYARETÇİ ===");
    console.log(log);

    // Dosyaya yazmayı dene (Render'da çalışmayabilir)
    try {
        fs.appendFileSync(logFile, log);
        console.log("Dosyaya kaydedildi.");
    } catch (e) {
        console.log("Dosya yazma hatası (normal - Render ücretsiz planda kalıcı değil)");
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>IP Logger</title>
            <style>
                body { font-family: Arial; background: #0f0c29; color: white; text-align: center; padding: 50px; }
                .box { background: rgba(155, 89, 182, 0.2); padding: 30px; border-radius: 15px; max-width: 500px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>IP Logger</h1>
                <h2>IP: ${ip}</h2>
                <p>Zaman: ${time}</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log(`Site ${PORT} portunda aktif`));