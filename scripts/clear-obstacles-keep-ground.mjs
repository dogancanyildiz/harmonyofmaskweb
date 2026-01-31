/**
 * Level 2–5: Clear all obstacles (engeller), keep only ground (bottom row).
 * Green and red layers: everything above the last row becomes 0; last row stays full (1).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

const files = ['tilemap2.json', 'tilemap3.json', 'tilemap4.json', 'tilemap5.json'];

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const width = json.width;

  for (const layer of json.layers) {
    if (layer.name !== 'green' && layer.name !== 'red') continue;
    const data = layer.data;
    const len = data.length;
    const groundStart = len - width;
    // Clear everything above ground (obstacles)
    for (let i = 0; i < groundStart; i++) data[i] = 0;
    // Keep ground row full
    for (let i = groundStart; i < len; i++) data[i] = 1;
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 0));
  console.log('Cleared obstacles, kept ground:', file);
}

console.log('Done.');
