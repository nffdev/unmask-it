/**
 * Parse a PE (Portable Executable) file buffer and extract headers and section info
 * @param {Buffer} buffer - Buffer of the .exe file
 * @returns {object} Parsed PE info (headers, sections, etc.)
 * @throws {Error} If not a valid PE file
 */
function parsePE(buffer) {
  // Check DOS header signature 'MZ' (0x4D, 0x5A)
  if (buffer[0] !== 0x4D || buffer[1] !== 0x5A) {
    throw new Error('Not a valid DOS MZ executable');
  }

  // Offset to PE header is at 0x3C (60)
  const peOffset = buffer.readUInt32LE(0x3C);
  if (buffer[peOffset] !== 0x50 || buffer[peOffset+1] !== 0x45 || buffer[peOffset+2] !== 0x00 || buffer[peOffset+3] !== 0x00) {
    throw new Error('Not a valid PE header');
  }

  // --- COFF Header ---
  const machine = buffer.readUInt16LE(peOffset + 4);
  const numberOfSections = buffer.readUInt16LE(peOffset + 6);
  const timeDateStamp = buffer.readUInt32LE(peOffset + 8);
  const pointerToSymbolTable = buffer.readUInt32LE(peOffset + 12);
  const numberOfSymbols = buffer.readUInt32LE(peOffset + 16);
  const sizeOfOptionalHeader = buffer.readUInt16LE(peOffset + 20);
  const characteristics = buffer.readUInt16LE(peOffset + 22);

  // --- Optional Header ---
  const optionalHeaderOffset = peOffset + 24;
  const magic = buffer.readUInt16LE(optionalHeaderOffset);
  // more soon ... 

  // --- Section Table ---
  const sectionTableOffset = optionalHeaderOffset + sizeOfOptionalHeader;
  const sections = [];
  for (let i = 0; i < numberOfSections; i++) {
    const entryOffset = sectionTableOffset + i * 40;
    const name = buffer.slice(entryOffset, entryOffset + 8).toString('utf8').replace(/\0.*/, '');
    const virtualSize = buffer.readUInt32LE(entryOffset + 8);
    const virtualAddress = buffer.readUInt32LE(entryOffset + 12);
    const sizeOfRawData = buffer.readUInt32LE(entryOffset + 16);
    const pointerToRawData = buffer.readUInt32LE(entryOffset + 20);
    const characteristics = buffer.readUInt32LE(entryOffset + 36);
    sections.push({ name, virtualSize, virtualAddress, sizeOfRawData, pointerToRawData, characteristics });
  }

  return {
    dosHeader: {
      magic: buffer.toString('ascii', 0, 2),
      peHeaderOffset: peOffset
    },
    peHeader: {
      magic: buffer.toString('ascii', peOffset, peOffset+4),
      machine,
      numberOfSections,
      timeDateStamp,
      pointerToSymbolTable,
      numberOfSymbols,
      sizeOfOptionalHeader,
      characteristics
    },
    optionalHeader: {
      magic
      // more soon...
    },
    sections
  };
}

module.exports = { parsePE };