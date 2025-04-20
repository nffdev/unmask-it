const { parsePE } = require('./analysis/pe-parser');
const { detectQuasar } = require('./signatures/quasar');

/**
 * Scan a Windows executable buffer and return a global report
 * @param {Buffer} buffer
 * @returns {object} Analysis report (validity, metadata, Quasar detection, etc.)
 */
function scanFile(buffer) {
    let isPE = false;
    let peInfo = null;
    let error = null;
    let arch = null;
    let suspiciousSections = [];
    let quasar = { found: false, details: [] };

    try {
        peInfo = parsePE(buffer);
        isPE = true;
        // Architecture : 0x014c = x86, 0x8664 = x64, 0x01c0 = ARM
        switch (peInfo.peHeader.machine) {
            case 0x014c: arch = 'x86'; break;
            case 0x8664: arch = 'x64'; break;
            case 0x01c0: arch = 'ARM'; break;
            default: arch = 'unknown';
        }
    } catch (e) {
        error = e.message;
    }

    // 2. QuasarRAT Detection (if PE is valid)
    if (isPE) {
        quasar = detectQuasar(buffer, peInfo);
        suspiciousSections = require('./analysis/static-checks').hasSuspiciousSectionFlags(peInfo.sections);
    }

    // 3. Global report
    return {
        isPE,
        error,
        arch,
        peInfo,
        suspiciousSections,
        quasar: quasar.found ? quasar : null
    };
}

module.exports = { scanFile };