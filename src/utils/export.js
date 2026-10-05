export const exportToCSV = (data, filename) => {
  if (!Array.isArray(data) || !data.length) {
    typeof window !== 'undefined' && typeof window.alert === 'function' 
      ? window.alert("Dışa aktarılacak veri bulunamadı.") 
      : console.warn("Dışa aktarılacak veri bulunamadı.");
    return;
  }
  
  const validRows = data.filter(row => row && typeof row === 'object');
  if (!validRows.length) return;

  const sensitiveKeys = new Set(['password', 'pass', 'token', 'secret', 'hash']);
  const headers = Object.keys(validRows[0]).filter(k => !sensitiveKeys.has(k.toLowerCase()));
  const csvRows = [];
  
  // Headers
  csvRows.push(headers.join(','));
  
  // Rows with KVKK TC Masking
  for (const row of validRows) {
    const values = headers.map(header => {
      let val = row[header];
      const lowerH = header.toLowerCase();
      if ((lowerH.includes('tc') || lowerH.includes('tckimlik')) && typeof val === 'string' && val.length === 11) {
        val = val.slice(0, 4) + '*****' + val.slice(-2);
      }
      const escaped = (typeof val === 'symbol' ? val.toString() : String(val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  if (typeof Blob === 'undefined' || typeof document === 'undefined') return;

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' }); // BOM added for Excel
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
