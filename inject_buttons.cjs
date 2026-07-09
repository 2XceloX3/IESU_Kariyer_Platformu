const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

// For mentor buttons
const mentorFind = 'Çağrı Yayınla';
const mentorIdx = code.indexOf(mentorFind);
if(mentorIdx > -1) {
  const startBtn = code.lastIndexOf('<div className="relative z-10', mentorIdx);
  const endBtn = code.indexOf('</div>', mentorIdx) + 6;
  const newMentorButtons = `                  <div className="relative z-10 flex gap-3 flex-col md:flex-row w-full md:w-auto flex-wrap">
                    <button onClick={() => setShowMentorCallModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 justify-center border border-red-400/50">
                      <Send size={18} /> Çağrı Yayınla
                    </button>
                    <button onClick={() => setShowMentorFormBuilder(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 justify-center border border-purple-400/50">
                      <Edit3 size={18} /> Formu Düzenle
                    </button>
                    <button onClick={() => alert('Başvurular Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 hover:shadow-lg transition-all hover:-translate-y-0.5 justify-center">
                      <Download size={18} /> Excel'e Aktar
                    </button>
                  </div>`;
  code = code.substring(0, startBtn) + newMentorButtons + code.substring(endBtn);
}

// For job buttons
const jobFind = 'Yeni İlan Ekle';
const jobIdx = code.indexOf(jobFind);
if(jobIdx > -1) {
  const startBtn = code.lastIndexOf('<div className="relative z-10', jobIdx);
  const endBtn = code.indexOf('</div>', jobIdx) + 6;
  const newJobButtons = `                  <div className="relative z-10 flex flex-wrap gap-3">
                    <button onClick={() => {
                      setEditingJob(null);
                      setJobForm({ title: '', company: '', type: 'TAM ZAMANLI', location: '', description: '', poster: '' });
                      setShowJobModal(true);
                    }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm justify-center">
                      <Briefcase size={18} /> Yeni İlan Ekle
                    </button>
                    <button onClick={() => setShowVoluntaryInternshipModal(true)} className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm justify-center">
                      <Globe size={18} /> Gönüllü Staj Duyurusu
                    </button>
                    <button onClick={() => alert('Başvuru Havuzu Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm justify-center">
                      <Download size={18} /> Havuzu Dışa Aktar
                    </button>
                  </div>`;
  code = code.substring(0, startBtn) + newJobButtons + code.substring(endBtn);
}

fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
