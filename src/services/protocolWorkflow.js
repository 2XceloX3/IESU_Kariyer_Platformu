/**
 * src/services/protocolWorkflow.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Kurumsal Protokol & Sanayi CRM Motoru
 * (İŞKUR / ESBİM / Sektörel İş Birlikleri / Senato Raporlama)
 *
 * Yasal ve Kurumsal Standartlar:
 * - 2547 Sayılı Yükseköğretim Kanunu Ek Madde 35 (Üniversite - Sanayi İş Birliği)
 * - YÖK Kurumsal Geri Bildirim ve Akreditasyon Göstergesi (Kamu - Üniversite - Sanayi İş Birlikleri)
 * - İŞKUR İş Kulübü & Gençlik İstihdamı İş Birliği Protokolü
 * - ESBİM (Esenyurt Belediyesi İstihdam Merkezi) Yerel İstihdam Masası Ortak Protokolü
 * - Senato & Rektörlük Resmî Protokol ve Kontenjan Denetim Raporu Standartları
 */

export const PROTOCOL_STANDARDS = {
  INSTITUTION_NAME: 'İstanbul Esenyurt Üniversitesi (İESÜ)',
  RECTORATE_TITLE: 'T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ',
  COORDINATOR_UNIT: 'Kariyer Geliştirme Koordinatörlüğü',
  ALUMNI_PORTAL_NAME: 'İESÜ Mezunlar Portalı',
  LEGAL_FRAMEWORK: '2547 Sayılı Kanun Ek Madde 35 & YÖK Kurumsal İş Birliği Kriterleri',
  ESBIM_PARTNER: 'Esenyurt Belediyesi İstihdam Merkezi (ESBİM)',
  ISKUR_PARTNER: 'Türkiye İş Kurumu (İŞKUR) İstanbul Çalışma ve İş Kurumu İl Müdürlüğü - Büyükçekmece / Esenyurt Hizmet Merkezi',
  DAYS_EXPIRING_SOON_THRESHOLD: 30,
};

export const PROTOCOL_TYPES = {
  COOPERATION: 'İş Birliği Protokolü',
  APPLIED_EDUCATION_7_PLUS_1: '7+1 / 3+1 İşletmede Mesleki Eğitim',
  ISKUR_JOB_CLUB: 'İŞKUR İş Kulübü & İstihdam Masası',
  ESBİM_LOCAL_DESK: 'ESBİM Yerel İstihdam Masası',
  RND_TECHNOPARK: 'AR-GE & Teknokent Ortaklığı',
  SECTOR_ADVISORY: 'Sektörel Danışma Kurulu & Hami Eşleşmesi',
};

export const PROTOCOL_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  UNDER_REVIEW: 'UNDER_REVIEW',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING_SOON',
  RENEWAL_REQUESTED: 'RENEWAL_REQUESTED',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
};

export const PROTOCOL_STATUS_LABELS = {
  PENDING_APPROVAL: 'Onay Bekliyor',
  UNDER_REVIEW: 'KGM İncelemesinde',
  REVISION_REQUESTED: 'Revizyon İstendi',
  REJECTED: 'Reddedildi',
  ACTIVE: 'Aktif & Onaylı Protokol',
  EXPIRING_SOON: 'Süresi Yaklaşan (Son 30 Gün)',
  RENEWAL_REQUESTED: 'Yenileme Talep Edildi',
  EXPIRED: 'Süresi Doldu',
  TERMINATED: 'Feshedildi / Askıda',
};

export const PROTOCOL_SECTORS = [
  'Savunma Sanayii',
  'Bilişim & Yazılım',
  'Havacılık & Lojistik',
  'Sağlık & Medikal',
  'Üretim & Otomotiv',
  'E-Ticaret & Perakende',
  'Finans & Bankacılık',
  'Mimarlık & İnşaat',
  'Kamu & Yerel Yönetim',
  'Medya & İletişim',
];

/**
 * Resmî Protokol Kodu Üretici (Örn: IESU-PRT-2026-001)
 */
export function generateProtocolCode(sequenceNumber, year = new Date().getFullYear()) {
  const safeSeq = Math.max(1, parseInt(sequenceNumber, 10) || 1);
  const safeYear = parseInt(year, 10) || new Date().getFullYear();
  return `IESU-PRT-${safeYear}-${String(safeSeq).padStart(3, '0')}`;
}

/**
 * Protokol Kodu Format Kontrolü
 */
export function validateProtocolCode(code) {
  if (typeof code !== 'string') return false;
  return /^IESU-PRT-\d{4}-\d{3,}$/.test(code.trim());
}

/**
 * Tarihi Güvenli UTC Gece Yarısı Zaman Damgasına Çevirici
 * (Saat dilimi sapmaları, artık yıllar ve ISO string kaymalarını önler)
 */
export function parseDateToUtcMidnight(input) {
  if (!input) return null;
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return null;
    return Date.UTC(input.getFullYear(), input.getMonth(), input.getDate());
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    // YYYY-MM-DD desenini doğrudan ayrıştır (yerel saat dilimi sapmasını engeller)
    const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return Date.UTC(year, month, day);
    }
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return null;
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (typeof input === 'number' && !isNaN(input)) {
    const d = new Date(input);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}

/**
 * Kalan Gün Sayısını Hesaplama (Zaman Diliminden Bağımsız Takvim Günü)
 */
