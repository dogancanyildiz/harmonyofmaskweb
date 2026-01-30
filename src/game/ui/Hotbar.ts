import type { Scene } from 'phaser';
import { MaskType } from '../masks/MaskType';

const SLOT_COUNT = 5;
const SLOT_SIZE = 16;
const SLOT_GAP = 2;
const BORDER_WIDTH = 1;
const UNSELECTED_BORDER = 0x4a5568;
const SELECTED_BORDER = 0xfbbf24;
const SLOT_BG = 0x1e293b;
const RED_MASK_COLOR = 0xef4444;
const GREEN_MASK_COLOR = 0x22c55e;

/** Which mask is in which slot; -1 = empty. */
const SLOT_MASKS: (MaskType | null)[] = [
  MaskType.Red,   // slot 0 = 1. maske = kırmızı
  MaskType.Green, // slot 1 = 2. maske = yeşil
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

    const totalWidth = SLOT_COUNT * SLOT_SIZE + (SLOT_COUNT - 1) * SLOT_GAP;
    const startX = (gameWidth - totalWidth) / 2 + SLOT_SIZE / 2 + SLOT_GAP / 2;
    const y = gameHeight - SLOT_SIZE / 2 - 6;

    for (let i = 0; i < SLOT_COUNT; i++) {
      const x = startX + i * (SLOT_SIZE + SLOT_GAP);
      const borderColor = i === this.selectedIndex ? SELECTED_BORDER : UNSELECTED_BORDER;

      const border = scene.add.rectangle(x, y, SLOT_SIZE + BORDER_WIDTH * 2, SLOT_SIZE + BORDER_WIDTH * 2, borderColor);
      const bg = scene.add.rectangle(x, y, SLOT_SIZE, SLOT_SIZE, SLOT_BG);

      this.container.add(border);
      this.container.add(bg);
      this.slotBorders.push(border);
      this.slotRects.push(bg);

      const maskType = SLOT_MASKS[i];
      if (maskType !== null) {
        const color = maskType === MaskType.Red ? RED_MASK_COLOR : GREEN_MASK_COLOR;
        const icon = scene.add.rectangle(x, y, SLOT_SIZE - 6, SLOT_SIZE - 6, color);
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
    const keys = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
    ];
    keys.forEach((keyCode, index) => {
      const key = this.scene.input.keyboard?.addKey(keyCode);
      key?.on('down', () => this.setSelectedSlot(index));
    });
  }

  /** Set selected slot and update visuals + callback. */
  setSelectedSlot(index: number): void {
    if (index < 0 || index >= SLOT_COUNT) return;
    this.selectedIndex = index;
    this.slotBorders.forEach((border, i) => {
      border.setFillStyle(i === index ? SELECTED_BORDER : UNSELECTED_BORDER);
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
