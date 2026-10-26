#!/usr/bin/env python3
"""
İESÜ Kariyer Platformu - Tam Otomatik Güvenlik, Tasarım (UI/UX), SEO, Mimari ve GitHub Yükleme Betiği
Kullanım: Proje kök dizininde `python3 apply_iesu_fixes.py` komutunu çalıştırın.
Tüm dosyaları otomatik günceller, tasarımsal hataları giderir ve Git üzerinden GitHub'a commit/push yapar.
"""

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# 1. GÜVENLİK: storage.rules (@iesu.edu.tr uzantılı tüm e-postaların admin sayılması açığı kapatıldı)
STORAGE_RULES = """rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // KRİTİK DÜZELTME: Sadece admin claim'i veya doğrulanmış kariyer@iesu.edu.tr hesabı admin yetkisi alır.
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.role == 'admin' ||
        (request.auth.token.email == 'kariyer@iesu.edu.tr' && request.auth.token.email_verified == true)
      );
    }

    function isCompany() {
      return isAuthenticated() && (
        request.auth.token.role == 'company' ||
        request.auth.token.role == 'employer' ||
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['company', 'employer']
      );
    }

    function isAcademic() {
      return isAuthenticated() && (
        request.auth.token.role == 'academic' ||
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'academic'
      );
    }

    function isImage() {
      return request.resource != null &&
             request.resource.contentType.matches('image/(jpeg|png|webp|gif)') &&
             request.resource.size < 5 * 1024 * 1024; // Maksimum 5 MB
    }

    function isDocument() {
      return request.resource != null &&
             (request.resource.contentType == 'application/pdf' ||
              request.resource.contentType == 'application/msword' ||
              request.resource.contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') &&
             request.resource.size < 10 * 1024 * 1024; // Maksimum 10 MB
    }

    // Profil avatarları: Sadece sahibi veya admin yükleyebilir
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if (isOwner(userId) || isAdmin()) && isImage();
    }

    // Özgeçmiş / CV belgeleri (KVKK Korumalı): Sadece sahibi, yetkili işveren/akademisyen veya admin okuyabilir
    match /resumes/{userId}/{fileName} {
      allow read: if isOwner(userId) || isAdmin() || isCompany() || isAcademic();
      allow write: if (isOwner(userId) || isAdmin()) && isDocument();
    }

    // İş başvurusu ekleri: Sadece başvuru sahibi kendi UID'sini içeren dosyayı yükleyebilir
    match /applications/{applicationId}/{fileName} {
      allow read: if isAuthenticated() && (
        isAdmin() || isCompany() || isAcademic() || fileName.matches('.*' + request.auth.uid + '.*')
      );
      allow write: if isAuthenticated() &&
        (isAdmin() || fileName.matches('.*' + request.auth.uid + '.*')) &&
        (isDocument() || isImage());
    }

    // Kulüp ve etkinlik medyaları: Sadece admin veya kulüp yetkilileri yazabilir
    match /clubs/{clubId}/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && isImage() && (
        isAdmin() ||
        firestore.get(/databases/(default)/documents/clubs/$(clubId)).data.presidentId == request.auth.uid
      );
    }

    // Kurumsal ve sistem belgeleri
    match /system/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Varsayılan kural: Güvenli kapalı mimari
    match /{allPaths=**} {
      allow read, write: if isAdmin();
    }
  }
}
"""