export function getDaysUntilExpiration(validUntil, referenceDate = new Date()) {
  const targetUtc = parseDateToUtcMidnight(validUntil);
  const refUtc = parseDateToUtcMidnight(referenceDate);
  if (targetUtc === null || refUtc === null) return null;

  return Math.round((targetUtc - refUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Dinamik Protokol Durum Motoru
 * - Manuel durum 'TERMINATED' ise doğrudan döner.
 * - 'RENEWAL_REQUESTED' ise doğrudan döner.
 * - 'EXPIRED' veya 'SÜRESİ DOLDU' ise doğrudan döner.
 * - validUntil geçmişte ise -> 'EXPIRED'
 * - validUntil 0 ile 30 gün arasındaysa -> 'EXPIRING_SOON'
 * - Aksi halde -> 'ACTIVE'
 */
export function calculateProtocolStatus(protocol, referenceDate = new Date()) {
  if (!protocol || typeof protocol !== 'object') return PROTOCOL_STATUS.PENDING_APPROVAL;

  const rawStatus = String(protocol.status || '').toUpperCase().trim();
  if (
    rawStatus === PROTOCOL_STATUS.PENDING_APPROVAL ||
    rawStatus === 'ONAY BEKLIYOR' ||
    rawStatus === 'ONAY BEKLİYOR' ||
    rawStatus === 'BEKLEMEDE'
  ) {
    return PROTOCOL_STATUS.PENDING_APPROVAL;
  }
  if (
    rawStatus === PROTOCOL_STATUS.UNDER_REVIEW ||
    rawStatus === 'INCELEMEDE' ||
    rawStatus === 'İNCELEMEDE'
  ) {
    return PROTOCOL_STATUS.UNDER_REVIEW;
  }
  if (
    rawStatus === PROTOCOL_STATUS.REVISION_REQUESTED ||
    rawStatus === 'REVIZYON ISTENDI' ||
    rawStatus === 'REVİZYON İSTENDİ'
  ) {
    return PROTOCOL_STATUS.REVISION_REQUESTED;
  }
  if (
    rawStatus === PROTOCOL_STATUS.REJECTED ||
    rawStatus === 'REDDEDILDI' ||
    rawStatus === 'REDDEDİLDİ'
  ) {
    return PROTOCOL_STATUS.REJECTED;
  }
  if (
    rawStatus === PROTOCOL_STATUS.TERMINATED ||
    rawStatus === 'FESHEDILDI' ||
    rawStatus === 'FESHEDİLDİ' ||
    rawStatus === 'ASKIDA'
  ) {
    return PROTOCOL_STATUS.TERMINATED;
  }
  if (
    rawStatus === PROTOCOL_STATUS.RENEWAL_REQUESTED ||
    rawStatus === 'YENILEME BEKLIYOR' ||
    rawStatus === 'YENİLEME BEKLİYOR'
  ) {
    return PROTOCOL_STATUS.RENEWAL_REQUESTED;
  }
  if (
    rawStatus === PROTOCOL_STATUS.EXPIRED ||
    rawStatus === 'SÜRESI DOLDU' ||
    rawStatus === 'SÜRESİ DOLDU' ||
    rawStatus === 'SURESI DOLDU' ||
    rawStatus === 'SURE DOLDU' ||
    rawStatus === 'PASİF' ||
    rawStatus === 'PASIF'
  ) {
    return PROTOCOL_STATUS.EXPIRED;
  }

  const daysLeft = getDaysUntilExpiration(protocol.validUntil, referenceDate);
  if (daysLeft === null) return PROTOCOL_STATUS.ACTIVE;

  if (daysLeft < 0) {
    return PROTOCOL_STATUS.EXPIRED;
  }
  if (daysLeft <= PROTOCOL_STANDARDS.DAYS_EXPIRING_SOON_THRESHOLD) {
    return PROTOCOL_STATUS.EXPIRING_SOON;
  }
  return PROTOCOL_STATUS.ACTIVE;
}

export const CUSTOM_PROTOCOL_TEMPLATE_STORAGE_KEY = 'iesu_custom_protocol_template_v1';

export const PROTOCOL_PLACEHOLDERS = [
  { token: '{{FIRMA_ADI}}', label: 'Firma Adı' },
  { token: '{{SEKTOR}}', label: 'Sektör' },
  { token: '{{PROTOKOL_TURU}}', label: 'Protokol Türü' },
  { token: '{{PROTOKOL_KODU}}', label: 'Protokol Kodu' },
  { token: '{{VERGI_NO}}', label: 'Vergi No' },
  { token: '{{MERSIS_NO}}', label: 'MERSİS No' },
  { token: '{{ADRES}}', label: 'Firma Adresi' },
  { token: '{{YETKILI}}', label: 'İmza Yetkilisi' },
  { token: '{{UNVAN}}', label: 'Yetkili Unvanı' },
  { token: '{{EPOSTA}}', label: 'E-Posta' },
  { token: '{{TELEFON}}', label: 'Telefon' },
  { token: '{{FAKULTE}}', label: 'Fakülte / Birim' },
  { token: '{{KONTENJAN}}', label: 'Yıllık Kontenjan' },
  { token: '{{BASLANGIC}}', label: 'Başlangıç Tarihi' },
  { token: '{{BITIS}}', label: 'Bitiş Tarihi' },
  { token: '{{KARAR_NO}}', label: 'Karar No' },
  { token: '{{KAPSAM}}', label: 'İş Birliği Kapsamı' }
];

export const DEFAULT_PROTOCOL_TEMPLATE = {
  headerTitle: 'T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ',
  headerSubtitle: 'KARİYER GELİŞTİRME KOORDİNATÖRLÜĞÜ • ÜNİVERSİTE–SANAYİ İŞ BİRLİĞİ PROTOKOLÜ',
  institutionParty: 'İstanbul Esenyurt Üniversitesi Rektörlüğü — Kariyer Geliştirme Koordinatörlüğü',
  institutionAddress: 'Zafer Mah. Adile Naşit Bulvarı No: 1, Esenyurt / İstanbul',
  signerLeftTitle: 'İstanbul Esenyurt Üniversitesi Adına',
  signerLeftRole: 'Rektörlük / Kariyer Geliştirme Koordinatörlüğü',
  signerRightTitle: '{{FIRMA_ADI}} Adına',
  signerRightRole: '{{YETKILI}} — {{UNVAN}}',
  uploadedTemplateFile: null,
  articles: [
    {
      id: 'm1',
      title: 'Madde 1 — Amaç ve Kapsam',
      body: 'Bu protokolün amacı; İstanbul Esenyurt Üniversitesi (İESÜ) ile {{FIRMA_ADI}} arasında {{PROTOKOL_TURU}} kapsamında {{FAKULTE}} öğrenci ve mezunlarına yönelik staj, uygulamalı eğitim, kariyer günleri ve istihdam iş birliğinin esaslarını düzenlemektir. İş birliği kapsamı: {{KAPSAM}}'
    },
    {
      id: 'm2',
      title: 'Madde 2 — Tarafların Yükümlülükleri ve Kontenjan',
      body: '{{FIRMA_ADI}}, yıllık {{KONTENJAN}} öğrenci/mezun kontenjanı dâhilinde uygulamalı eğitim ve staj imkânı sunmayı; İESÜ Kariyer Geliştirme Koordinatörlüğü ise uygun adayların yönlendirilmesi ve süreç koordinasyonunu sağlamayı kabul eder.'
    },
    {
      id: 'm3',
      title: 'Madde 3 — Yasal Dayanak, SGK ve KVKK',
      body: 'Taraflar, 2547 Sayılı Yükseköğretim Kanunu, 3308 Sayılı Mesleki Eğitim Kanunu, 5510 Sayılı Kanun 5/b iş kazası ve meslek hastalığı sigortası hükümleri ile 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kurallarına eksiksiz uymayı taahhüt eder.'
    },
    {
      id: 'm4',
      title: 'Madde 4 — Süre, Yenileme ve Fesih',
      body: 'İşbu protokol {{BASLANGIC}} tarihinde yürürlüğe girer ve {{BITIS}} tarihine kadar geçerlidir. Taraflardan biri bitiş tarihinden en az 30 gün önce yazılı bildirimde bulunmadığı takdirde protokol karşılıklı mutabakatla yenilenebilir.'
    }
  ]
};

export function loadCustomProtocolTemplate() {
  if (typeof window === 'undefined') return DEFAULT_PROTOCOL_TEMPLATE;
  try {
    const raw = localStorage.getItem(CUSTOM_PROTOCOL_TEMPLATE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROTOCOL_TEMPLATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROTOCOL_TEMPLATE;
    return {
      ...DEFAULT_PROTOCOL_TEMPLATE,
      ...parsed,
      articles: Array.isArray(parsed.articles) && parsed.articles.length > 0
        ? parsed.articles
        : DEFAULT_PROTOCOL_TEMPLATE.articles
    };
  } catch {
    return DEFAULT_PROTOCOL_TEMPLATE;
  }
}

export function saveCustomProtocolTemplate(template) {
  const merged = {
    ...DEFAULT_PROTOCOL_TEMPLATE,
    ...(template || {}),
    updatedAt: new Date().toISOString()
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_PROTOCOL_TEMPLATE_STORAGE_KEY, JSON.stringify(merged));
    } catch { /* intentional */ }
  }
  return merged;
}

export function resetCustomProtocolTemplate() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CUSTOM_PROTOCOL_TEMPLATE_STORAGE_KEY);
    } catch { /* intentional */ }
  }
  return DEFAULT_PROTOCOL_TEMPLATE;
}

export function interpolateProtocolText(text, protocol = {}) {
  const replacements = {
    '{{FIRMA_ADI}}': protocol.companyName || 'Kurumsal İşletme',
    '{{SEKTOR}}': protocol.sector || 'Sektör Belirtilmedi',
    '{{PROTOKOL_TURU}}': protocol.protocolType || PROTOCOL_TYPES.COOPERATION,
    '{{PROTOKOL_KODU}}': protocol.protocolCode || protocol.id || 'IESU-PRT-TASLAK',
    '{{VERGI_NO}}': protocol.taxNo || '—',
    '{{MERSIS_NO}}': protocol.mersisNo || '—',
    '{{ADRES}}': protocol.companyAddress || '—',
    '{{YETKILI}}': protocol.contactPerson || 'Kurum Yetkilisi',
    '{{UNVAN}}': protocol.contactTitle || 'Yetkili',
    '{{EPOSTA}}': protocol.contactEmail || '—',
    '{{TELEFON}}': protocol.contactPhone || '—',
    '{{FAKULTE}}': protocol.assignedFaculty || 'Tüm Fakülte ve MYO Programları',
    '{{KONTENJAN}}': String(protocol.committedQuota ?? protocol.internshipQuota ?? 0),
    '{{BASLANGIC}}': protocol.signedDate || protocol.startDate || new Date().toISOString().split('T')[0],
    '{{BITIS}}': protocol.validUntil || protocol.endDate || '—',
    '{{KARAR_NO}}': protocol.senateDecisionNo || 'KGM / Senato Onayı Bekleniyor',
    '{{KAPSAM}}': protocol.scope || 'Staj, uygulamalı eğitim, kariyer etkinlikleri ve mezun istihdamı iş birliği.'
  };
  let output = String(text ?? '');
  Object.entries(replacements).forEach(([token, val]) => {
    output = output.split(token).join(val);
  });
  return output;
}

