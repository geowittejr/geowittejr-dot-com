// Builds the default social share image (public/og-image.png, 1200×630) from scripts/headshot.png.
// Run: node scripts/og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;
const PHOTO = 380;
const PHOTO_X = 90;
const PHOTO_Y = (H - PHOTO) / 2;

const src = fileURLToPath(new URL('./headshot.png', import.meta.url));
const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

// Theme tokens from src/styles/global.css (dark).
const bg = '#111214';
const fg = '#e8e8e8';
const muted = '#9aa0a6';
const accent = '#7aa2ff';

const circle = Buffer.from(
  `<svg width="${PHOTO}" height="${PHOTO}"><circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}"/></svg>`,
);
const photo = await sharp(src)
  .resize(PHOTO, PHOTO)
  .composite([{ input: circle, blend: 'dest-in' }])
  .png()
  .toBuffer();

const textX = PHOTO_X + PHOTO + 70;
const font = `font-family="Segoe UI, Helvetica, Arial, sans-serif"`;
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="${H - 12}" width="${W}" height="12" fill="${accent}"/>
  <circle cx="${PHOTO_X + PHOTO / 2}" cy="${H / 2}" r="${PHOTO / 2 + 6}" fill="none" stroke="${accent}" stroke-width="4"/>
  <text x="${textX}" y="270" ${font} font-size="72" font-weight="700" fill="${fg}">George Witte Jr.</text>
  <text x="${textX}" y="340" ${font} font-size="40" fill="${muted}">Senior Software Engineer</text>
  <text x="${textX}" y="420" ${font} font-size="32" font-weight="600" fill="${accent}">geowittejr.com</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
  .composite([
    { input: photo, left: PHOTO_X, top: PHOTO_Y },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`Wrote ${out}`);
