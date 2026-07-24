import React, { useState } from 'react';
import { AlertTriangle, Trash2, CheckCircle2, Search, Filter, ShieldAlert, Archive } from 'lucide-react';

export default function DataCleanup({ 
  students, setStudents,
  alumni, setAlumni,
  companies, setCompanies,
  messages, setMessages,
  posts, setPosts,
  jobs, setJobs
}) {
  const [logs, setLogs] = useState([]);

  // Detection logic for demo/seed records
  const isDemoRecord = (record, type) => {
    if (record.source === 'demo_seed') return true;
    if (record.name && (record.name.includes('Demo') || record.name.includes('Test') || record.name.includes('Örnek'))) return true;
    if (record.email && (record.email.includes('example.com') || record.email.includes('test.com'))) return true;
    if (type === 'company' && record.name === '') return true;
    if (type === 'company' && record.id && typeof record.id === 'number') return true; // old generated companies had numeric IDs
    if ((type === 'student' || type === 'alumni') && record.id && typeof record.id === 'number') return true;
    return false;
  };

  const getSuspectedRecords = (arr, type) => {
    return (arr || []).filter(item => isDemoRecord(item, type));
  };

  const suspectedStudents = getSuspectedRecords(students, 'student');
  const suspectedAlumni = getSuspectedRecords(alumni, 'alumni');
  const suspectedCompanies = getSuspectedRecords(companies, 'company');
  const suspectedMessages = (messages || []).filter(m => m.source === 'demo_seed' || (m.content && m.content.includes('Demo')));
  
  const handleArchive = (type, recordsToArchive) => {
    const ids = recordsToArchive.map(r => r.id);
    const newLog = `Archived ${ids.length} suspected ${type} records.`;
    
    if (type === 'student') setStudents((students || []).map(s => ids.includes(s.id) ? { ...s, source: 'demo_seed' } : s));
    if (type === 'alumni') setAlumni((alumni || []).map(s => ids.includes(s.id) ? { ...s, source: 'demo_seed' } : s));
    if (type === 'company') setCompanies((companies || []).map(s => ids.includes(s.id) ? { ...s, source: 'demo_seed' } : s));
    if (type === 'message') setMessages((messages || []).filter(m => !ids.includes(m.id)));

    setLogs([`[${new Date().toLocaleTimeString()}] ${newLog}`, ...logs]);
    window.toast.success(`${ids.length} kayıt başarıyla demo olarak işaretlendi ve canlı arayüzden gizlendi.`);
  };

  const renderSection = (title, records, type) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
          {records.length > 0 ? <AlertTriangle className="text-amber-500" size={20} /> : <CheckCircle2 className="text-green-500" size={20} />}
          {title} ({records.length})
        </h3>
        {records.length > 0 && (
          <button 
            onClick={() => handleArchive(type, records)}
            className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Archive size={16} /> Hepsini Demo Olarak İşaretle (Gizle)
          </button>
        )}
      </div>

      {records.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID / İsim</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tespit Nedeni</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{r.name || r.content?.substring(0,20) || r.id}</td>
                  <td className="py-3 px-4 text-xs text-amber-600 font-medium">Demo Veri / Test Kaydı</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleArchive(type, [r])} className="text-gray-500 hover:text-amber-600 transition-colors">
                      <Archive size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500 font-medium">Bu kategoride şüpheli veya demo kayıt bulunamadı.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
          <ShieldAlert size={28} /> Demo Veri Temizliği (Bakım)
        </h2>
        <p className="text-amber-100 font-medium max-w-2xl text-sm">
          Sistemde önceden oluşturulmuş sahte, demo veya mock kayıtları tespit edip gizleyebilirsiniz. Gerçek verilerinize zarar verilmez. Şüpheli kayıtlar silinmez, sadece "Demo" olarak işaretlenerek canlı sayfalardan kaldırılır.
        </p>
      </div>

      {renderSection('Şüpheli Firma Kayıtları', suspectedCompanies, 'company')}
      {renderSection('Şüpheli Öğrenci Kayıtları', suspectedStudents, 'student')}
      {renderSection('Şüpheli Mezun Kayıtları', suspectedAlumni, 'alumni')}
      {renderSection('Şüpheli Mesajlar', suspectedMessages, 'message')}

      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="font-black text-white text-lg mb-4">Temizlik Günlüğü</h3>
          <div className="space-y-2 font-mono text-xs text-green-400 h-32 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
