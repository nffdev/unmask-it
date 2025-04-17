import fs from 'fs';
import crypto from 'crypto';
import Scan from '../models/Scan.js';

function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

export async function scanFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file sent.' });
    }
    const { filename, originalname, mimetype, size, path: filePath } = req.file;
    const hash = await calculateFileHash(filePath);

    console.log(`[scanFile] Processing file: ${originalname}, size: ${size} bytes`);
    const scan = new Scan({ filename, originalname, mimetype, size, hash, result: 'clean' });
    await scan.save();
    // TODO : Implement real logic here

    res.status(201).json({ 
      id: scan._id, 
      filename, 
      hash, 
      size: size, 
      result: scan.result 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getScanResult(req, res) {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ error: 'Scan not found.' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
