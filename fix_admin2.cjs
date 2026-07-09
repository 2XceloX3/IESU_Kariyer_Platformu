const fs = require('fs');
let text = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const targetStr = '{orgChartMembers.length === 0 ? (';
const idx = text.indexOf(targetStr);

if (idx > -1) {
  // Let's truncate everything after this and manually append what is needed.
  // Wait, we need to keep the modals!
  const modal1Idx = text.indexOf('{/* Job Publishing Modal */}');
  const modal2Idx = text.indexOf('{/* Mentor Call Modal */}');
  let modals = '';
  if (modal1Idx > -1) {
    const endModal = text.lastIndexOf('</div>\n  );\n}');
    if (endModal > -1) {
      modals = text.substring(modal1Idx, endModal);
    }
  }

  const newText = `
                {orgChartMembers.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <Users className="text-blue-400" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Şema Boş</h4>
                    <p className="text-gray-500 max-w-md font-medium">Organizasyon şemasına henüz personel eklenmemiş. "Personel Ekle" butonunu kullanarak ekibinizi kurabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Tablo Gelecek */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ayarlar İskeleti */}
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

          {/* Yetkili Kadro Yönetimi */}
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

        </main>
      </div>
      
      ${modals}
      
    </div>
  );
}

// Helper Components
function SidebarButton({ active, onClick, icon, label, pendingCount, badge }) {
  return (
    <button 
      onClick={onClick} 
      className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-bold group border mb-1.5 \${
        active 
          ? 'bg-white/20 text-white border-white/30 backdrop-blur-md shadow-lg shadow-black/10' 
          : 'bg-transparent text-red-100/70 hover:text-white hover:bg-white/10 border-transparent'
      }\`}
    >
      <div className="flex items-center gap-3">
        <span className={\`\${active ? 'text-white' : 'text-red-200/50 group-hover:text-white transition-colors'}\`}>{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
      {(badge > 0 || pendingCount > 0) && (
        <span className="bg-black/20 text-white/90 text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge || pendingCount}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, color, icon, bg }) {
  return (
    <div className={\`bg-white p-6 rounded-3xl border border-gray-100 \${color} border-b-4 shadow-sm relative overflow-hidden group\`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className={\`text-4xl font-black mt-2 text-gray-900\`}>{value}</h3>
        </div>
        <div className={\`p-4 rounded-2xl \${bg}\`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
`;

  text = text.substring(0, idx) + newText;
  // Oh wait, my `newText` has a syntax error `+w newText`.
  text = text.replace('+w newText', '+ newText');
  fs.writeFileSync('src/components/AdminDashboard.jsx', text, 'utf8');
}
