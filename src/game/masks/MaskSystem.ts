import type { Tilemaps } from 'phaser';
import { MaskType } from './MaskType';

/** One mask's tile layer (visibility only; collision is always on). */
export interface MaskLayerEntry {
  maskType: MaskType;
  layer: Tilemaps.TilemapLayer;
}

/**
 * Toggles which mask layer is visible. Collision with all layers is always active.
 */
export class MaskSystem {
  private entries: Map<MaskType, MaskLayerEntry> = new Map();
  private _activeMask: MaskType;

  constructor(entries: MaskLayerEntry[], defaultMask: MaskType) {
    for (const e of entries) {
      this.entries.set(e.maskType, e);
    }
    this._activeMask = defaultMask;
    this.apply();
  }

  get activeMask(): MaskType {
    return this._activeMask;
  }

  /** Set the active mask; only its layer is visible (collision stays on for all). */
  setActiveMask(type: MaskType): void {
    if (!this.entries.has(type)) return;
    this._activeMask = type;
    this.apply();
  }

  private apply(): void {
    for (const [, entry] of this.entries) {
      entry.layer.setVisible(entry.maskType === this._activeMask);
    }
  }
}
