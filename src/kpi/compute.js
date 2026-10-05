/** Yaşayan Kovan KPI engine — pure functions only. ruleVersion bumps when formulas change. */
export const RULE_VERSION = 1;

const MIN_N = {
  alumni_employment_rate: 10,
  major_relevance_rate: 10,
  placement_90d_rate: 10,
  internship_completion_rate: 5,
  placements_per_job: 3,
  event_attendance_rate: 5,
  survey_response_rate: 10,
};

const VALID_STATUS = new Set(['submitted', 'verified']);

function round1(n) {
  return Math.round(n * 10) / 10;
}

function result({ kpiKey, departmentId, period, numerator, denominator, minN, asRatio = false }) {
  let status;
  let value = null;
  if (denominator === 0) status = 'empty';
  else if (denominator < minN) status = 'insufficient';
  else {
    status = 'ok';
    value = asRatio
      ? round1(numerator / denominator)
      : round1((numerator / denominator) * 100);
  }
  return {
    kpiKey,
    departmentId: departmentId ?? null,
    period: period ?? null,
    numerator,
    denominator,
    value,
    minN,
    status,
    ruleVersion: RULE_VERSION,
    computedAt: new Date().toISOString(),
  };
}

/** Eligible: status submitted|verified and non-empty source. */
export function isEligibleRecord(r) {
  if (!r || typeof r !== 'object') return false;
  if (!VALID_STATUS.has(r.status)) return false;
  if (r.source == null || r.source === '') return false;
  return true;
}

