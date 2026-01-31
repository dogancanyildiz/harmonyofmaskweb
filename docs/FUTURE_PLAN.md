# Oyuna Eklenebilecekler – Güncel Plan

Bu doküman hem **şu ana kadar yapılanları** hem **sıradaki fikirleri** listeler. Birlikte öncelik verebiliriz.

---

## ✅ Şu ana kadar tamamlananlar

| Özellik | Durum |
|--------|--------|
| Tebrikler / bitiş ekranı | WinScene: "Tebrikler!", Tekrar oyna, Menü |
| Seviye göstergesi | GameScene sol üst: "Bölüm X / 5" |
| Kayıt (localStorage) | save.ts: en yüksek tamamlanan bölüm; sayfa yenilense kalıyor |
| Ana menü | Yeni oyun, Devam et, Seviye seç, Sıralama, Kontroller, Ayarlar (ok ile seçim, Enter/Space) |
| Seviye seçimi | LevelSelectScene: 1–5 seçimi, kayda göre kilitleme |
| Pause menüsü | Esc ile duraklat; Devam, Ayarlar, Menü |
| Kontroller ekranı | ControlsScene: A/D, W/Space, S, 1–5, Esc; ana menü ve Ayarlar’dan (K) erişim |
| Ses (temel) | SoundManager: zıplama, hedefe girme, ölüm (Web Audio API, asset yok) |
| Coyote time + jump buffer | Player: kenardan düşerken ~100 ms zıplama; yere inmeden ~120 ms önce basınca zıplama |
| Sıralama ekranı | RankingScene: en yüksek bölüm veya "Henüz kayıt yok" |
| Ayarlar ekranı | SettingsScene: Kontroller [K], placeholder; Geri: Escape |

---

## 🎯 Sıradaki adımlar (önerilen sıra)

### 1. Oyun akışı

| Özellik | Açıklama | Zorluk |
|--------|----------|--------|
| ~~Seviye seçimi~~ | ✅ Tamamlandı. | — |
| ~~Pause menüsü~~ | ✅ Tamamlandı. | — |
| ~~Kontroller ekranı~~ | ✅ Tamamlandı. | — |

### 2. Oynanış ve his

| Özellik | Açıklama | Zorluk |
|--------|----------|--------|
| ~~Ses (temel)~~ | ✅ Zıplama, hedef, ölüm (SoundManager, Web Audio). | — |
| ~~Hareket iyileştirmeleri~~ | ✅ Coyote time (100 ms), jump buffer (120 ms). | — |
| **Parçacık / efekt** | Hedefe girince veya ölünce kısa efekt; isteğe zıplama tozu. | Orta |
| **Ek maske (3. maske)** | Mavi layer; hotbar slot 3, MaskType + tilemap layer. | Orta |
| **Basit düşman / tehlike** | Dokununca ölüm veya hasar; sabit veya basit patrol. | Orta |
| **Checkpoint** | Seviye içinde spawn noktası; ölünce oradan devam. | Orta |

### 3. İçerik

| Özellik | Açıklama | Zorluk |
|--------|----------|--------|
| **Bölüm 2–5 engelleri** | Şu an sadece zemin; Tiled ile platformlar ve boşluklar (LEVELS_PLAN, LEVELS_OBSTACLES.md). | Orta |
| **Yeni seviyeler (6, 7, …)** | LEVEL_MAP_KEYS, LEVEL_MAX artır; yeni tilemap. | Düşük |
| **Hikaye / diyalog** | Seviye başında veya hedefte kısa metin; basit overlay. | Orta |
| **Karakter sprite** | Dikdörtgen yerine animasyonlu sprite (idle, yürüme, eğilme, zıplama). | Orta |
| **Tileset / tema** | Yeni tileset veya palet; aynı mekanik, farklı görünüm. | Orta |

### 4. UI ve bilgi

| Özellik | Açıklama | Zorluk |
|--------|----------|--------|
| **Can / hasar** | 3 can; hasar alınca spawn veya checkpoint’ten devam. | Orta |
| **Skor / süre** | Seviye süresi veya toplanan nesne sayısı (koleksiyon eklenirse). | Düşük |

### 5. Ayarlar ve teknik

| Özellik | Açıklama | Zorluk |
|--------|----------|--------|
| **Ayarlar içeriği** | Ses aç/kapa, müzik seviyesi; ileride tuş atama. | Orta |
| **Mobil / dokunmatik** | Sanal joystick veya butonlar; klavye + dokunmatik. | Orta |
| **Erişilebilirlik** | Yüksek kontrast, büyük yazı, basit “kolay mod” (düşme = ölüm geç başlasın). | Orta |
| **Test / debug** | F2 = sonraki bölüm, physics debug (hitbox görünür). | Düşük |

---

## Önerilen sıra (bir sonraki 5 adım)

1. **Seviye seçimi** – Menüden “Seviye seç” veya mevcut menüye seviye listesi; kayıta göre kilitleme.
2. **Pause menüsü** – Esc ile duraklat; Devam, Ayarlar, Menüye dön.
3. **Kontroller ekranı** – Menü veya Ayarlar’da kısa “Nasıl oynanır” metni.
4. **Ses (temel)** – Zıplama, hedef, ölüm; his kuvvetlenir.
5. **Hareket iyileştirmeleri** – Coyote time + jump buffer; hissiyatı iyileştirir, kodu az değiştirir.

Sonrasında: Bölüm 2–5 engelleri (Tiled), Ayarlar içeriği (ses), parçacık efektleri, ek maske – önceliğine göre.

---

## Nasıl ilerleyelim?

- **“Şunu yapalım”** dersen, o madde için somut görev listesi (hangi dosya, hangi sahne) çıkarabilirim.
- **“X de olsun”** dersen, plana ekleyip uygun gruba koyarız.
- **“Sırayla yap”** dersen, yukarıdaki “bir sonraki 5 adım” sırasıyla uygulanabilir.

Bu dosya canlı plan; birlikte güncelleyebiliriz.
