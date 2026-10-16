// Builds the default social share image (public/og-image.png, 1200×630) from public/geowittejr.png.
// Colors come from the dark theme tokens in src/styles/global.css, including --headshot-bg, the fill
// behind the transparent headshot. Change them there and rerun: node scripts/og-image.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;
const PHOTO = 380;
const PHOTO_X = 90;
const PHOTO_Y = (H - PHOTO) / 2;

const src = fileURLToPath(new URL('../public/geowittejr.png', import.meta.url));
const css = fileURLToPath(new URL('../src/styles/global.css', import.meta.url));
const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

/** Reads the `--name: value;` custom properties declared in the first rule for `selector`. */
function tokens(source, selector) {
  const start = source.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No "${selector}" rule in ${css}`);
  const body = source.slice(start, source.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
}

const { bg, fg, muted, accent, 'headshot-bg': headshotBg } = tokens(
  await readFile(css, 'utf8'),
  ":root[data-theme='dark']",
);

const r = PHOTO / 2;
const disc = Buffer.from(
  `<svg width="${PHOTO}" height="${PHOTO}"><circle cx="${r}" cy="${r}" r="${r}" fill="${headshotBg}"/></svg>`,
);
const mask = Buffer.from(`<svg width="${PHOTO}" height="${PHOTO}"><circle cx="${r}" cy="${r}" r="${r}"/></svg>`);
// Square crop of the 1000×1000 source that zooms in on the head (top at y≈129, chin at y≈790, centered at
// x≈500): half the original space above the head and below the chin.
const CROP = { left: 85, top: 65, width: 830, height: 830 };
const face = await sharp(src).extract(CROP).resize(PHOTO, PHOTO).png().toBuffer();
// The headshot is transparent, so lay it over a filled disc, then clip both to a circle.
const photo = await sharp(disc)
  .composite([{ input: face }, { input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const textX = PHOTO_X + PHOTO + 70;
const font = `font-family="Segoe UI, Helvetica, Arial, sans-serif"`;
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="${H - 12}" width="${W}" height="12" fill="${accent}"/>
  <circle cx="${PHOTO_X + r}" cy="${H / 2}" r="${r + 6}" fill="none" stroke="${accent}" stroke-width="4"/>
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
