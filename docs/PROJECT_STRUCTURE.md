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
| `src/game/scenes/GameScene.ts` | Checkpoint (spawnX/spawnY), hazard overlap, can (LIVES_MAX), can HUD, volume prefs, müzik. | Oyun sahnesi. `create()`: `setupMap`, `setupWorldBounds`, `setupColliders`, `setupHotbar`, `setupCamera`, `setupGoalZone`, `setupLevelIndicator`. Ölüm/hedef: `checkDeathByFall`, `checkGoalReached`. Bölüm 5 hedefi → WinScene. Preload: tilemap'ler `LEVEL_MAP_KEYS` ile. |
| `src/game/scenes/WinScene.ts` | Bitiş ekranı: "Tebrikler!". Tekrar oyna (Space), menü (Escape). |
| `src/game/save.ts` | Kayıt: `saveLastCompletedLevel`, `getLastCompletedLevel`, `getVolumePrefs`, `setVolumePrefs` (localStorage). |

## Karakter, maske, UI

| Dosya | Açıklama |
|-------|----------|
| `src/game/player/Player.ts` | Hareket, zıplama, eğilme, coyote time, jump buffer. Tuş tipi `PlayerKeys`; boyut/hız `constants`'tan. |
| `src/game/audio/SoundManager.ts` | Ses efektleri (Web Audio): playJump, playGoal, playDeath, playMaskSwitch. Asset yok. |
| `src/game/effects/ParticleEffects.ts` | Parçacık efektleri: spawnGoalEffect, spawnDeathEffect, spawnJumpDust (zıplama tozu). |
| `src/game/masks/MaskType.ts` | Mask türleri (Red, Green, Blue); layer isimleriyle eşleşir. |
| `src/game/masks/MaskSystem.ts` | Aktif maskeye göre hangi layer'ın görüneceğini yönetir; çarpışma her zaman açık. |
| `src/game/ui/Hotbar.ts` | 5 slot (Red, Green, Blue, boş, boş); 1–5 tuşları; slot içeriği `SLOT_MASKS`. |

## Düzenleme ipuçları

- **Boyut / hız / renk:** `src/game/constants.ts`
- **Yeni seviye:** `LEVEL_MAP_KEYS` ve `LEVEL_MAX` güncelle; `public/assets/` içine yeni tilemap ekle.
- **Sahne akışı:** `GameScene` içindeki `setup*` ve `check*` metodlarına bak.
- **Layer / tileset isimleri:** `constants.ts` içinde `TILESET_IMAGE_KEY`, `LAYER_NAME_GREEN`, `LAYER_NAME_RED`.
- **Detaylı özellik planı:** `docs/DETAILED_FEATURE_PLAN.md` – eklenebilecek tüm özellikler, uygulama notları, zorluk, dosya referansları.
