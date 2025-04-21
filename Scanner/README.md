# malware-scanner npm package

[![npm version](https://img.shields.io/npm/v/malware-scanner.svg)](https://www.npmjs.com/package/malware-scanner)

Minimal file scanner module for Unmask-it. This package allows you to analyze and validate executable files (PE) and detect suspicious or malicious characteristics.

## Installation (npm)
```bash
npm install malware-scanner
```

## Usage (npm)
```js
const scanner = require('malware-scanner');

scanner.scanFile('path/to/file.exe')
  .then(report => {
    console.log(report);
  })
  .catch(err => {
    console.error('Scan failed:', err);
  });
```

## Repository
[https://github.com/nffdev/unmask-it](https://github.com/nffdev/unmask-it)

---

## Usage (local module)

```js
const { scanFile } = require('./Scanner');

scanFile('/path/to/file').then(result => {
  console.log(result);
});
```

**Result example:**
```json
{
  "filePath": "/path/to/file",
  "size": 12345,
  "mimetype": "application/pdf",
  "hash": "...",
  "result": "clean"
}
```

---

- v1: only work for QuasarRAT