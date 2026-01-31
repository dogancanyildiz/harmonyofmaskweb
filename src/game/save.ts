/**
 * Simple save/load for progress (localStorage).
 * Key: highest level completed (1–5). Used for "continue" or level select later.
 */

const STORAGE_KEY = 'harmonyofmask_maxLevel';

export function saveLastCompletedLevel(level: number): void {
  try {
    const current = getLastCompletedLevel();
    if (level > current) {
      localStorage.setItem(STORAGE_KEY, String(level));
    }
  } catch {
    // localStorage disabled or full
  }
}

export function getLastCompletedLevel(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
  } catch {
    return 0;
  }
}