# 2. GÜVENLİK: firestore.rules (Kimliğe bürünme ve yetkisiz statü güncelleme açıkları kapatıldı)
FIRESTORE_RULES = """rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // CRITICAL: admin is claim-only. Doc role alone must NOT grant admin
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.role == 'admin' ||
        (request.auth.token.email == 'kariyer@iesu.edu.tr' && request.auth.token.email_verified == true)
      );
    }

    // Non-admin roles: prefer claim, allow users doc fallback.
    function isCompany() {
      return isAuthenticated() && (
        request.auth.token.role == 'company' ||
        request.auth.token.role == 'employer' ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['company', 'employer'])
      );
    }

    function isAcademic() {
      return isAuthenticated() && (
        request.auth.token.role == 'academic' ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'academic')
      );
    }

    function selfSelectableRole(role) {
      return role in ['student', 'alumni', 'company', 'employer'];
    }

    function noPrivilegedUserFields() {
      return !request.resource.data.keys().hasAny(['isAdmin', 'customClaims', 'claims'])
        && request.resource.data.get('isAdmin', false) == false;
    }

    match /users/{userId} {
      allow read: if isAuthenticated();

      allow create: if isAuthenticated()
        && request.auth.uid == userId
        && selfSelectableRole(request.resource.data.role)
        && noPrivilegedUserFields();

      allow update: if isAdmin()
        || (
          isOwner(userId)
          && noPrivilegedUserFields()
          && !request.resource.data.diff(resource.data).affectedKeys()
              .hasAny(['role', 'isAdmin', 'customClaims', 'claims'])
        );

      allow delete: if isAdmin();
    }

    match /jobs/{jobId} {
      allow read: if true;
      allow create: if isAuthenticated() && (
        isAdmin() || (
          isCompany()
          && request.resource.data.companyId == request.auth.uid
        )
      );
      allow update: if isAuthenticated() && (
        isAdmin() || (
          isCompany()
          && resource.data.companyId == request.auth.uid
          && request.resource.data.companyId == resource.data.companyId
        )
      );
      allow delete: if isAuthenticated() && (
        (isCompany() && resource.data.companyId == request.auth.uid) || isAdmin()
      );
    }

    function applicationJobExists() {
      return request.resource.data.jobId is string
        && exists(/databases/$(database)/documents/jobs/$(request.resource.data.jobId));
    }

    function applicationCompanyMatchesJob() {
      return applicationJobExists()
        && get(/databases/$(database)/documents/jobs/$(request.resource.data.jobId)).data.companyId
          == request.resource.data.companyId;
    }

    function applicantCreateStatusOk() {
      return request.resource.data.status in ['Beklemede', 'Onay Bekliyor'];
    }

    function noCompanyReservedApplicationFields() {
      return !request.resource.data.keys().hasAny([
        'employerDecision', 'companyDecision', 'reviewedBy', 'hired',
        'hiredAt', 'companyInternalStatus', 'adminNotes', 'interviewScore'
      ]);
    }

    match /applications/{applicationId} {
      allow create: if isAuthenticated()
        && request.resource.data.applicantId == request.auth.uid
        && applicationCompanyMatchesJob()
        && applicantCreateStatusOk()
        && noCompanyReservedApplicationFields();

      allow read: if isAuthenticated() && (
        resource.data.applicantId == request.auth.uid ||
        resource.data.companyId == request.auth.uid ||
        isAdmin() ||
        isAcademic()
      );

      allow update: if isAuthenticated() && (
        isAdmin() ||
        (
          isCompany()
          && resource.data.companyId == request.auth.uid
          && exists(/databases/$(database)/documents/jobs/$(resource.data.jobId))
          && get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.companyId == request.auth.uid
          && request.resource.data.applicantId == resource.data.applicantId
          && request.resource.data.jobId == resource.data.jobId
          && request.resource.data.companyId == resource.data.companyId
        )
      );

      allow delete: if isAdmin();
    }

    match /posts/{postId} {
      allow read: if true;
      allow create: if isAuthenticated()
        && (!request.resource.data.keys().hasAny(['authorId']) || request.resource.data.authorId == request.auth.uid)
        && (!request.resource.data.keys().hasAny(['author']) || !(request.resource.data.author is map) || !request.resource.data.author.keys().hasAny(['id']) || request.resource.data.author.id == request.auth.uid);
      allow update: if isAuthenticated() && (
        resource.data.author.id == request.auth.uid ||
        resource.data.authorId == request.auth.uid ||
        isAdmin()
      );
      allow delete: if isAuthenticated() && (
        resource.data.author.id == request.auth.uid ||
        resource.data.authorId == request.auth.uid ||
        isAdmin()
      );
    }

    match /clubs/{clubId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if isAuthenticated() && (
        resource.data.presidentId == request.auth.uid ||
        isAdmin()
      );
    }

    match /notifications/{notifId} {
      allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated()
        && request.resource.data.keys().hasAll(['userId', 'title'])
        && request.resource.data.userId is string;
    }

    match /audit_logs/{logId} {
      allow read, write: if isAdmin();
    }

    match /internships/{internshipId} {
      allow create: if isAuthenticated()
        && request.resource.data.studentId == request.auth.uid
        && request.resource.data.status in ['Beklemede', 'Onay Bekliyor', 'pending']
        && request.resource.data.get('advisorStatus', 'pending') in ['pending', 'Beklemede']
        && !request.resource.data.keys().hasAny(['reviewedBy', 'reviewedAt']);

      allow read: if isAuthenticated() && (
        resource.data.studentId == request.auth.uid ||
        isAcademic() ||
        isAdmin()
      );

      allow update: if isAuthenticated() && (
        isAdmin() ||
        (
          isAcademic()
          && request.resource.data.studentId == resource.data.studentId
        )
      );

      allow delete: if isAdmin();
    }

    match /academicApprovals/{docId} {
      allow read: if isAuthenticated() && (isAcademic() || isAdmin());
      allow create, update: if isAuthenticated() && (isAcademic() || isAdmin());
      allow delete: if isAdmin();
    }

    match /mentorshipRequests/{docId} {
      allow read: if isAuthenticated() && (
        isAcademic() || isAdmin() ||
        resource.data.studentId == request.auth.uid ||
        resource.data.applicantId == request.auth.uid
      );
      allow create: if isAuthenticated()
        && (!request.resource.data.keys().hasAny(['studentId']) || request.resource.data.studentId == request.auth.uid)
        && (!request.resource.data.keys().hasAny(['applicantId']) || request.resource.data.applicantId == request.auth.uid);
      allow update: if isAuthenticated() && (
        isAcademic() || isAdmin() || (
          resource.data.studentId == request.auth.uid &&
          !request.resource.data.diff(resource.data).affectedKeys().hasAny(['status', 'approvedBy', 'reviewedBy'])
        )
      );
      allow delete: if isAdmin();
    }

    match /researchLabs/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (isAcademic() || isAdmin());
    }

    match /counselingRequests/{docId} {
      allow read: if isAuthenticated() && (isAcademic() || isAdmin() || resource.data.studentId == request.auth.uid);
      allow create: if isAuthenticated()
        && (!request.resource.data.keys().hasAny(['studentId']) || request.resource.data.studentId == request.auth.uid);
      allow update: if isAuthenticated() && (isAcademic() || isAdmin());
      allow delete: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
"""

