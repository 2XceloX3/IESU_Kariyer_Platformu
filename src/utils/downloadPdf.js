// Minimal, bağımlılıksız, gerçek tek-sayfa PDF üretici (Blob indirme).
// ASCII-safe metin içerir; Türkçe karakterler transliterate edilir.

const LATIN = {
  'ı':'i','İ':'I','ş':'s','Ş':'S','ğ':'g','Ğ':'G','ü':'u','Ü':'U',
  'ö':'o','Ö':'O','ç':'c','Ç':'C','â':'a','û':'u','î':'i','Þ':'T','Ž':'Z'
};
const toAscii = (s) => String(s || '').replace(/[^\x20-\x7E]/g, (c) => (LATIN[c] !== undefined ? LATIN[c] : ''));
const esc = (t) => toAscii(t).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

function makePdf(title, lines) {
  const c = [];
  c.push('BT /F1 16 Tf 50 780 Td (' + esc(title) + ') Tj ET');
  let y = 740;
  for (const line of (lines || []).slice(0, 46)) {
    if (y < 50) break;
    c.push('BT /F1 10 Tf 50 ' + y + ' Td (' + esc(line) + ') Tj ET');
    y -= 16;
  }
  const stream = c.join('\n');

  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream'
  ];

  let out = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 0; i < objs.length; i++) {
    offsets.push(out.length);
    out += (i + 1) + ' 0 obj\n' + objs[i] + '\nendobj\n';
  }
  const xref = out.length;
  out += 'xref\n0 6\n0000000000 65535 f \n';
  for (const o of offsets) out += String(o).padStart(10, '0') + ' 00000 n \n';
  out += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return out;
}

export function downloadReportPdf(filename, title, lines) {
  const pdf = makePdf(title || 'Rapor', lines || []);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (filename || 'rapor') + '.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}