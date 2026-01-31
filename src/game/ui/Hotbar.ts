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
  HOTBAR_COLOR_BLUE,
  HOTBAR_KEY_CODES,
} from '../constants';

/** Grey for locked slot (blue until level 3). */
const HOTBAR_COLOR_LOCKED = 0x475569;

/**
 * Minecraft-style 5-slot hotbar at bottom of screen.
 * Slots 0–2: Red, Green, Blue (Blue unlocked from level 3). Keys 1–5 select slot.
 */
export class Hotbar {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private slotRects: Phaser.GameObjects.Rectangle[] = [];
  private slotBorders: Phaser.GameObjects.Rectangle[] = [];
  private slotIcons: (Phaser.GameObjects.Rectangle | null)[] = [];
  private selectedIndex = 0;
  private onSlotSelected: (slotIndex: number, maskType: MaskType | null) => void;
  private blueUnlocked: boolean;

  constructor(
    scene: Scene,
    gameWidth: number,
    gameHeight: number,
    onSlotSelected: (slotIndex: number, maskType: MaskType | null) => void,
    blueUnlocked = true
  ) {
    this.scene = scene;
    this.onSlotSelected = onSlotSelected;
    this.blueUnlocked = blueUnlocked;
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

      const isBlueSlot = i === 2;
      const showBlue = isBlueSlot;
      if (showBlue || i === 0 || i === 1) {
        const color =
          i === 0
            ? HOTBAR_COLOR_RED
            : i === 1
              ? HOTBAR_COLOR_GREEN
              : blueUnlocked
                ? HOTBAR_COLOR_BLUE
                : HOTBAR_COLOR_LOCKED;
        const icon = scene.add.rectangle(x, y, iconSize, iconSize, color);
        this.container.add(icon);
        this.slotIcons.push(icon);
      } else {
        this.slotIcons.push(null);
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
    const maskType = this.getMaskForSlot(index);
    this.onSlotSelected(index, maskType);
  }

  /** Slot 0=Red, 1=Green, 2=Blue (if unlocked), else null. */
  private getMaskForSlot(slotIndex: number): MaskType | null {
    if (slotIndex === 0) return MaskType.Red;
    if (slotIndex === 1) return MaskType.Green;
    if (slotIndex === 2 && this.blueUnlocked) return MaskType.Blue;
    return null;
  }

  getSelectedSlot(): number {
    return this.selectedIndex;
  }

  /** Get mask type for a slot (null if empty). Instance method uses blueUnlocked. */
  getMaskForSlotPublic(slotIndex: number): MaskType | null {
    return this.getMaskForSlot(slotIndex);
  }
}
