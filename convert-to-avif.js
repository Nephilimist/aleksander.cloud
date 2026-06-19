/**
 * convert-to-avif.js
 *
 * Konwertuje wszystkie .jpg / .jpeg / .png z assets/img/ na .avif
 * Resize: max 1400px szerokości (wystarczy na card 2x retina)
 * Jakość AVIF: 60 (dobry balans rozmiar/jakość)
 *
 * Użycie:
 *   node convert-to-avif.js           # pomija już istniejące .avif
 *   node convert-to-avif.js --force   # nadpisuje wszystkie
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'assets', 'img');
const QUALITY = 60;
const MAX_WIDTH = 1400;
const FORCE = process.argv.includes('--force');

const EXTS = ['.jpg', '.jpeg', '.png'];

async function convert(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTS.includes(ext)) return;

  const avifPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  if (!FORCE && fs.existsSync(avifPath)) {
    console.log('  skip (exists): ' + path.basename(avifPath));
    return;
  }

  const statBefore = fs.statSync(filePath).size;

  await sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .avif({ quality: QUALITY, effort: 6 })
    .toFile(avifPath);

  const statAfter = fs.statSync(avifPath).size;
  const saving = (((statBefore - statAfter) / statBefore) * 100).toFixed(0);

  console.log(
    '  ' + path.basename(filePath).padEnd(30) +
    (statBefore / 1024).toFixed(0).padStart(6) + ' KB  →  ' +
    (statAfter / 1024).toFixed(0).padStart(5) + ' KB  (' + saving + '% smaller)'
  );
}

(async () => {
  console.log('📦 Converting images to AVIF...\n');
  console.log('  Dir:     ' + IMG_DIR);
  console.log('  Quality: ' + QUALITY);
  console.log('  MaxW:    ' + MAX_WIDTH + 'px');
  console.log('  Force:   ' + FORCE + '\n');

  const files = fs.readdirSync(IMG_DIR)
    .filter(f => EXTS.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(IMG_DIR, f));

  for (const f of files) {
    await convert(f);
  }

  // Summary
  const avifFiles = fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.avif'));
  const totalKB = avifFiles
    .map(f => fs.statSync(path.join(IMG_DIR, f)).size)
    .reduce((a, b) => a + b, 0) / 1024;

  console.log('\n✅ Done! ' + avifFiles.length + ' AVIF files, total: ' + totalKB.toFixed(0) + ' KB');
})();
