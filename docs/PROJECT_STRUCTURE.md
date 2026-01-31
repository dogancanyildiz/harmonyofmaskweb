# Proje Yapısı

Kolay okunabilir ve düzenlenebilir yapı özeti.

## Giriş noktaları

| Dosya | Açıklama |
|-------|----------|
| `src/main.ts` | DOM yüklendikten sonra Phaser.Game başlatır; `gameConfig` için `./game` import eder. |
| `src/game/index.ts` | Oyun modülü girişi: `gameConfig`, `MaskType`, `MaskLayerEntry` export eder. |
| `src/game/config.ts` | Phaser oyun config (ekran, fizik, sahne listesi). İlk sahne: MainMenuScene. |

## Sabitler ve yapılandırma

| Dosya | Açıklama |
|-------|----------|
| `src/game/constants.ts` | **Tek kaynak:** Tüm boyutlar, hızlar, renkler, seviye anahtarları, layer/tileset isimleri. Değişiklik yaparken önce buraya bak. |

## Sahne ve oyun akışı

| Dosya | Açıklama |
|-------|----------|
| `src/game/scenes/MainMenuScene.ts` | Ana menü: Yeni oyun, Devam et, Seviye seç, Sıralama, Kontroller, Ayarlar (ok/W/S, Enter/Space). |
| `src/game/scenes/LevelSelectScene.ts` | Seviye seçimi 1–5; kayda göre kilitleme. |
| `src/game/scenes/ControlsScene.ts` | Kontroller: A/D, W/Space, S, 1–5, Esc. Ana menü veya Ayarlar’dan (K) erişilir. |
| `src/game/scenes/GameScene.ts` | Oyun sahnesi. `create()`: `setupMap`, `setupWorldBounds`, `setupColliders`, `setupHotbar`, `setupCamera`, `setupGoalZone`, `setupLevelIndicator`. Ölüm/hedef: `checkDeathByFall`, `checkGoalReached`. Bölüm 5 hedefi → WinScene. Preload: tilemap'ler `LEVEL_MAP_KEYS` ile. |
| `src/game/scenes/WinScene.ts` | Bitiş ekranı: "Tebrikler!". Tekrar oyna (Space), menü (Escape). |
| `src/game/save.ts` | Kayıt: `saveLastCompletedLevel`, `getLastCompletedLevel` (localStorage). Hedefe girince kayıt; menüde "Devam et" buna göre. |

## Karakter, maske, UI

| Dosya | Açıklama |
|-------|----------|
| `src/game/player/Player.ts` | Hareket, zıplama, eğilme, coyote time, jump buffer. Tuş tipi `PlayerKeys`; boyut/hız `constants`'tan. |
| `src/game/audio/SoundManager.ts` | Ses efektleri (Web Audio): playJump, playGoal, playDeath. Asset yok. |
| `src/game/masks/MaskType.ts` | Mask türleri (Red, Green); layer isimleriyle eşleşir. |
| `src/game/masks/MaskSystem.ts` | Aktif maskeye göre hangi layer'ın görüneceğini yönetir; çarpışma her zaman açık. |
| `src/game/ui/Hotbar.ts` | 5 slot, 1–5 tuşları; slot içeriği `SLOT_MASKS`, boyutlar/renkler `constants`'tan. |

## Düzenleme ipuçları

- **Boyut / hız / renk:** `src/game/constants.ts`
- **Yeni seviye:** `LEVEL_MAP_KEYS` ve `LEVEL_MAX` güncelle; `public/assets/` içine yeni tilemap ekle.
- **Sahne akışı:** `GameScene` içindeki `setup*` ve `check*` metodlarına bak.
- **Layer / tileset isimleri:** `constants.ts` içinde `TILESET_IMAGE_KEY`, `LAYER_NAME_GREEN`, `LAYER_NAME_RED`.
