---
name: IESU Kariyer Platformu - Google Stitch & Design.md Identity
version: "1.0.0"
description: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü (KGM) için Google Stitch Protokolü ve Design.md standartlarına uygun resmî tasarım sistemi."

colors:
  primary: "#990000"          # İESÜ Kurumsal Nar Çiçeği / Koyu Kırmızı
  primary-dark: "#7A0000"     # Koyu Ton Accent
  primary-gradient: "linear-gradient(135deg, #7A0000 0%, #990000 50%, #5C0000 100%)"
  secondary: "#0A2342"        # Derin Kurumsal Lacivert
  surface: "#FFFFFF"          # Kart ve Panel Arka Planı
  surface-subtle: "#F8FAFC"   # Sayfa ve Alt Panel Arka Planı (Slate 50)
  border-soft: "#E2E8F0"      # Panel ve Kart Kenarlıkları (Slate 200)
  text-main: "#0F172A"        # Ana Başlıklar ve Metin (Slate 900)
  text-muted: "#64748B"       # İkincil Metinler (Slate 500)
  accent-gold: "#F59E0B"      # Etkinlik ve Öne Çıkanlar (Amber 500)
  accent-green: "#10B981"     # Aktif / Onaylı Protokol (Emerald 500)

typography:
  fontFamily: "Inter, system-ui, -apple-system, sans-serif"
  h1:
    fontSize: "2.25rem"
    fontWeight: "900"
    lineHeight: "1.2"
  h2:
    fontSize: "1.5rem"
    fontWeight: "900"
    lineHeight: "1.3"
  h3:
    fontSize: "1.125rem"
    fontWeight: "800"
    lineHeight: "1.4"
  body:
    fontSize: "0.875rem"
    fontWeight: "500"
    lineHeight: "1.6"
  caption:
    fontSize: "0.75rem"
    fontWeight: "700"
    letterSpacing: "0.05em"

rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"

components:
  card-stitch:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-soft}"
    rounded: "{rounded.xl}"
    shadow: "0 8px 30px rgba(0, 0, 0, 0.04)"
  banner-hero:
    background: "{colors.primary-gradient}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
---

## Overview

**İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü (KGM)** dijital kimliği:
Prestijli bir üniversite kariyer ağının kurumsal güvenilirliği ile modern, duyarlı ve akıcı bir kullanıcı deneyimini (Google Stitch / Design.md uyumlu) harmanlar.

Tasarım; **sıkışıklıklardan uzak, kenarlardan sıfırlanmış veya dengeli taşan geniş paneller, zengin renk gradyanları, yüksek okunabilirlik ve mikro-etkileşimler** üzerine kuruludur.

---

## Layou & Edge-to-Edge Rules (Google Stitch Standards)

1. **Sıfır İstenmeyen Boşluk (No Unwanted Gaps):**
   - Alt paneller (Footer) ve üst paneller (Header / Banner) arasında asla istemsiz beyaz şerit veya marjin boşluğu bırakılamaz.
   - Sayfa altındaki `SubPanelFooter` veya ana altlıklar `w-full` olarak kenardan kenara yayılır.

2. **Responsive Grid & Card Sizing:**
   - Firma ve Etkinlik kartları dar sütunlara (ör. 300px'lik tek bir sidebar içerisine) hapsedilemez.
   - Ana akışta ve geniş panellerde 2 veya 3 sütunlu (`sm:grid-cols-2 lg:grid-cols-3`) dengeli Izgara (Grid) kullanılır.
   - Metinler asla dar alanda `truncate` edilip okunmaz hale getirilemez; `leading-snug` ile alt satıra kaydırılır.

3. **Tam Genişlik Paneller (Full Width Panels):**
   - `Neler Oluyor?`, `CareerNetwork` ve `NewsEvents` gibi ana akış bölümleri sayfa genişliğini tam verimle kullanır (`max-w-7xl` veya `w-full`).

---

## Color Palette & Typography Guidelines

- **Primary (#990000):** Tüm birincil aksiyonlar, resmi kurumsal rozetler ve vurgularda kullanılır.
- **Secondary (#0A2342):** İkincil rozetler, akademisyen/yönetici detayları ve derinlik katan vurgularda tercih edilir.
- **Typographic Hierarchy:** Başlıklarda yüksek kontrasta sahip **Inter (900/800 Black/ExtraBold)**; gövde metinlerinde ise göz yormayan **Inter (500 Medium)** kullanılır.

---

## Do's and Don'ts

### ✅ DO (Yapılacaklar)
- **Do** paneller arasında akıcı ve kesintisiz renk geçişleri sağlayın.
- **Do** buton ve etkileşimli kartlara `hover:-translate-y-0.5` veya `hover:scale-[1.02]` gibi tatlı mikro-animasyonlar ekleyin.
- **Do** resmi duyuru ve haber kartlarında kısıtlama yerine açıklayıcı metin alanları sunun.
- **Do** her zaman `/cnd` Google Stitch protokolü prensiplerine uyun.

### ❌ DON'T (Yapılmayacaklar)
- **Don't** Footer veya Banner üstünde/yanında boş beyaz margin alanları bırakmayın.
- **Don't** Kart içerisindeki şirket veya etkinlik isimlerini daraltıp `A...` şeklinde kesmeyin.
- **Don't** Tüm içeriği tek bir dar sidebar içerisine sıkıştırmayın.
