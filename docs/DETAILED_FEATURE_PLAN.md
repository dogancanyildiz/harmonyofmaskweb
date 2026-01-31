# Harmony of Mask – Detaylı Özellik ve İçerik Planı

Bu doküman oyuna **eklenebilecek tüm özellikleri** kategorilere ayırarak, her biri için **açıklama**, **uygulama notları**, **zorluk** ve **etkilenen dosyalar** ile listeler. Öncelik sırası proje ihtiyacına göre değiştirilebilir.

**Kısaltmalar:**  
- **Z:** Zorluk (D = Düşük, O = Orta, Y = Yüksek)  
- **Dosya:** Değişecek/eklenecek ana dosyalar  
- **Bağımlılık:** Önce yapılması faydalı maddeler  

---

## 1. Oynanış ve Mekanik

### 1.1 Maskeler ve Katmanlar

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 1.1.1 | **3. maske (mavi)** | Hotbar slot 3’e mavi maske; tilemap’te mavi layer (blue). Kırmızı/yeşil gibi görünürlük + çarpışma. | `MaskType.ts`’e Blue; `LEVEL_MAP_KEYS` ile tilemap’lerde "blue" layer; Tiled’da yeni layer; `MaskSystem` ve `Hotbar` SLOT_MASKS güncellemesi. | O | MaskType, MaskSystem, Hotbar, constants (HOTBAR_COLOR_BLUE?), GameScene setupMap, tilemap JSON’lar | — |
| 1.1.2 | **4. ve 5. maske** | İsteğe bağlı ek maskeler (örn. mor, turuncu); aynı pattern. | MaskType enum, layer adları, SLOT_MASKS, tilemap layer’ları. Slot 4–5 şu an boş; doldurulabilir. | O | Aynı + tilemap | 1.1.1 |
| 1.1.3 | **Maske kilidi / sıralı açılma** | Belirli bölümlerde sadece 1. maske, sonra 2. açılır vb. | Bölüm bazlı “unlocked masks”; LevelSelect veya GameScene’de `getUnlockedMasks(level)`; Hotbar’da kilitli slotlar gri + tıklanmaz. | O | constants, save (unlockedMasks?), Hotbar, GameScene | — |
| 1.1.4 | **Maske değiştirme süresi / cooldown** | Slot değiştirince kısa süre (örn. 0.2 s) tekrar değiştirilemez. | MaskSystem veya GameScene’de `lastMaskSwitchTime`, `MASK_SWITCH_COOLDOWN_MS`; Hotbar seçiminde cooldown kontrolü. | D | constants, MaskSystem veya GameScene, Hotbar | — |

### 1.2 Düşmanlar ve Tehlikeler

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 1.2.1 | **Dokununca ölüm (spike / düşman)** | Belirli objelere veya bölgelere değince anında ölüm (spawn’a veya checkpoint’e). | Tiled’da "hazards" layer veya object layer; GameScene’de overlap/collider; Player overlap’ta `triggerDeath()` veya can azaltma. | O | GameScene, tilemap (object/layer), constants (HAZARD_*) | — |
| 1.2.2 | **Hareketli düşman (patrol)** | Yatay/dikey gidip gelen düşman; temas = ölüm veya hasar. | Yeni sınıf `Enemy.ts` veya `PatrolHazard.ts`; Phaser arcade body, velocity veya tween; collider Player ile; ölüm/hasar callback. | O | Enemy/PatrolHazard, GameScene colliders | 1.2.1 |
| 1.2.3 | **Hasar (can sistemi)** | Dokununca 1 can azalır; 0’da ölüm. Can HUD’da gösterilir. | `Player` veya GameScene’de `lives` (örn. 3); hasar alınca `lives--`, spawn/checkpoint’e taşı veya sahne yenile; UI can ikonları. | O | Player veya GameScene, UI (can göstergesi), constants (LIVES_MAX) | 1.2.1, Checkpoint |
| 1.2.4 | **Zamanlı tehlike** | Belirli aralıklarla açılıp kapanan spike/platform. | Tiled object + custom property "timed"; GameScene’de sprite/graphics + timer; periyodik visible/active veya collision toggle. | O | GameScene, tilemap objects | 1.2.1 |
| 1.2.5 | **Düşen platform** | Üzerine çıkınca bir süre sonra düşen platform. | Platform body; Player ile overlap’ta timer başlat; süre sonra body’yi destroy veya kinematic’ten dynamic’e geçir + gravity. | O | GameScene, platform sınıfı veya Tiled + script | — |

