/**
 * Adds a "blue" tile layer to each tilemap JSON by copying the "red" layer.
 * Run from project root: node scripts/add-blue-layer.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const mapKeys = ['tilemap', 'tilemap2', 'tilemap3', 'tilemap4', 'tilemap5'];

for (const mapKey of mapKeys) {
  const filePath = path.join(assetsDir, `${mapKey}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${mapKey}.json (not found)`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const hasBlue = data.layers.some((l) => l.name === 'blue');
  if (hasBlue) {
    console.log(`${mapKey}.json already has blue layer`);
    continue;
  }
  const redLayer = data.layers.find((l) => l.name === 'red');
  if (!redLayer) {
    console.warn(`Skip ${mapKey}.json (no red layer)`);
    continue;
  }
  const blueLayer = {
    ...redLayer,
    id: data.nextlayerid,
    name: 'blue',
    data: [...redLayer.data],
  };
  data.layers.push(blueLayer);
  data.nextlayerid += 1;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 0));
  console.log(`Added blue layer to ${mapKey}.json`);
}
