# 🎓 İSTANBUL ESENYURT ÜNİVERSİTESİ (İESÜ)
# KARİYER & MEZUN PLATFORMU — NOTEBOOKLM ANA REFERANS VE PROJE BİLGİ BANKASI

> **Doküman Türü:** Kapsamlı Sistem Mimarisi, Organizasyon Şeması, Rol Yetki Matrisi ve Teknik Kaynak Belgesi  
> **Hedef Kitle:** Google NotebookLM, Proje Yöneticileri, Yazılım Geliştiriciler ve Sistem Yöneticileri  
> **Resmî Kurumsal Makam:** Kariyer Geliştirme Koordinatörlüğü  
> **Platform Versiyonu:** 2026.4 (Kaos Protokolü & KVKK Sertleştirilmiş Sürüm)  

---

## 1. KURUMSAL KİMLİK VE TEMEL İLKELER

### 1.1 Resmî İsimlendirme Standartları
* **Resmî Üniversite Adı:** İstanbul Esenyurt Üniversitesi (İESÜ)
* **Merkezi Yönetici Birim:** **"Kariyer Geliştirme Koordinatörlüğü"** (Geliştirici adları veya gayriresmî unvanlar sistem genelinde kesinlikle yasaktır).
* **Mezun Çatı Portalı:** Kesin olarak **"İESÜ Mezunlar Portalı"** olarak adlandırılır. ("Mezun Derneği Portalı" veya türevleri yasaklanmıştır).
* **Öğrenci Kariyer Gelişim Sistemi:** KGB (Kariyer Gelişim Karnesi) ve YÖK Kariyer Akreditasyon Standartları.

### 1.2 Arayüz ve Tasarım Kuralları (AGENTS.md)
* **Mükerrer Buton Yasağı:** Sayfa altında işlem çubuğu (`Save Action Bar`) varsa, kart başlığına veya üst çubuğa mükerrer kayıt/onay butonları konulmaz.
* **Veri Kaybı Önleme:** Sekme ve sayfa geçişlerinde bekleyen form verileri arka planda otomatik kaydedilir (`handleSave(false)`).
* **Küresel Harita Standartları:** `GlobalAlumniMap.jsx` üzerinde çirkin yuvarlak pin/noktalar yasaktır; derin arduvaz siber cam parıltısı ve nefes alma efektli SVG poligonlar kullanılır.
* **SafeAvatar Zorunluluğu:** Profil avatarlarında kırılabilen harici `pravatar` veya ham `<img>` yerine her zaman SVG/baş harf fallback'li `SafeAvatar` bileşeni kullanılır.

---

## 2. TEKNOLOJİ YIĞINI VE ALTYAPI MİMARİSİ

