# Neler Ekleyebiliriz?

Projenin mevcut durumu ve eklenebilecek özelliklerin özet listesi. Öncelik sırası önerilere göre değiştirilebilir.

---

## Mevcut durum (zaten var)

- **Akış:** Ana menü, Yeni oyun / Devam / Seviye seç (1–5), Kontroller, Ayarlar, Sıralama
- **Oyun:** 5 bölüm, maske geçişi (yeşil/kırmızı/mavi), checkpoint, 3 can, hazard (Tiled "hazards"), L3+ zemin boşlukları, düşünce bölüm başına dönüş
- **Ses:** Zıplama, hedef, ölüm, maske değiştirme; müzik (Ayarlar’dan aç/kapa, ses seviyesi)
- **Efektler:** Hedef/ölüm parçacıkları, zıplama tozu
- **Kayıt:** localStorage (en yüksek bölüm, ses tercihleri)
- **Engeller:** L1 mantığı L2–5’e script ile uygulanıyor (yeşil/red/both platformlar, L3+ mavi + zemin boşlukları)

---

## Hızlı eklenebilecekler (düşük efor)

| Özellik | Açıklama | Nerede |
|--------|----------|--------|
| **F2 sonraki bölüm** | Geliştirme için F2 ile bir sonraki bölüme atlama | GameScene `update` |
| **Bölüm başlığı** | Bölüme girince "Bölüm 3" yazısı 2–3 sn gösterilir | GameScene `create` |
| **Kayıt sıfırlama** | Ayarlar’da "İlerlemeyi sıfırla" butonu | SettingsScene, save.ts |
| **Credits ekranı** | Menüde "Credits" → yapımcılar / teşekkür | Yeni CreditsScene, MainMenu |
| **Skor / seviye süresi** | Bölümde geçen süre veya basit puan; HUD’da göster | GameScene, isteğe save |
| **Kolay mod** | Ayarlar’da toggle: düşme = ölüm sadece L5’te (veya hiç) | constants, Settings, GameScene |

---

## Orta efor, yüksek etki

| Özellik | Açıklama | Dosyalar |
|--------|----------|----------|
| **Gerçek ses dosyaları** | Zıplama, hedef, ölüm için .mp3/.ogg; mevcut beep’ler yedek kalsın | SoundManager, public/assets/audio, preload |
| **Karakter sprite** | Dikdörtgen yerine sprite sheet (idle, yürüme, zıplama, eğilme) | Player.ts, assets, GameScene preload |
| **Parallax arka plan** | 1–2 katman; kamera ile yavaş kayma | GameScene (background layer) |
| **Yıldız / koleksiyon** | Bölümde 3 yıldız; toplayınca HUD "1/3", bölüm sonunda kayıt | GameScene overlap, save (stars per level), HUD |
| **Hareketli platform** | Üzerinde durunca oyuncu platformla birlikte hareket eder | GameScene, Tiled veya script ile platform |
| **Çift zıplama (double jump)** | Havadayken bir kez daha zıplama | Player, constants |
| **Mobil / dokunmatik** | Sanal joystick + zıplama/eğilme butonları | Yeni TouchController veya GameScene overlay |
| **Tuş atama** | Ayarlar’da A/D, W/Space, 1–5’i kullanıcı tanımlı yapma | SettingsScene, save, Player, Hotbar |

---

## İçerik ve seviyeler

| Özellik | Açıklama | Dosyalar |
|--------|----------|----------|
| **Bölüm 6, 7, …** | LEVEL_MAX artır; yeni tilemap; script ile engel ekle | constants, tilemap, LevelSelect, save |
| **Hazard’lar tilemap’te** | Tiled’da "hazards" object layer’a diken bölgeleri ekle (L2–5) | tilemap JSON, GameScene zaten okuyor |
| **Checkpoint objeleri (Tiled)** | Birden fazla checkpoint; en son geçilen aktif | tilemap objects, GameScene overlap |
| **Hikaye / diyalog** | Bölüm başında veya hedefte kısa metin overlay | GameScene veya ayrı IntroScene |
| **Gizli bölüm** | Belirli bölümde gizli hedef → farklı seviye | GameScene, save, LevelSelect |

---

## Görsel ve his

| Özellik | Açıklama | Dosyalar |
|--------|----------|----------|
| **Yeni tileset / tema** | Aynı 16×16 yapı, farklı görünüm (karanlık, kar, vb.) | tileset.png, constants |
| **Hedef bölgesi ışıltı** | Hedef zone’da hafif pulse veya parçacık | GameScene setupGoalZone |
| **Landing effect** | Yere inişte kısa toz veya squash | Player, ParticleEffects |
| **Ölüm ekranı** | Ölünce kısa "Öldün" veya kırmızı flash, sonra spawn | GameScene triggerDeath |

---

## Erişilebilirlik ve teknik

| Özellik | Açıklama | Dosyalar |
|--------|----------|----------|
| **Yüksek kontrast** | Ayarlar’da toggle; karakter/platform renkleri belirgin | constants, Settings, Player, Hotbar, GameScene |
| **Büyük yazı** | Menü ve HUD font boyutu artar | SettingsScene, save, tüm sahneler |
| **Physics debug (F3)** | Hitbox’ları çiz; test için | GameScene, config |
| **Yükleme ekranı** | Oyun/bölüm açılışında progress bar | PreloadScene, config |

---

## Önerilen sıra (ilk 5 adım)

1. **F2 sonraki bölüm** – Test için hızlı.
2. **Bölüm başlığı** – "Bölüm 3" gibi kısa metin; oyun hissini artırır.
3. **Kayıt sıfırlama** – Ayarlar’da "İlerlemeyi sıfırla"; kullanıcı deneyimi.
4. **Gerçek ses dosyaları** – Beep yerine .mp3/.ogg (opsiyonel fallback).
5. **Yıldız / koleksiyon** – Bölümde 3 yıldız toplama; tekrar oynanabilirlik.

Daha detaylı açıklama ve uygulama notları için: **docs/DETAILED_FEATURE_PLAN.md** ve **docs/FUTURE_PLAN.md**.