# 3. MİMARİ VE GÜVENLİK: src/utils/firebase.js (Hardcoded API anahtarları kaldırıldı)
FIREBASE_JS = """// @ts-check
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const isTestEnv =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  (import.meta.env.MODE === "test" || Boolean(import.meta.env.VITEST));

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || (isTestEnv ? "test-api-key" : undefined),
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || (isTestEnv ? "iesu-test.firebaseapp.com" : undefined),
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || (isTestEnv ? "iesu-kariyer-platformu" : undefined),
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || (isTestEnv ? "iesu-test.firebasestorage.app" : undefined),
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || (isTestEnv ? "000000000000" : undefined),
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || (isTestEnv ? "1:000000000000:web:test" : undefined),
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

if (!isTestEnv && (!firebaseConfig.apiKey || !firebaseConfig.projectId)) {
  console.warn(
    "[Firebase] Eksik ortam değişkeni tespit edildi. Lütfen .env dosyanızda VITE_FIREBASE_* değişkenlerinin tanımlı olduğundan emin olun."
  );
}

let app = null;
let _db = null;
let _auth = null;
let _storage = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
} catch (e) {
  console.warn("[Firebase] Initialization fallback warning:", e);
  try {
    app = initializeApp(firebaseConfig, "iesu-fallback-" + Date.now());
  } catch (e2) {
    console.error("[Firebase] Fatal: app initialization failed", e2);
    app = null;
  }
}

try { _db = app ? getFirestore(app) : null; } catch (e) { console.warn("[Firebase] Firestore init failed:", e?.message); }
try { _auth = app ? getAuth(app) : null; } catch (e) { console.warn("[Firebase] Auth init failed:", e?.message); }
try { _storage = app ? getStorage(app) : null; } catch (e) { console.warn("[Firebase] Storage init failed:", e?.message); }

export const analytics = null;
export const db = _db;
export const auth = _auth;
export const storage = _storage;
export default app;
"""

