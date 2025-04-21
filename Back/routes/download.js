import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { scanFile } from '../controllers/scanController.js';
import { isWindowsExecutable } from '../controllers/scanController.js';
import multer from 'multer';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

async function gofile(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!/gofile.io\/d\//gi.test(url)) return reject("Invalid URL!");
      const id = /https:\/\/gofile.io\/d\/([\d\w]+)/gi.exec(url)[1];

      if (!id) return reject("Folder ID Not Found");

      const BASE_API = "https://api.gofile.io";
      const BASE_URL = "https://gofile.io";
      
      console.log(`[gofile] Creating temporary account`);
      const acc = await fetch(BASE_API + "/accounts", {
        method: "POST",
        headers: {
          origin: BASE_URL,
          referer: `${BASE_URL}/`,
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        },
        body: "{}",
      }).then((v) => v.json());

      if (acc.status !== "ok") return reject("Error making account");
      const { token } = acc.data;
      console.log(`[gofile] Account created, token obtained`);

      console.log(`[gofile] Fetching content info for folder ID: ${id}`);
      const content = await fetch(
        BASE_API +
          "/contents/" +
          id +
          "?" +
          new URLSearchParams({ wt: "4fd6sg89d7s6" }),
        {
          method: "GET",
          headers: {
            origin: BASE_URL,
            referer: `${BASE_URL}/`,
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            authorization: `Bearer ` + token,
          },
        }
      ).then((v) => v.json());

      if (content.status !== "ok") return reject("Error Fetching Content");
      console.log(`[gofile] Content info retrieved successfully`);
      
      const data = content.data;
      
      data.token = token;
      data.baseUrl = BASE_URL;
      data.baseApi = BASE_API;
      
      resolve(data);
    } catch (e) {
      console.log(`[gofile] Error: ${e.message}`);
      reject(e);
    }
  });
}


