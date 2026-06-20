/* eslint-disable @typescript-eslint/no-var-requires */
// One-off icon generator for PWA assets. Run: node scripts/generate-icons.mjs
// Uses `sharp` (already a project dependency) to rasterize an SVG monogram.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'icons');

// Brand monogram. `pad` controls the safe zone for maskable icons.
function svg({ size, pad = 0, rounded = true }) {
  const r = rounded ? Math.round(size * 0.22) : 0;
  const fs = Math.round(size * 0.42);
  const dotR = Math.round(size * 0.05);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1c"/>
      <stop offset="60%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" rx="${pad ? 0 : r}" fill="${pad ? '#111111' : 'url(#g)'}"/>
  <g transform="translate(${size / 2}, ${size / 2})">
    <text x="0" y="${fs * 0.34}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${fs}" fill="#ffffff" text-anchor="middle" letter-spacing="-2">FT</text>
    <circle cx="${fs * 0.62}" cy="${fs * 0.34}" r="${dotR}" fill="#1151ff"/>
  </g>
</svg>`;
}

const targets = [
  { name: 'icon-192.png', size: 192, pad: 0 },
  { name: 'icon-512.png', size: 512, pad: 0 },
  // Maskable variants: flat background, content kept within the safe zone.
  { name: 'maskable-192.png', size: 192, pad: 1, rounded: false },
  { name: 'maskable-512.png', size: 512, pad: 1, rounded: false },
  // Apple touch icon (no transparency, square corners — iOS masks it).
  { name: 'apple-touch-icon.png', size: 180, pad: 1, rounded: false },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  for (const t of targets) {
    const buf = Buffer.from(svg(t));
    await sharp(buf).png().toFile(path.join(OUT, t.name));
    console.log('wrote', t.name);
  }
  // Favicon (32px) as PNG in public root.
  await sharp(Buffer.from(svg({ size: 32, pad: 0 })))
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
  console.log('wrote favicon.png');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