### 1.3 Checkpoint ve Ölüm

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 1.3.1 | **Checkpoint (tek)** | Seviye içinde bir noktaya gelince “son spawn” güncellenir; ölünce oradan devam. | Tiled’da checkpoint object (x,y); GameScene’de overlap ile “spawn noktasını (x,y) güncelle”; ölünce `scene.start(level, { spawnX, spawnY })` veya Player’ı taşı. | O | GameScene (spawn state), tilemap objects, constants (SPAWN_*) | — |
| 1.3.2 | **Birden fazla checkpoint** | Sıralı checkpoint’ler; en son geçilen aktif. | Checkpoint ID veya sıra; overlap’ta “bu checkpoint’in indeksi > kayıtlı indeks” ise güncelle. | O | Aynı + checkpoint listesi | 1.3.1 |
| 1.3.3 | **Ölüm animasyonu / ekran** | Ölünce kısa kırmızı flash veya “Öldün” yazısı, sonra spawn. | Kamera flash veya overlay; `time.delayedCall` ile spawn; mevcut death effect’e ek. | D | GameScene, isteğe UI overlay | — |
| 1.3.4 | **Canlı yeniden başlat (respawn butonu)** | Ölünce “Yeniden dene” / “Checkpoint’ten devam” seçeneği. | Küçük pause benzeri overlay: iki buton; biri checkpoint’ten, biri bölüm başından. | O | GameScene (death overlay), UI | 1.3.1 |

### 1.4 Hareket ve Fizik

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 1.4.1 | **Çift zıplama (double jump)** | Havadayken bir kez daha zıplama. | Player’da `jumpsLeft` (örn. 2); zıplamada azalt; yere değince sıfırla; `DOUBLE_JUMP_FORCE` isteğe farklı. | D | Player, constants | — |
| 1.4.2 | **Duvar zıplama (wall jump)** | Duvara yapışınca tek zıplama; zıplayınca duvardan uzağa fırlama. | Duvar teması tespiti (body.touching.left/right); `onWall` state; zıplamada velocity x’i ters yöne set. | O | Player, constants | — |
| 1.4.3 | **Kaygan zemin** | Belirli tile’larda sürtünme az; kayma hissi. | Tiled’da “ice” tile property; Phaser’da tile friction veya body.setFriction; layer bazlı veya tile callback. | O | GameScene (tile collision callback), tilemap | — |
| 1.4.4 | **Hareketli platform (taşıyıcı)** | Üzerinde durunca player platformla birlikte hareket eder. | Platform kinematic body; Player ile collider; platform velocity’sini Player’a eklemek (moveWith) veya Phaser’da “moving platform” pattern. | O | GameScene, platform sınıfı veya Tiled | — |
| 1.4.5 | **Koşu (sprint)** | Shift veya ayrı tuşla daha hızlı yürüme. | `RUN_SPEED` constant; tuş basılıyken speed = RUN_SPEED; eğilirken sprint kapalı olabilir. | D | Player, constants | — |

---

## 2. İçerik: Seviyeler ve Harita

### 2.1 Mevcut Bölümlerin Doldurulması

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 2.1.1 | **Bölüm 2–5 engelleri (Tiled)** | tilemap2–5’te platformlar, boşluklar, eğilme geçitleri; sadece zemin kalmamalı. | LEVELS_PLAN.md ve LEVELS_OBSTACLES.md’e göre Tiled’da green/red (ve blue) layer’lara tile’lar; export JSON. Layer isimleri ve tileset sabit. | O | public/assets/tilemap2–5.json | — |
| 2.1.2 | **Bölüm 3–5’te zorluk kademesi** | Bölüm 3: az boşluk; 4: daha fazla + maske zorunlu; 5: en dar platformlar, birden fazla maske. | Tasarım kararı + Tiled düzenleme; kodda ek değişiklik gerekmez (mevcut mask + ölüm mantığı yeterli). | O | tilemap3–5 | 2.1.1 |
| 2.1.3 | **Hazard / spike layer (opsiyonel)** | Tiled’da object layer “hazards”; GameScene’de okuyup overlap ekle. | Tiled: rectangle/point objects, type "hazard"; preload’da object layer parse; create’de Arcade overlap. | O | GameScene, tilemap | 1.2.1 |
| 2.1.4 | **Checkpoint objeleri (Tiled)** | Tiled’da checkpoint noktaları; GameScene overlap ile spawn güncelle. | Object layer "checkpoints", property "order" veya "id"; create’de spawn state + overlap. | O | GameScene, tilemap | 1.3.1 |