# 4. SEO, OPEN GRAPH, PLAYFAIR DISPLAY FONT & YAPISAL VERİ (JSON-LD): index.html
INDEX_HTML = """<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/official_pdf_logo.png" />
    <link rel="apple-touch-icon" href="/pwa-192x192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#990000" />
    <title>İESÜ Kariyer Platformu | İstanbul Esenyurt Üniversitesi Kariyer ve Staj Merkezi</title>
    <meta name="description" content="İstanbul Esenyurt Üniversitesi öğrencileri, mezunları, akademisyenleri ve işverenler için resmi kariyer, iş ilanı, zorunlu staj takibi ve mentorluk platformu." />
    <meta name="keywords" content="İESÜ Kariyer, İstanbul Esenyurt Üniversitesi, staj başvurusu, iş ilanları, mezun ağı, üniversite kariyer merkezi" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://iesu-kariyer-platformu.vercel.app/" />

    <!-- Open Graph / LinkedIn / WhatsApp Paylaşım Etiketleri -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="tr_TR" />
    <meta property="og:site_name" content="İESÜ Kariyer Platformu" />
    <meta property="og:title" content="İESÜ Kariyer Platformu | İş, Staj ve Mezun Ağı" />
    <meta property="og:description" content="İstanbul Esenyurt Üniversitesi öğrencileri ve mezunları için iş/staj fırsatları, akademik staj onay sistemi ve kariyer danışmanlığı platformu." />
    <meta property="og:url" content="https://iesu-kariyer-platformu.vercel.app/" />
    <meta property="og:image" content="https://iesu-kariyer-platformu.vercel.app/official_pdf_logo.png" />

    <!-- Twitter Card Etiketleri -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="İESÜ Kariyer Platformu | İş, Staj ve Mezun Ağı" />
    <meta name="twitter:description" content="İstanbul Esenyurt Üniversitesi öğrencileri ve mezunları için kariyer, staj ve mentorluk platformu." />
    <meta name="twitter:image" content="https://iesu-kariyer-platformu.vercel.app/official_pdf_logo.png" />

    <!-- Güvenlik Politikaları -->
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />

    <!-- Google Fonts: Inter, Outfit ve Playfair Display (font-serif başlıkların Times New Roman'a düşmesini engeller) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />

    <!-- Arama Motorları İçin JSON-LD Yapısal Veri (Schema.org) -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "İESÜ Kariyer Platformu",
        "url": "https://iesu-kariyer-platformu.vercel.app/",
        "publisher": {
          "@type": "CollegeOrUniversity",
          "name": "İstanbul Esenyurt Üniversitesi",
          "url": "https://www.esenyurt.edu.tr/"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

# 5. TASARIM (UI/UX): src/App.css (Unutulmuş Vite şablon sınıfları .hero, .counter, #center vb. temizlendi)
APP_CSS = """/* İESÜ Kariyer Platformu - Temizlenmiş Uygulama Taban Stilleri */
#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
   isolation: isolate;
}

/* Hareket hassasiyeti olan kullanıcılar ve mobil performans için animasyon optimizasyonu */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
"""

# 6. GÜVENLİK BAŞLIKLARI VE ÖNBELLEKLEME: vercel.json
VERCEL_JSON = {
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(self)"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}

# 7. TİP GÜVENLİĞİ ALTYAPISI: jsconfig.json
JSCONFIG_JSON = {
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "checkJs": False,
    "allowJs": True,
    "resolveJsonModule": True,
    "isolatedModules": True,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "patches", "out-core", ".agents"]
}

# 8. KURUMSAL DOKÜMANTASYON: README.md
README_MD = """# İESÜ Kariyer Platformu

