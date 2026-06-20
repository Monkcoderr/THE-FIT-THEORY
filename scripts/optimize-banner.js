const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '..', 'Assets', 'banner.png');
const outputDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Optimizing banner image...');

// 1. Desktop version: width 1600px
const optimizeDesktop = sharp(inputPath)
  .resize({ width: 1600 })
  .webp({ quality: 85 })
  .toFile(path.join(outputDir, 'banner-desktop.webp'))
  .then((info) => {
    console.log(`Optimized banner-desktop.webp created: ${Math.round(info.size / 1024)} KB`);
  });

// 2. Mobile version: width 800px
const optimizeMobile = sharp(inputPath)
  .resize({ width: 800 })
  .webp({ quality: 80 })
  .toFile(path.join(outputDir, 'banner-mobile.webp'))
  .then((info) => {
    console.log(`Optimized banner-mobile.webp created: ${Math.round(info.size / 1024)} KB`);
  });

Promise.all([optimizeDesktop, optimizeMobile])
  .then(() => {
    console.log('All images optimized successfully!');
  })
  .catch(err => {
    console.error('Error optimizing banner image:', err);
    process.exit(1);
  });