### 2.2 Yeni Seviyeler

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 2.2.1 | **Bölüm 6, 7, …** | LEVEL_MAX artır; yeni tilemap JSON’lar; LevelSelect ve kayıt. | constants: LEVEL_MAX, LEVEL_MAP_KEYS; public/assets/tilemap6.json …; WinScene sadece LEVEL_MAX’ta gösterilir. | D | constants, LevelSelectScene, save, WinScene, tilemap dosyaları | — |
| 2.2.2 | **Boss / final seviye** | Son bölüm farklı mekanik (büyük alan, boss hareketi vb.). | Ayrı sahne veya özel GameScene logic (level === LEVEL_MAX); boss sprite + basit AI. | Y | GameScene veya BossScene, boss asset | 2.2.1 |
| 2.2.3 | **Gizli bölüm / alternatif yol** | Belirli bölümde gizli hedef veya kapı; farklı seviye açılır. | Overlap ile “secret goal”; scene.start(SCENE_KEY_GAME, { level: SECRET_LEVEL_ID }); kayıtta secret level da tutulabilir. | O | GameScene, save, LevelSelect | 2.2.1 |

### 2.3 Toplanabilir ve Etkileşimli Nesneler

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 2.3.1 | **Yıldız / koleksiyon** | Seviyede 3 yıldız; hepsini toplayınca ekstra skor veya rozet. | Tiled object veya sprite; overlap’ta topla, sayacı artır; HUD’da “1/3” göster; bölüm sonunda save’e yıldız sayısı. | O | GameScene, save (stars per level), UI, tilemap/sprite | — |
| 2.3.2 | **Anahtar–kapı** | Anahtar toplanınca belirli kapı açılır; hedefe ulaşılabilir. | Overlap: key → `hasKey = true`; door overlap’ta `hasKey` ise door’u kaldır veya geçişe izin ver. | O | GameScene, tilemap objects | — |
| 2.3.3 | **Kırılabilir kutu** | Zıplayınca veya üzerine basınca kırılan kutu; altından geçiş veya gizli yol. | Tile veya sprite; collision’da “yukarıdan mı geldi” kontrolü; destroy veya animasyon + collision kapat. | O | GameScene, tilemap/sprite | — |

---

## 3. Görsel ve Ses

### 3.1 Karakter ve Animasyon

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 3.1.1 | **Karakter sprite (dikdörtgen yerine)** | Idle, yürüme, eğilme, zıplama frame’leri; sprite sheet. | Sprite sheet + atlas veya frame listesi; Player’da Rectangle yerine Sprite; animasyonlar: idle, walk, crouch, jump; state’e göre play. | O | Player (Sprite + anims), assets (sprite sheet), GameScene preload | — |
| 3.1.2 | **Maske görseli karakterde** | Aktif maskeye göre yüzde kırmızı/yeşil/mavi overlay veya ayrı layer. | Sprite’a child olarak “mask overlay” sprite; MaskSystem veya GameScene’de aktif maskeye göre frame/tint. | O | Player, MaskSystem veya GameScene | 3.1.1, 1.1.1 |
| 3.1.3 | **Yürüme tozu / ayak izi** | Yürürken ayak altında hafif toz (spawnJumpDust benzeri, daha az). | Player update’te “yere değiyor + hareket” ise periyodik spawnJumpDust veya daha hafif effect; throttle (örn. 80 ms’de bir). | D | Player veya GameScene, ParticleEffects | — |
| 3.1.4 | **Landing effect** | Yere inişte kısa toz veya squash–stretch. | Yere ilk değdiği frame tespiti (wasInAir && onGround); spawnJumpDust veya scale tween. | D | Player, ParticleEffects | — |

