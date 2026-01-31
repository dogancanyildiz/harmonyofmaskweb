# Oyun Boyutları ve Yapılandırma Referansı

**Tek kaynak:** Tüm sabitler `src/game/constants.ts` dosyasında. Bu doküman referans niteliğindedir.

---

## 1. Oyun / Ekran (config.ts)

| Değişken | Değer | Birim | Açıklama |
|----------|-------|-------|----------|
| `width` | 320 | px | Oyun canvas genişliği (logic size) |
| `height` | 180 | px | Oyun canvas yüksekliği (logic size) |
| `backgroundColor` | #1a1a2e | — | Arka plan rengi |
| `scale.mode` | FIT | — | Ekrana sığdırma |
| `scale.autoCenter` | CENTER_BOTH | — | Ortalama |
| `render.pixelArt` | true | — | Piksel netliği (smoothing kapalı) |
| `physics.arcade.gravity.y` | 600 | px/s² | Yerçekimi |

---

## 2. Karakter / Player (Player.ts)

| Değişken | Değer | Birim | Açıklama |
|----------|-------|-------|----------|
| **Boyut (ayakta)** | | | |
| Genişlik | 16 | px | `setSize(16, …)`, rect 16 |
| Yükseklik (ayakta) | 24 | px | `STAND_HEIGHT` |
| **Boyut (eğilmiş)** | | | |
| Genişlik | 16 | px | Aynı |
| Yükseklik (eğilmiş) | 12 | px | `CROUCH_HEIGHT` |
| **Hareket** | | | |
| `MOVE_SPEED` | 200 | px/s | Yürüme hızı |
| `CROUCH_SPEED` | 80 | px/s | Eğilirken hız |
| `JUMP_FORCE` | -350 | px/s | Zıplama hızı (Y bileşeni) |
| **Görsel** | | | |
| Renk | 0x4ade80 | hex | Yeşil dikdörtgen |
| Body offset (eğilince) | (0, 12) | px | `setOffset(0, STAND_HEIGHT - CROUCH_HEIGHT)` |

Özet: Karakter **16×24 px** (ayakta), **16×12 px** (eğilince). 1 tile (16 px) genişliğinde, 1.5 tile yüksekliğinde.

---

## 3. Harita / Tile (Tiled + GameScene)

Tüm tilemap’lerde **tek tileset**: `tileset.png`, tile boyutu **16×16 px**.

| Harita | width (tile) | height (tile) | widthInPixels | heightInPixels |
|--------|----------------|----------------|----------------|-----------------|
| tilemap (Lv1) | 35 | 12 | 560 | 192 |
| tilemap2 (Lv2) | 45 | 14 | 720 | 224 |
| tilemap3 (Lv3) | 50 | 14 | 800 | 224 |
| tilemap4 (Lv4) | 55 | 15 | 880 | 240 |
| tilemap5 (Lv5) | 60 | 16 | 960 | 256 |

- **Tile genişliği / yüksekliği:** 16 px (Tiled: `tilewidth`, `tileheight`).
- Engel/zemin: Her “engel” veya “zemin” aslında 16×16 px’lik tile’lardan oluşuyor; boyut tile sayısı × 16.

---

## 4. Sahne / Dünya (GameScene.ts)

| Sabit / Hesaplama | Değer | Birim | Açıklama |
|--------------------|-------|-------|----------|
| `DEATH_FALL_LEVEL_MIN` | 3 | level | Bu seviyeden itibaren düşme = ölüm |
| `DEATH_FALL_MARGIN` | 32 | px | Harita altından bu kadar aşağı = ölüm (2 tile) |
| `VOID_HEIGHT` | 200 | px | Bölüm 3+ dünya yüksekliği = mapHeightPx + 200 |
| **Oyuncu spawn** | (48, mapHeightPx - 48) | px | Sol 48, zeminden 48 px yukarı (3 tile) |
| **Hedef bölgesi (goal zone)** | | | |
| x | mapWidthPx - 32 | px | Sağdan 32 px (2 tile) |
| y | mapHeightPx - 80 | px | Alttan 80 px (5 tile) |
| Genişlik | 40 | px | 2.5 tile |
| Yükseklik | 80 | px | 5 tile |
| **Kamera** | | | |
| Bounds | (0, 0, mapWidthPx, mapHeightPx) | px | Takip alanı |
| Follow lerp | 0.1, 0.1 | — | startFollow smooth |

---

## 5. Hotbar / UI (Hotbar.ts)

| Değişken | Değer | Birim | Açıklama |
|----------|-------|-------|----------|
| `SLOT_COUNT` | 5 | adet | Slot sayısı |
| `SLOT_SIZE` | 16 | px | Bir slotun kare boyutu (1 tile) |
| `SLOT_GAP` | 2 | px | Slotlar arası boşluk |
| `BORDER_WIDTH` | 1 | px | Seçili/seçili değil çerçeve kalınlığı |
| Border kare | SLOT_SIZE + 2*BORDER_WIDTH = 18 | px | Dış çerçeve 18×18 |
| **Pozisyon** | | | |
| y | gameHeight - SLOT_SIZE/2 - 6 | px | = gameHeight - 14 (180’de 166) |
| Icon (maske) boyutu | SLOT_SIZE - 6 = 10 | px | Slot içindeki renkli kare 10×10 |
| Renkler | UNSELECTED 0x4a5568, SELECTED 0xfbbf24, BG 0x1e293b | hex | Çerçeve ve arka plan |

---

## 6. Özet: Tek birim = 16 px (1 tile)

- **1 tile** = 16×16 px (hem harita hem Hotbar slotu).
- **Karakter:** 16 px genişlik, 24 px yükseklik (ayakta) → 1 tile genişlik, 1.5 tile yükseklik.
- **Eğilme:** 12 px = 0.75 tile.
- **Hedef:** 40×80 px = 2.5 × 5 tile.
- **Spawn:** Sol 3 tile, zeminden 3 tile yukarı.
- **Ölüm margin:** 2 tile harita altı.

Bu doküman, karakter ve engel boyutlarını yapılandırmaya taşırken referans olarak kullanılabilir.
