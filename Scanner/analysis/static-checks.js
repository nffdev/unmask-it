/**
 * Searches for a binary pattern or string in a Buffer
 * @param {Buffer} buffer - Buffer to analyze
 * @param {Buffer|string} pattern - Pattern to search for
 * @returns {boolean} true if found
 */
function findPattern(buffer, pattern) {
    if (typeof pattern === 'string') pattern = Buffer.from(pattern, 'utf8');
    return buffer.indexOf(pattern) !== -1;
}

/**
 * Extracts all ASCII strings of at least minLength characters
 * @param {Buffer} buffer
 * @param {number} minLength
 * @returns {string[]} Array of found strings
 */
function extractAsciiStrings(buffer, minLength = 4) {
    const results = [];
    let current = '';
    for (let i = 0; i < buffer.length; i++) {
        const c = buffer[i];
        if (c >= 32 && c <= 126) {
        current += String.fromCharCode(c);
        } else {
        if (current.length >= minLength) results.push(current);
        current = '';
        }
    }
    if (current.length >= minLength) results.push(current);
    return results;
}

/**
 * Extracts all Unicode (UTF-16LE) strings of at least minLength characters
 * @param {Buffer} buffer
 * @param {number} minLength
 * @returns {string[]} Array of found strings
 */
function extractUnicodeStrings(buffer, minLength = 4) {
    const results = [];
    let current = '';
    for (let i = 0; i < buffer.length - 1; i += 2) {
        const c = buffer.readUInt16LE(i);
        if (c >= 32 && c <= 126) {
        current += String.fromCharCode(c);
        } else {
        if (current.length >= minLength) results.push(current);
        current = '';
        }
    }
    if (current.length >= minLength) results.push(current);
    return results;
}

/**
 * Detects PE sections with suspicious flags (executable AND writable)
 * @param {Array} sections - List of PE sections
 * @returns {Array} List of suspicious sections
 */
function hasSuspiciousSectionFlags(sections) {
    // Common PE flags: 0x20000000 (executable), 0x80000000 (writable)
    return sections.filter(s =>
        (s.characteristics & 0x20000000) && (s.characteristics & 0x80000000)
    );
}

module.exports = {
    findPattern,
    extractAsciiStrings,
    extractUnicodeStrings,
    hasSuspiciousSectionFlags
};  