### 3.2 Arka Plan ve Tileset

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 3.2.1 | **Parallax arka plan** | 1–2 katmanlı arka plan; kamera hareketine göre yavaş kayma. | TileSprite veya Sprite; scrollFactor 0.3, 0.5 vb.; kamera takibi ile x offset. | D | GameScene (background layer) | — |
| 3.2.2 | **Yeni tileset / palet** | Aynı boyutta farklı görünüm (ör. karanlık tema, kar teması). | Yeni tileset.png; constants’ta TILESET_IMAGE_KEY veya bölüm bazlı tileset; layer’lar aynı isimle kalır. | O | constants, preload, tilemap | — |
| 3.2.3 | **Arka plan müziği** | Menü ve oyun için loop müzik; Ayarlar’dan kısma. | SoundManager’da müzik kanalı veya Phaser sound; preload’da müzik dosyası veya Web Audio ile basit loop; Settings’te volume. | O | SoundManager, SettingsScene, assets veya procedural | 3.3.2 |
| 3.2.4 | **Bölüm bazlı müzik** | Her bölümde farklı parça veya bölüm 5’te “final” tema. | Level’a göre müzik key seç; sahne geçişinde önceki müziği durdur, yeniyi başlat. | D | GameScene, SoundManager | 3.2.3 |

### 3.3 Ses Detayları

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 3.3.1 | **Gerçek SFX dosyaları** | Web Audio beep yerine .mp3/.ogg zıplama, hedef, ölüm, maske. | Preload: this.load.audio('jump','jump.mp3') vb.; SoundManager’da ctx yerine scene.sound.play(key); fallback beep. | O | SoundManager, public/assets/audio, preload | — |
| 3.3.2 | **Ayarlar: ses seviyesi** | Ana ses ve müzik için slider; localStorage’a kaydet. | SettingsScene’de slider UI; save/load volume; SoundManager.setMasterVolume(), setMusicVolume(). | O | SettingsScene, save (volume prefs), SoundManager | — |
| 3.3.3 | **Ses aç/kapa** | Tek tuşla tüm sesleri susturma. | SoundManager.setEnabled(false/true); Settings’te toggle; menüde M veya S. | D | SoundManager, SettingsScene | — |

### 3.4 Parçacık ve Efekt

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 3.4.1 | **Hazard’a değince ek efekt** | Spike’a değince ek kırmızı parçacık veya ek ses. | checkDeathByFall / hazard overlap’ta spawnDeathEffect benzeri veya ayrı spawnHazardEffect. | D | ParticleEffects, GameScene | 1.2.1 |
| 3.4.2 | **Hedef bölgesi ışıltı** | Hedef zone’da hafif pulse veya parçacık. | goalGraphics’e alpha tween veya sürekli az sayıda particle emit; frequency > 0. | D | GameScene setupGoalZone, ParticleEffects | — |
| 3.4.3 | **Ekran kenarı vignette** | Oyun alanında hafif kararma (opsiyonel atmosfer). | Sabit graphics overlay; kamera ile aynı boyutta; alpha düşük. | D | GameScene | — |

---

## 4. UI ve Bilgi

### 4.1 HUD (Oyun İçi)

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 4.1.1 | **Can göstergesi** | Sol üstte 3 kalp/ikon; hasar alınca biri kalkar. | GameScene’de container + 3 sprite/graphics; lives değişince güncelle; constants LIVES_MAX. | O | GameScene (HUD), constants | 1.2.3 |
| 4.1.2 | **Skor / puan** | Toplanan yıldız veya mesafe; sağ üstte sayı. | GameScene’de text; overlap/event’te score++; save’e yazılabilir; ranking’te gösterilir. | D | GameScene, save, RankingScene | 2.3.1 (opsiyonel) |
| 4.1.3 | **Seviye süresi** | Bölümde geçen süre (saniye); bölüm sonunda veya HUD’da. | GameScene’de time counter (update’te delta); bölüm sonunda save’e “best time” yazılabilir. | D | GameScene, save | — |
| 4.1.4 | **Mini harita (opsiyonel)** | Köşede küçük harita; player ve hedef noktası. | Küçük graphics; harita genişliği/yüksekliği oranında scale; player ve goal pozisyonu işaretle. | O | GameScene | — |

