# 🚀 Google Stitch Protocol & Design.md Kural Belgesi (/cnd)

Bu kural belgesi, projede yapılan veya yapılacak tüm geliştirmelerde otomasyon ve tasarım standartlarının korunmasını garanti altına alır.

## 📌 Temel İlkeler

1. **`/cnd` Komutu & Google Stitch Protokolü Uyumluluğu:**
   - Projedeki tüm arayüz çalışmaları, `DESIGN.md` ve Google Stitch tasarım protokolüne sıkı sıkıya bağlı kalır.
   - Ekran tasarımı yapılırken kenarlarda veya paneller arasında **istenmeyen boşluklar (unwanted margins/gaps)** bırakılamaz.
   - Tüm alt paneller (Footer, SubPanelFooter) ve üst banner'lar tam genişlikte (`w-full`) veya taşmasız kusursuz düzenle render edilir.

2. **Dengeli Izgara (Responsive Grid) ve Sıkıştırma Yasağı:**
   - `CareerNetwork`, `NelerOluyorPanel`, `NewsEvents` gibi geniş veri barındıran bileşenler **300px'lik dar sidebar'lara sıkıştırılamaz**.
   - Şirket isimleri, etkinlik başlıkları metin kesilmelerine (`truncate` veya kırpılmış metinler) maruz bırakılamaz.

3. **🌐 Kamuya Açık Sayfalar ve Giriş Engeli Yasağı (Public Pages Rule):**
   - Sertifika Doğrulama (`smart_certs`), Akademi (`sem`), Haberler, Etkinlikler gibi kamuya açık sayfalara kesinlikle **giriş zorunluluğu (`userRole` veya `currentUser` engeli)** konulamaz.
   - Giriş yapmamış ziyaretçiler bu sayfalara tıkladığında engelsiz bir şekilde doğrudan içerik ve araçlar render edilmelidir (site haritası / SEO korunur).
   - İşlevsel modüller pop-up modal yerine tam genişlikli müstakil sayfalar olarak açılır.

4. **Renk ve Tipografi Bütünlüğü:**
   - Kurumsal Nar Çiçeği Kırmızısı (`#990000`) ve Lacivert (`#0A2342`) temel kontrast alanlarıdır.
   - Font ailesi olarak `Inter` (900/800 font-black başlıklar, 500 font-medium gövde metinleri) tercih edilir.

---
*Bu kural Antigravity çalışma ortamı tarafından otomatik algılanır ve tüm işlemlerde aktif tutulur.*
