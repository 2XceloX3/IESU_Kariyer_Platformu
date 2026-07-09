const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const search = '<Plus size={18} /> Personel Ekle';
const idx = content.indexOf(search);
if (idx > -1) {
  const endIdx = content.indexOf(')}', idx) + 2;
  const newText = `
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {['settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/60">
                <Settings size={48} className="text-gray-400 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Sistem Ayarları Modülü</h2>
              <button onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-xl hover:shadow-2xl">
                Ana Özete Dön
              </button>
            </div>
          )}

          {activeTab === 'staff_management' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Akademik Kadro ve Yetkiler</h3>
                </div>
                <button onClick={() => setShowStaffModal(true)} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-[0.98]">
                  <ShieldCheck size={18} /> Yeni Personel Ekle
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Personel Adı</th>
                        <th className="p-5 font-bold text-gray-500 text-[13px] uppercase tracking-wider">Yetki Seviyesi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5 font-bold text-gray-900">{staff.name}</td>
                          <td className="p-5">
                            <span className={\`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider \${
                              staff.role === 'super_admin' ? 'bg-red-100 text-red-700' : 
                              staff.role === 'content_admin' ? 'bg-blue-100 text-blue-700' : 
                              staff.role === 'mentor_admin' ? 'bg-purple-100 text-purple-700' : 
                              'bg-gray-100 text-gray-700'
                            }\`}>
                              {staff.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
`;
  content = content.substring(0, idx + search.length) + newText + content.substring(endIdx);
  fs.writeFileSync('src/components/AdminDashboard.jsx', content, 'utf8');
}
