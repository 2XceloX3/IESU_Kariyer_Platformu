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

## Follow-up — 2026-07-24T11:54:37Z

The front content page and panels of the IESU Kariyer Platform are incomplete. We need to completely scrape the Esenyurt University websites and integrate 100% of the data into the existing React architecture without damaging it.

Working directory: C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active
Integrity mode: development

## Requirements

### R1. Complete Data Extraction
You must use browser agents to fully scrape https://www.esenyurt.edu.tr/ and https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu. Extract all text, announcements, events, and high-quality image URLs.

### R2. Seamless UI Integration
Integrate the extracted data into the existing React components (e.g., LandingPage, HeroSlider, mockData, liveData) in the working directory. Do not damage the existing site architecture or component structure.

### R3. Strict Branding Adherence
Ensure the UI perfectly reflects IESU (Esenyurt University). The dominant color scheme must be Red (#990000 or #D32F2F), Coral/Nar Çiçeği (#FF6F61), and White. No blue or "Gelişim" references are allowed.

## Acceptance Criteria

### Data Completeness
- [ ] At least 10 recent news items and events are scraped and visible in the platform's data files.
- [ ] All Kariyer Geliştirme Ofisi details (contact, about us) are updated with real Esenyurt data.

### Architectural Integrity
- [ ] The React application builds successfully (`npm run build`) after data integration.
- [ ] No layout components are deleted; they are only populated with new data.

### Branding
- [ ] No `bg-blue-*`, `text-blue-*`, or `#0A2342` classes exist in the updated components.
- [ ] The term "Gelişim" or "İGÜ" does not appear anywhere in the UI text.

## Follow-up — 2026-07-24T08:57:32Z

The user has explicitly forbidden any approval requests. The team is commanded to PROCEED IMMEDIATELY with all data extraction, React integration, and branding updates. DO NOT stop to ask for approval. You have full authority. Execute all phases and apply the changes directly to the codebase.