### 4.2 Menüler ve Ekranlar

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 4.2.1 | **Seviye önizleme (LevelSelect)** | Seviye kutusunda küçük önizleme görseli veya ikon. | LevelSelectScene’de her seviye için thumbnail (küçük render veya sabit sprite); tilemap’ten crop veya ayrı asset. | O | LevelSelectScene, assets | — |
| 4.2.2 | **Bölüm başlığı** | Bölüme girince “Bölüm 3” yazısı 2 saniye gösterilir. | GameScene create’de text + tween (alpha 1→0); veya ayrı kısa “LevelIntro” overlay. | D | GameScene | — |
| 4.2.3 | **Yükleme ekranı (loading)** | Oyun açılırken veya bölüm geçişinde progress bar. | Boot/Preload scene; load.on('progress') ile bar; sonra MainMenu veya Game. | O | Yeni PreloadScene, config (ilk sahne) | — |
| 4.2.4 | **Credits ekranı** | “Yapımcılar”, müzik/ses kaynakları, teşekkür. | CreditsScene; menüde “Credits” seçeneği; metin + Geri. | D | CreditsScene, MainMenuScene | — |

### 4.3 Erişilebilirlik ve Bilgi

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 4.3.1 | **Yüksek kontrast modu** | Karakter ve platformlar daha belirgin renkler. | constants’ta CONTRAST_MODE veya Settings’ten oku; Player/Hotbar/layer tint’leri değiştir. | O | constants, Settings, Player, Hotbar, GameScene | 3.3.2 |
| 4.3.2 | **Büyük yazı / UI scale** | Menü ve HUD yazı boyutu artar. | Settings’te “Büyük yazı”; fontSize’ı multiplier ile artır; tüm sahnelerde ortak font scale. | O | SettingsScene, save, tüm sahneler (font) | — |
| 4.3.3 | **Kolay mod** | Düşme = ölüm bölüm 5’te başlar (veya hiç yok); daha fazla coyote time. | constants DEATH_FALL_LEVEL_MIN = 5 veya ayar; COYOTE_TIME_MS artırılabilir; Settings’te toggle. | D | constants, Settings, save, GameScene | — |
| 4.3.4 | **Tuş atama (keybindings)** | A/D, W/Space, 1–5’i kullanıcı tanımlı tuşlara değiştirme. | Settings’te “Kontroller” altında tuş seçimi; save’e key map; Player ve Hotbar’da key map’ten oku. | O | SettingsScene, save, Player, Hotbar, constants | — |

---

## 5. Ayarlar ve Teknik

### 5.1 Platform ve Kontrol

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 5.1.1 | **Mobil / dokunmatik** | Sol yarı joystick, sağ yarı zıplama/eğilme butonları. | Overlay: joystick (virtual) + butonlar; input’u klavye gibi Player’a “sanal tuş” olarak ilet; A/D/W/S/Space simüle et. | O | Yeni TouchController veya GameScene overlay | — |
| 5.1.2 | **Tam ekran** | F11 veya menüden tam ekran. | Phaser scale.startFullscreen() veya browser fullscreen API; Settings’te “Tam ekran” toggle. | D | SettingsScene veya MainMenu, config | — |
| 5.1.3 | **Pencere boyutuna uyum** | Farklı çözünürlüklerde oran korunur (mevcut FIT); ekstra “pixel perfect” veya “stretch” seçeneği. | Scale manager mode: FIT (mevcut), USER (scale factor ayarı); Settings’te seçenek. | O | config, SettingsScene | — |

### 5.2 Kayıt ve İlerleme

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 5.2.1 | **Bölüm bazlı yıldız / skor** | Her bölüm için “en iyi skor” veya “yıldız sayısı” kaydet. | save.ts: getLevelStars(level), setLevelStars(level, count); getBestTime(level) vb. | D | save | 2.3.1, 4.1.3 |
| 5.2.2 | **Cloud save (opsiyonel)** | İlerlemeyi sunucuda saklama. | Backend endpoint; save.ts’te localStorage + API sync; conflict çözümü (son yazılan kazanır vb.). | Y | save, backend | — |
| 5.2.3 | **Oyundan çıkışta otomatik kayıt** | beforeunload veya visibility change’de mevcut bölümü kaydet. | window event; saveLastPlayedLevel(level) veya checkpoint; “Devam et” buradan okur. | D | save, main.ts veya GameScene | — |