router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    console.log('[download] Reject: No URL provided.');
    return res.status(400).json({ error: 'No URL provided.' });
  }
  try {
    let response;
    let filename = 'downloaded.exe';
    let tempPath;

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL.' });
    }

    const allowedDomains = [
      'gofile.io',
      'github.com',
      'raw.githubusercontent.com',
      'cdn.discordapp.com',
      'discord.com',
    ];
    const isAllowed = allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));
    if (!isAllowed) {
      return res.status(400).json({ error: 'URL must be from gofile.io, github.com, or discord.' });
    }

    if (parsedUrl.hostname.includes('gofile.io')) {
      try {
        console.log(`[download] Processing Gofile URL: ${url}`);
        const gofileData = await gofile(url);
        
        console.log(`[download] Gofile data structure: ${JSON.stringify(gofileData, null, 2)}`);
        
        let exeFile = null;
        
        if (gofileData.contents) {
          console.log(`[download] Gofile contents found, checking for .exe files`);
          
          for (const fileId in gofileData.contents) {
            const file = gofileData.contents[fileId];
            console.log(`[download] Checking file: ${file.name}, type: ${file.type}`);
            if (file.name && file.name.toLowerCase().endsWith('.exe')) {
              exeFile = file;
              break;
            }
          }
        } else if (gofileData.children) {
          console.log(`[download] Gofile children found, checking for .exe files`);
          
          for (const childId in gofileData.children) {
            const child = gofileData.children[childId];
            console.log(`[download] Checking child: ${child.name}, type: ${child.type}`);
            if (child.name && child.name.toLowerCase().endsWith('.exe')) {
              exeFile = child;
              break;
            }
          }
        }
        
        if (!exeFile) {
          console.log(`[download] Reject: No .exe file found in Gofile link`);
          return res.status(400).json({ error: 'No .exe file found in the Gofile link.' });
        }

        filename = exeFile.name;
        console.log(`[download] Found .exe file in Gofile: ${filename}`);

        console.log(`[download] Trying original Gofile link: ${exeFile.link}`);
        
        response = await fetch(exeFile.link, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Referer': `${gofileData.baseUrl}/d/${gofileData.code}`,
            'Cookie': `accountToken=${gofileData.token}`,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          }
        });
        
        if (!response.ok) {
          console.log(`[download] Reject: fetch failed for Gofile download link (status ${response.status})`);
          return res.status(400).json({ error: 'Failed to fetch file from Gofile.' });
        }
        
        console.log(`[download] Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
        console.log(`[download] Response type: ${response.type}`);
        console.log(`[download] Response status: ${response.status}`);
        console.log(`[download] Content-Type: ${response.headers.get('content-type')}`);
        console.log(`[download] Content-Length: ${response.headers.get('content-length')}`);
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.log(`[download] Reject: Gofile returned HTML instead of a file`);
          return res.status(400).json({ error: 'The Gofile link did not return a valid file.' });
        }
        
      } catch (error) {
        console.log(`[download] Gofile processing error: ${error.message}`);
        return res.status(400).json({ error: `Error processing Gofile link: ${error.message}` });
      }
    } else {
      response = await fetch(url);
      if (!response.ok) {
        console.log(`[download] Reject: fetch failed for ${url} (status ${response.status})`);
        return res.status(400).json({ error: 'Failed to fetch file from URL.' });
      }

      const contentDisposition = response.headers.get('content-disposition');
      filename = url.split('/').pop() || 'downloaded.exe';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match) filename = match[1];
      }
    }

    if (!filename.toLowerCase().endsWith('.exe')) {
      console.log(`[download] Reject: Invalid file type for ${filename}`);
      return res.status(400).json({ error: 'Only .exe files are allowed.' });
    }

    tempPath = path.join(uploadsDir, Date.now() + '-' + filename);
    console.log(`[download] Saving file to: ${tempPath}`);
    const fileStream = fs.createWriteStream(tempPath);
    
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on('error', (err) => {
        console.log(`[download] Error during file write: ${err.message}`);
        reject(err);
      });
      fileStream.on('finish', () => {
        console.log(`[download] File write completed`);
        resolve();
      });
    });
    
    try {
      const stats = fs.statSync(tempPath);
      console.log(`[download] File size after download: ${stats.size} bytes`);
      
      const buffer = Buffer.alloc(16);
      const fd = fs.openSync(tempPath, 'r');
      fs.readSync(fd, buffer, 0, 16, 0);
      fs.closeSync(fd);
      
      console.log(`[download] First 16 bytes: ${buffer.toString('hex')}`);
      console.log(`[download] MZ check: ${buffer[0] === 0x4D && buffer[1] === 0x5A}`);
      
      if (buffer[0] !== 0x4D || buffer[1] !== 0x5A) {
        if (buffer.toString().toLowerCase().includes('<!doctype html') || 
            buffer.toString().toLowerCase().includes('<html')) {
          console.log(`[download] Detected HTML content instead of executable`);
          
          const htmlContent = fs.readFileSync(tempPath, 'utf8');
          const redirectMatch = htmlContent.match(/window\.location\.href\s*=\s*["']([^"']+)["']/i) ||
                              htmlContent.match(/location\.replace\(["']([^"']+)["']\)/i) ||
                              htmlContent.match(/http-equiv=["']refresh["']\s+content=["']\d+;\s*url=([^"']+)["']/i);
          
          if (redirectMatch && redirectMatch[1]) {
            const redirectUrl = redirectMatch[1];
            console.log(`[download] Found redirect URL in HTML: ${redirectUrl}`);
            
            fs.unlinkSync(tempPath);
            
            console.log(`[download] Trying redirect URL: ${redirectUrl}`);
            const redirectResponse = await fetch(redirectUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
              }
            });
            
            if (!redirectResponse.ok) {
              console.log(`[download] Redirect fetch failed (status ${redirectResponse.status})`);
              return res.status(400).json({ error: 'Failed to fetch file from redirect URL.' });
            }
            
            const redirectStream = fs.createWriteStream(tempPath);
            await new Promise((resolve, reject) => {
              redirectResponse.body.pipe(redirectStream);
              redirectResponse.body.on('error', (err) => {
                console.log(`[download] Error during redirect file write: ${err.message}`);
                reject(err);
              });
              redirectStream.on('finish', () => {
                console.log(`[download] Redirect file write completed`);
                resolve();
              });
            });
            
            const redirectBuffer = Buffer.alloc(16);
            const redirectFd = fs.openSync(tempPath, 'r');
            fs.readSync(redirectFd, redirectBuffer, 0, 16, 0);
            fs.closeSync(redirectFd);
            
            console.log(`[download] Redirect file first 16 bytes: ${redirectBuffer.toString('hex')}`);
            console.log(`[download] Redirect MZ check: ${redirectBuffer[0] === 0x4D && redirectBuffer[1] === 0x5A}`);
            
            if (redirectBuffer[0] !== 0x4D || redirectBuffer[1] !== 0x5A) {
              fs.unlinkSync(tempPath);
              console.log(`[download] Reject: Redirected file is not a valid Windows executable`);
              return res.status(400).json({ error: 'The downloaded file is not a valid Windows executable.' });
            }
          }
        }
      }
    } catch (err) {
      console.log(`[download] Error checking file: ${err.message}`);
    }
    
    if (!isWindowsExecutable(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log(`[download] Reject: File is not a valid Windows executable: ${filename}`);
      return res.status(400).json({ error: 'The downloaded file is not a valid Windows executable.' });
    }
    
    const stats = fs.statSync(tempPath);
    console.log(`[download] File size: ${stats.size} bytes for ${filename}`);
    if (stats.size > 50 * 1024 * 1024) {
      fs.unlinkSync(tempPath);
      console.log(`[download] Reject: file too large (${stats.size} octets) for ${filename}`);
      return res.status(400).json({ error: 'EXE files larger than 50MB are not allowed.' });
    }
    const fileSizeInBytes = parseInt(stats.size, 10);
    console.log(`[download] File size: ${fileSizeInBytes} bytes (type: ${typeof fileSizeInBytes})`);
    console.log(`[download] Downloaded successfully, now scanning...`);
    const buffer = await fs.promises.readFile(tempPath);
    const report = (await import('../../Scanner/scanner.js')).default.scanFile(buffer);
    const result = report.quasar && report.quasar.found ? 'malicious' : 'clean';
    const fileId = Date.now().toString();

    return res.json({
      id: fileId,
      name: filename,
      size: fileSizeInBytes,
      type: 'exe',
      status: 'completed',
      result,
      report,
      date: Date.now()
    }); 
  } catch (err) {
    console.log(`[download] Server error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
