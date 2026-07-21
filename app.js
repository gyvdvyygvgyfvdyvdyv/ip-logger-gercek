const express = require('express');
const fs = require('fs');
const path = require('path');

app.set('trust proxy', true);

const app = express();
const PORT = 3000;

const logFile = path.join(__dirname, 'ziyaretciler.txt');

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;

    // IPv6 localhost temizleme
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
        ip = '127.0.0.1';
    }

    // Eğer birden fazla IP varsa ilkini al
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    return ip;
}

app.get('/', (req, res) => {
    const ip = getClientIP(req);
    const time = new Date().toLocaleString('tr-TR');
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';
    
    const log = `[${time}] IP: ${ip} | Tarayıcı: ${userAgent}\n`;
    
    console.log(log);
    fs.appendFileSync(logFile, log);
    
    res.send(`
        <h1>Eğitim Amaçlı IP Logger</h1>
        <p><strong>IP Adresiniz:</strong> ${ip}</p>
        <p>Zaman: ${time}</p>
        <p>Bu sadece eğitim amaçlı testtir.</p>
    `);
});

app.listen(PORT, () => {
    console.log(`✅ Site http://localhost:${PORT} adresinde çalışıyor!`);
});