/** Map legacy checkup rows into employmentDeclaration-shaped records when eligible fields exist. */
export function checkupToEmploymentDeclarations(checkupRecords = []) {
  return (checkupRecords || [])
    .map((r, i) => {
      const status = r.status || (r.submittedAt || r.source ? 'submitted' : null);
      const source = r.source || null;
      if (!status || !source) return null;
      return {
        alumniId: r.alumniId || r.userId || r.id || `checkup-${i}`,
        employed: r.employed === true || r.employed === 'Evet',
        relatedToMajor: r.relatedToMajor === true || r.relatedToMajor === 'Evet',
        startDate: r.startDate || r.jobStartDate || null,
        graduationDate: r.graduationDate || null,
        departmentId: r.departmentId || null,
        period: r.period || null,
        status,
        source,
        updatedAt: r.updatedAt || r.createdAt || r.submittedAt || null,
      };
    })
    .filter(Boolean);
}