### 5.3 Geliştirici ve Test

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 5.3.1 | **F2 sonraki bölüm** | Geliştirme modunda F2 ile bir sonraki bölüme atlama. | GameScene’de F2 key; scene.start(SCENE_KEY_GAME, { level: currentLevel + 1 }); production’da devre dışı (env check). | D | GameScene | — |
| 5.3.2 | **Physics debug (hitbox)** | F3 veya ayarla hitbox’ları çiz. | Arcade physics debug: body.debugBodyGraphics; toggle ile aç/kapa. | D | GameScene, config (debug) | — |
| 5.3.3 | **God mode / ölümsüzlük** | Test için düşme ve hazard’da ölüm yok. | GameScene’de flag; checkDeathByFall ve hazard overlap’ta flag true ise return. | D | GameScene | — |
| 5.3.4 | **Kayıt silme** | Ayarlar’da “İlerlemeyi sıfırla” butonu. | save.clear() veya tüm key’leri sil; scene.start(SCENE_KEY_MENU). | D | save, SettingsScene | — |

---

## 6. Hikaye ve Atmosfer

| # | Özellik | Açıklama | Uygulama notları | Z | Dosya | Bağımlılık |
|---|--------|----------|-------------------|---|-------|------------|
| 6.1 | **Bölüm başı diyalog** | “Bölüm 3: Karanlık Tünel” gibi 1–2 cümle. | Level intro overlay; metin + “Devam” butonu veya 3 saniye sonra kapanır. | O | GameScene veya LevelIntroScene | 4.2.2 |
| 6.2 | **Hedefte kısa metin** | Bölüm 5 hedefinde “Tebrikler! Maskeleri topladın.” vb. | WinScene’de metin; veya goal overlap’ta bir kez gösterilen popup. | D | WinScene, GameScene | — |
| 6.3 | **Ana menü hikaye özeti** | “Maskeleri topla, hedefe ulaş” gibi tek satır. | MainMenuScene’de alt başlık veya küçük açıklama. | D | MainMenuScene | — |
| 6.4 | **Zorluk seçimi (Kolay / Normal / Zor)** | Normal: mevcut; Kolay: daha fazla coyote time, belki can artışı; Zor: daha az coyote, tek can. | save’te difficulty; constants’ta difficulty’ye göre DEATH_FALL_LEVEL_MIN, COYOTE_TIME_MS, LIVES_MAX. | O | save, constants, SettingsScene, GameScene | — |

---

## 7. Öncelik Matrisi (Önerilen Sıra)

Aşağıdaki sıra **oynanışı** ve **içeriği** önce tamamlamaya, sonra **cilalamaya** odaklanır.

1. **Bölüm 2–5 engelleri (Tiled)** – Oyun şu an boş seviyelerle sınırlı; içerik öncelikli.  
2. **3. maske (mavi)** – Mekanik derinlik; hotbar ve layer hazır.  
3. **Checkpoint** – Uzun bölümlerde deneyim iyileşir.  
4. **Hazard / spike (dokununca ölüm)** – Seviye tasarımına tehlike ekler.  
5. **Can sistemi + can HUD** – Ölümü yumuşatır, checkpoint ile uyumlu.  
6. **Ayarlar: ses seviyesi + müzik** – Ses/müzik tamamlama.  
7. **Karakter sprite + animasyon** – Görsel kimlik.  
8. **Yıldız / koleksiyon + skor** – Tekrar oynanabilirlik.  
9. **Mobil dokunmatik** – Hedef kitle genişler.  
10. **Erişilebilirlik (kontrast, kolay mod)** – Kapsayıcılık.

---

## 8. Dokümanlar Arası Referanslar

| Konu | Doküman |
|------|---------|
| Tamamlananlar + kısa sıradaki adımlar | FUTURE_PLAN.md |
| Bölüm tasarımı (1–5) | LEVELS_PLAN.md |
| Bölüm 2–5 engellerini Tiled’da ekleme | LEVELS_OBSTACLES.md |
| Hotbar ve oyun akışı | HOTBAR_AND_FLOW_PLAN.md |
| Boyutlar ve constants | DIMENSIONS_AND_CONFIG.md |
| Kod yapısı | PROJECT_STRUCTURE.md |
| Bu detaylı plan | DETAILED_FEATURE_PLAN.md |

---

Bu plan canlıdır; yeni fikirler veya değişen öncelikler bu dosyaya eklenip güncellenebilir.
