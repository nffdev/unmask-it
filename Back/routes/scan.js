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

router.post('/', upload.single('file'), scanFile);
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