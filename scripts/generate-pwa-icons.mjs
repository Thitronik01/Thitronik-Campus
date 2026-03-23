import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

const svg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1D3661" />
  <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle">THI</text>
  <text x="50%" y="82%" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#4AADCE" text-anchor="middle">CAMPUS</text>
</svg>`;

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function createIcon(size, filename) {
  const svgBuffer = Buffer.from(svg);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, filename));
}

async function generate() {
    try {
        await createIcon(192, 'icon-192.png');
        await createIcon(512, 'icon-512.png');
        // Apple Touch Icon must be 180x180 and opaque
        await createIcon(180, 'apple-touch-icon.png');
        console.log('Icons generated successfully.');
    } catch (error) {
        console.error('Failed to generate icons:', error);
    }
}

generate();
