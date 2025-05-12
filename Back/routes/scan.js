import express from 'express';
import multer from 'multer';
import { scanFile, getScanResult, isWindowsExecutable, scanGitHubRepository } from '../controllers/scanController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Scan from '../models/Scan.js';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res, next) => {
  const file = req.file;
  
  if (!file || !file.originalname.toLowerCase().endsWith('.exe')) {
    if (file && file.path) {
      try { fs.unlinkSync(file.path); } catch (err) { console.error(err); }
    }
    return res.status(400).json({ error: 'Only .exe files are allowed.' });
  }
  
  if (file.size > 50 * 1024 * 1024) {
    try { fs.unlinkSync(file.path); } catch (err) { console.error(err); }
    return res.status(400).json({ error: 'EXE files larger than 50MB are not allowed.' });
  }
  
  if (!isWindowsExecutable(file.path)) {
    try { fs.unlinkSync(file.path); } catch (err) { console.error(err); }
    console.log(`[scan] Reject: File is not a valid Windows executable: ${file.originalname}`);
    return res.status(400).json({ error: 'The uploaded file is not a valid Windows executable.' });
  }
  
  return scanFile(req, res, next);
});
router.get('/:id', getScanResult);

router.get('/', async (req, res) => {
  try {
    const scans = await Scan.find().sort({ scanDate: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/github', scanGitHubRepository);

export default router;