export function renderProtocolDocumentHtml(protocol = {}, templateOverride = null) {
  const tpl = templateOverride || loadCustomProtocolTemplate();
  const esc = (v) => String(v ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const statusLabel = PROTOCOL_STATUS_LABELS[calculateProtocolStatus(protocol)] || protocol.status || 'Taslak';
  const effectiveArticles = Array.isArray(protocol.customArticles) && protocol.customArticles.length > 0
    ? protocol.customArticles
    : (Array.isArray(tpl.articles) && tpl.articles.length > 0 ? tpl.articles : DEFAULT_PROTOCOL_TEMPLATE.articles);

  const articlesHtml = effectiveArticles.map((art) => {
    const title = interpolateProtocolText(art.title || 'Madde', protocol);
    const body = interpolateProtocolText(art.body || '', protocol).replace(/\n/g, '<br/>');
    return `<div class="article"><h3>${esc(title)}</h3><p>${body}</p></div>`;
  }).join('');

  const leftTitle = interpolateProtocolText(tpl.signerLeftTitle || DEFAULT_PROTOCOL_TEMPLATE.signerLeftTitle, protocol);
  const leftRole = interpolateProtocolText(tpl.signerLeftRole || DEFAULT_PROTOCOL_TEMPLATE.signerLeftRole, protocol);
  const rightTitle = interpolateProtocolText(tpl.signerRightTitle || DEFAULT_PROTOCOL_TEMPLATE.signerRightTitle, protocol);
  const rightRole = interpolateProtocolText(tpl.signerRightRole || DEFAULT_PROTOCOL_TEMPLATE.signerRightRole, protocol);

  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(protocol.protocolCode || protocol.companyName || 'IESU-Protokol')}</title>
  <style>
    body{font-family:Segoe UI,Calibri,Arial,sans-serif;color:#0f172a;padding:36px 44px;line-height:1.65;font-size:12.5px}
    .hdr{border-bottom:3px solid #990000;padding-bottom:14px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
    .hdr h1{font-size:16.5px;margin:0;color:#0a2342}
    .hdr p{margin:4px 0 0;color:#475569;font-size:11px;font-weight:700}
    .badge{background:#f1f5f9;border:1px solid #cbd5e1;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
    h2{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#990000;margin:20px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px}
    h3{font-size:12.5px;color:#0a2342;margin:14px 0 4px}
    .article p{margin:0 0 8px;text-align:justify}
    table{width:100%;border-collapse:collapse;margin-bottom:14px}
    td{padding:7px 10px;border:1px solid #e2e8f0;vertical-align:top}
    td.k{width:34%;font-weight:700;background:#f8fafc;color:#334155}
    .sign{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:36px;page-break-inside:avoid}
    .sign-box{border:1px dashed #94a3b8;padding:16px;border-radius:10px;min-height:110px}
    @media print{body{padding:16px}}
  </style></head><body>
    <div class="hdr">
      <div>
        <h1>${esc(interpolateProtocolText(tpl.headerTitle, protocol))}</h1>
        <p>${esc(interpolateProtocolText(tpl.headerSubtitle, protocol))}</p>
      </div>
      <div class="badge">${esc(protocol.protocolCode || protocol.id || 'TASLAK')} • ${esc(statusLabel)}</div>
    </div>
    <h2>Taraflar & Kurumsal Bilgiler</h2>
    <table>
      <tr><td class="k">Üniversite Tarafı</td><td>${esc(tpl.institutionParty)}<br/><small>${esc(tpl.institutionAddress)}</small></td></tr>
      <tr><td class="k">İşletme / Kurum Ünvanı</td><td>${esc(protocol.companyName)}</td></tr>
      <tr><td class="k">Sektör / Protokol Türü</td><td>${esc(protocol.sector)} — ${esc(protocol.protocolType || PROTOCOL_TYPES.COOPERATION)}</td></tr>
      <tr><td class="k">Vergi No / MERSİS</td><td>${esc(protocol.taxNo)} / ${esc(protocol.mersisNo)}</td></tr>
      <tr><td class="k">Resmî Adres</td><td>${esc(protocol.companyAddress)}</td></tr>
      <tr><td class="k">İmza Yetkilisi & İletişim</td><td>${esc(protocol.contactPerson)} (${esc(protocol.contactTitle)}) • ${esc(protocol.contactEmail)} • ${esc(protocol.contactPhone)}</td></tr>
      <tr><td class="k">Kontenjan & Geçerlilik</td><td>${esc(protocol.committedQuota ?? protocol.internshipQuota ?? 0)} Aday / Yıl • ${esc(protocol.signedDate || protocol.startDate || 'Onay Tarihi')} — ${esc(protocol.validUntil || protocol.endDate || '—')}</td></tr>
    </table>
    <h2>Protokol Maddeleri</h2>
    ${articlesHtml}
    <div class="sign">
      <div class="sign-box"><strong>${esc(leftTitle)}</strong><br/>${esc(leftRole)}<br/><br/>İmza / Kaşe: _______________________</div>
      <div class="sign-box"><strong>${esc(rightTitle)}</strong><br/>${esc(rightRole)}<br/><br/>İmza / Kaşe: _______________________</div>
    </div>
  </body></html>`;
}

/**
 * İkili Resmî Protokol Yazdırma / PDF Çıktısı (Üniversitenin Kendi Düzenlediği Şablon/Maddelerle)
 */
export function exportBilateralProtocolDraftPdf(protocol = {}, templateOverride = null) {
  if (typeof window === 'undefined') return;
  const html = renderProtocolDocumentHtml(protocol, templateOverride);
  const w = window.open('', '_blank', 'width=920,height=800');
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => { try { w.print(); } catch (_) {} }, 350);
  }
}

/**
 * İkili Resmî Protokolü Microsoft Word (.doc) Olarak İndirme
 */
export function exportBilateralProtocolWord(protocol = {}, templateOverride = null) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const html = renderProtocolDocumentHtml(protocol, templateOverride);
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const safeName = String(protocol.protocolCode || protocol.companyName || 'IESU_Protokol')
    .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_-]+/g, '_');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Personel & Koordinatörlük İçin Yazdırılabilir Kurumsal PDF Tablo/Detay Raporu
 */
export function exportPrintableReportHtml({ title = 'İESÜ Kurumsal Rapor', subtitle = '', headers = [], rows = [] }) {
  if (typeof window === 'undefined') return;
  const esc = (v) => String(v ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const nowStr = new Date().toLocaleString('tr-TR');
  const headHtml = headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const bodyHtml = rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    body{font-family:Segoe UI,Arial,sans-serif;color:#0f172a;padding:28px 34px;font-size:12px}
    .hdr{border-bottom:3px solid #312e81;padding-bottom:12px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-end}
    h1{margin:0;font-size:17px;color:#1e1b4b}
    p{margin:4px 0 0;color:#64748b;font-size:11px;font-weight:700}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th{background:#eef2ff;color:#1e1b4b;text-align:left;padding:8px 10px;border:1px solid #cbd5e1;font-size:11px}
    td{padding:7px 10px;border:1px solid #e2e8f0;vertical-align:top}
    tr:nth-child(even) td{background:#f8fafc}
    @media print{body{padding:12px}}
  </style></head><body>
    <div class="hdr">
      <div>
        <h1>İstanbul Esenyurt Üniversitesi — ${esc(title)}</h1>
        <p>${esc(subtitle || 'Kariyer Geliştirme Koordinatörlüğü • Personel Portalı Rapor Çıktısı')}</p>
      </div>
      <div style="font-size:11px;color:#475569;font-weight:700">${esc(nowStr)} • ${rows.length} Kayıt</div>
    </div>
    <table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>
  </body></html>`;
  const w = window.open('', '_blank', 'width=960,height=780');
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => { try { w.print(); } catch (_) {} }, 350);
  }
}

/**
 * Kontenjan Gerçekleşme ve Doluluk Oranı Hesaplama
 */
export function calculateQuotaFulfillment(committedQuota = 0, placedCount = 0) {
  const committed = Math.max(0, parseInt(committedQuota, 10) || 0);
  const placed = Math.max(0, parseInt(placedCount, 10) || 0);

  if (committed === 0) {
    return {
      committedQuota: 0,
      placedCount: placed,
      fillRate: placed > 0 ? 100 : 0,
      remainingQuota: 0,
      isOverCapacity: placed > 0,
    };
  }

  const rate = Math.round((placed / committed) * 1000) / 10; // Tek ondalık hassasiyeti (örn %72.0)
  return {
    committedQuota: committed,
    placedCount: placed,
    fillRate: rate,
    remainingQuota: Math.max(0, committed - placed),
    isOverCapacity: placed > committed,
  };
}

/**
 * Protokol Havuzu İçin Toplu CRM İstatistikleri
 */
export function calculateProtocolAggregateStats(protocols = [], referenceDate = new Date()) {
  const rawList = Array.isArray(protocols) ? protocols : [];
  const list = rawList.filter((p) => p && typeof p === 'object');
  let totalCommittedQuota = 0;
  let totalPlacedCount = 0;

  const byStatus = {
    [PROTOCOL_STATUS.ACTIVE]: 0,
    [PROTOCOL_STATUS.EXPIRING_SOON]: 0,
    [PROTOCOL_STATUS.RENEWAL_REQUESTED]: 0,
    [PROTOCOL_STATUS.EXPIRED]: 0,
    [PROTOCOL_STATUS.TERMINATED]: 0,
  };

  const bySector = {};
  const byType = {};

  list.forEach((p) => {
    const effectiveStatus = calculateProtocolStatus(p, referenceDate);
    byStatus[effectiveStatus] = (byStatus[effectiveStatus] || 0) + 1;

    const committed = Math.max(0, parseInt(p.committedQuota || p.slots || 0, 10));
    const placed = Math.max(0, parseInt(p.placedCount || 0, 10));
    totalCommittedQuota += committed;
    totalPlacedCount += placed;

    const sector = p.sector || 'Diğer Sektörler';
    if (!bySector[sector]) {
      bySector[sector] = { count: 0, committed: 0, placed: 0 };
    }
    bySector[sector].count += 1;
    bySector[sector].committed += committed;
    bySector[sector].placed += placed;

    const type = p.protocolType || p.type || PROTOCOL_TYPES.COOPERATION;
    if (!byType[type]) {
      byType[type] = { count: 0, committed: 0, placed: 0 };
    }
    byType[type].count += 1;
    byType[type].committed += committed;
    byType[type].placed += placed;
  });

  const overallFillRate = totalCommittedQuota > 0
    ? Math.round((totalPlacedCount / totalCommittedQuota) * 1000) / 10
    : 0;

  return {
    totalProtocols: list.length,
    activeProtocols: byStatus[PROTOCOL_STATUS.ACTIVE] + byStatus[PROTOCOL_STATUS.EXPIRING_SOON],
    expiringSoonProtocols: byStatus[PROTOCOL_STATUS.EXPIRING_SOON],
    renewalRequestedProtocols: byStatus[PROTOCOL_STATUS.RENEWAL_REQUESTED],
    expiredProtocols: byStatus[PROTOCOL_STATUS.EXPIRED],
    terminatedProtocols: byStatus[PROTOCOL_STATUS.TERMINATED],
    totalCommittedQuota,
    totalPlacedCount,
    overallFillRate,
    byStatus,
    bySector,
    byType,
  };
}

/**
 * İŞKUR & ESBİM Eşleştirme Motoru
 * Yerel belediye istihdam merkezi masası için aday ve açık iş eşleşmesi
 */
export function matchCandidateWithESBIM(candidate, vacancies = []) {
  if (!candidate || !Array.isArray(vacancies)) return [];
  const candDept = String(candidate.department || '').trim().toLowerCase();
  const candCity = String(candidate.city || candidate.location || 'İstanbul').trim().toLowerCase();
  const candDistrict = String(candidate.district || 'Esenyurt').trim().toLowerCase();

  return vacancies
    .filter((vac) => vac && typeof vac === 'object')
    .map((vac) => {
      let score = 50; // Temel uyum tabanı

      // İlçe uyumu (Esenyurt, Beylikdüzü, Avcılar, Başakşehir komşuluğu)
      const vacDistrict = String(vac.district || '').trim().toLowerCase();
      if (vacDistrict && (vacDistrict === candDistrict || candDistrict.includes(vacDistrict) || vacDistrict.includes(candDistrict))) {
        score += 25;
      } else if (vac.city && String(vac.city).trim().toLowerCase() === candCity) {
        score += 10;
      }

      // Bölüm / Meslek Alanı Uyumu
      const vacField = String(vac.field || vac.title || '').trim().toLowerCase();
      if (candDept && vacField && (candDept.includes(vacField) || vacField.includes(candDept))) {
        score += 25;
      }

      return {
        vacancy: vac,
        matchScore: Math.min(100, score),
        isRecommended: score >= 75,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Sektörel Danışma Kurulu ve Hamiler Havuzu Eşleştirme
 */
export function matchSectorMentor(mentor, departmentOrSector) {
  if (!mentor || !departmentOrSector) return false;
  const target = String(departmentOrSector).trim().toLowerCase();
  if (!target) return false;

  const mentorSector = String(mentor.sector || '').trim().toLowerCase();
  const mentorDept = String(mentor.assignedDepartment || '').trim().toLowerCase();
  const expertise = Array.isArray(mentor.expertise)
    ? mentor.expertise.join(' ').toLowerCase()
    : String(mentor.expertise || '').toLowerCase();

  const sectorMatch = mentorSector.length > 0 && (mentorSector.includes(target) || target.includes(mentorSector));
  const deptMatch = mentorDept.length > 0 && (mentorDept.includes(target) || target.includes(mentorDept));
  const expertiseMatch = expertise.length > 0 && expertise.includes(target);

  return sectorMatch || deptMatch || expertiseMatch;
}

export const SAMPLE_ESBIM_VACANCIES = [
  {
    id: 'ESBIM-VAC-001',
    title: 'Lojistik Depo & Sevkiyat Sorumlusu',
    company: 'Doğuş Lojistik A.Ş.',
    district: 'Esenyurt',
    city: 'İstanbul',
    field: 'Lojistik Yönetimi',
    type: 'Tam Zamanlı',
    openQuota: 5,
    contactPerson: 'Serdar Aydın',
  },
  {
    id: 'ESBIM-VAC-002',
    title: 'Junior Web & Full Stack Yazılım Geliştirici',
    company: 'Esen Teknoloji Çözümleri',
    district: 'Beylikdüzü',
    city: 'İstanbul',
    field: 'Bilgisayar',
    type: 'Hibrit',
    openQuota: 3,
    contactPerson: 'Ceren Tekin',
  },
  {
    id: 'ESBIM-VAC-003',
    title: 'İmalat Mühendisi / Üretim Planlama Asistanı',
    company: 'Sarten Ambalaj San. A.Ş.',
    district: 'Hadımköy',
    city: 'İstanbul',
    field: 'Makine',
    type: 'Tam Zamanlı',
    openQuota: 4,
    contactPerson: 'Kamil Yurt',
  },
  {
    id: 'ESBIM-VAC-004',
    title: 'Ön Muhasebe & Finans Uzman Yardımcısı',
    company: 'Norm Cıvata Sanayi',
    district: 'Esenyurt',
    city: 'İstanbul',
    field: 'İşletme',
    type: 'Tam Zamanlı',
    openQuota: 2,
    contactPerson: 'Melis Arslan',
  },
  {
    id: 'ESBIM-VAC-005',
    title: 'Dış Ticaret & İhracat Operasyon Sorumlusu',
    company: 'Pilsan Oyuncak A.Ş.',
    district: 'Avcılar',
    city: 'İstanbul',
    field: 'Dış Ticaret',
    type: 'Tam Zamanlı',
    openQuota: 3,
    contactPerson: 'Özgür Şen',
  },
];

// ============================================================================
// RESMÎ ÖRNEK KURUMSAL PROTOKOLLER & ENTEGRASYON HAVUZU
// ============================================================================

export const SAMPLE_CORPORATE_PROTOCOLS = [
  {
    id: 'PRT-2026-001',
    protocolCode: 'IESU-PRT-2026-001',
    companyName: 'Aselsan A.Ş.',
    taxNo: '1234567890',
    sector: 'Savunma Sanayii',
    protocolType: PROTOCOL_TYPES.RND_TECHNOPARK,
    signedDate: '2024-01-15',
    validUntil: '2027-06-30',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 25,
    placedCount: 18,
    scope: 'Savunma Sanayii Ar-Ge ve İleri Teknoloji Staj & İstihdam Kontenjanı',
    contactPerson: 'Dr. Mehmet Yılmaz',
    contactTitle: 'Yetkinlik & Akademi Direktörü',
    contactEmail: 'myilmaz@aselsan.com.tr',
    contactPhone: '0312 528 70 00',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'Ahmet Akyol (Genel Müdür)',
    assignedFaculty: 'Mühendislik ve Mimarlık Fakültesi',
    notes: 'Başarılı stajyerler aday mühendis kadrosuna doğrudan dahil edilmektedir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/02-04',
  },
  {
    id: 'PRT-2026-002',
    protocolCode: 'IESU-PRT-2026-002',
    companyName: 'Baykar Teknoloji',
    taxNo: '9876543210',
    sector: 'Havacılık & Lojistik',
    protocolType: PROTOCOL_TYPES.APPLIED_EDUCATION_7_PLUS_1,
    signedDate: '2024-09-01',
    validUntil: '2028-12-31',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 30,
    placedCount: 24,
    scope: 'Milli Teknoloji Hamlesi 7+1 İşletmede Mesleki Eğitim ve Otonom Sistemler Stajı',
    contactPerson: 'Zeynep Kaya',
    contactTitle: 'Yetenek Kazanım Yöneticisi',
    contactEmail: 'z.kaya@baykartech.com',
    contactPhone: '0212 867 09 00',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'Haluk Bayraktar (Genel Müdür)',
    assignedFaculty: 'Mühendislik ve Mimarlık Fakültesi',
    notes: 'Havacılık ve Yazılım Mühendisliği son sınıf öğrencilerine tam zamanlı staj imkanı.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/09-11',
  },
  {
    id: 'PRT-2026-003',
    protocolCode: 'IESU-PRT-2026-003',
    companyName: 'Esenyurt Belediyesi İstihdam Merkezi (ESBİM)',
    taxNo: '3810012234',
    sector: 'Kamu & Yerel Yönetim',
    protocolType: PROTOCOL_TYPES.ESBİM_LOCAL_DESK,
    signedDate: '2025-01-10',
    validUntil: '2027-01-10',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 120,
    placedCount: 92,
    scope: 'Yerel İstihdam Masası, Esenyurt Sanayi Bölgesi Toplu Mülakat ve Eşleştirme Programı',
    contactPerson: 'Hakan Karaca',
    contactTitle: 'ESBİM Koordinatörü',
    contactEmail: 'esbim@esenyurt.bel.tr',
    contactPhone: '0212 689 10 00',
    rectorateSignatory: 'Kariyer Geliştirme Koordinatörlüğü & Rektörlük',
    companySignatory: 'Esenyurt Belediye Başkanlığı',
    assignedFaculty: 'Tüm Fakülte ve Meslek Yüksekokulları',
    notes: 'Her ay düzenli olarak kampüste toplu mülakat günleri organize edilmektedir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2025/01-03',
  },
  {
    id: 'PRT-2026-004',
    protocolCode: 'IESU-PRT-2026-004',
    companyName: 'Türkiye İş Kurumu (İŞKUR)',
    taxNo: '4810291122',
    sector: 'Kamu & Yerel Yönetim',
    protocolType: PROTOCOL_TYPES.ISKUR_JOB_CLUB,
    signedDate: '2024-03-01',
    validUntil: '2027-03-01',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 200,
    placedCount: 165,
    scope: 'İŞKUR İş Kulübü Gençlik İstihdamı Masası & CV / Mülakat Simülasyon Eğitimleri',
    contactPerson: 'Banu Çelik',
    contactTitle: 'İş ve Meslek Danışmanı / İş Kulübü Lideri',
    contactEmail: 'buyukcekmece.iskur@iskur.gov.tr',
    contactPhone: '0212 881 22 33',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'İŞKUR İstanbul İl Müdürü',
    assignedFaculty: 'Tüm Öğrenci ve Yeni Mezunlar',
    notes: 'Ayda iki kez 25 kişilik kohortlar halinde İş Kulübü sertifikalı eğitim modülü verilmektedir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/03-08',
  },
  {
    id: 'PRT-2026-005',
    protocolCode: 'IESU-PRT-2026-005',
    companyName: 'Türk Hava Yolları (THY Teknik A.Ş.)',
    taxNo: '8760012398',
    sector: 'Havacılık & Lojistik',
    protocolType: PROTOCOL_TYPES.COOPERATION,
    signedDate: '2024-04-10',
    validUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 18 gün sonra bitiyor -> EXPIRING_SOON
    status: PROTOCOL_STATUS.EXPIRING_SOON,
    committedQuota: 20,
    placedCount: 17,
    scope: 'Havacılık Yönetimi ve Uçak Bakım Teknisyenliği Staj ve İstihdam Kotası',
    contactPerson: 'Ahmet Demir',
    contactTitle: 'İK ve Eğitim Direktörü',
    contactEmail: 'ademir@thy.com',
    contactPhone: '0212 463 63 63',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'THY Teknik Genel Müdürlüğü',
    assignedFaculty: 'Mühendislik ve Havacılık Yüksekokulu',
    notes: 'Protokol süresi son 18 gün içerisindedir. Yenileme evrakları Hukuk Müşavirliği incelemesindedir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/04-02',
  },
  {
    id: 'PRT-2026-006',
    protocolCode: 'IESU-PRT-2026-006',
    companyName: 'Turkcell İletişim Hizmetleri A.Ş.',
    taxNo: '8790019283',
    sector: 'Bilişim & Yazılım',
    protocolType: PROTOCOL_TYPES.COOPERATION,
    signedDate: '2024-02-20',
    validUntil: '2027-02-20',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 20,
    placedCount: 15,
    scope: 'GNCTRKCLL Kampüs, Bulut Bilişim & Veri Analitiği Stajyer Yetiştirme Programı',
    contactPerson: 'Elif Şahin',
    contactTitle: 'Kampüs Etkileşim Müdürü',
    contactEmail: 'elif.sahin@turkcell.com.tr',
    contactPhone: '0212 313 10 00',
    rectorateSignatory: 'Kariyer Geliştirme Koordinatörlüğü',
    companySignatory: 'Turkcell İK Direktörlüğü',
    assignedFaculty: 'Mühendislik ve Mimarlık Fakültesi / YBS',
    notes: 'Yazılım ve telekomünikasyon alanında sertifikasyon programları ve burslar dahildir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/02-19',
  },
  {
    id: 'PRT-2026-007',
    protocolCode: 'IESU-PRT-2026-007',
    companyName: 'Trendyol (DSM Grup Danışmanlık)',
    taxNo: '3130541298',
    sector: 'E-Ticaret & Perakende',
    protocolType: PROTOCOL_TYPES.APPLIED_EDUCATION_7_PLUS_1,
    signedDate: '2025-01-10',
    validUntil: '2027-12-31',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 18,
    placedCount: 14,
    scope: 'E-Ticaret Lojistiği, Büyük Veri & Yazılım Geliştirme 7+1 Dönem Projesi',
    contactPerson: 'Caner Öztürk',
    contactTitle: 'Genç Yetenek Programları Lideri',
    contactEmail: 'cozturk@trendyol.com',
    contactPhone: '0212 331 02 00',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'Trendyol İK Grubu',
    assignedFaculty: 'İktisadi, İdari ve Sosyal Bilimler / Mühendislik',
    notes: 'Bootcamp mezunlarına junior pozisyon mülakat önceliği tanımlanmıştır.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2025/01-14',
  },
  {
    id: 'PRT-2026-008',
    protocolCode: 'IESU-PRT-2026-008',
    companyName: 'Medipol Sağlık Grubu',
    taxNo: '6130491823',
    sector: 'Sağlık & Medikal',
    protocolType: PROTOCOL_TYPES.COOPERATION,
    signedDate: '2024-05-15',
    validUntil: '2027-05-15',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 45,
    placedCount: 38,
    scope: 'Hemşirelik, Sağlık Yönetimi ve Fizyoterapi Hastane Klinik Stajları Protokolü',
    contactPerson: 'Dr. Sevgi Karadağ',
    contactTitle: 'Eğitim ve Sağlık Hizmetleri Direktörü',
    contactEmail: 'skaradag@medipol.com.tr',
    contactPhone: '0212 460 70 00',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'Medipol Sağlık Grubu Yönetim Kurulu',
    assignedFaculty: 'Sağlık Bilimleri Fakültesi / SHMYO',
    notes: 'Öğrencilerimize klinikte doğrudan mesleki staj rotasyonu sağlanmaktadır.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2024/05-22',
  },
  {
    id: 'PRT-2026-009',
    protocolCode: 'IESU-PRT-2026-009',
    companyName: 'Mercedes-Benz Türk A.Ş.',
    taxNo: '6190012891',
    sector: 'Üretim & Otomotiv',
    protocolType: PROTOCOL_TYPES.SECTOR_ADVISORY,
    signedDate: '2023-11-01',
    validUntil: '2026-11-01',
    status: PROTOCOL_STATUS.ACTIVE,
    committedQuota: 15,
    placedCount: 11,
    scope: 'Sektörel Danışma Kurulu Temsiliyeti, Otomotiv Üretim Stajı & Hami Mentorluğu',
    contactPerson: 'Deniz Koç',
    contactTitle: 'İnsan Kaynakları & Sektör Hamisi',
    contactEmail: 'deniz.koc@mercedes-benz.com.tr',
    contactPhone: '0212 858 30 00',
    rectorateSignatory: 'Kariyer Geliştirme Koordinatörlüğü',
    companySignatory: 'Mercedes-Benz Türk Direktörlüğü',
    assignedFaculty: 'Mühendislik Fakültesi (Makine & Endüstri)',
    notes: 'Hoşdere Fabrikasında staj ve teknik gezi kontenjanları aktiftir.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2023/11-09',
  },
  {
    id: 'PRT-2026-010',
    protocolCode: 'IESU-PRT-2026-010',
    companyName: 'HAVELSAN A.Ş.',
    taxNo: '4590012389',
    sector: 'Savunma Sanayii',
    protocolType: PROTOCOL_TYPES.RND_TECHNOPARK,
    signedDate: '2022-04-15',
    validUntil: '2025-12-31',
    status: PROTOCOL_STATUS.EXPIRED,
    committedQuota: 10,
    placedCount: 8,
    scope: 'Siber Güvenlik, Komuta Kontrol Sistemleri ve Simülasyon Staj Protokolü',
    contactPerson: 'Murat Arslan',
    contactTitle: 'Savunma Çözümleri Direktörü',
    contactEmail: 'marslan@havelsan.com.tr',
    contactPhone: '0312 292 20 00',
    rectorateSignatory: 'Prof. Dr. Süleyman Özdemir (Rektör)',
    companySignatory: 'HAVELSAN Genel Müdürlüğü',
    assignedFaculty: 'Mühendislik ve Mimarlık Fakültesi',
    notes: 'Protokol süresi tamamlanmıştır. Yeni dönem revize maddeleriyle Senatoya sunulacaktır.',
    isOfficialSenateApproved: true,
    senateDecisionNo: '2022/04-05',
  },
];

export const SAMPLE_SECTOR_MENTORS = [
  {
    id: 'SM-001',
    name: 'Dr. Mehmet Yılmaz',
    title: 'Savunma Sistemleri Başmühendisi & Ar-Ge Direktörü',
    company: 'Aselsan A.Ş.',
    protocolCode: 'IESU-PRT-2026-001',
    sector: 'Savunma Sanayii',
    assignedDepartment: 'Bilgisayar Mühendisliği',
    expertise: ['Radar Sistemleri', 'Gömülü Yazılım', 'C++', 'Algoritma Tasarımı'],
    email: 'myilmaz@aselsan.com.tr',
    menteeCapacity: 5,
    activeMentees: 4,
    avatar: null,
    isAdvisoryBoardMember: true,
    term: '2025-2027',
  },
  {
    id: 'SM-002',
    name: 'Zeynep Kaya',
    title: 'Otonom Sistemler Ekip Lideri',
    company: 'Baykar Teknoloji',
    protocolCode: 'IESU-PRT-2026-002',
    sector: 'Havacılık & Lojistik',
    assignedDepartment: 'Yazılım Mühendisliği',
    expertise: ['İHA Uçuş Kontrol', 'ROS', 'Python', 'Yapay Zeka'],
    email: 'z.kaya@baykartech.com',
    menteeCapacity: 6,
    activeMentees: 6,
    avatar: null,
    isAdvisoryBoardMember: true,
    term: '2025-2027',
  },
  {
    id: 'SM-003',
    name: 'Hakan Karaca',
    title: 'İstihdam & Bölgesel Kalkınma Masası Direktörü',
    company: 'Esenyurt Belediyesi İstihdam Merkezi (ESBİM)',
    protocolCode: 'IESU-PRT-2026-003',
    sector: 'Kamu & Yerel Yönetim',
    assignedDepartment: 'İşletme',
    expertise: ['İş Hukuku', 'Yerel İstihdam Masaları', 'Mülakat Teknikleri'],
    email: 'hakan.karaca@esenyurt.bel.tr',
    menteeCapacity: 10,
    activeMentees: 8,
    avatar: null,
    isAdvisoryBoardMember: true,
    term: '2024-2026',
  },
  {
    id: 'SM-004',
    name: 'Banu Çelik',
    title: 'Kıdemli İş ve Meslek Danışmanı / Kulüp Lideri',
    company: 'Türkiye İş Kurumu (İŞKUR)',
    protocolCode: 'IESU-PRT-2026-004',
    sector: 'Kamu & Yerel Yönetim',
    assignedDepartment: 'Psikoloji',
    expertise: ['Kariyer Danışmanlığı', 'İş Arama Stratejileri', 'Yetkinlik Değerlendirme'],
    email: 'banu.celik@iskur.gov.tr',
    menteeCapacity: 8,
    activeMentees: 7,
    avatar: null,
    isAdvisoryBoardMember: true,
    term: '2024-2026',
  },
  {
    id: 'SM-005',
    name: 'Deniz Koç',
    title: 'Otomotiv İmalat Süreçleri Müdürü',
    company: 'Mercedes-Benz Türk A.Ş.',
    protocolCode: 'IESU-PRT-2026-009',
    sector: 'Üretim & Otomotiv',
    assignedDepartment: 'Endüstri Mühendisliği',
    expertise: ['Yalın Üretim', 'Endüstri 4.0', 'Tedarik Zinciri'],
    email: 'deniz.koc@mercedes-benz.com.tr',
    menteeCapacity: 4,
    activeMentees: 3,
    avatar: null,
    isAdvisoryBoardMember: true,
    term: '2025-2027',
  },
];

export const SAMPLE_ESBIM_EVENTS = [
  {
    id: 'ESBIM-EVT-01',
    title: 'İESÜ & ESBİM Bölgesel Sanayi Toplu Mülakat Günü',
    date: '2026-04-16',
    time: '10:00 - 16:30',
    location: 'İESÜ Merkez Kampüs Rektörlük Fuaye Alanı',
    partnerCompanies: ['Doğuş Otomotiv', 'LC Waikiki', 'Sarten Ambalaj', 'Norm Cıvata'],
    targetDepartments: ['Lojistik Yönetimi', 'Dış Ticaret', 'Makine', 'Elektrik'],
    registeredCandidatesCount: 142,
    openPositionsQuota: 45,
    status: 'Planlandı',
  },
  {
    id: 'ESBIM-EVT-02',
    title: 'Esenyurt İmalat Sanayii & Teknoloji Kariyer Masası',
    date: '2026-05-08',
    time: '11:00 - 17:00',
    location: 'ESBİM Esenyurt Hizmet Binası & Çevrim İçi',
    partnerCompanies: ['Arçelik', 'Pilsan', 'Esen Plastik', 'Günsan Elektrik'],
    targetDepartments: ['Endüstri Mühendisliği', 'Bilgisayar', 'İşletme'],
    registeredCandidatesCount: 98,
    openPositionsQuota: 30,
    status: 'Başvurular Açık',
  },
];

export const SAMPLE_ISKUR_JOB_CLUB_COHORTS = [
  {
    id: 'ISKUR-JC-2026-01',
    cohortName: '2026 Bahar Dönemi 1. İş Kulübü Eğitim Kohortu',
    trainer: 'Banu Çelik (İŞKUR İş ve Meslek Danışmanı)',
    capacity: 25,
    enrolledCount: 25,
    completedCount: 24,
    startDate: '2026-02-16',
    endDate: '2026-02-27',
    modulesCompleted: ['Özgeçmiş Hazırlama', 'Mülakat Teknikleri', 'Beden Dili', 'İş Arama Ağı'],
    status: 'Tamamlandı',
    completionRate: 96,
  },
  {
    id: 'ISKUR-JC-2026-02',
    cohortName: '2026 Bahar Dönemi 2. İş Kulübü Eğitim Kohortu',
    trainer: 'Banu Çelik & İESÜ Kariyer Uzmanı',
    capacity: 25,
    enrolledCount: 22,
    completedCount: 0,
    startDate: '2026-04-06',
    endDate: '2026-04-17',
    modulesCompleted: ['Özgeçmiş Hazırlama (Devam Ediyor)'],
    status: 'Devam Ediyor',
    completionRate: 50,
  },
];

// ============================================================================
// RESMÎ SENATO & REKTÖRLÜK PROTOKOL RAPORU İHRACI (HTML/PDF & EXCEL/CSV)
// ============================================================================

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function generateSenateProtocolHtmlReport({
  protocols = SAMPLE_CORPORATE_PROTOCOLS,
  sectorMentors = SAMPLE_SECTOR_MENTORS,
  esbimEvents = SAMPLE_ESBIM_EVENTS,
  iskurCohorts = SAMPLE_ISKUR_JOB_CLUB_COHORTS,
  period = '2025-2026 Akademik Yılı',
  reportNo = 'İESÜ-SENATO-PRT-2026-091',
  generatedBy = 'Kariyer Geliştirme Koordinatörlüğü',
} = {}) {
  const safeProtocols = Array.isArray(protocols) ? protocols.filter(Boolean) : (Array.isArray(SAMPLE_CORPORATE_PROTOCOLS) ? SAMPLE_CORPORATE_PROTOCOLS : []);
  const safeMentors = Array.isArray(sectorMentors) ? sectorMentors.filter(Boolean) : (Array.isArray(SAMPLE_SECTOR_MENTORS) ? SAMPLE_SECTOR_MENTORS : []);
  const safeEvents = Array.isArray(esbimEvents) ? esbimEvents.filter(Boolean) : (Array.isArray(SAMPLE_ESBIM_EVENTS) ? SAMPLE_ESBIM_EVENTS : []);
  const safeCohorts = Array.isArray(iskurCohorts) ? iskurCohorts.filter(Boolean) : (Array.isArray(SAMPLE_ISKUR_JOB_CLUB_COHORTS) ? SAMPLE_ISKUR_JOB_CLUB_COHORTS : []);

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const stats = calculateProtocolAggregateStats(safeProtocols);

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>İESÜ Kurumsal Protokol & Sanayi CRM Senato Raporu (${escapeHtml(period)})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm 12mm 10mm; }
    body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #0F172A; line-height: 1.4; font-size: 10.5px; margin: 0; padding: 20px; background: #fff; }
    .official-header { border-bottom: 3px double #990000; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
    .crest-box { display: flex; align-items: center; gap: 12px; }
    .uni-emblem { width: 50px; height: 50px; border-radius: 50%; background: #990000; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; letter-spacing: 1px; }
    .header-text h1 { margin: 0; font-size: 14px; font-weight: 900; color: #990000; letter-spacing: 0.5px; text-transform: uppercase; }
    .header-text h2 { margin: 2px 0 0 0; font-size: 11.5px; font-weight: 700; color: #0A2342; }
    .header-text p { margin: 2px 0 0 0; font-size: 9.5px; color: #64748B; font-weight: 600; }
    .meta-box { text-align: right; font-size: 9px; color: #334155; line-height: 1.5; border-left: 1px solid #CBD5E1; padding-left: 12px; }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 16px; }
    .kpi-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px; text-align: center; }
    .kpi-title { font-size: 8px; text-transform: uppercase; font-weight: 800; color: #64748B; }
    .kpi-val { font-size: 15px; font-weight: 900; color: #0A2342; margin-top: 2px; }
    .kpi-val.accent { color: #990000; }
    .kpi-val.green { color: #059669; }
    .kpi-val.blue { color: #2563EB; }

    h3 { font-size: 11px; font-weight: 900; color: #0A2342; text-transform: uppercase; margin: 14px 0 6px 0; border-left: 4px solid #990000; padding-left: 6px; display: flex; justify-content: space-between; align-items: center; }
    h3 span.badge { font-size: 8.5px; font-weight: 700; color: #475569; background: #E2E8F0; padding: 2px 6px; border-radius: 4px; text-transform: none; }

    table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 12px; font-size: 9px; }
    th { background: #0A2342; color: #FFFFFF; font-weight: 800; padding: 5px 6px; text-align: left; text-transform: uppercase; font-size: 8px; letter-spacing: 0.3px; border: 1px solid #0A2342; }
    td { padding: 4.5px 6px; border: 1px solid #E2E8F0; vertical-align: middle; }
    tr:nth-child(even) { background-color: #F8FAFC; }
    .font-bold { font-weight: 700; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }

    .status-pill { display: inline-block; padding: 1.5px 5px; border-radius: 4px; font-size: 7.5px; font-weight: 800; text-transform: uppercase; }
    .pill-green { background: #DCFCE7; color: #166534; }
    .pill-blue { background: #DBEAFE; color: #1E40AF; }
    .pill-amber { background: #FEF3C7; color: #92400E; }
    .pill-rose { background: #FFE4E6; color: #9F1239; }

    .approval-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 22px; page-break-inside: avoid; border-top: 1px dashed #CBD5E1; padding-top: 15px; }
    .approval-card { border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px; text-align: center; background: #FAFAFA; }
    .approval-role { font-size: 8px; text-transform: uppercase; font-weight: 800; color: #64748B; margin-bottom: 2px; }
    .approval-name { font-size: 10.5px; font-weight: 900; color: #0A2342; }
    .approval-title { font-size: 8.5px; color: #475569; margin-top: 2px; }
    .approval-sig-space { height: 35px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #94A3B8; font-style: italic; margin-top: 4px; border-bottom: 1px solid #E2E8F0; }

    .official-footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 8px; color: #94A3B8; }
    .barcode-box { font-family: monospace; font-size: 8.5px; letter-spacing: 1.5px; background: #F1F5F9; padding: 3px 6px; border-radius: 4px; font-weight: bold; color: #334155; }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div class="official-header">
    <div class="crest-box">
      <div class="uni-emblem">İESÜ</div>
      <div class="header-text">
        <h1>T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ</h1>
        <h2>Kariyer Geliştirme Koordinatörlüğü — Senato & Rektörlük Protokol Masası</h2>
        <p>Resmî Üniversite - Sanayi İş Birliği, İŞKUR & ESBİM İstihdam Kontenjanı Denetim Raporu</p>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Belge Referans:</strong> ${escapeHtml(reportNo)}</div>
      <div><strong>Akademik Dönem:</strong> ${escapeHtml(period)}</div>
      <div><strong>Tanzim Tarihi:</strong> ${escapeHtml(currentDate)}</div>
      <div><strong>Dağıtım:</strong> Resmî Senato Üyeleri & Rektörlük Makamı</div>
    </div>
  </div>

  <!-- KPI SUMMARY CARDS -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Toplam Protokol</div>
      <div class="kpi-val">${stats.totalProtocols} Kurum</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Aktif Protokol</div>
      <div class="kpi-val green">${stats.activeProtocols} Protokol</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Taahhüt Kontenjan</div>
      <div class="kpi-val blue">${stats.totalCommittedQuota} Kontenjan</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Yerleşen Öğrenci/Mezun</div>
      <div class="kpi-val green">${stats.totalPlacedCount} Kişi</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Kontenjan Doluluk Oranı</div>
      <div class="kpi-val accent">%${stats.overallFillRate}</div>
    </div>
  </div>

  <!-- BÖLÜM 1: PROTOKOL VE SÖZLEŞME ÇİZELGESİ -->
  <h3>
    1. İMZALANAN RESMÎ KURUMSAL PROTOKOLLER VE KONTENJAN GERÇEKLEŞME DURUMU
    <span class="badge">2547 Sayılı Kanun Ek Md. 35 & YÖK Kurumsal İş Birliği Kriterleri</span>
  </h3>
  <table>
    <thead>
      <tr>
        <th style="width: 25px;" class="text-center">No</th>
        <th>Protokol Kodu</th>
        <th>Firma / Kamu Kurumu</th>
        <th>Sektör</th>
        <th>Protokol Türü</th>
        <th class="text-center">İmza / Bitiş</th>
        <th class="text-center">Taahhüt</th>
        <th class="text-center">Yerleşen</th>
        <th class="text-center">Doluluk</th>
        <th class="text-center">Durum</th>
      </tr>
    </thead>
    <tbody>
      ${safeProtocols.map((p, idx) => {
        const quota = calculateQuotaFulfillment(p.committedQuota || p.slots, p.placedCount);
        const st = calculateProtocolStatus(p);
        let pillClass = 'pill-green';
        if (st === PROTOCOL_STATUS.EXPIRING_SOON) pillClass = 'pill-amber';
        else if (st === PROTOCOL_STATUS.EXPIRED || st === PROTOCOL_STATUS.TERMINATED) pillClass = 'pill-rose';
        else if (st === PROTOCOL_STATUS.RENEWAL_REQUESTED) pillClass = 'pill-blue';

        return `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-bold"><code>${escapeHtml(p.protocolCode || p.id)}</code></td>
            <td class="font-bold">${escapeHtml(p.companyName)}</td>
            <td>${escapeHtml(p.sector)}</td>
            <td style="font-size: 8px;">${escapeHtml(p.protocolType || PROTOCOL_TYPES.COOPERATION)}</td>
            <td class="text-center" style="font-size: 8px;">${escapeHtml(p.signedDate)}<br>→ ${escapeHtml(p.validUntil)}</td>
            <td class="text-center font-bold">${quota.committedQuota}</td>
            <td class="text-center font-bold" style="color: #059669;">${quota.placedCount}</td>
            <td class="text-center font-bold" style="color: #0A2342;">%${quota.fillRate}</td>
            <td class="text-center">
              <span class="status-pill ${pillClass}">
                ${escapeHtml(PROTOCOL_STATUS_LABELS[st] || st)}
              </span>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <!-- BÖLÜM 2: İŞKUR & ESBİM İSTİHDAM KÖPRÜSÜ -->
  <div style="margin-top: 14px;">
    <h3>
      2. İŞKUR İŞ KULÜBÜ & ESBİM YEREL İSTİHDAM MASASI ENTEGRASYON RAPORU
      <span class="badge">Esenyurt Sanayi Bölgesi & Kamu İstihdam Masaları</span>
    </h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div>
        <p style="font-weight: 800; font-size: 9px; margin: 0 0 4px 0; color: #0A2342;">A. İŞKUR İş Kulübü Eğitim Kohortları:</p>
        <table>
          <thead>
            <tr>
              <th>Kohort Adı</th>
              <th class="text-center">Tarih</th>
              <th class="text-center">Kayıt / Tamamlama</th>
              <th class="text-center">Başarı</th>
            </tr>
          </thead>
          <tbody>
            ${safeCohorts.map(c => `
              <tr>
                <td class="font-bold">${escapeHtml(c.cohortName)}</td>
                <td class="text-center" style="font-size: 8px;">${escapeHtml(c.startDate)}</td>
                <td class="text-center">${c.enrolledCount} / ${c.completedCount}</td>
                <td class="text-center font-bold" style="color: #059669;">%${c.completionRate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div>
        <p style="font-weight: 800; font-size: 9px; margin: 0 0 4px 0; color: #0A2342;">B. ESBİM Yerel Toplu Mülakat Masaları:</p>
        <table>
          <thead>
            <tr>
              <th>Etkinlik Başlığı</th>
              <th class="text-center">Tarih</th>
              <th class="text-center">Açık Kontenjan</th>
              <th class="text-center">Aday Sayısı</th>
            </tr>
          </thead>
          <tbody>
            ${safeEvents.map(e => `
              <tr>
                <td class="font-bold">${escapeHtml(e.title)}</td>
                <td class="text-center" style="font-size: 8px;">${escapeHtml(e.date)}</td>
                <td class="text-center font-bold" style="color: #2563EB;">${e.openPositionsQuota}</td>
                <td class="text-center font-bold">${e.registeredCandidatesCount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- BÖLÜM 3: SEKTÖREL DANIŞMA KURULU VE HAMİLER HAVUZU -->
  <div style="margin-top: 14px;">
    <h3>
      3. SEKTÖREL DANIŞMA KURULU & SANAYİ HAMİLERİ HAVUZU
      <span class="badge">Bölüm ve Fakülte Dış Paydaş Temsilcileri</span>
    </h3>
    <table>
      <thead>
        <tr>
          <th style="width: 25px;" class="text-center">No</th>
          <th>Sektör Hamisi / Danışma Kurulu Üyesi</th>
          <th>Kurum / Firma</th>
          <th>Protokol No</th>
          <th>Sektör</th>
          <th>Eşleştiği Bölüm</th>
          <th class="text-center">Hami Kapasite</th>
          <th class="text-center">Aktif Öğrenci</th>
          <th class="text-center">Görev Süresi</th>
        </tr>
      </thead>
      <tbody>
        ${safeMentors.map((m, idx) => `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td class="font-bold">${escapeHtml(m.name)}<br><span style="font-size: 7.5px; color: #64748B;">${escapeHtml(m.title)}</span></td>
            <td><strong>${escapeHtml(m.company)}</strong></td>
            <td><code>${escapeHtml(m.protocolCode)}</code></td>
            <td>${escapeHtml(m.sector)}</td>
            <td>${escapeHtml(m.assignedDepartment)}</td>
            <td class="text-center font-bold">${m.menteeCapacity}</td>
            <td class="text-center font-bold" style="color: #059669;">${m.activeMentees}</td>
            <td class="text-center" style="font-size: 8px;">${escapeHtml(m.term || '2025-2027')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- RESMÎ ONAY VE İMZA BLOKLARI (SENATO & REKTÖRLÜK) -->
  <div class="approval-grid">
    <div class="approval-card">
      <div class="approval-role">Raporu Tanzim Eden</div>
      <div class="approval-name">${escapeHtml(generatedBy)}</div>
      <div class="approval-title">Kariyer Geliştirme Koordinatörlüğü</div>
      <div class="approval-sig-space">[e-İmzalı / Paraflı]</div>
      <div style="font-size: 7.5px; color: #64748B; margin-top: 2px;">Tarih: ${escapeHtml(currentDate)}</div>
    </div>

    <div class="approval-card">
      <div class="approval-role">Tetkik Eden / Senato Raportörü</div>
      <div class="approval-name">Prof. Dr. Rektör Yardımcısı</div>
      <div class="approval-title">Üniversite - Sanayi İş Birliği Komisyonu</div>
      <div class="approval-sig-space">[e-İmzalı / Uygun Görüldü]</div>
      <div style="font-size: 7.5px; color: #64748B; margin-top: 2px;">Karar No: 2026/SEN-08</div>
    </div>

    <div class="approval-card">
      <div class="approval-role">Makam Onayı / Tasdik Eden</div>
      <div class="approval-name">Prof. Dr. Süleyman Özdemir</div>
      <div class="approval-title">İstanbul Esenyurt Üniversitesi Rektörü</div>
      <div class="approval-sig-space">[Mühürlü ve Resmî Onaylı]</div>
      <div style="font-size: 7.5px; color: #64748B; margin-top: 2px;">Kayıt No: İESÜ-REK-9904</div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="official-footer">
    <div>Bu belge 5070 Sayılı Elektronik İmza Kanunu'na uygun olarak güvenli elektronik imza ile oluşturulmuştur.</div>
    <div class="barcode-box">BARKOD: ${escapeHtml(reportNo)}</div>
    <div>Sayfa 1 / 1 — © 2026 İESÜ Kariyer Geliştirme Koordinatörlüğü</div>
  </div>

  <script>
    function triggerPrint() {
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (_) {}
      }, 350);
    }
    if (document.readyState === 'complete') {
      triggerPrint();
    } else {
      window.addEventListener('load', triggerPrint);
    }
  </script>
</body>
</html>
  `.trim();
}

/**
 * Resmî Senato PDF İhracını Yeni Sekmede Baskı Penceresi Olarak Açar
 */
export function exportSenateProtocolPdf({
  protocols,
  sectorMentors,
  esbimEvents,
  iskurCohorts,
  period,
  reportNo,
} = {}) {
  if (typeof window === 'undefined') return false;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    if (window.toast?.error) {
      window.toast.error('Tarayıcınız açılır pencereyi engelledi. Lütfen açılır pencerelere izin verin.');
    }
    return false;
  }
  const html = generateSenateProtocolHtmlReport({
    protocols,
    sectorMentors,
    esbimEvents,
    iskurCohorts,
    period,
    reportNo,
  });
  printWindow.document.write(html);
  printWindow.document.close();
  try {
    printWindow.focus();
  } catch {}
  return true;
}

/**
 * Resmî Excel / CSV İhracı (RFC 4180, Türkçe Karakter Uyumlu UTF-8 BOM ve sep=; direktifi)
 */
export function generateSenateProtocolCsv({
  protocols = SAMPLE_CORPORATE_PROTOCOLS,
  sectorMentors = SAMPLE_SECTOR_MENTORS,
  period = '2025-2026 Akademik Yılı',
  reportNo = 'İESÜ-SENATO-PRT-2026-CSV',
} = {}) {
  const safeProtocols = Array.isArray(protocols) ? protocols.filter(Boolean) : (Array.isArray(SAMPLE_CORPORATE_PROTOCOLS) ? SAMPLE_CORPORATE_PROTOCOLS : []);
  const safeMentors = Array.isArray(sectorMentors) ? sectorMentors.filter(Boolean) : (Array.isArray(SAMPLE_SECTOR_MENTORS) ? SAMPLE_SECTOR_MENTORS : []);

  const lines = [];

  // Metadata Başlığı
  lines.push(`${escapeCsvField('T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ')};${escapeCsvField('Kariyer Geliştirme Koordinatörlüğü')}`);
  lines.push(`${escapeCsvField('RESMÎ SENATO KURUMSAL PROTOKOL & SANAYİ CRM KÜTÜĞÜ')};${escapeCsvField('Dönem: ' + period)}`);
  lines.push(`${escapeCsvField('Belge No: ' + reportNo)};${escapeCsvField('Tarih: ' + new Date().toLocaleDateString('tr-TR'))}`);
  lines.push('');

  // Tablo 1: Protokoller
  lines.push(escapeCsvField('1. İMZALANAN RESMÎ KURUMSAL PROTOKOLLER'));
  lines.push([
    escapeCsvField('No'),
    escapeCsvField('Protokol Kodu'),
    escapeCsvField('Firma / Kurum Adı'),
    escapeCsvField('Sektör'),
    escapeCsvField('Protokol Türü'),
    escapeCsvField('İmza Tarihi'),
    escapeCsvField('Bitiş Tarihi'),
    escapeCsvField('Taahhüt Kontenjan'),
    escapeCsvField('Yerleşen Öğrenci/Mezun'),
    escapeCsvField('Doluluk Oranı (%)'),
    escapeCsvField('Protokol Durumu'),
    escapeCsvField('İlgili Fakülte'),
    escapeCsvField('Yetkili İletişim'),
    escapeCsvField('Senato Karar No'),
  ].join(';'));

  safeProtocols.forEach((p, idx) => {
    const quota = calculateQuotaFulfillment(p.committedQuota || p.slots, p.placedCount);
    const st = calculateProtocolStatus(p);
    lines.push([
      escapeCsvField(idx + 1),
      escapeCsvField(p.protocolCode || p.id),
      escapeCsvField(p.companyName),
      escapeCsvField(p.sector),
      escapeCsvField(p.protocolType || PROTOCOL_TYPES.COOPERATION),
      escapeCsvField(p.signedDate),
      escapeCsvField(p.validUntil),
      escapeCsvField(quota.committedQuota),
      escapeCsvField(quota.placedCount),
      escapeCsvField(`%${quota.fillRate}`),
      escapeCsvField(PROTOCOL_STATUS_LABELS[st] || st),
      escapeCsvField(p.assignedFaculty || 'Genel'),
      escapeCsvField(p.contactPerson ? `${p.contactPerson} (${p.contactEmail || ''})` : ''),
      escapeCsvField(p.senateDecisionNo || '-'),
    ].join(';'));
  });

  lines.push('');
  lines.push(escapeCsvField('2. SEKTÖREL DANIŞMA KURULU VE SANAYİ HAMİLERİ'));
  lines.push([
    escapeCsvField('No'),
    escapeCsvField('Hami Adı Soyadı'),
    escapeCsvField('Unvan'),
    escapeCsvField('Firma / Kurum'),
    escapeCsvField('Protokol Kodu'),
    escapeCsvField('Sektör'),
    escapeCsvField('Atandığı Bölüm'),
    escapeCsvField('Hami Kapasitesi'),
    escapeCsvField('Aktif Mentee Sayısı'),
    escapeCsvField('İletişim E-posta'),
  ].join(';'));

  safeMentors.forEach((m, idx) => {
    lines.push([
      escapeCsvField(idx + 1),
      escapeCsvField(m.name),
      escapeCsvField(m.title),
      escapeCsvField(m.company),
      escapeCsvField(m.protocolCode),
      escapeCsvField(m.sector),
      escapeCsvField(m.assignedDepartment),
      escapeCsvField(m.menteeCapacity),
      escapeCsvField(m.activeMentees),
      escapeCsvField(m.email),
    ].join(';'));
  });

  // UTF-8 BOM ve Excel ayırıcı direktifi (sep=;) ekle
  return '\uFEFFsep=;\r\n' + lines.join('\r\n');
}

/**
 * CSV Dosyasını Tarayıcıda Doğrudan İndirme
 */
export function downloadSenateProtocolCsv(options = {}) {
  if (typeof window === 'undefined') return false;
  try {
    const csvContent = generateSenateProtocolCsv(options);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `IESU_Senato_Protokol_CRM_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (window.toast?.success) {
      window.toast.success(`Resmî Senato Protokol CSV kütüğü başarıyla indirildi: ${filename}`);
    }
    return true;
  } catch (err) {
    if (window.toast?.error) {
      window.toast.error('CSV dosyası oluşturulurken hata meydana geldi: ' + err.message);
    }
    return false;
  }
}
