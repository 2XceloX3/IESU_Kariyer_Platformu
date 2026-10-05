// OBS / e-Devlet integration — client calls only internal proxy. No secrets here.

const API_BASE_URL = import.meta.env.VITE_INTERNAL_API_URL || '/api';

export const fetchStudentFromOBS = async (studentNumber) => {
  if (!studentNumber) {
    throw new Error('Öğrenci numarası gereklidir.');
  }

  const response = await fetch(`${API_BASE_URL}/obs/students/${studentNumber}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    return await response.json();
  }

  // Production: never invent student profiles
  if (!import.meta.env.DEV) {
    throw new Error(`OBS servisi yanıt vermedi (${response.status}).`);
  }

  // DEV-only unreachable in production builds (import.meta.env.DEV === false is DCE'd)
  console.warn('OBS API unreachable — DEV mock disabled for security parity; returning error.');
  throw new Error('OBS servisi geliştirme ortamında da mock profil döndürmez.');
};

/**
 * Returns true ONLY when the backend responds with verified === true.
 * Never returns true from client-side heuristics.
 */
export const verifyEDevlet = async (tcKimlik) => {
  if (!tcKimlik) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/edevlet/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tc: tcKimlik }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.verified === true;
    }
  } catch (error) {
    console.warn('e-Devlet verification network error');
  }

  // No mock "length === 11 => verified" fallback (that path previously set false trust)
  return false;
};

export const syncAlumniData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alumni/sync`, { method: 'GET' });
    if (response.ok) return await response.json();
  } catch (_) { /* fall through */ }

  if (!import.meta.env.DEV) {
    throw new Error('Mezun senkronizasyon servisi yanıt vermedi.');
  }
  return [];
};
