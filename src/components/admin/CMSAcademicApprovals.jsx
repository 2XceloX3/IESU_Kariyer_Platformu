import React, { useState } from 'react';
import { 
  Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Library, CheckCircle2, 
  XCircle, ShieldCheck, ChevronDown, RefreshCw, Award, GraduationCap, AlertCircle, 
  Check, User, Clock, FileText, Sparkles, ArrowRight, ShieldAlert
} from 'lucide-react';
import AdminCMSLayout, { TopInfoCard, SearchFilterBar, Badge } from './AdminCMSLayout';

export default function CMSAcademicApprovals({ academicApprovals, setAcademicApprovals, students, setStudents, alumni, setAlumni }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('HEPSİ');

  const pendingApprovals = (academicApprovals || []).filter(a => a.status === 'Beklemede').length;
  const approvedCount = (academicApprovals || []).filter(a => a.status === 'Onaylandı').length;
  const rejectedCount = (academicApprovals || []).filter(a => a.status === 'Reddedildi').length;

  const filteredApprovals = (academicApprovals || []).filter(a => {
    const matchesSearch = a.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.fieldChanged.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'HEPSİ' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = () => {
    if (!selectedRequest) return;
    
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
    window.toast?.success?.('✅ Akademik talep başarıyla onaylandı ve öğrenci profili güncellendi.');
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    
    const updatedApprovals = (academicApprovals || []).map(a => 
      a.id === selectedRequest.id ? { ...a, status: 'Reddedildi' } : a
    );
    setAcademicApprovals(updatedApprovals);
    setSelectedRequest(null);
    window.toast?.info?.('Talep reddedildi.');
  };

  return (
    <div className="animate-fade-in space-y-6 font-sans">
      
      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-red-950/20">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
              <ShieldCheck size={28} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  Akademik Radar & Onay Yönetimi
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Resmi Doğrulama
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Akademik Profil Onay Merkezi
              </h1>
              <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                Öğrenci ve mezunların ÇAP, Yandal, Staj Durumu ve Belge Onay taleplerini inceleyin.
              </p>
            </div>
          </div>

          <div className="bg-amber-400/15 border border-amber-400/30 rounded-2xl p-3.5 max-w-xs backdrop-blur-md">
            <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <ShieldAlert size={14} /> GANO Kuralı Notu:
            </p>
            <p className="text-[10px] text-rose-100/90 leading-tight">
              GANO barajı (min 2.00) <b>yalnızca CBİKO Ulusal Staj Programı</b> başvurularında geçerlidir. Zorunlu & Gönüllü kurum stajlarında GANO kısıtlaması aranmaz.
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Bekleyen Talepler</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingApprovals}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Onaylanan Değişiklikler</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Reddedilen Talepler</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{rejectedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Toplam Talepler</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{(academicApprovals || []).length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <RefreshCw size={20} />
          </div>
        </div>
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Request List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <GraduationCap size={20} className="text-[#990000]" /> İnceleme Bekleyen Akademik Talepler
              </h3>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  {['HEPSİ', 'Beklemede', 'Onaylandı', 'Reddedildi'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === st ? 'bg-[#990000] text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 sm:w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2">
              {filteredApprovals.map(request => (
                <div 
                  key={request.id} 
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    selectedRequest?.id === request.id 
                      ? 'bg-rose-50/60 border-[#990000] shadow-sm' 
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950 text-white font-black text-xs flex items-center justify-center shrink-0 border border-white/20">
                      {request.userName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{request.userName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span className="font-bold text-[#990000]">{request.userType === 'student' ? 'Öğrenci' : 'Mezun'}</span> 
                        <span>•</span> 
                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px]">
                          {request.fieldChanged}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-600">{request.submittedDate}</span>
                    <Badge status={request.status} />
                  </div>
                </div>
              ))}

              {filteredApprovals.length === 0 && (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ShieldCheck className="text-slate-400 mx-auto mb-2" size={32} />
                  <h4 className="text-sm font-bold text-slate-700">Kayıt Bulunamadı</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Seçilen filtrelere uygun akademik onay talebi bulunmuyor.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right: Request Details & Action Form */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sticky top-24 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#990000] flex items-center justify-center font-bold border border-rose-100">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Talep Detay İnceleme</h3>
                <p className="text-xs text-slate-500">Değişikliği doğrulayın ve işleyin</p>
              </div>
            </div>

            {selectedRequest ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Kullanıcı Bilgisi</span>
                  <p className="text-sm font-black text-slate-900">{selectedRequest.userName}</p>
                  <p className="text-xs font-semibold text-slate-500">{selectedRequest.userType === 'student' ? 'Aktif Öğrenci' : 'Mezun Kullanıcı'}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Değiştirilmek İstenen Alan</span>
                  <span className="inline-block px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200/60">
                    {selectedRequest.fieldChanged}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">Eski Değer</span>
                    <p className="text-xs font-bold text-rose-900 line-through">{selectedRequest.oldValue || 'Belirtilmedi'}</p>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Yeni Talep</span>
                    <p className="text-xs font-black text-emerald-800">{selectedRequest.newValue}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Yönetici Notu & Açıklama</label>
                  <textarea 
                    rows="3" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#990000]" 
                    placeholder="Örn: Belge öğrenci işleri sisteminden teyit edildi..."
                  />
                </div>

                {selectedRequest.status === 'Beklemede' ? (
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button 
                      onClick={handleReject} 
                      className="flex-1 py-2.5 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                    >
                      Reddet
                    </button>
                    <button 
                      onClick={handleApprove} 
                      className="flex-1 py-2.5 text-xs font-black bg-[#990000] text-white hover:bg-rose-900 rounded-xl transition shadow-md shadow-rose-950/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Değişikliği Onayla
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                      İşlem Durumu: <Badge status={selectedRequest.status} />
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium mt-1">Bu talep idari kayıtlar tarafından sonuçlandırılmıştır.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Talep Seçilmedi</h4>
                <p className="text-[11px] text-slate-600 font-medium">İncelemek ve onay vermek için sol taraftaki listeden bir talep seçin.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

