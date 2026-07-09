const fs = require('fs');

// Check what features each version has
const files = {
  5201: 'C:/Users/celil/.gemini/antigravity/scratch/admin_step_5201.jsx',
  5167: 'C:/Users/celil/.gemini/antigravity/scratch/admin_step_5167.jsx',
  1210: 'C:/Users/celil/.gemini/antigravity/scratch/admin_step_1210.jsx',
};

const features = [
  'Önizleme', 'onizleme', 'preview', 'livePreview', 'LivePreview',
  'Etkinlik', 'etkinlik', 'EtkinlikPanel',
  'paylaş', 'Paylaş', 'share',
  'showJobModal', 'JobModal',
  'handleSaveJob', 'editingJob',
  'Mentorluk', 'MentorlukPanel',
  'Gönüllü', 'gonullu', 'GonulluPanel',
  'Akademik', 'AkademikPanel',
  'Operasyon', 'OperasyonPanel',
  'Firma Bilgi', 'FirmaPanel',
  'SEM', 'SEMPanel',
  'AlumniAssoc', 'Mezun Derneği',
  'Kart Başvuruları', 'KartPanel',
  'Anket', 'AnketPanel',
  'OrgPanel', 'Organizasyon',
];

for (const [step, path] of Object.entries(files)) {
  const code = fs.readFileSync(path, 'utf8');
  console.log(`\n=== STEP ${step} (${code.length} bytes) ===`);
  features.forEach(f => {
    if (code.includes(f)) console.log('  ✓', f);
  });
}
