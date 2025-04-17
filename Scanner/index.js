const fs = require('fs');
const crypto = require('crypto');
const mime = require('mime-types');

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

module.exports = { scanFile };