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
        department: r.department || null,
        faculty: r.faculty || null,
        name: r.name || r.alumniName || null,
        tcNo: r.tcNo || r.studentId || null,
        jobTiming: r.jobTiming || null,
        sector: r.sector || null,
        company: r.company || r.companyName || null,
        companyType: r.companyType || null,
        title: r.title || null,
        salaryRange: r.salaryRange || null,
        salaryAmount: r.salaryAmount || null,
        workMode: r.workMode || null,
        postgrad: r.postgrad || null,
        period: r.period || null,
        status,
        source,
        updatedAt: r.updatedAt || r.createdAt || r.submittedAt || null,
      };
    })
    .filter(Boolean);
}
