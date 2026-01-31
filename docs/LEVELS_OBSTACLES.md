# Bölüm 2–8 Engelleri (Maske Geçişi, Yıldız, Hareketli Platform)

Engeller **Level 1 ile aynı mantıkta**: bazı platformlar sadece **yeşil**, bazıları sadece **kırmızı**, bazıları sadece **mavi** layer’da. Oyuncu ilerlemek için maske değiştirmek zorunda. Zorluk 2’den 8’e artar.

- **Bölüm 6–8:** Yıldız toplama (3 yıldız), hareketli platformlar, çift zıplama kullanımı; zemin boşlukları artar.

## Script ile ekleme

```bash
node scripts/add-obstacles.mjs
```

- **Bölüm 2:** Yeşil → kırmızı → yeşil → kırmızı (geniş platformlar, az sayıda geçiş).
- **Bölüm 3:** Daha çok geçiş, bir üst platform; **mavi** layer’da tek mavi-only platform (mavi maske gerekir).
- **Bölüm 4–5:** Daha sık geçiş, dar platformlar, mavi-only köprüler; L5’te mavi zorunlu.
- **Bölüm 6–8:** L1 engel mantığı + ek zemin boşlukları; yıldız ve hareketli platformlar `levelConfig.ts` ile tanımlı.

## Level 1 mantığı

- **Green-only:** Platform sadece green layer’da → kırmızı maskeyle görünmez, yeşile geçmek gerekir.
- **Red-only:** Platform sadece red layer’da → yeşil maskeyle görünmez, kırmızıya geçmek gerekir.
- **Blue-only (L3+):** Platform sadece blue layer’da → mavi maskeye geçmek gerekir.

Script zemin dışı satırları temizleyip yalnızca bu tek-maske platformları ekler; böylece ilerleme maske geçişine bağlı olur.

## Teknik

- Layer isimleri: **green**, **red**, **blue**.
- Tileset: **tileset**, tile 16×16.
- En alt satır zemin (script dokunmaz). Üst satırlara sadece ilgili layer’da 1 yazılır (diğer layer’da 0).

**Zemin boşlukları (L3+):** Bölüm 3’ten itibaren zeminde çeşitli boşluklar (çukurlar) vardır. Düşen oyuncu can kaybetmeden **bölüm başlangıcına** döner.

Engelleri değiştirmek için `scripts/add-obstacles.mjs` içindeki `setRange(…)` çağrılarını düzenle; script tekrar çalışınca önce zemin üstü temizlenip yeni engeller yazılır.

## Yıldız ve hareketli platform (L6–8)

- **Yıldız:** Bölüm 6, 7, 8’de 3’er yıldız; konumlar `src/game/levelConfig.ts` → `LEVEL_STARS`. Toplanan yıldız sayısı HUD’da "★ 1/3" olarak gösterilir; bölüm bitince en iyi skor kaydedilir.
- **Hareketli platform:** `LEVEL_PLATFORMS` ile tanımlı; yatay gidip gelen platformlar. Oyuncu üzerinde durunca platformla birlikte hareket eder.
- **Çift zıplama:** Tüm bölümlerde havada bir kez daha zıplama (constants: `MAX_JUMPS = 2`).
