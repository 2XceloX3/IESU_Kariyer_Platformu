import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Sparkles,
  ArrowUpDown,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import SafeAvatar from '../shared/SafeAvatar';

export default function CMSApplicationsPool({
  applications = [],
  setApplications,
  setSelectedUserId,
  setView,
  currentUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [companyFilter, setCompanyFilter] = useState('Tümü');
  const [selectedAppModal, setSelectedAppModal] = useState(null);

  // Distinct company list
  const companies = useMemo(() => {
    const list = Array.from(new Set(applications.map(a => a.company).filter(Boolean)));
    return ['Tümü', ...list];
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch =
        !searchQuery ||
        (app.applicantName && app.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.applicantDept && app.applicantDept.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.company && app.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.applicantEmail && app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.applicantPhone && app.applicantPhone.includes(searchQuery));

      const matchStatus =
        statusFilter === 'Tümü' ||
        (statusFilter === 'Beklemede' && (app.status === 'Beklemede' || !app.status)) ||
        app.status === statusFilter;

      const matchCompany =
        companyFilter === 'Tümü' || app.company === companyFilter;

      return matchSearch && matchStatus && matchCompany;
    });
  }, [applications, searchQuery, statusFilter, companyFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'Beklemede' || !a.status).length;
    const interview = applications.filter(a => a.status === 'Mülakat').length;
    const accepted = applications.filter(a => a.status === 'Kabul Edildi' || a.status === 'Onaylandı').length;
    const rejected = applications.filter(a => a.status === 'Reddedildi').length;
    return { total, pending, interview, accepted, rejected };
  }, [applications]);

  // Status changer
  const handleStatusChange = (appId, newStatus) => {
    if (setApplications) {
      setApplications(prev => (prev || []).map(a => a.id === appId ? { ...a, status: newStatus } : a));
    }
    if (selectedAppModal && selectedAppModal.id === appId) {
      setSelectedAppModal(prev => ({ ...prev, status: newStatus }));
    }
    window.toast?.success?.(`Başvuru durumu "${newStatus}" olarak güncellendi.`);
  };

  // Delete application
  const handleDelete = (appId) => {
    if (window.confirm("Bu başvuruyu havuzdan kaldırmak istediğinize emin misiniz?")) {
      if (setApplications) {
        setApplications(prev => (prev || []).filter(a => a.id !== appId));
      }
      if (selectedAppModal && selectedAppModal.id === appId) {
        setSelectedAppModal(null);
      }
      window.toast?.info?.("Başvuru havuzdan silindi.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = "\uFEFF"; // UTF-8 BOM
    csv += "İSTANBUL ESENYURT ÜNİVERSİTESİ - İLAN & STAJ BAŞVURU HAVUZU RAPORU\n";
    csv += `Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}\n\n`;
    csv += "Başvuru ID;Aday Adı;Bölüm;Pozisyon / İlan;Kurum / Firma;Durum;CV Türü;E-posta;Telefon;Ön Yazı;Başvuru Tarihi\n";

    filteredApps.forEach(app => {
      const cleanCover = (app.coverLetter || '').replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""');
      csv += `"${app.id}";"${app.applicantName || ''}";"${app.applicantDept || ''}";"${app.jobTitle || ''}";"${app.company || ''}";"${app.status || 'Beklemede'}";"${app.cvType || ''}";"${app.applicantEmail || ''}";"${app.applicantPhone || ''}";"${cleanCover}";"${app.date || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `IESU_Basvuru_Havuzu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.toast?.success?.("Başvuru listesi Excel CSV formatında başarıyla indirildi.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black shadow-sm">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              İlan & Staj Başvuru Havuzu
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {applications.length} Başvuru
              </span>
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Öğrencilerin ve mezunların iş/staj ilanlarına yaptığı tüm başvuruları tek bir havuzdan denetleyin ve yönetin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
            title="Excel formatında dışa aktar"
          >
            <Download size={15} /> Excel / CSV İndir (KVKK)
          </button>
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div 
          onClick={() => setStatusFilter('Tümü')} 
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${statusFilter === 'Tümü' ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-100'}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Toplam Başvuru</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.total}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Beklemede')} 
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${statusFilter === 'Beklemede' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-gray-100'}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1"><Clock size={12} /> Beklemede</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.pending}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Mülakat')} 
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${statusFilter === 'Mülakat' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-gray-100'}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1"><UserCheck size={12} /> Mülakat</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.interview}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Kabul Edildi')} 
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${statusFilter === 'Kabul Edildi' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-gray-100'}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Kabul Edilen</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.accepted}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Reddedildi')} 
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${statusFilter === 'Reddedildi' ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20' : 'border-gray-100'}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1"><XCircle size={12} /> Reddedilen</p>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH ─── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Aday, bölüm, ilan veya firma ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          )}
        </div>

        {/* Company filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Kurum / Firma:</span>
          <select
            aria-label="Firma Filtresi"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-amber-600"
          >
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto hide-scrollbar">
          {['Tümü', 'Beklemede', 'Mülakat', 'Kabul Edildi', 'Reddedildi'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === s
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── APPLICATIONS TABLE ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Briefcase size={28} />
            </div>
            <h4 className="text-base font-black text-gray-900">Eşleşen Başvuru Bulunamadı</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              {searchQuery || statusFilter !== 'Tümü' || companyFilter !== 'Tümü'
                ? 'Seçili filtrelere uygun başvuru bulunmamaktadır. Filtreleri temizleyip tekrar deneyin.'
                : 'Henüz sistemdeki iş veya staj ilanlarına yapılmış bir başvuru bulunmamaktadır.'}
            </p>
            {(searchQuery || statusFilter !== 'Tümü' || companyFilter !== 'Tümü') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('Tümü'); setCompanyFilter('Tümü'); }}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3.5">Aday Bilgisi</th>
                  <th className="px-4 py-3.5">Başvurulan İlan & Kurum</th>
                  <th className="px-4 py-3.5">İletişim</th>
                  <th className="px-4 py-3.5">CV & Ön Yazı</th>
                  <th className="px-4 py-3.5">Tarih</th>
                  <th className="px-4 py-3.5">Durum</th>
                  <th className="px-4 py-3.5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-amber-50/30 transition">
                    {/* Candidate */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <SafeAvatar
                          src={app.avatar}
                          alt={app.applicantName}
                          className="w-9 h-9 rounded-xl border border-gray-100 shadow-xs"
                          fallbackText={app.applicantName}
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{app.applicantName}</p>
                          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <GraduationCap size={11} className="text-gray-400" /> {app.applicantDept || 'Belirtilmedi'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Job & Company */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{app.jobTitle}</p>
                        <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Building2 size={11} /> {app.company}
                        </p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5 text-gray-600">
                      <div className="space-y-0.5 text-[11px]">
                        {app.applicantPhone && (
                          <a href={`tel:${app.applicantPhone}`} className="flex items-center gap-1 font-medium hover:text-amber-700">
                            <Phone size={10} className="text-gray-400" /> {app.applicantPhone}
                          </a>
                        )}
                        {app.applicantEmail && (
                          <a href={`mailto:${app.applicantEmail}`} className="flex items-center gap-1 font-medium hover:text-amber-700">
                            <Mail size={10} className="text-gray-400" /> {app.applicantEmail}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* CV & Cover */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold">
                          {app.cvType || 'KGM Akredite İESÜ Dijital CV'}
                        </span>
                        {app.coverLetter && (
                          <button
                            onClick={() => setSelectedAppModal(app)}
                            className="block text-[11px] text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
                          >
                            Ön Yazıyı İncele →
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap font-medium text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-gray-400" /> {app.date || 'Bugün'}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3.5">
                      <select
                        aria-label="Başvuru Durumu"
                        value={app.status || 'Beklemede'}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-black rounded-xl px-2.5 py-1.5 border-none outline-none cursor-pointer shadow-xs transition ${
                          app.status === 'Kabul Edildi' || app.status === 'Onaylandı'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Mülakat'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Reddedildi'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Mülakat">Mülakat Aşaması</option>
                        <option value="Kabul Edildi">Kabul Edildi</option>
                        <option value="Reddedildi">Reddedildi</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAppModal(app)}
                          className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          title="Detay & Ön Yazı"
                        >
                          <Eye size={15} />
                        </button>
                        {setSelectedUserId && setView && (
                          <button
                            onClick={() => {
                              setSelectedUserId(app.applicantId);
                              setView('user_profile');
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Aday Profili"
                          >
                            <ExternalLink size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Başvuruyu Kaldır"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── DETAIL & COVER LETTER MODAL ─── */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-gray-900 via-amber-950 to-gray-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-black">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Aday Başvuru Dosyası</h3>
                  <p className="text-[11px] text-amber-200 font-medium">KGM Yönetici Değerlendirme Masası</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-gray-700 custom-scrollbar">
              {/* Job Info */}
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Başvurulan Pozisyon</p>
                <h4 className="font-black text-gray-900 text-base mt-0.5">{selectedAppModal.jobTitle}</h4>
                <p className="text-xs text-gray-600 font-medium flex items-center gap-1 mt-1">
                  <Building2 size={13} className="text-amber-600" /> {selectedAppModal.company} • {selectedAppModal.date}
                </p>
              </div>

              {/* Candidate Info */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aday Kimlik & İletişim</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium block">Ad Soyad</span>
                    <span className="font-bold text-gray-900">{selectedAppModal.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Bölüm</span>
                    <span className="font-bold text-gray-900">{selectedAppModal.applicantDept || 'Belirtilmedi'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">Telefon</span>
                    <span className="font-bold text-gray-900">{selectedAppModal.applicantPhone || 'Yok'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">E-Posta</span>
                    <span className="font-bold text-gray-900">{selectedAppModal.applicantEmail || 'Yok'}</span>
                  </div>
                </div>
              </div>

              {/* CV Type */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-blue-900 font-bold flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" /> {selectedAppModal.cvType || 'KGM Akredite İESÜ Dijital CV'}
                </span>
                {setSelectedUserId && setView && (
                  <button
                    onClick={() => {
                      setSelectedAppModal(null);
                      setSelectedUserId(selectedAppModal.applicantId);
                      setView('user_profile');
                    }}
                    className="text-[11px] font-black text-blue-700 hover:underline cursor-pointer"
                  >
                    CV & Profili Aç →
                  </button>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <p className="text-xs font-black text-gray-800 mb-1.5 flex items-center gap-1">
                  <FileText size={14} className="text-amber-600" /> Adayın Ön Yazısı / Mesajı
                </p>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedAppModal.coverLetter || 'Ön yazı belirtilmemiş.'}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Başvuru Değerlendirme Durumu</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedAppModal.id, 'Mülakat')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedAppModal.status === 'Mülakat'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                    }`}
                  >
                    Mülakata Çağır
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAppModal.id, 'Kabul Edildi')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedAppModal.status === 'Kabul Edildi'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    Kabul Et
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAppModal.id, 'Reddedildi')}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedAppModal.status === 'Reddedildi'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-red-50 hover:bg-red-100 text-red-700'
                    }`}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