/** Latest updatedAt per person key; ties keep first encountered after sort desc. */
export function dedupeLatestByPerson(records, personKeyFn) {
  const sorted = [...records].sort((a, b) => {
    const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return tb - ta;
  });
  const seen = new Set();
  const out = [];
  for (const r of sorted) {
    const k = personKeyFn(r);
    if (k == null || k === '') continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

function filterDept(records, departmentId) {
  if (departmentId == null || departmentId === '') return records;
  return records.filter((r) => r.departmentId === departmentId);
}

function filterPeriod(records, period) {
  if (period == null || period === '') return records;
  return records.filter((r) => r.period === period);
}

function daysBetween(startIso, endIso) {
  const a = new Date(startIso);
  const b = new Date(endIso);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function computeAlumniEmploymentRate(records, opts) {
  const minN = MIN_N.alumni_employment_rate;
  let rows = (records || []).filter(isEligibleRecord);
  rows = filterDept(rows, opts.departmentId);
  rows = filterPeriod(rows, opts.period);
  rows = dedupeLatestByPerson(rows, (r) => r.alumniId);
  const denominator = rows.length;
  const numerator = rows.filter((r) => r.employed === true).length;
  return result({
    kpiKey: 'alumni_employment_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

function computeMajorRelevanceRate(records, opts) {
  const minN = MIN_N.major_relevance_rate;
  let rows = (records || []).filter(isEligibleRecord);
  rows = filterDept(rows, opts.departmentId);
  rows = filterPeriod(rows, opts.period);
  rows = dedupeLatestByPerson(rows, (r) => r.alumniId);
  rows = rows.filter((r) => r.employed === true);
  const denominator = rows.length;
  const numerator = rows.filter((r) => r.relatedToMajor === true).length;
  return result({
    kpiKey: 'major_relevance_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

/**
 * placement_90d: startDate - graduationDate <= 90 inclusive, 91 exclusive.
 * records: employmentDeclarations joined with graduationDate on each record (or users map via opts.usersById).
 */
function computePlacement90dRate(records, opts) {
  const minN = MIN_N.placement_90d_rate;
  const usersById = opts.usersById || {};
  let rows = (records || []).filter(isEligibleRecord);
  rows = filterDept(rows, opts.departmentId);
  rows = filterPeriod(rows, opts.period);
  rows = dedupeLatestByPerson(rows, (r) => r.alumniId);
  rows = rows.filter((r) => r.employed === true && r.startDate);
  const withGrad = [];
  for (const r of rows) {
    const grad =
      r.graduationDate ||
      usersById[r.alumniId]?.graduationDate ||
      usersById[r.alumniId]?.graduationYear; // year alone insufficient for day math
    if (!r.graduationDate && !usersById[r.alumniId]?.graduationDate) continue;
    const graduationDate = r.graduationDate || usersById[r.alumniId].graduationDate;
    const d = daysBetween(graduationDate, r.startDate);
    if (d == null) continue;
    withGrad.push({ ...r, _days: d });
  }
  const denominator = withGrad.length;
  const numerator = withGrad.filter((r) => r._days <= 90).length;
  return result({
    kpiKey: 'placement_90d_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

function computeInternshipCompletionRate(records, opts) {
  const minN = MIN_N.internship_completion_rate;
  let rows = (records || []).filter((r) => r && r.status !== 'rejected');
  if (opts.advisorId) {
    rows = rows.filter((r) => r.advisorId === opts.advisorId);
  }
  rows = filterDept(rows, opts.departmentId);
  rows = filterPeriod(rows, opts.period);
  // academic year start: use period or startedInPeriod flag; if period set match r.period / r.academicYear
  const denominator = rows.length;
  const numerator = rows.filter(
    (r) => r.advisorStatus === 'approved' && r.companyStatus === 'completed'
  ).length;
  return result({
    kpiKey: 'internship_completion_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

function computePlacementsPerJob(records, opts) {
  // records shape: { jobs: [], applications: [] } or flat with _type
  const minN = MIN_N.placements_per_job;
  const jobs = filterDept(
    filterPeriod((opts.jobs || records?.jobs || []).slice(), opts.period),
    opts.departmentId
  ).filter((j) => j && (j.status === 'Aktif' || j.status === 'published' || j.published === true || !j.status || j.status === 'open'));
  const apps = (opts.applications || records?.applications || []).filter(
    (a) => a && a.decision === 'accepted'
  );
  const jobIds = new Set(jobs.map((j) => j.id));
  const accepted = apps.filter((a) => jobIds.has(a.jobId));
  const denominator = jobs.length;
  const numerator = accepted.length;
  return result({
    kpiKey: 'placements_per_job',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
    asRatio: true,
  });
}

function computeEventAttendanceRate(records, opts) {
  const minN = MIN_N.event_attendance_rate;
  let rows = (records || []).filter((r) => r && (r.eventId || r.userId));
  rows = filterDept(rows, opts.departmentId);
  rows = filterPeriod(rows, opts.period);
  // unique registered users
  const byUser = new Map();
  for (const r of rows) {
    const uid = r.userId || r.attendeeId;
    if (!uid) continue;
    const prev = byUser.get(uid);
    if (!prev || new Date(r.updatedAt || 0) > new Date(prev.updatedAt || 0)) {
      byUser.set(uid, r);
    }
  }
  const uniq = [...byUser.values()];
  const denominator = uniq.length;
  const numerator = uniq.filter((r) => r.checkedInAt).length;
  return result({
    kpiKey: 'event_attendance_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

function computeSurveyResponseRate(records, opts) {
  const minN = MIN_N.survey_response_rate;
  // records: invitations; opts.responses: completed surveyResponses
  const invitations = filterDept(filterPeriod((records || []).slice(), opts.period), opts.departmentId);
  const invitees = new Set(
    invitations.map((r) => r.userId || r.inviteeId).filter(Boolean)
  );
  const responses = (opts.responses || []).filter(
    (r) => r && (r.completed === true || r.status === 'completed' || r.status === 'submitted')
  );
  const responded = new Set(
    responses.map((r) => r.userId || r.respondentId).filter((id) => invitees.has(id))
  );
  const denominator = invitees.size;
  const numerator = responded.size;
  return result({
    kpiKey: 'survey_response_rate',
    departmentId: opts.departmentId,
    period: opts.period,
    numerator,
    denominator,
    minN,
  });
}

/**
 * @param {string} kpiKey
 * @param {Array|object} records
 * @param {{ departmentId?: string, period?: string, usersById?: object, advisorId?: string, jobs?: array, applications?: array, responses?: array }} options
 */
export function computeKpi(kpiKey, records, options = {}) {
  const opts = options || {};
  switch (kpiKey) {
    case 'alumni_employment_rate':
      return computeAlumniEmploymentRate(records, opts);
    case 'major_relevance_rate':
      return computeMajorRelevanceRate(records, opts);
    case 'placement_90d_rate':
      return computePlacement90dRate(records, opts);
    case 'internship_completion_rate':
      return computeInternshipCompletionRate(records, opts);
    case 'placements_per_job':
      return computePlacementsPerJob(records, opts);
    case 'event_attendance_rate':
      return computeEventAttendanceRate(records, opts);
    case 'survey_response_rate':
      return computeSurveyResponseRate(records, opts);
    default:
      throw new Error(`Unknown kpiKey: ${kpiKey}`);
  }
}

export function formatKpiUi(kpi, { formHref } = {}) {
  if (!kpi || kpi.status === 'empty') {
    return {
      headline: 'Henüz kayıt yok',
      detail: formHref ? `Kayıt için ilgili forma gidin.` : null,
      formHref: formHref || null,
      showPercent: false,
    };
  }
  if (kpi.status === 'insufficient') {
    return {
      headline: `Bu dönem için yeterli kayıt yok (n = ${kpi.denominator}, eşik ${kpi.minN})`,
      detail: null,
      formHref: null,
      showPercent: false,
    };
  }
  const unit = kpi.kpiKey === 'placements_per_job' ? '' : '%';
  return {
    headline: `${kpi.value}${unit}`,
    detail: `n = ${kpi.denominator}${kpi.period ? ` · ${kpi.period}` : ''}`,
    formHref: null,
    showPercent: true,
  };
}

export { MIN_N };
