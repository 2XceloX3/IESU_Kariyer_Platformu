// Mock Integration Service for OBS (Öğrenci İşleri Bilgi Sistemi) and e-Devlet

/**
 * Simulates fetching student data from the university's OBS system.
 * @param {string} studentNumber 
 * @returns {Promise<Object>}
 */
export const fetchStudentFromOBS = async (studentNumber) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!studentNumber) {
        reject(new Error("Öğrenci numarası gereklidir."));
        return;
      }
      
      // Mock Data
      resolve({
        id: studentNumber,
        name: "Test Öğrenci",
        department: "Bilgisayar Mühendisliği",
        faculty: "Mühendislik ve Mimarlık Fakültesi",
        status: "Aktif",
        gpa: "3.20",
        year: 3
      });
    }, 1500); // Simulate network delay
  });
};

/**
 * Simulates e-Devlet authentication/verification
 * @param {string} tcKimlik 
 * @returns {Promise<boolean>}
 */
export const verifyEDevlet = async (tcKimlik) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real scenario, this would check against an API
      resolve(tcKimlik && tcKimlik.length === 11);
    }, 2000);
  });
};

/**
 * Simulates syncing the Alumni Association list
 * @returns {Promise<Array>}
 */
export const syncAlumniData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'ALM-SYNC-1', name: "Zeynep Yılmaz", dept: "İşletme", year: 2022 },
        { id: 'ALM-SYNC-2', name: "Mehmet Demir", dept: "Psikoloji", year: 2021 }
      ]);
    }, 2500);
  });
};