```
┌────────────────────────────────────────────────────────────────────────┐
│                   İESÜ FRONTEND SPA (React 18 + Vite)                  │
│  - Tailwind CSS 3.4 (Özelleştirilmiş İESÜ Kurumsal Renk Paleti)       │
│  - Lucide React İkonografi Kütüphanesi                                 │
│  - Vite PWA (Service Worker, Offline Cache, App Manifest)              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 ZUSTAND ÇOK KATMANLI DURUM YÖNETİMİ                     │
│  - coreStore (useAppStore.js)   : Oturum, kullanıcı rolü, branch       │
│  - useSharedStore.js            : İlanlar, etkinlikler, duyurular      │
│  - useAdminStore.js             : 30+ CMS havuzu, onay süreçleri, log  │
│  - eventBus.js                  : Modüller arası anlık reaktif mesajlaşma│
│  - safeStorage.js               : 5MB LocalStorage Quota Koruyucu      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                       FIREBASE BULUT SERVİSLERİ                        │
│  - Firebase Authentication      : E-posta/Şifre, Custom Claims         │
│  - Cloud Firestore              : 'users', 'jobs', 'applications'      │
│  - Cloud Storage                : 'avatars/', 'resumes/', 'clubs/'     │
│  - storage.rules & firestore.rules : Rol Bazlı Katı Güvenlik           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ÇOK DALLI PORTAL MİMARİSİ (5 BAĞIMSIZ DAL)

Sistem kökte tek bir React SPA üzerinde çalışır ancak her kullanıcı rolü için tamamen izole edilmiş bir "Hive" (Kovan) portal dalına sahiptir:

| Portal Dalı | Rol Kodu | Renk Teması | Temel Modüller & Görevler |
|---|---|---|---|
| **Öğrenci Portalı** | `student` | Zümrüt Yeşili (Emerald) | • Akış (Feed) ve Kampüs Haberleri<br>• KGB Kariyer Karnem & YÖK Standartları<br>• Staj ve İş İlanları Başvuru Havuzu<br>• Öğrenci Kulüpleri & SKS Etkinlikleri<br>• Kariyer Danışmanlığı Randevu Sistemi |
| **Mezunlar Portalı** | `alumni` | Esenyurt Bordo (Crimson / #990000) | • İESÜ Mezunlar Ağı & Bağlantı Keşfi<br>• Dijital Mezun Kartı & Cüzdan<br>• Mezun-Öğrenci Mentörlük Sistemi<br>• Küresel Mezun İstihdam Haritası<br>• Kariyer Check-up & YÖK İzleme |
| **İşveren / Firma Portalı** | `company` | Gece Mavisi (Indigo) | • İlan Oluşturma ve Yayınlama (Tam/Yarı/Staj)<br>• ATS (Aday Takip Sistemi) Kanban Panosu<br>• Başvuru İnceleme, Mülakata Çağırma<br>• Firma Kampüs Etkinlik & Stant Talepleri<br>• Koordinatörlük İletişim Hattı |
| **Akademik Koordinatörlük** | `academic` | Derin Lacivert (Navy) | • Zorunlu Staj Başvurusu İnceleme & Onay<br>• Akademik Radar & Riskli Öğrenci Takibi<br>• Fakülte/Bölüm İstihdam İstatistikleri<br>• Danışmanlık Saatleri & Öğrenci Görüşmeleri |
| **Süper Admin (Koordinatörlük)** | `admin` | Kurumsal Bordo / Kehribar (Amber) | • 30+ CMS Yönetim Modülü<br>• Kullanıcı ve Yetki Türü Yöneticisi<br>• YÖK Akreditasyon Otomatik Raporu<br>• Canlı Mesaj Denetim Havuzu (Message Audit)<br>• Firma & Kulüp Başvuru Onay Merkezleri |

---

## 4. DETAYLI KULLANICI ROLLERİ VE YETKİ MATRİSİ

### 4.1 İdari ve Personel Rolleri (CMSUserTypeManager)
1. **Süper Admin (Kariyer Geliştirme Koordinatörlüğü):**
   * Yetki Seviyesi: Tam Yetki (30/30 Modül)
   * Görevleri: Platform konfigürasyonu, tüm veri havuzlarını dışa aktarma (Excel/CSV), personel hesapları yönetimi, güvenlik ve denetim loglarını inceleme, toplu duyuru yayınlama.
2. **Admin (Birim Yöneticisi):**
   * Yetki Seviyesi: İdari Yönetim (25/30 Modül)
   * Görevleri: Firma onayları, iş ilanı moderasyonu, mezun kartı onayları, kulüp bütçe ve salon talepleri yönetimi.
3. **İçerik Editörü:**
   * Yetki Seviyesi: Medya ve İletişim (12/30 Modül)
   * Görevleri: Kampüs haberleri, başarı hikayeleri, duyurular, etkinlik takvimi güncelleme.
4. **Akademik Koordinatör:**
   * Yetki Seviyesi: Akademik Süreçler (18/30 Modül)
   * Görevleri: Staj defteri ve evrak incelemesi, 20-30 iş günü SGK staj formları onayı, fakülte akademik istihdam analitiği.
5. **İşveren İlişkileri Sorumlusu:**
   * Yetki Seviyesi: Kurumsal İletişim (15/30 Modül)
   * Görevleri: Yeni kayıt olan firmaları doğrulama, kampüs mülakat günleri planlama, sponsorluk ve stant yönetimi.
6. **Gözlemci / Raporcu:**
   * Yetki Seviyesi: Salt Okunur (5/30 Modül)
   * Görevleri: YÖK akreditasyon raporlarını görüntüleme, anonim istihdam istatistiklerini izleme.

### 4.2 Son Kullanıcı Rolleri
* **Öğrenci (`student`):**
  * Sadece kendi profilini, başvurularını, katıldığı kulüpleri ve aldığı belgeleri yönetir.
  * Firma ilanlarına başvurabilir, mentörlük talep edebilir, kulüp etkinliği için SKS talebi oluşturabilir.
* **Mezun (`alumni`):**
  * Dijital Mezun Kartı başvurusunda bulunabilir, öğrencilere mentörlük verebilir.
  * Mezunlar Ağı üzerinden dönem arkadaşlarıyla mesajlaşabilir, Kariyer Check-up anketini yanıtlar.
* **Firma Yetkilisi (`company` / `employer`):**
  * Kayıt olduktan sonra `status: 'Onay Bekliyor'` durumunda bekler. Süper Admin onaylayınca aktif olur.
  * Kendi ilanlarını yayınlar, ATS üzerinden adayları "Ön İnceleme -> Mülakat -> Teklif -> Kabul/Ret" aşamalarında yönetir.

---

## 5. VERİ MODELİ VE DURUM YÖNETİMİ (ZUSTAND & FIRESTORE)

### 5.1 Ana Veri Koleksiyonları
* `users`: Kullanıcı hesapları (`uid`, `name`, `email`, `role`, `department`, `status`, `avatar`, `phone`).
* `jobs`: İş ve staj ilanları (`id`, `title`, `company`, `type`, `location`, `description`, `requirements`, `deadline`, `status`).
* `applications`: İş başvuruları (`id`, `jobId`, `applicantId`, `applicantName`, `cvUrl`, `status`, `createdAt`).
* `clubs`: Öğrenci kulüpleri (`id`, `name`, `category`, `president`, `members`, `authorizedOfficers`, `budget`).
* `alumniCardApplications`: Mezun kartı talepleri (`id`, `name`, `tcNo`, `studentId`, `deliveryType`, `status`).
* `checkupRecords`: YÖK Mezun İstihdam İzleme anket yanıtları (`id`, `name`, `department`, `employed`, `sector`, `relatedToMajor`).

### 5.2 Veri Bütünlüğü ve Depolama Kalkanı (`safeStorage.js`)
* Tarayıcıların 5 MB'lık `localStorage` limitine karşı `QuotaExceededError` yakalama kalkanı aktiftir.
* Kota dolduğunda düşük öncelikli önbellekler (`iesu_temp_`, `iesu_cache_`) `Object.keys()` snapshot ile indis kayması olmadan temizlenir.
* Sorun devam ederse uygulama belleğe (`memoryFallback`) geçerek beyaz ekran çökmesini engeller.

---

## 6. GÜVENLİK, KVKK VE PROTOKOL İLKELERİ

### 6.1 KVKK ve Kişisel Veri Koruma
* **T.C. Kimlik Numarası Maskeleme:** Tüm tablolarda, arayüz kartlarında ve CSV/Excel dışa aktarım dosyalarında T.C. Kimlik numaraları otomatik olarak `1234*****90` şeklinde maskelenir. Ham 11 haneli numara istemcide açıkta gösterilmez.
* **LocalStorage Parola İzolasyonu:** Personel oluşturma veya güncelleme işlemlerinde parolalar `localStorage` içine asla düz metin yazılmaz. `saveAccounts` fonksiyonu parolaları otomatik filtreler.
* **Oturum İzolasyonu:** `sessionStorage` varsayılan oturum alanıdır. "Beni Hatırla" seçilmediği sürece tarayıcı kapandığında oturum sonlanır; ortak bilgisayarlarda oturum sızıntısı önlenir.

### 6.2 Güvenlik Açıklarına Karşı Koruma Kalkanları
* **CSV / Formula Enjeksiyonu (CWE-1236):** Excel dışa aktarımlarında `=`, `+`, `-`, `@`, `Tab`, `CR` ile başlayan metinlerin önüne tek tırnak (`'`) eklenerek işletim sistemi komut çalıştırma açığı engellenmiştir.
* **Stored XSS Koruması:** `CMSAnalytics.jsx` içinde basılan YÖK Akreditasyon Yazdırma Raporunda `escapeHtml` fonksiyonu ile HTML etiketleri (`&lt;`, `&gt;`, `&quot;`) kaçırılır.
* **Kullanıcı Sayımı (User Enumeration) Engeli:** `ForgotPassword.jsx` ekranında girilen e-posta sistemde olmasa bile generic mesaj dönülerek üniversite e-posta havuzunun taranması engellenir.
* **Cloud Storage Kuralları (`storage.rules`):** Yalnızca kimliği doğrulanmış kullanıcılar dosya yükleyebilir; avatar için 5MB görsel, CV için 10MB PDF sınırı uygulanır.

