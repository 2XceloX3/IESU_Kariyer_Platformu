/**
 * Derive student career readiness % from up to 5 real signals (0–100).
 * Missing data ⇒ that signal counts as incomplete (never invent scores).
 */
export function computeCareerProgress({ user, applications = [], cvRecords = [] } = {}) {
  if (!user || !(user.id || user.uid)) {
    return { percent: null, signals: {}, done: 0, total: 5 };
  }
  const uid = user.id || user.uid;
  const profileComplete = Boolean(
    user.name &&
    user.department &&
    (user.email || user.studentId || user.studentNo)
  );
  const careerTestDone = Boolean(
    user.careerTestCompleted === true ||
    user.careerTestResult ||
    (Array.isArray(user.careerTestAnswers) && user.careerTestAnswers.length > 0)
  );
  const mapOrTaskDone = Boolean(
    user.mapTaskDone === true ||
    user.onboardingMapComplete === true ||
    (typeof user.roadmapProgress === 'number' && user.roadmapProgress > 0) ||
    user.careerRoadmapCompleted === true
  );
  const cvSaved = Boolean(
    user.cvSaved === true ||
    user.cvUrl ||
    (typeof user.cvCompleteness === 'number' && user.cvCompleteness > 0) ||
    cvRecords.some((c) => (c.userId || c.ownerId || c.studentId) === uid)
  );
  const hasApplication = applications.some(
    (a) => a.applicantId === uid || a.applicantId === user.uid
  );

  const signals = {
    profileComplete,
    careerTestDone,
    mapOrTaskDone,
    cvSaved,
    hasApplication,
  };
  const done = Object.values(signals).filter(Boolean).length;
  const percent = Math.round((done / 5) * 100);
  return { percent, signals, done, total: 5 };
}

export function gradeFromPercent(percent) {
  if (percent == null) return { label: 'Veri yok', letter: '—' };
  if (percent >= 80) return { label: 'A+ Düzeyi', letter: 'A+' };
  if (percent >= 60) return { label: 'A Düzeyi', letter: 'A' };
  if (percent >= 40) return { label: 'B Düzeyi', letter: 'B' };
  if (percent > 0) return { label: 'Başlangıç', letter: 'C' };
  return { label: 'Henüz veri yok', letter: '—' };
}
