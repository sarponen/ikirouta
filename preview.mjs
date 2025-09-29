// Simple static file server for previewing dist/
import http from 'http';
import { createReadStream, promises as fs } from 'fs';
import { extname, join } from 'path';

const PORT = process.env.PORT || 5000;
const DIST = 'dist';

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  let filePath = join(DIST, req.url === '/' ? '/index.html' : req.url);
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = join(filePath, 'index.html');
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}`);
});
