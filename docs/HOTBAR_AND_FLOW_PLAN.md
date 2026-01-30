# Hotbar ve Oyun Akışı Planı

## Hedef
- Minecraft tarzı 5 slotlu envanter alanı (ekranın altında)
- Slot 1 = Kırmızı maske, Slot 2 = Yeşil maske; seçilebilir
- 1. engel = kırmızı katman, 1. maske = kırmızı (varsayılan)
- Tuşlar 1–5 ile slot seçimi; seçim MaskSystem ile senkron

## Adımlar

### 1. Hotbar UI (5 slot)
- `src/game/ui/Hotbar.ts`: Phaser Container veya sabit grafikler
- Ekranın altında, ortada; pixel-art uyumlu (slot ~32px, kenarlık 2px)
- 5 slot yan yana; boş slotlar koyu çerçeve, dolu slotlarda maske rengi (kırmızı/yeşil kare)
- Seçili slot: beyaz/sarı çerçeve ile vurgula

### 2. Slot–Maske eşlemesi
- Slot 0 (oyunda “1” tuşu): Kırmızı maske
- Slot 1 (“2” tuşu): Yeşil maske
- Slot 2–4: Boş (ileride eşya eklenebilir)
- Varsayılan seçim: Slot 0 (Kırmızı maske)

### 3. Seçim ve MaskSystem
- Tuşlar 1–5 → slot 0–4 seçimi
- Slot 0 seçilince: `maskSystem.setActiveMask(MaskType.Red)`
- Slot 1 seçilince: `maskSystem.setActiveMask(MaskType.Green)`
- Slot 2–4: Maske değiştirmez (sadece seçim güncellenir)

### 4. GameScene akışı
- Varsayılan maske: Red (1. engel kırmızı, 1. maske kırmızı)
- create(): Hotbar oluştur, MaskSystem varsayılan Red ile başlat
- Hotbar’a `onSlotSelected(slotIndex)` callback ver; slot 0/1’de maskeyi değiştir

## Dosya yapısı
```
src/game/
  ui/
    Hotbar.ts      # 5 slot, seçim, görsel
  scenes/
    GameScene.ts   # Hotbar + MaskSystem entegrasyonu, default Red
```
