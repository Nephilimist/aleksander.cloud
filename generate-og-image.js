
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const OUT   = path.join(__dirname, 'assets', 'img', 'og-image.png');
const PHOTO = path.join(__dirname, 'assets', 'img', 'aleksander.png');
const W = 1200, H = 630;

const BG     = '#05060f';
const SURFACE= '#0d1021';
const ACCENT = '#a5ffcb';
const TEXT   = '#f5f5ff';
const MUTED  = 'rgba(245,245,255,0.65)';

(async () => {
  const photoResized = await sharp(PHOTO)
    .resize({ height: 580, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const photoMeta = await sharp(photoResized).metadata();
  const photoW = photoMeta.width;
  const photoLeft = W - photoW - 30;
  const photoTop  = H - photoMeta.height; // Align to bottom

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${BG}" />
    <rect x="0" y="0" width="${photoLeft + 40}" height="${H}" fill="${SURFACE}" opacity="0.5" />
    <rect x="60" y="110" width="4" height="70" rx="2" fill="${ACCENT}" />
    <text x="80" y="138" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="500" letter-spacing="4" fill="${ACCENT}">WORDPRESS DEVELOPER</text>
    <text x="80" y="218" font-family="system-ui,-apple-system,sans-serif" font-size="68" font-weight="700" fill="${TEXT}">Aleksander</text>
    <text x="80" y="290" font-family="system-ui,-apple-system,sans-serif" font-size="68" font-weight="700" fill="${TEXT}">Banaszak</text>
    <text x="80" y="380" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="${MUTED}">Custom themes · Elementor · ACF · WooCommerce</text>
    <text x="80" y="412" font-family="system-ui,-apple-system,sans-serif" font-size="22" fill="${MUTED}">API integrations · Performance optimisation</text>
  </svg>`;

  await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: photoResized, top: photoTop, left: photoLeft }
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log('OK: og-image.png saved (' + kb + ' KB, 1200x630)');
})();
