import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { scanFile } from '../controllers/scanController.js';
import multer from 'multer';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    console.log('[download] Reject: No URL provided.');
    return res.status(400).json({ error: 'No URL provided.' });
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`[download] Reject: fetch failed for ${url} (status ${response.status})`);
      return res.status(400).json({ error: 'Failed to fetch file from URL.' });
    }
    const contentDisposition = response.headers.get('content-disposition');
    let filename = url.split('/').pop() || 'downloaded.exe';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match) filename = match[1];
    }
    if (!filename.toLowerCase().endsWith('.exe')) {
      console.log(`[download] Reject: Invalid file type for ${filename}`);
      return res.status(400).json({ error: 'Only .exe files are allowed.' });
    }
    const tempPath = path.join(uploadsDir, Date.now() + '-' + filename);
    const fileStream = fs.createWriteStream(tempPath);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
    const stats = fs.statSync(tempPath);
    if (stats.size > 50 * 1024 * 1024) {
      fs.unlinkSync(tempPath);
      console.log(`[download] Reject: file too large (${stats.size} octets) for ${filename}`);
      return res.status(400).json({ error: 'EXE files larger than 50MB are not allowed.' });
    }
    req.file = {
      path: tempPath,
      originalname: filename,
      size: stats.size,
      mimetype: 'application/vnd.microsoft.portable-executable'
    };
    await scanFile(req, res, () => {});
    // TODO : delete file after scan
  } catch (err) {
    console.log(`[download] Server error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
