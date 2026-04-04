// screenshot.mjs — Jacob Digital visual QA tool
// Usage: node screenshot.mjs [url] [label]
// Defaults: url = http://localhost:3000, label = ''
// Output: temporary screenshots/screenshot-N[-label].png

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url    = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] ? '-' + process.argv[3] : '';
const outDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Auto-increment screenshot number
function nextIndex() {
  const files = fs.readdirSync(outDir).filter(f => f.startsWith('screenshot-'));
  if (files.length === 0) return 1;
  const nums = files.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'));
  return Math.max(...nums) + 1;
}

async function take(page, width, suffix) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  // Allow fonts to render
  await new Promise(r => setTimeout(r, 800));

  const idx  = nextIndex();
  const file = path.join(outDir, `screenshot-${idx}${label}-${suffix}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('Saved:', file);
  return file;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const pageDesktop = await browser.newPage();
  await take(pageDesktop, 1440, 'desktop');
  await pageDesktop.close();

  const pageMobile = await browser.newPage();
  await take(pageMobile, 375, 'mobile');
  await pageMobile.close();

  await browser.close();
  console.log('Done.');
})();
