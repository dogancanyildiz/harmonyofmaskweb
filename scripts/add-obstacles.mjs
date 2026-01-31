/**
 * Applies Level 1 obstacle logic to tilemap2–5.
 * L1 has green-only, red-only, and both (B) platforms at multiple rows; we scale to map size
 * and optionally add ground gaps (L3+) and blue-only segments (L3+).
 * Run from project root: node scripts/add-obstacles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

const W1 = 35;
const H1 = 12;
/** L1 obstacle segments above ground (row 11 = ground). layer: 'G' | 'R' | 'B' */
const L1_SEGMENTS = [
  { row: 5, cStart: 28, cEnd: 32, layer: 'R' },
  { row: 6, cStart: 22, cEnd: 26, layer: 'G' },
  { row: 7, cStart: 5, cEnd: 8, layer: 'R' },
  { row: 7, cStart: 18, cEnd: 19, layer: 'R' },
  { row: 7, cStart: 20, cEnd: 22, layer: 'B' },
  { row: 7, cStart: 23, cEnd: 28, layer: 'G' },
  { row: 8, cStart: 3, cEnd: 6, layer: 'G' },
  { row: 8, cStart: 8, cEnd: 11, layer: 'R' },
  { row: 8, cStart: 12, cEnd: 14, layer: 'B' },
  { row: 8, cStart: 15, cEnd: 15, layer: 'G' },
  { row: 8, cStart: 20, cEnd: 28, layer: 'G' },
  { row: 9, cStart: 8, cEnd: 14, layer: 'R' },
];

function idx(w, row, col) {
  return row * w + col;
}
function setRange(data, w, row, cStart, cEnd, val) {
  for (let c = cStart; c <= cEnd; c++) data[idx(w, row, c)] = val;
}

/** Scale column from L1 width (35) to target width. */
function scaleCol(c, targetW) {
  return Math.floor((c * targetW) / W1);
}
/** Map L1 row to target map row (L1 ground row 11 -> target bottomRow). */
function scaleRow(r1, targetH) {
  const bottomRow = targetH - 1;
  return r1 + (bottomRow - 11); // L1 ground is row 11
}

function applyObstacles(filePath, level) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const w = data.width;
  const h = data.height;
  const bottomRow = h - 1;

  const green = data.layers.find((l) => l.name === 'green');
  const red = data.layers.find((l) => l.name === 'red');
  const blue = data.layers.find((l) => l.name === 'blue');
  if (!green || !red) return;

  // Clear all rows above ground
  for (let row = 0; row < bottomRow; row++) {
    for (let col = 0; col < w; col++) {
      green.data[idx(w, row, col)] = 0;
      red.data[idx(w, row, col)] = 0;
      if (blue) blue.data[idx(w, row, col)] = 0;
    }
  }

  // Ground gaps (L3+)
  if (level >= 3) {
    setRange(green.data, w, bottomRow, 10, 12, 0);
    setRange(red.data, w, bottomRow, 10, 12, 0);
    if (blue) setRange(blue.data, w, bottomRow, 10, 12, 0);
    setRange(green.data, w, bottomRow, 22, 24, 0);
    setRange(red.data, w, bottomRow, 22, 24, 0);
    if (blue) setRange(blue.data, w, bottomRow, 22, 24, 0);
    setRange(green.data, w, bottomRow, 35, 37, 0);
    setRange(red.data, w, bottomRow, 35, 37, 0);
    if (blue) setRange(blue.data, w, bottomRow, 35, 37, 0);
  }
  if (level >= 4) {
    setRange(green.data, w, bottomRow, 5, 6, 0);
    setRange(red.data, w, bottomRow, 5, 6, 0);
    if (blue) setRange(blue.data, w, bottomRow, 5, 6, 0);
    setRange(green.data, w, bottomRow, 30, 31, 0);
    setRange(red.data, w, bottomRow, 30, 31, 0);
    if (blue) setRange(blue.data, w, bottomRow, 30, 31, 0);
  }
  if (level === 5) {
    setRange(green.data, w, bottomRow, 18, 19, 0);
    setRange(red.data, w, bottomRow, 18, 19, 0);
    if (blue) setRange(blue.data, w, bottomRow, 18, 19, 0);
  }
  // L6–8: more ground gaps (harder)
  if (level >= 6) {
    setRange(green.data, w, bottomRow, 8, 9, 0);
    setRange(red.data, w, bottomRow, 8, 9, 0);
    if (blue) setRange(blue.data, w, bottomRow, 8, 9, 0);
    setRange(green.data, w, bottomRow, 26, 27, 0);
    setRange(red.data, w, bottomRow, 26, 27, 0);
    if (blue) setRange(blue.data, w, bottomRow, 26, 27, 0);
  }
  if (level >= 7) {
    setRange(green.data, w, bottomRow, 17, 18, 0);
    setRange(red.data, w, bottomRow, 17, 18, 0);
    if (blue) setRange(blue.data, w, bottomRow, 17, 18, 0);
    setRange(green.data, w, bottomRow, 38, 39, 0);
    setRange(red.data, w, bottomRow, 38, 39, 0);
    if (blue) setRange(blue.data, w, bottomRow, 38, 39, 0);
  }
  if (level === 8) {
    setRange(green.data, w, bottomRow, 2, 3, 0);
    setRange(red.data, w, bottomRow, 2, 3, 0);
    if (blue) setRange(blue.data, w, bottomRow, 2, 3, 0);
    setRange(green.data, w, bottomRow, 42, 43, 0);
    setRange(red.data, w, bottomRow, 42, 43, 0);
    if (blue) setRange(blue.data, w, bottomRow, 42, 43, 0);
  }

  // Apply L1-style segments (scaled to this map)
  for (const seg of L1_SEGMENTS) {
    const row = scaleRow(seg.row, h);
    const cStart = scaleCol(seg.cStart, w);
    const cEnd = scaleCol(seg.cEnd, w);
    if (row >= bottomRow || row < 0) continue;
    if (seg.layer === 'G') {
      setRange(green.data, w, row, cStart, cEnd, 1);
    } else if (seg.layer === 'R') {
      setRange(red.data, w, row, cStart, cEnd, 1);
    } else {
      setRange(green.data, w, row, cStart, cEnd, 1);
      setRange(red.data, w, row, cStart, cEnd, 1);
    }
  }

  // L3+: add one blue-only platform (bridge) so blue mask is required
  if (level >= 3 && blue) {
    const r1 = bottomRow - 1;
    setRange(blue.data, w, r1, scaleCol(32, w), scaleCol(34, w), 1);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 0));
  console.log(`Applied L1-style obstacles to tilemap${level}.json`);
}

for (const level of [2, 3, 4, 5, 6, 7, 8]) {
  const filePath = path.join(assetsDir, `tilemap${level}.json`);
  if (fs.existsSync(filePath)) applyObstacles(filePath, level);
}
