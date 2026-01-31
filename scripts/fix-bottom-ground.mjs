/**
 * Ensures every level has a full bottom row (ground) in both green and red layers,
 * like level 1. Reads tilemap2–5, sets last row to all 1s, writes back.
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
    const start = len - width;
    for (let i = start; i < len; i++) data[i] = 1;
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 0));
  console.log('Fixed bottom row:', file);
}

console.log('Done.');
