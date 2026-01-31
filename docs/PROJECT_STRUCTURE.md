# Proje Yapısı

Kolay okunabilir ve düzenlenebilir yapı özeti.

## Giriş noktaları

| Dosya | Açıklama |
|-------|----------|
| `src/main.ts` | DOM yüklendikten sonra Phaser.Game başlatır; `gameConfig` için `./game` import eder. |
| `src/game/index.ts` | Oyun modülü girişi: `gameConfig`, `MaskType`, `MaskLayerEntry` export eder. |
| `src/game/config.ts` | Phaser oyun config (ekran, fizik, sahne listesi); değerler `constants.ts`'den gelir. |

## Sabitler ve yapılandırma

| Dosya | Açıklama |
|-------|----------|
| `src/game/constants.ts` | **Tek kaynak:** Tüm boyutlar, hızlar, renkler, seviye anahtarları, layer/tileset isimleri. Değişiklik yaparken önce buraya bak. |

## Sahne ve oyun akışı

| Dosya | Açıklama |
|-------|----------|
| `src/game/scenes/GameScene.ts` | Ana sahne. `create()` küçük metodlara bölünmüş: `setupMap`, `setupWorldBounds`, `setupColliders`, `setupHotbar`, `setupCamera`, `setupGoalZone`. Ölüm/hedef kontrolü `checkDeathByFall`, `checkGoalReached`. Preload tüm tilemap'leri `LEVEL_MAP_KEYS` ile döngüyle yükler. |

## Karakter, maske, UI

| Dosya | Açıklama |
|-------|----------|
| `src/game/player/Player.ts` | Hareket, zıplama, eğilme. Tuş tipi `PlayerKeys`; boyut/hız `constants`'tan. |
| `src/game/masks/MaskType.ts` | Mask türleri (Red, Green); layer isimleriyle eşleşir. |
| `src/game/masks/MaskSystem.ts` | Aktif maskeye göre hangi layer'ın görüneceğini yönetir; çarpışma her zaman açık. |
| `src/game/ui/Hotbar.ts` | 5 slot, 1–5 tuşları; slot içeriği `SLOT_MASKS`, boyutlar/renkler `constants`'tan. |

## Düzenleme ipuçları

- **Boyut / hız / renk:** `src/game/constants.ts`
- **Yeni seviye:** `LEVEL_MAP_KEYS` ve `LEVEL_MAX` güncelle; `public/assets/` içine yeni tilemap ekle.
- **Sahne akışı:** `GameScene` içindeki `setup*` ve `check*` metodlarına bak.
- **Layer / tileset isimleri:** `constants.ts` içinde `TILESET_IMAGE_KEY`, `LAYER_NAME_GREEN`, `LAYER_NAME_RED`.
