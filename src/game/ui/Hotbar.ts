import type { Scene } from 'phaser';
import { MaskType } from '../masks/MaskType';
import {
  HOTBAR_SLOT_COUNT,
  HOTBAR_SLOT_SIZE,
  HOTBAR_SLOT_GAP,
  HOTBAR_BORDER_WIDTH,
  HOTBAR_BOTTOM_OFFSET,
  HOTBAR_ICON_INSET,
  HOTBAR_COLOR_BORDER,
  HOTBAR_COLOR_BORDER_SELECTED,
  HOTBAR_COLOR_BG,
  HOTBAR_COLOR_RED,
  HOTBAR_COLOR_GREEN,
  HOTBAR_KEY_CODES,
} from '../constants';

/** Slot index → mask type; null = empty slot. */
const SLOT_MASKS: (MaskType | null)[] = [
  MaskType.Red,
  MaskType.Green,
  null,
  null,
  null,
];

/**
 * Minecraft-style 5-slot hotbar at bottom of screen.
 * Slots 1 and 2 hold Red and Green masks; keys 1–5 select slot.
 */
export class Hotbar {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private slotRects: Phaser.GameObjects.Rectangle[] = [];
  private slotBorders: Phaser.GameObjects.Rectangle[] = [];
  private selectedIndex = 0;
  private onSlotSelected: (slotIndex: number, maskType: MaskType | null) => void;

  constructor(
    scene: Scene,
    gameWidth: number,
    gameHeight: number,
    onSlotSelected: (slotIndex: number, maskType: MaskType | null) => void
  ) {
    this.scene = scene;
    this.onSlotSelected = onSlotSelected;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(1000);

    const totalWidth = HOTBAR_SLOT_COUNT * HOTBAR_SLOT_SIZE + (HOTBAR_SLOT_COUNT - 1) * HOTBAR_SLOT_GAP;
    const startX = (gameWidth - totalWidth) / 2 + HOTBAR_SLOT_SIZE / 2 + HOTBAR_SLOT_GAP / 2;
    const y = gameHeight - HOTBAR_BOTTOM_OFFSET;

    const iconSize = HOTBAR_SLOT_SIZE - HOTBAR_ICON_INSET * 2;
    const borderSize = HOTBAR_SLOT_SIZE + HOTBAR_BORDER_WIDTH * 2;

    for (let i = 0; i < HOTBAR_SLOT_COUNT; i++) {
      const x = startX + i * (HOTBAR_SLOT_SIZE + HOTBAR_SLOT_GAP);
      const borderColor = i === this.selectedIndex ? HOTBAR_COLOR_BORDER_SELECTED : HOTBAR_COLOR_BORDER;

      const border = scene.add.rectangle(x, y, borderSize, borderSize, borderColor);
      const bg = scene.add.rectangle(x, y, HOTBAR_SLOT_SIZE, HOTBAR_SLOT_SIZE, HOTBAR_COLOR_BG);

      this.container.add(border);
      this.container.add(bg);
      this.slotBorders.push(border);
      this.slotRects.push(bg);

      const maskType = SLOT_MASKS[i];
      if (maskType !== null) {
        const color = maskType === MaskType.Red ? HOTBAR_COLOR_RED : HOTBAR_COLOR_GREEN;
        const icon = scene.add.rectangle(x, y, iconSize, iconSize, color);
        this.container.add(icon);
      }
    }

    this.container.list.forEach((child) => {
      if (child && typeof (child as Phaser.GameObjects.GameObject).setScrollFactor === 'function') {
        (child as Phaser.GameObjects.GameObject).setScrollFactor(0);
      }
    });

    this.setupKeys();
  }

  private setupKeys(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) return;
    HOTBAR_KEY_CODES.forEach((keyCode, index) => {
      const key = keyboard.addKey(keyCode);
      key.on('down', () => this.setSelectedSlot(index));
    });
  }

  /** Set selected slot and update visuals + callback. */
  setSelectedSlot(index: number): void {
    if (index < 0 || index >= HOTBAR_SLOT_COUNT) return;
    this.selectedIndex = index;
    this.slotBorders.forEach((border, i) => {
      border.setFillStyle(i === index ? HOTBAR_COLOR_BORDER_SELECTED : HOTBAR_COLOR_BORDER);
    });
    this.onSlotSelected(index, SLOT_MASKS[index]);
  }

  getSelectedSlot(): number {
    return this.selectedIndex;
  }

  /** Get mask type for a slot (null if empty). */
  static getMaskForSlot(slotIndex: number): MaskType | null {
    return SLOT_MASKS[slotIndex] ?? null;
  }
}
