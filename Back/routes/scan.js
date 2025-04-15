import express from 'express';
import multer from 'multer';
import { scanFile, getScanResult } from '../controllers/scanController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Scan from '../models/Scan.js';

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
    return res.status(400).json({ error: 'Only .exe files are allowed.' });
  }
  if (file.size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'EXE files larger than 50MB are not allowed.' });
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

export default router;