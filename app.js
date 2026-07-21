const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;   // Render için önemli

app.set('trust proxy', true);

const logFile = path.join(__dirname, 'ziyaretciler.txt');

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress;

    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    if (ip === '::1' || ip.includes('127.0.0.1')) {
        ip = 'Localhost';
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
        <h1>IP Logger (Eğitim Amaçlı)</h1>
        <p><strong>IP:</strong> ${ip}</p>
        <p>Zaman: ${time}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Site ${PORT} portunda çalışıyor`);
});