const sharp = require('sharp');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'Assets', 'banner.png');

sharp(imagePath)
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    
    // Sample a few pixels from the left edge (x = 0, at various y)
    console.log('Left Edge Pixels (x = 0):');
    for (let y = 0; y < height; y += Math.floor(height / 5)) {
      const idx = y * width * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      console.log(`y=${y}: rgb(${r}, ${g}, ${b})`);
    }

    // Sample a few pixels from the right edge (x = width - 1, at various y)
    console.log('\nRight Edge Pixels (x = width - 1):');
    for (let y = 0; y < height; y += Math.floor(height / 5)) {
      const idx = (y * width + (width - 1)) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      console.log(`y=${y}: rgb(${r}, ${g}, ${b})`);
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });
