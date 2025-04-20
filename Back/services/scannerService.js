const path = require('path');
const fs = require('fs');
const scanner = require('../../Scanner/scanner');

/**
 * Scans a buffer (PE file)
 * @param {Buffer} buffer
 * @returns {object} analysis report
 */
function scanFileBuffer(buffer) {
    return scanner.scanFile(buffer);
}

/**
 * Scans a file from disk
 * @param {string} filePath
 * @returns {Promise<object>} analysis report
 */
function scanFileFromDisk(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
            if (err) return reject(err);
            try {
                const report = scanner.scanFile(buffer);
                resolve(report);
            } catch (e) {
                reject(e);
            }
        });
    });
}

module.exports = {
    scanFileBuffer,
    scanFileFromDisk
};
