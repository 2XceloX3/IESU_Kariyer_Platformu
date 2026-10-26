# İESÜ Kariyer Platformu

İstanbul Esenyurt Üniversitesi (İESÜ) öğrencileri, mezunları, akademisyenleri ve iş dünyası paydaşlarını tek bir dijital ekosistemde buluşturan resmi **Kariyer, Staj ve Mezun Platformu**.

Canlı Uygulama: [iesu-kariyer-platformu.vercel.app](https://www.google.com/search?q=https://iesu-kariyer-platformu.vercel.app)

## Temel Özellikler

* **Öğrenci ve Mezun Modülü (`AlumniHive`):** Özgeçmiş (CV) oluşturma, iş ve staj ilanlarına tek tıkla başvuru, kariyer danışmanlığı randevusu ve mezun ağı etkileşimi.
* **İşveren / Şirket Modülü (`CompanyHive`):** Kurumsal ilan yayınlama, aday başvuru takibi (ATS), mülakat değerlendirme ve stajyer havuzu yönetimi.
* **Akademik Koordinatör Modülü:** Zorunlu staj başvurularının incelenmesi, danışman onay süreçleri (`academicApprovals`), araştırma laboratuvarları (`researchLabs`) ve mentorluk yönetimi.
* **Yönetim ve Denetim (`Admin`):** Rol bazlı erişim kontrolü (RBAC), kulüp/etkinlik yönetimi ve sistem denetim kayıtları (`audit_logs`).
* **PWA ve Hızlı Erişim:** Mobil cihazlara kurulabilen Progressive Web App (PWA) desteği ve klavye kısayollarıyla çalışan komut paleti (`CommandPalette`).

## Teknoloji Yığını

| Katman | Kullanılan Teknolojiler |
| :--- | :--- |
| **Ön Yüz (Frontend)** | React 19, Vite 8, React Router v7, Tailwind CSS, Framer Motion |
| **Durum ve Veri Yönetimi** | Zustand, TanStack React Query, React Hook Form + Zod |
| **Arka Uç ve Güvenlik (BaaS)** | Firebase Authentication, Cloud Firestore, Firebase Storage |
| **Kod Kalitesi ve Test** | Vitest, Testing Library, Playwright (E2E), Oxlint, ESLint, Husky |

## Kurulum ve Geliştirme

### 1. Gereksinimler
* **Node.js** `>= 20.x`
* **npm** `>= 10.x`
* **Firebase CLI** (Güvenlik kuralları emülatörü ve dağıtım için: `npm install -g firebase-tools`)

### 2. Bağımlılıkların Yüklenmesi
```bash
git clone https://github.com/2XceloX3/IESU_Kariyer_Platformu.git
cd IESU_Kariyer_Platformu
npm install
```

### 3. Ortam Değişkenlerinin (`.env`) Yapılandırılması
Kök dizindeki `.env.example` dosyasını `.env` olarak kopyalayın ve kendi Firebase proje anahtarlarınızı tanımlayın:

```bash
cp .env.example .env
```

Gerekli ortam değişkenleri:
* `VITE_FIREBASE_API_KEY`
* `VITE_FIREBASE_AUTH_DOMAIN`
* `VITE_FIREBASE_PROJECT_ID`
* `VITE_FIREBASE_STORAGE_BUCKET`
* `VITE_FIREBASE_MESSAGING_SENDER_ID`
* `VITE_FIREBASE_APP_ID`
* `VITE_FIREBASE_MEASUREMENT_ID`

### 4. Uygulamayı Çalıştırma
```bash
# Geliştirme sunucusunu başlatır (http://localhost:5173)
npm run dev

# Üretim (Production) derlemesi alır
npm run build
```

## Güvenlik ve Kalite Kontrolleri

Projede tüm yetkilendirme ve KVKK veri izolasyonu `firestore.rules` ve `storage.rules` üzerinden zorunlu tutulmaktadır:
* **Rol Ayrımı:** Yönetici (`admin`) yetkileri yalnızca doğrulanmış Firebase Custom Claims (`request.auth.token.role == 'admin'`) veya kurumsal yönetici hesabı üzerinden verilir; istemci tarafından rol yükseltilmesi (`privilege escalation`) kurallar düzeyinde engellenmiştir.
* **KVKK ve Dosya Güvenliği:** Özgeçmişler (`/resumes/{userId}`) yalnızca dosyanın sahibi, yetkili işveren/akademisyen veya sistem yöneticisi tarafından okunabilir; maksimum dosya boyutu ve MIME tipi (`application/pdf` vb.) sınırlandırılmıştır.

Testleri ve kod denetimini çalıştırmak için:
```bash
# Birim ve bileşen testlerini çalıştırır
npm test

# Firestore güvenlik kuralları testlerini emülatörde çalıştırır
npm run test:rules

# Oxlint ile hızlı statik kod analizi yapar
npm run lint
```

## Dağıtım (Deployment)

* **Vercel (Frontend):** `vercel.json` içerisindeki SPA yönlendirme (`rewrites`) ve güvenlik başlıkları (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`) ile otomatik dağıtıma hazırdır.
* **Firebase (Kurallar):** Güvenlik kurallarını canlı ortama göndermek için:
  ```bash
  firebase deploy --only firestore:rules,storage
  ```
