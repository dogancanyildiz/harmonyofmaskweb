/**
 * Simple save/load for progress (localStorage).
 * Key: highest level completed (1–5). Used for "continue" or level select later.
 * Volume: master (0–1), music (0–1).
 */

const STORAGE_KEY = 'harmonyofmask_maxLevel';
const VOLUME_STORAGE_KEY = 'harmonyofmask_volume';

export interface VolumePrefs {
  master: number;
  music: number;
}

export function getVolumePrefs(): VolumePrefs {
  try {
    const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (raw == null) return { master: 1, music: 0.5 };
    const parsed = JSON.parse(raw) as { master?: number; music?: number };
    return {
      master: Math.max(0, Math.min(1, Number(parsed.master) || 1)),
      music: Math.max(0, Math.min(1, Number(parsed.music) ?? 0.5)),
    };
  } catch {
    return { master: 1, music: 0.5 };
  }
}

export function setVolumePrefs(prefs: VolumePrefs): void {
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

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
