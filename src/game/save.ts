/**
 * Simple save/load for progress (localStorage).
 * Key: highest level completed (1–LEVEL_MAX). Volume: master (0–1), music (0–1).
 * Stars: per-level best count (e.g. { "6": 2, "7": 3 }).
 */

import { LEVEL_MAX } from './constants';

const STORAGE_KEY = 'harmonyofmask_maxLevel';
const VOLUME_STORAGE_KEY = 'harmonyofmask_volume';
const STARS_STORAGE_KEY = 'harmonyofmask_stars';

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
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(LEVEL_MAX, n));
  } catch {
    return 0;
  }
}

export function getLevelStars(level: number): number {
  try {
    const raw = localStorage.getItem(STARS_STORAGE_KEY);
    if (raw == null) return 0;
    const obj = JSON.parse(raw) as Record<string, number>;
    const n = obj[String(level)];
    return typeof n === 'number' ? Math.max(0, Math.min(3, n)) : 0;
  } catch {
    return 0;
  }
}

export function setLevelStars(level: number, count: number): void {
  try {
    const raw = localStorage.getItem(STARS_STORAGE_KEY);
    const obj: Record<string, number> = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const prev = obj[String(level)];
    if (typeof prev !== 'number' || count > prev) {
      obj[String(level)] = Math.max(0, Math.min(3, count));
      localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(obj));
    }
  } catch {
    // ignore
  }
}
