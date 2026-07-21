const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

const logFile = path.join(__dirname, 'ziyaretciler.txt');

function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress;

    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    if (ip === '::1' || ip.includes('127.0.0.1')) ip = 'Local Test';

    return ip;
}

app.get('/', (req, res) => {
    const ip = getClientIP(req);
    const time = new Date().toLocaleString('tr-TR');
    const userAgent = req.headers['user-agent'] || 'Bilinmiyor';

    const log = `[${time}] IP: ${ip} | User-Agent: ${userAgent}\n`;
    
    console.log(log);
    fs.appendFileSync(logFile, log);

    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>IP Logger</title>
            <style>
                body {
                    font-family: 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: #fff;
                    text-align: center;
                    padding: 50px;
                    margin: 0;
                    min-height: 100vh;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(0,0,0,0.4);
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
                }
                h1 {
                    color: #9b59b6;
                    margin-bottom: 20px;
                }
                .info {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 20px 0;
                    font-size: 1.1em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔍 IP Logger</h1>
                <p style="opacity:0.8;">Eğitim Amaçlı - Gerçek IP Takibi</p>
                
                <div class="info">
                    <strong>IP Adresiniz:</strong><br>
                    <span style="font-size:1.4em; color:#bb86fc;">${ip}</span>
                </div>
                
                <p>Zaman: ${time}</p>
                <p style="margin-top:30px; opacity:0.6; font-size:0.9em;">
                    Bu site sadece eğitim amaçlıdır.
                </p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Site ${PORT} portunda çalışıyor`);
});