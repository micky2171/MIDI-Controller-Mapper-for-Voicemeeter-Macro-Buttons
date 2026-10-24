const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const root = path.join(__dirname, 'public');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];
    if (pathname === '/api/voicemeeter') {
        return execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'voicemeeter-reader.ps1')], { windowsHide: true, timeout: 10000 }, (error, stdout, stderr) => {
            res.writeHead(error ? 500 : 200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
            if (error) return res.end(JSON.stringify({ ok: false, error: (stderr || error.message).trim() }));
            res.end(stdout.trim());
        });
    }
    const requestPath = pathname === '/' ? '/index.html' : pathname;
    const file = path.normalize(path.join(root, requestPath));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (error, data) => { if (error) { res.writeHead(404); return res.end('Not found'); } res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data); });
}).listen(3000, () => console.log('MIDI Controller Mapper: http://localhost:3000'));
