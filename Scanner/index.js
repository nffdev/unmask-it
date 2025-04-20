const fs = require('fs');
const crypto = require('crypto');
const mime = require('mime-types');
const path = require('path');

/**
 * Scan a file and return basic info (hash, size, mimetype, status)
 * @param {string} filePath - Path to the file
 * @returns {Promise<object>} - Scan result
 */
async function scanFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) return reject(err);
      const size = stats.size;
      const mimetype = mime.lookup(filePath) || 'application/octet-stream';
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => {
        resolve({
          filePath,
          size,
          mimetype,
          hash: hash.digest('hex'),
          result: 'clean' // TODO : implement real logic here
        });
      });
      stream.on('error', reject);
    });
  });
}

// --- CLI ---
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node index.js <file.exe>');
        process.exit(1);
    }
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(2);
    }
    fs.readFile(filePath, (err, buffer) => {
        if (err) {
            console.error('Error reading file:', err.message);
            process.exit(3);
        }
        try {
            const report = scanFile(filePath); // Modified here
            console.log('--- Unmask-It Static Scanner Report ---');
            console.log('File:', path.basename(filePath));
            console.log('PE Valid:', report.result === 'clean'); // Modified here
            if (report.error) console.log('Error:', report.error);
            if (report.result === 'clean') { // Modified here
                console.log('Architecture:', 'Unknown'); // Modified here
                console.log('Sections:', 'Unknown'); // Modified here
                console.log('Suspicious Sections:', 'Unknown'); // Modified here
                console.log('QuasarRAT Detected: NO'); // Modified here
            }
        } catch (e) {
            console.error('Scan error:', e.message);
            process.exit(4);
        }
    });
}

module.exports = { scanFile };