import fs from 'fs';
import crypto from 'crypto';
import Scan from '../models/Scan.js';
import scanner from '../../Scanner/scanner.js';

export function isWindowsExecutable(filePath) {
  try {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    
    return buffer[0] === 0x4D && buffer[1] === 0x5A;
  } catch (error) {
    console.error(`Error checking file signature: ${error.message}`);
    return false;
  }
}

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

    const buffer = await fs.promises.readFile(filePath);
    const report = scanner.scanFile(buffer);
    const result = report.quasar && report.quasar.found ? 'malicious' : 'clean';

    const scan = new Scan({ filename, originalname, mimetype, size, hash, result, report });
    await scan.save();

    res.status(201).json({ 
      id: scan._id, 
      filename, 
      hash, 
      size: size, 
      result,
      report
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
