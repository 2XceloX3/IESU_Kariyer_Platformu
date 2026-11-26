export const sanitizeCSVCell = (val) => {
  if (val === null || val === undefined) return '';
  let normalized = val;
  if (Array.isArray(val)) {
    normalized = val.map(item => (item && typeof item === 'object' ? (item.name || item.title || JSON.stringify(item)) : String(item ?? ''))).join(', ');
  } else if (typeof val === 'object') {
    normalized = val.label || val.name || val.title || JSON.stringify(val);
  }
  const str = (typeof normalized === 'symbol' ? normalized.toString() : String(normalized)).replace(/"/g, '""').replace(/\r?\n/g, ' ');
  return /^[=+\-@\t\r]/.test(str) ? "'" + str : str;
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!Array.isArray(data) || !data.length) {
    if (typeof window !== 'undefined' && window.toast?.info) {
      window.toast.info('Dışa aktarılacak veri bulunamadı.');
    } else if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert('Dışa aktarılacak veri bulunamadı.');
    } else {
      console.warn('Dışa aktarılacak veri bulunamadı.');
    }
    return;
  }

  const validRows = data.filter(row => row && typeof row === 'object');
  if (!validRows.length) return;

  const sensitiveKeys = new Set(['password', 'pass', 'passwordhash', 'token', 'secret', 'hash', 'avatar', 'coverimage']);
  const headerSet = new Set();
  validRows.forEach(row => {
    Object.keys(row).forEach(k => {
      if (!sensitiveKeys.has(k.toLowerCase())) headerSet.add(k);
    });
  });
  const headers = Array.from(headerSet);
  const csvRows = [];

  // Turkish Excel compatible semicolon delimiter
  csvRows.push(headers.map(h => `"${sanitizeCSVCell(h)}"`).join(';'));

  for (const row of validRows) {
    const values = headers.map(header => {
      let val = row[header];
      const lowerH = header.toLowerCase();
      if ((lowerH.includes('tc') || lowerH.includes('tckimlik')) && typeof val === 'string' && val.length === 11) {
        val = val.slice(0, 4) + '*****' + val.slice(-2);
      }
      return `"${sanitizeCSVCell(val)}"`;
    });
    csvRows.push(values.join(';'));
  }

  const csvString = csvRows.join('\r\n');
  if (typeof Blob === 'undefined' || typeof document === 'undefined') return;

  const safeFilename = String(filename || 'export.csv').endsWith('.csv') ? filename : `${filename}.csv`;
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', safeFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  }
};

export const exportToJSON = (data, filename = 'iesu_backup.json') => {
  if (typeof Blob === 'undefined' || typeof document === 'undefined') return;
  const safeFilename = String(filename || 'iesu_backup.json').endsWith('.json') ? filename : `${filename}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', safeFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
};