---

## 7. KAOS PROTOKOLÜ DENETİM ÖZETİ VE UYGULANAN İYİLEŞTİRMELER

| Alan | Tespit Edilen Zafiyet | Uygulanan Mühendislik Çözümü |
|---|---|---|
| **Firebase İstemci** | Modül seviyesinde korumasız `getFirestore` / `getAuth` çağrıları gizli sekmede fatal çökme yaratıyordu. | `try/catch` ve fallback instance ile güvenli lazy başlatma mimarisine geçildi. |
| **Kayıt & Şifremi Unuttum** | `auth/user-not-found` ile personel/öğrenci e-postaları enumerate edilebiliyordu. | Generic güvenlik mesajı entegre edildi. |
| **Depolama (safeStorage)** | `for(let i=0; i<length; i++)` döngüsünde `removeItem` indis kayması yaratıyordu. | `Object.keys(localStorage).forEach` snapshot döngüsüyle düzeltildi. |
| **CSV Dışa Aktarımlar** | Excel formula injection açığı mevcuttu. | Regex kontrolü (`/^[=+\-@\t\r]/`) ile tek tırnak koruması eklendi. |
| **YÖK Rapor Çıktısı** | `document.write` içine mezun adları doğrudan string olarak basılıyordu (Stored XSS). | `escapeHtml` kalkanı yazıldı ve tüm alanlar sanitize edildi. |
| **Storage Kuralları** | Projede `storage.rules` yoktu, bulut depolama tanımsızdı. | Kapsamlı ve katı dosya tipi/boyut filtreli `storage.rules` yazıldı. |
| **Firma Onay Senkronizasyonu** | Firma onaylanınca sadece yerel Zustand güncelleniyor, Firestore'a yazılmıyordu. | `CMSCompanies.jsx` içine `updateDoc` Firestore senkronizasyonu ve hızlı onay butonları eklendi. |
| **Öğrenci Akışı Performansı** | `StudentFeed.jsx` render gövdesinde 3 kez tekrarlanan IIFE `computeCareerProgress` CPU tüketiyordu. | `useMemo` ile tek seferde hesaplanan reaktif mimariye geçirildi. |
| **Personel Parolaları** | `iesu_staff_accounts_v1` içerisine düz metin parolalar yazılıyordu (KVKK). | `saveAccounts` içerisinde parola temizleme ve sterilizasyon uygulandı. |
| **useAppStore Bellek Kirliliği** | Logout işleminde `followedUserIds` sıfırlanmıyordu. | `reset()` metoduna `followedUserIds: []` eklendi; `partialize`'da TC alanları temizlendi. |

