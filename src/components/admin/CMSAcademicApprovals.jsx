import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Library, CheckCircle2, XCircle, ShieldCheck, ChevronDown, RefreshCw } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard, SearchFilterBar, Badge } from './AdminCMSLayout';

export default function CMSAcademicApprovals({ academicApprovals, setAcademicApprovals, students, setStudents, alumni, setAlumni }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pendingApprovals = (academicApprovals || []).filter(a => a.status === 'Beklemede').length;
  const approvedCount = (academicApprovals || []).filter(a => a.status === 'Onaylandı').length;
  const rejectedCount = (academicApprovals || []).filter(a => a.status === 'Reddedildi').length;

  const filteredApprovals = (academicApprovals || []).filter(a => 
    a.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.fieldChanged.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would update the actual user's record in the DB.
    // For now, we update the local arrays based on the fieldChanged.
    
    // Attempt to parse a standard key from the human-readable fieldChanged string
    let fieldKey = selectedRequest.fieldChanged.toLowerCase().includes('çap') ? 'capDept' : 
                   selectedRequest.fieldChanged.toLowerCase().includes('yandal') ? 'yandalDept' : 
                   selectedRequest.fieldChanged.toLowerCase().includes('staj') ? 'internshipStatus' : 'updatedField';

    if (selectedRequest.userType === 'student' && setStudents) {
      setStudents(prev => (prev || []).map(s => 
        s.id === selectedRequest.userId ? { ...s, [fieldKey]: selectedRequest.newValue } : s
      ));
    } else if (selectedRequest.userType === 'alumni' && setAlumni) {
      setAlumni(prev => (prev || []).map(a => 
        a.id === selectedRequest.userId ? { ...a, [fieldKey]: selectedRequest.newValue } : a
      ));
    }

    const updatedApprovals = (academicApprovals || []).map(a => 
      a.id === selectedRequest.id ? { ...a, status: 'Onaylandı' } : a
    );
    setAcademicApprovals(updatedApprovals);
    setSelectedRequest(null);
    window.toast.success('Talep onaylandı ve kullanıcı profili güncellendi.');
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    
    const updatedApprovals = (academicApprovals || []).map(a => 
      a.id === selectedRequest.id ? { ...a, status: 'Reddedildi' } : a
    );
    setAcademicApprovals(updatedApprovals);
    setSelectedRequest(null);
  };

  return (
    <AdminCMSLayout title="Akademik Bilgi Onayları" subtitle="Öğrenci ve mezunların akademik profil güncelleme taleplerini inceleyin.">
      
      {/* Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TopInfoCard icon={<ShieldCheck size={20} />} title="Bekleyen Talepler" value={pendingApprovals} color="orange" />
        <TopInfoCard icon={<CheckCircle2 size={20} />} title="Onaylanan" value={approvedCount} color="emerald" />
        <TopInfoCard icon={<XCircle size={20} />} title="Reddedilen" value={rejectedCount} color="red" />
        <TopInfoCard icon={<RefreshCw size={20} />} title="Toplam Talep" value={(academicApprovals || []).length} color="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sol Taraf: Liste */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-gray-50/50">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Kişi veya alan ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredApprovals.map(request => (
                <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
                  key={request.id} 
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${selectedRequest?.id === request.id ? 'bg-orange-50/50' : 'bg-white'}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                       <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.userName)}&background=random`} alt="User" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{request.userName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-gray-700">{request.userType === 'student' ? 'Öğrenci' : 'Mezun'}</span> • Değişen: {request.fieldChanged}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-500">{request.submittedDate}</span>
                    <Badge status={request.status} />
                  </div>
                </div>
              ))}
              
              {filteredApprovals.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="text-gray-500" size={24} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
                  <p className="text-sm text-gray-500">İnceleme bekleyen talep yok.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Form / Detay */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Talep Detayı</h3>
                <p className="text-xs text-gray-500 mt-0.5">Değişikliği incele ve onayla</p>
              </div>
            </div>

            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Kullanıcı</label>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.userName} ({selectedRequest.userType === 'student' ? 'Öğrenci' : 'Mezun'})</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Değiştirilmek İstenen Alan</label>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.fieldChanged}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl">
                    <label className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">Eski Değer</label>
                    <p className="text-sm font-medium text-gray-700 line-through">{selectedRequest.oldValue || 'Boş'}</p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Yeni Değer</label>
                    <p className="text-sm font-bold text-emerald-700">{selectedRequest.newValue}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Yönetici Notu (Opsiyonel)</label>
                  <textarea rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none focus:ring-2 focus:ring-orange-500/20" placeholder="Örn: E-Devlet belgesiyle doğrulandı..."></textarea>
                </div>

                {selectedRequest.status === 'Beklemede' ? (
                  <div className="flex gap-2 pt-4 border-t border-gray-100 mt-6">
                    <button onClick={handleReject} className="flex-1 px-4 py-2 text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition">Reddet</button>
                    <button onClick={handleApprove} className="flex-1 px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm">Değişikliği Onayla</button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center mt-6">
                    <p className="text-sm font-bold text-gray-900">Durum: <Badge status={selectedRequest.status} /></p>
                    <p className="text-xs text-gray-500 mt-1">Bu talep işleme alınmıştır.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-gray-400" size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Talep Seçilmedi</h3>
                <p className="text-xs text-gray-500 leading-relaxed">İncelemek için sol taraftaki listeden bir talep seçin.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminCMSLayout>
  );
}
