# Bölüm 2–5 Engelleri (Tiled ile)

Seviye 2, 3, 4, 5’te şu an **sadece en alt satır zemin** var; platformlar ve boşluklar `scripts/clear-obstacles-keep-ground.mjs` ile temizlenmişti.

## Engelleri geri eklemek

1. **Tiled** ile `public/assets/tilemap2.json` … `tilemap5.json` dosyalarını aç (veya `.tmx` kaynağın varsa onu düzenle).
2. **green** ve **red** layer’larında, en alt satırı **olduğu gibi bırak** (tam zemin).
3. Üst satırlara platformlar ve boşluklar ekle: `LEVELS_PLAN.md`’deki tasarıma göre:
   - Bölüm 2: Parçalı zemin, dar platformlar, eğilme geçitleri.
   - Bölüm 3–5: Daha fazla boşluk, dar platformlar, mask değiştirme zorunlu.
4. **Export** → JSON olarak kaydet; mevcut `tilemap2.json` … `tilemap5.json` üzerine yazılabilir.

## Dikkat

- Layer isimleri **green** ve **red** kalmalı; kod buna göre.
- Tileset adı **tileset**, tile boyutu **16×16** kalmalı.
- En alt satırı boş bırakma; tüm seviyelerde sürekli zemin standardı korunmalı.

Script’i tekrar çalıştırırsan yine sadece zemin kalır; engelleri Tiled’da elle ekleyip export etmek gerekir.
