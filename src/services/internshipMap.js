/** Pure mapper — safe for unit tests (no Firebase import). */
export function mapInternshipToPanelStatus(row) {
  if (!row) return null;
  return {
    company: row.company || '',
    role: row.type || row.role || 'Staj',
    status: row.status || 'Onay Bekliyor',
    duration: row.duration || '',
    sgkStatus: row.sgkStatus || '',
    advisor: row.reviewerName || row.advisor || '',
    approvedDate: row.reviewedAt
      ? new Date(row.reviewedAt).toLocaleDateString('tr-TR')
      : (row.approvedDate || ''),
    notebookDeadline: row.notebookDeadline || '',
    id: row.id,
    studentId: row.studentId,
  };
}
