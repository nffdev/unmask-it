# Scanner

Minimal file scanner module for Unmask-it.

## Usage

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

- v1: always returns `result: clean`.
- Designed to be easily extensible for future malware checks.
