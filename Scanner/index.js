const fs = require('fs');
const path = require('path');
const { scanFile } = require('./scanner');

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
            const report = scanFile(buffer);
            console.log('--- Unmask-It Static Scanner Report ---');
            console.log('File:', path.basename(filePath));
            console.log('PE Valid:', report.isPE);
            if (report.error) console.log('Error:', report.error);
            if (report.isPE) {
                console.log('Architecture:', report.arch);
                console.log('Sections:', report.peInfo.sections.map(s => s.name).join(', '));
                if (report.suspiciousSections.length > 0) {
                    console.log('Suspicious Sections:', report.suspiciousSections.map(s => s.name).join(', '));
                }
                if (report.quasar) {
                    console.log('QuasarRAT Detected:', report.quasar.found ? 'YES' : 'NO');
                    if (report.quasar.details.length > 0) {
                        console.log('Details:');
                        for (const d of report.quasar.details) console.log(' -', d);
                    }
                } else {
                    console.log('QuasarRAT Detected: NO');
                }
            }
        } catch (e) {
            console.error('Scan error:', e.message);
            process.exit(4);
        }
    });
}