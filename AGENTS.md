# İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer & Mezun Platformu Kuralları

Bu dosya, projenin kurumsal kimlik, kullanıcı arayüzü ve veri bütünlüğü kurallarını tanımlar.

## 1. Kurumsal İsimlendirme ve Kimlik Kuralları
- **Resmi Kurum Adı:** İstanbul Esenyurt Üniversitesi (İESÜ)
- **Yönetici/Koordinatörlük Unvanı:** Süper Admin, sistem yöneticisi ve kurumsal birimlerde hiçbir zaman kişisel geliştirici adları kullanılamaz; resmi kurumsal unvan olan **"Kariyer Geliştirme Koordinatörlüğü"** veya **"Kariyer Geliştirme Merkezi"** kullanılmalıdır.
- **Mezunlar Portalı Başlığı:** Mezunlar için kullanılan çatı sistemin adı kesin olarak **"İESÜ Mezunlar Portalı"** olarak kullanılmalıdır. ("Mezunlar Derneği Portalı" veya benzeri türevler kesinlikle kullanılmamalıdır).

## 2. Kullanıcı Arayüzü & Buton Standartları
- **Mükerrer Buton Yasağı:** Form sayfalarında ve panellerde, sayfa/bölüm altında zaten özel bir işlem çubuğu (`Save Action Bar`) bulunuyorsa, kart başlığına veya üst gezinme çubuğuna aynı işlevi gören mükerrer butonlar konulmamalıdır. Eylem noktaları tek, net ve akışın doğal bittiği yerde olmalıdır.
- **Veri Kaybı Önleme:** Sekme geçişlerinde ve sayfa değişimlerinde bekleyen form değişiklikleri arka planda otomatik olarak kaydedilmeli (`handleSave(false)`), kullanıcının girdiği veriler hiçbir zaman kaybolmamalıdır.

## 3. Kod ve Veri Dönüşüm İlkeleri
- **Körlemesine Regex Yasağı:** Kurum adı değişimlerinde `replace(/Gelişim/g, 'Esenyurt')` gibi global kör regex asla uygulanmamalıdır; bu durum "Gelişim Alanları" -> "Esenyurt Alanları", "Çocuk Gelişimi" -> "Çocuk Esenyurti" gibi metin bozulmalarına yol açmaktadır. Değişiklikler semantik ve kontrollü yapılmalıdır.
- **Yapay Zeka JSON Ayrıştırma:** Yapay zeka çıktılarında markdown temizlenirken `replace(/json/gi, '')` yerine `replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()` kullanılmalıdır; JSON verisinin içindeki "json" ifadeleri silinmemelidir.

## 4. Çok Dallı Portal Mimarisi ve Gezinme Standartları
- **Geri Dönüş Tuzakları Yasağı:** Alt paneller veya bağımsız modüller (ör. Küresel Mezun Haritası, Mezun Bilgi Sistemi, Kullanıcı Profili) asla varsayılan olarak Süper Admin (`admin`) paneline bağlanamaz. Her kullanıcı kendi aktif portal dalına (`alumni`, `student`, `company`, `academic`) geri yönlendirilmelidir.
- **Her Dalın Kendi Yaprağı:** Her portal dalı kendi renk paletine, alt yüzen dock'una (Emerald, Crimson, Indigo, Navy, Amber) ve bağlamsal başlığına sahip olmalıdır; sistem kökte birleşen ancak dallarda bağımsız çalışan bir ekosistem olarak tasarlanmalıdır.

## 5. Küresel Harita ve Jeo-Konum İlkeleri
- **Pin/Nokta Göstergesi Yasağı:** Küresel haritada (`GlobalAlumniMap.jsx`) ülkelerin üzerinde görüntü kirliliği yaratan daire/yuvarlak pin göstergeleri kesinlikle kullanılmamalıdır.
- **Siber Cam Parıltısı ve Nefes Alma Efekti:** Ülkeler doğal derin arduvaz (`#101a2f` - `#14223d`) dolgusuyla render edilmeli, hover veya odaklanma anında siber cam ışıltısı ve nefes alma konturlarıyla parıldamalıdır.
- **Genişletilmiş Şehir Veritabanı:** `alumniGeoData.js` içerisinde Türkiye'nin 81 ili ve dünya genelindeki 350+ teknoloji/finans/sanayi merkezi doğru koordinatları ve yetkinlik rozetleriyle eksiksiz yer almalıdır.

## 6. Güvenli Avatar ve Medya Standartları
- **SafeAvatar Zorunluluğu:** Profil avatarlarında dış kaynaklı ve bozulabilen ham `img` etiketleri veya `pravatar.cc` kullanılmamalı; her zaman hataya dayanıklı SVG/baş harf fallback'li `SafeAvatar` bileşeni kullanılmalıdır.
- **Alt Yüzen Dock ve Eylem Çubukları:** Panellerde alt kontrol dock'u (`AdminOmniDock`) ve form eylem çubuğu hiçbir sekmede kaybolmamalı, her görünümde eksiksiz render edilmelidir.

