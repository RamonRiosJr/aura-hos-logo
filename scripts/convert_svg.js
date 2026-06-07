import sharp from 'sharp';
import fs from 'fs';

const input = 'src/assets/aura-hos.svg';
const output = 'src/assets/aura-hos.png';

async function convert() {
  try {
    await sharp(input)
      .resize(200) // Ensure a safe, decent resolution for emails
      .png()
      .toFile(output);
    console.log('Conversion successful!');
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}

convert();
