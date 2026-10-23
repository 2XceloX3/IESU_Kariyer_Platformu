/** Pure mapper — safe for unit tests (no Firebase import). */
export function mapInternshipToPanelStatus(row) {
  if (!row) return null;
  return {
    company: row.company || row.companyName || '',
    role: row.type || row.role || (row.isPaid ? '3308 Zorunlu / Ücretli Staj' : '5510 Zorunlu Staj'),
    status: row.status || 'Onay Bekliyor',
    duration: row.duration || (row.workDays ? `${row.workDays} İş Günü` : ''),
    sgkStatus: row.sgkStatus || (row.sgkBarcode ? 'Aktif' : ''),
    advisor: row.reviewerName || row.advisor || '',
    approvedDate: row.reviewedAt
      ? new Date(row.reviewedAt).toLocaleDateString('tr-TR')
      : (row.approvedDate || ''),
    notebookDeadline: row.notebookDeadline || (row.endDate || ''),
    id: row.id,
    studentId: row.studentId,
    sgkBarcode: row.sgkBarcode || '',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    workDays: row.workDays || 0,
    hasFamilyGss: Boolean(row.hasFamilyGss),
    employerScore: row.employerScore || null,
    commissionScore: row.commissionScore || null,
    finalGrade: row.finalGrade || null,
    notebookEntries: row.notebookEntries || [],
    raw: row,
  };
}
