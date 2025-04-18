import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { scanFile } from '../controllers/scanController.js';
import { isWindowsExecutable } from '../controllers/scanController.js';
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
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }

    const allowedDomains = [
      'gofile.io',
      'github.com',
      'raw.githubusercontent.com',
      'cdn.discordapp.com',
      'discord.com',
    ];
    const isAllowed = allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));
    if (!isAllowed) {
      return res.status(400).json({ error: 'URL must be from gofile.io, github.com, or discord.' });
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
    
    if (!isWindowsExecutable(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log(`[download] Reject: File is not a valid Windows executable: ${filename}`);
      return res.status(400).json({ error: 'The downloaded file is not a valid Windows executable.' });
    }
    
    const stats = fs.statSync(tempPath);
    console.log(`[download] File size: ${stats.size} bytes for ${filename}`);
    if (stats.size > 50 * 1024 * 1024) {
      fs.unlinkSync(tempPath);
      console.log(`[download] Reject: file too large (${stats.size} octets) for ${filename}`);
      return res.status(400).json({ error: 'EXE files larger than 50MB are not allowed.' });
    }
    const fileSizeInBytes = parseInt(stats.size, 10);
    console.log(`[download] File size: ${fileSizeInBytes} bytes (type: ${typeof fileSizeInBytes})`);
    // TODO : implement scan file
    const fileId = Date.now().toString();
    
    return res.json({
      id: fileId,
      name: filename,
      size: fileSizeInBytes,
      type: 'exe',
      status: 'completed',
      date: Date.now()
    }); 
  } catch (err) {
    console.log(`[download] Server error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
