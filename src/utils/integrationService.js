// Mock Integration Service for OBS (Öğrenci İşleri Bilgi Sistemi) and e-Devlet
// Prepared for real REST API integration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.esenyurt.edu.tr/v1';

/**
 * Fetches student data from the university's OBS system.
 * @param {string} studentNumber 
 * @returns {Promise<Object>}
 */
export const fetchStudentFromOBS = async (studentNumber) => {
  if (!studentNumber) {
    throw new Error("Öğrenci numarası gereklidir.");
  }

  try {
    // REAL API CALL PREPARATION
    const response = await fetch(`${API_BASE_URL}/obs/students/${studentNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OBS_API_KEY}`
      }
    });

    if (response.ok) {
      return await response.json();
    }
    
    // If API fails (or in development mode), gracefully fallback to mock data
    console.warn("OBS API not reachable or returned error, falling back to mock data.");
  } catch (error) {
    console.warn("Network error during OBS API fetch, falling back to mock data.");
  }

  // Fallback Mock Data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: studentNumber,
        name: "Test Öğrenci",
        department: "Bilgisayar Mühendisliği",
        faculty: "Mühendislik ve Mimarlık Fakültesi",
        status: "Aktif",
        gpa: "3.20",
        year: 3
      });
    }, 800);
  });
};

/**
 * Authenticates/verifies via e-Devlet Gateway API
 * @param {string} tcKimlik 
 * @returns {Promise<boolean>}
 */
export const verifyEDevlet = async (tcKimlik) => {
  try {
    // REAL API CALL PREPARATION
    const response = await fetch(`${API_BASE_URL}/edevlet/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tc: tcKimlik })
    });

    if (response.ok) {
      const data = await response.json();
      return data.verified === true;
    }
  } catch (error) {
    console.warn("Network error during e-Devlet verification, falling back to mock logic.");
  }

  // Fallback Logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tcKimlik && tcKimlik.length === 11);
    }, 1000);
  });
};

/**
 * Syncs the Alumni Association list
 * @returns {Promise<Array>}
 */
export const syncAlumniData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'ALM-SYNC-1', name: "Zeynep Yılmaz", dept: "İşletme", year: 2022 },
        { id: 'ALM-SYNC-2', name: "Mehmet Demir", dept: "Psikoloji", year: 2021 }
      ]);
    }, 1500);
  });
};
