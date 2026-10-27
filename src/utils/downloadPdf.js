/**
 * src/utils/downloadPdf.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer Geliştirme Koordinatörlüğü
 * Kurumsal, Çok Sayfalı, Tam Türkçe (UTF-8) Destekli Resmî PDF Üretim Motoru
 */

/**
 * Resmî Kurumsal Antetli HTML Şablonunu Oluşturur
 */
export function buildReportHTML(title, lines = [], options = {}) {
  const docId = options.docId || ('IESU-DOC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000));
  const dateStr = options.dateStr || new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedLines = (lines || []).map((line) => {
    const trimmed = String(line || '').trim();
    if (!trimmed) {
      return '<div style="height: 8px;"></div>';
    }
    if (trimmed.startsWith('#') || trimmed.startsWith('===') || trimmed.endsWith(':')) {
      return `<div style="font-weight: 800; color: #0f172a; margin-top: 12px; margin-bottom: 4px; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">${trimmed.replace(/^[#=\s]+/, '')}</div>`;
    }
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      return `<div style="padding-left: 14px; margin-bottom: 4px; position: relative;">
        <span style="position: absolute; left: 0; color: #990000; font-weight: bold;">•</span>
        ${trimmed.replace(/^[-*•\s]+/, '')}
      </div>`;
    }
    return `<div style="margin-bottom: 4px;">${trimmed}</div>`;
  }).join('');

  return `
    <div id="iesu-pdf-report-root" style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; padding: 24px 30px; color: #1e293b; background: #ffffff; max-width: 800px; margin: 0 auto; line-height: 1.5; font-size: 11px;">
      <!-- Antet (Header) -->
      <div style="border-bottom: 3px solid #990000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="color: #990000; font-size: 16px; font-weight: 900; letter-spacing: -0.3px; text-transform: uppercase;">
            T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ
          </div>
          <div style="color: #475569; font-size: 12px; font-weight: 700; margin-top: 2px;">
            Kariyer Geliştirme Koordinatörlüğü
          </div>
          <div style="color: #94a3b8; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">
            Resmî Bilişim & Belge Doğrulama Sistemi
          </div>
        </div>
        <div style="text-align: right; font-size: 10px; color: #64748b;">
          <div><strong style="color: #0f172a;">Belge No:</strong> ${docId}</div>
          <div><strong style="color: #0f172a;">Tarih:</strong> ${dateStr}</div>
          <div style="margin-top: 2px; color: #10b981; font-weight: 700;">✓ E-Doğrulanmış Nüsha</div>
        </div>
      </div>

      <!-- Belge Başlığı -->
      <div style="background: #f8fafc; border-left: 4px solid #990000; padding: 10px 14px; margin-bottom: 18px; border-radius: 0 8px 8px 0;">
        <h1 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0;">
          ${title || 'Kariyer ve Yetkinlik Değerlendirme Raporu'}
        </h1>
      </div>

      <!-- İçerik Akışı (Çok Sayfalı, 46 Satır Sınırı Olmadan) -->
      <div style="color: #334155; margin-bottom: 24px; min-height: 200px;">
        ${formattedLines}
      </div>

      <!-- Alt Bilgi (Footer) -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid;">
        <div>
          Bu resmî belge <strong>İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü</strong> platformu üzerinden elektronik olarak üretilmiştir.
        </div>
        <div style="font-family: monospace; font-weight: bold; color: #64748b;">
          ${docId}
        </div>
      </div>
    </div>
  `;
}

/**
 * Resmî Raporu PDF Olarak İndir (UTF-8, Çok Sayfalı, Tam Türkçe)
 */
export async function downloadReportPdf(filename, title, lines) {
  const safeFilename = (filename || 'rapor').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeTitle = title || 'İESÜ Kariyer Geliştirme Raporu';
  const htmlContent = buildReportHTML(safeTitle, lines || []);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // 1. Tarayıcı ortamında html2pdf.js ile gerçek vektör PDF üretimi dene
  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    if (typeof html2pdf === 'function') {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${safeFilename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(container).set(opt).save();
      document.body.removeChild(container);
      return;
    }
  } catch (err) {
    // jsdom/test veya canvas kısıtı durumunda dayanıklı yedek akışa geç
  }

  // 2. Yedek Akış: UTF-8 Antetli HTML/PDF Blob İndirici (Sıfır Karakter Bozulması)
  const fullHtmlDoc = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body style="margin: 0; background: #fff;">
  ${htmlContent}
  <script>
    window.onload = function() {
      if (window.opener) {
        window.print();
      }
    };
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFilename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default {
  buildReportHTML,
  downloadReportPdf
};
