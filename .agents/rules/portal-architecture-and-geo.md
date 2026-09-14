---
name: portal-architecture-and-geo
description: Enforces branch isolation in multi-role university portal, cyber-geospatial map aesthetics, and robust avatar rendering.
always_on: true
---

# Portal Mimarisi, Siber Harita ve Güvenli Avatar Kuralları

## 1. Çok Dallı Portal İzolasyonu (Branch Isolation)
- Hiçbir alt görünüm (ör. global_alumni_map, alumni_info_system, user_profile, profile_update), kullanıcıyı körlemesine Süper Admin paneline (admin) aktaramaz.
- Geri dönüş aksiyonları daima kullanıcının oturum açtığı veya geldiği dalı referans almalıdır:
  - Mezun için -> alumni
  - Öğrenci için -> student
  - Akademik Personel için -> academic
  - Şirket için -> company
  - Yalnızca Süper Admin için -> admin

## 2. Küresel Harita Tasarım Standartları
- Harita üzerinde ekstra yuvarlak / pin / nokta marker'lar konulamaz (kullanıcı kesin talimatı).
- Ülkeler koyu arduvaz (#101a2f - #14223d) arka planına sahip olmalı, fare ile üzerine gelindiğinde veya seçildiğinde nefes alan cam parıltısı (cyan / emerald glass sheen) ile yanıp sönmelidir.
- Logo kesinlikle beyaz renkte olmalıdır.
- Başlık çubuğunda "Canlı Diaspora" gibi gereksiz rozetler veya bozuk butonlar bulunmamalıdır.
- src/utils/alumniGeoData.js dosyası 81 ili ve 350+ dünya metropolünü eksiksiz koordinat ve uzmanlık rozetleriyle sağlamalıdır.

## 3. Medya ve Arayüz Bütünlüğü
- Asla dış kaynaklı ham img (örn. pravatar.cc) doğrudan kullanılmamalı, daima SafeAvatar tercih edilmelidir.
- Alt yüzen dock (AdminOmniDock) ve kaydetme aksiyon çubukları her sekmede aktif olmalıdır.
