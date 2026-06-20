const sharp = require('sharp');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'Assets', 'banner.png');

sharp(imagePath)
  .metadata()
  .then(metadata => {
    console.log('Image Metadata:', JSON.stringify(metadata, null, 2));
  })
  .catch(err => {
    console.error('Error reading image metadata:', err);
  });