---

## 8. SSS (SIKÇA SORULAN SORULAR) — NOTEBOOKLM SORGULARI İÇİN

* **Soru: İESÜ Kariyer Platformu'nda kaç farklı kullanıcı arayüzü vardır?**  
  *Cevap:* 5 farklı arayüz vardır: Öğrenci Portalı (StudentHive), Mezunlar Portalı (AlumniHive), İşveren Portalı (CompanyHive), Akademik Koordinatörlük (AcademicHive) ve Süper Admin Paneli (AdminDashboard).
* **Soru: Yeni kayıt olan bir şirket doğrudan öğrenci ilanlarına erişebilir mi?**  
  *Cevap:* Hayır. Şirket kayıt olduğunda durumu `Onay Bekliyor` olarak işaretlenir. Kariyer Geliştirme Koordinatörlüğü şirketin vergi ve kurumsal bilgilerini inceleyip onaylamadan ilan yayınlayamaz ve aday havuzunu göremez.
* **Soru: T.C. Kimlik numaraları sistemde nasıl korunmaktadır?**  
  *Cevap:* KVKK uyumu kapsamında arayüzde, tablolarda ve dışa aktarılan dosyalarda T.C. Kimlik numaraları ilk 4 ve son 2 hanesi hariç yıldızlanarak (`1234*****90`) gösterilir. Zustand yerel depolama oturumuna hassas kimlik verileri yazılmaz.
* **Soru: KGB Kariyer Karnesi nedir?**  
  *Cevap:* Öğrencinin tamamladığı stajlar, sertifikalar, kulüp başkanlıkları, etkinlik katılımları ve başvuru sayılarına göre YÖK Kariyer Akreditasyon kriterleri doğrultusunda dinamik hesaplanan A-B-C-D harf notlu bir gelişim metriğidir.