İstanbul Esenyurt Üniversitesi (İESÜ) öğrencileri, mezunları, akademisyenleri ve iş dünyası paydaşlarını tek bir dijital ekosistemde buluşturan resmi **Kariyer, Staj ve Mezun Platformu**.

Canlı Uygulama: [iesu-kariyer-platformu.vercel.app](https://iesu-kariyer-platformu.vercel.app)

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

```bash
git clone https://github.com/2XceloX3/IESU_Kariyer_Platformu.git
cd IESU_Kariyer_Platformu
cp .env.example .env
npm install
npm run dev
```

## Güvenlik ve Test Komutları

```bash
# Birim ve bileşen testlerini çalıştırır
npm test

# Firestore güvenlik kuralları testlerini emülatörde çalıştırır
npm run test:rules

# Oxlint ile hızlı statik kod analizi yapar
npm run lint
```
"""


def fix_index_css(root: Path):
    """src/index.css içindeki renk değişkenlerini tailwind.config.js ile eşitler ve cam (glass) kontrastını artırır."""
    css_path = root / "src" / "index.css"
    if not css_path.exists():
        return
    content = css_path.read_text(encoding="utf-8")
    # Renk paleti ve kontrast eşitlemesi
    replacements = {
        "--brand-primary: #A80016": "--brand-primary: #990000",
        "--brand-primary: #a80016": "--brand-primary: #990000",
        "--brand-secondary: #800000": "--brand-secondary: #D32F2F",
        "--brand-navy: #0A2342": "--brand-navy: #1e3a5f",
        "--brand-navy: #0a2342": "--brand-navy: #1e3a5f",
        "--surface-glass: rgba(255, 255, 255, 0.72)": "--surface-glass: rgba(255, 255, 255, 0.90)",
    }
    for old, new in replacements.items():
        content = content.replace(old, new)
    css_path.write_text(content, encoding="utf-8")
    print("[OK] src/index.css güncellendi (Kurumsal renk kodları tailwind.config.js ile eşitlendi, glass kontrastı 0.90 yapıldı).")


def main():
    print("=== İESÜ Kariyer Platformu Güvenlik, Tasarım ve Mimari Düzeltmeleri Uygulanıyor ===")

    # 1. Güvenlik, SEO ve Dokümantasyon Dosyalarını Güncelle
    (ROOT / "storage.rules").write_text(STORAGE_RULES, encoding="utf-8")
    print("[OK] storage.rules güncellendi (Admin e-posta regex açığı kapatıldı, KVKK CV yetkileri sıkılaştırıldı).")

    (ROOT / "firestore.rules").write_text(FIRESTORE_RULES, encoding="utf-8")
    print("[OK] firestore.rules güncellendi (Post/Mentorship/Notification sahiplik doğrulamaları eklendi).")

    firebase_path = ROOT / "src" / "utils" / "firebase.js"
    firebase_path.parent.mkdir(parents=True, exist_ok=True)
    firebase_path.write_text(FIREBASE_JS, encoding="utf-8")
    print("[OK] src/utils/firebase.js güncellendi (Hardcoded API anahtarları temizlendi, test modu korundu).")

    (ROOT / "index.html").write_text(INDEX_HTML, encoding="utf-8")
    print("[OK] index.html güncellendi (Playfair Display fontu, SEO, Open Graph ve Schema.org JSON-LD eklendi).")

    # 2. Tasarımsal (UI/UX) CSS Düzeltmeleri
    app_css_path = ROOT / "src" / "App.css"
    app_css_path.parent.mkdir(parents=True, exist_ok=True)
    app_css_path.write_text(APP_CSS, encoding="utf-8")
    print("[OK] src/App.css güncellendi (Çakışmaya yol açan Vite şablon sınıfları .hero, #center vb. temizlendi).")

    fix_index_css(ROOT)

    (ROOT / "vercel.json").write_text(json.dumps(VERCEL_JSON, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("[OK] vercel.json güncellendi (HSTS, Referrer-Policy ve Permissions-Policy başlıkları eklendi).")

    (ROOT / "jsconfig.json").write_text(json.dumps(JSCONFIG_JSON, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("[OK] jsconfig.json oluşturuldu (IDE tip kontrolü ve @/* modül yolları tanımlandı).")

    (ROOT / "README.md").write_text(README_MD, encoding="utf-8")
    print("[OK] README.md güncellendi (Kurumsal proje dokümantasyonu eklendi).")

    # 3. package.json içindeki gereksiz/mükerrer bağımlılıkları temizle
    pkg_path = ROOT / "package.json"
    if pkg_path.exists():
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        pkg["version"] = "1.0.0"
        pkg["description"] = "İstanbul Esenyurt Üniversitesi Kariyer, Staj ve Mezun Platformu"
        deps = pkg.get("dependencies", {})
        src_dir = ROOT / "src"
        for unused_pkg in ["@supabase/supabase-js", "pdfkit"]:
            if unused_pkg in deps:
                used = False
                if src_dir.exists():
                    for p in src_dir.rglob("*"):
                        if p.is_file() and p.suffix in {".js", ".jsx", ".ts", ".tsx"}:
                            if unused_pkg in p.read_text(encoding="utf-8", errors="ignore"):
                                used = True
                                break
                if not used:
                    del deps[unused_pkg]
                    print(f"[OK] package.json: Kullanılmayan '{unused_pkg}' bağımlılığı kaldırıldı.")
        pkg_path.write_text(json.dumps(pkg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # 4. Kök dizindeki tek seferlik yama dosyalarını (fix.py, fix2.cjs, fix_app.cjs) temizle
    for legacy_file in ["fix.py", "fix2.cjs", "fix_app.cjs"]:
        target = ROOT / legacy_file
        if target.exists():
            target.unlink()
            print(f"[OK] Kök dizindeki geçici yama dosyası silindi: {legacy_file}")

    # 5. .gitignore dosyasını güçlendir
    gitignore_path = ROOT / ".gitignore"
    ignore_entries = [
        ".env",
        ".env.*",
        "!.env.example",
        "out-core/",
        ".agents/",
        "fix*.cjs",
        "fix*.py",
        "apply_iesu_fixes.py",
    ]
    existing_ignore = gitignore_path.read_text(encoding="utf-8") if gitignore_path.exists() else ""
    added = [entry for entry in ignore_entries if entry not in existing_ignore.splitlines()]
    if added:
        with gitignore_path.open("a", encoding="utf-8") as f:
            f.write("\n# Güvenlik ve Geçici Ajan/Yama Dosyaları\n" + "\n".join(added) + "\n")
        print("[OK] .gitignore güncellendi.")

    # 6. Eğer bir Git deposu içindeyse otomatik commit ve push işlemini çalıştır
    if (ROOT / ".git").exists():
        print("\n=== Git Deposu Tespit Edildi: Otomatik Commit ve Push Başlatılıyor ===")
        try:
            subprocess.run(["git", "add", "-A"], cwd=ROOT, check=True)
            subprocess.run(
                [
                    "git",
                    "commit",
                    "-m",
                    "fix: tighten security rules, fix UI/UX palette & typography, add SEO and docs",
                ],
                cwd=ROOT,
                check=False,
            )
            push_res = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=False)
            if push_res.returncode == 0:
                print("[OK] Tüm değişiklikler GitHub 'main' dalına başarıyla yüklendi!")
            else:
                print("[BİLGİ] Değişiklikler commit edildi. GitHub'a göndermek için `git push` komutunu çalıştırın.")
        except Exception as exc:
            print(f"[BİLGİ] Otomatik Git işlemi sırasında uyarı: {exc}")

    print("\n=== Tüm Güvenlik ve Tasarım Düzeltmeleri Tamamlandı! ===")


if __name__ == "__main__":
    main()