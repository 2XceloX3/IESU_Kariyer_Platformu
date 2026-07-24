# Original User Request

## Initial Request — 2026-07-24T00:00:19+03:00

Proje: İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi web sitesindeki (https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu) tüm verilerin (vizyon, misyon, hedefler, personel, etkinlikler, haberler ve varsa görsel referanslar) çekilerek IESU Kariyer Platformu'na entegre edilmesi ve sistemin çökme testine (Chaos Engineering) tabi tutulması.

Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu
Integrity mode: development

## Requirements

### R1. Veri Sömürme ve Ayrıştırma (Data Extraction)
Ajan ekibi (Browser ajanı dâhil) Esenyurt Kariyer Geliştirme Ofisi sayfasını tüm detaylarıyla (metinler, personeller, haberler, etkinlik içerikleri vb.) taramalı ve analiz etmelidir. "Her şeyi sömürme modu" aktif olmalı, mümkün olan en fazla yararlı içerik alınmalıdır.

### R2. Veritabanı (Mock) Güncellemesi
Elde edilen bu yepyeni veriler, projedeki `src/utils/mockData.js`, `src/utils/innerPagesData.js`, `src/utils/universityData.js` vb. dosyalara mantıklı bir yapıyla eklenmelidir. Yer tutucu (placeholder) veriler gerçek verilerle yer değiştirmelidir.

### R3. Güvenli Entegrasyon (Crash Prevention)
Eklenecek verilerin formatı (özellikle array'ler, image URL'leri, tanımlamalar) projede önceden kurulmuş olan arayüzleri (React componentlerini) bozmayacak şekilde olmalıdır. 

## Acceptance Criteria

### Veri Tamlığı ve Zenginliği
- [ ] Kariyer sayfasındaki Vizyon, Misyon, Hedefler vb. temel verilerin projeye aktarıldığı teyit edilmiş olmalı.
- [ ] Personel listesi veya haber duyuru içerikleri (sayfada var ise) tespit edilip `mockData` içerisine gömülmüş olmalı.

### Kaos (QA) Doğrulaması
- [ ] Bir "Chaos Engineer" veya Hakem ajan (QA), yeni veriler eklendikten sonra `npm run build` komutunun veya geliştirme sunucusunun başarıyla render alabildiğini doğrulamalıdır.
- [ ] UI tarafında verilerin "undefined" olması sebebiyle "Rendered fewer hooks" veya "Beyaz Sayfa" çökmesi yaşanmadığı ajanlar tarafından objektif olarak kontrol edilmelidir.
