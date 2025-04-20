const { findPattern, extractAsciiStrings, extractUnicodeStrings, hasSuspiciousSectionFlags } = require('../analysis/static-checks');

// Typical ASCII/Unicode strings found in QuasarRAT
const QUASAR_STRINGS = [
    'quasar',
    'Quasar Client',
    'quasar.exe',
    'QuasarRAT',
    'Quasar.Settings',
    'Quasar.Server',
    'Quasar.Common'
];

// Typical or suspicious section names
const QUASAR_SECTIONS = [
    '.quasar',
    '.data',
    '.bss'
];

/**
 * Detects QuasarRAT in a PE binary using static signatures
 * @param {Buffer} buffer - File buffer
 * @param {object} peInfo - PE info extracted by parsePE
 * @returns {object} { found: boolean, details: array }
 */
function detectQuasar(buffer, peInfo) {
    const details = [];
    let found = false;

    // Search for typical strings (ASCII & Unicode)
    const asciiStrings = extractAsciiStrings(buffer, 6);
    const unicodeStrings = extractUnicodeStrings(buffer, 6);
    for (const sig of QUASAR_STRINGS) {
        if (asciiStrings.some(s => s.toLowerCase().includes(sig.toLowerCase()))) {
            details.push(`ASCII string found: "${sig}"`);
            found = true;
        }
        if (unicodeStrings.some(s => s.toLowerCase().includes(sig.toLowerCase()))) {
            details.push(`Unicode string found: "${sig}"`);
            found = true;
        }
    }

    // Search for typical/suspicious section names
    if (peInfo && peInfo.sections) {
        for (const sec of peInfo.sections) {
            if (QUASAR_SECTIONS.includes(sec.name)) {
                details.push(`Suspicious section name: ${sec.name}`);
                found = true;
            }
        }
        // Check for suspicious flags on sections
        const susSections = hasSuspiciousSectionFlags(peInfo.sections);
        if (susSections.length > 0) {
            details.push(`Sections with suspicious flags: ${susSections.map(s => s.name).join(', ')}`);
            found = true;
        }
    }

    return { found, details };
}

module.exports = { detectQuasar };