import React, { useState, useMemo } from 'react';
import { 
  Building2, Users, FileText, CheckCircle, XCircle, Clock, 
  Search, Plus, Filter, Download, ArrowUpRight, ShieldCheck, 
  Wallet, Trophy, ChevronRight, X, Eye, Edit3, Trash2, Calendar, MapPin
} from 'lucide-react';
import PanelHeader from './PanelHeader';
import { toast } from '../shared/Toast';
import { initialClubs, initialClubApplications } from '../../data/mockClubsData';

export default function CMSClubs({ 
  clubs = [], 
  setClubs, 
  clubApplications = [], 
  setClubApplications, 
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('active_clubs'); // 'active_clubs' | 'new_club_apps' | 'budget_apps'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedClubForView, setSelectedClubForView] = useState(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState(null);

  // Fallback to rich sample data if store pools are empty
  const allClubs = useMemo(() => (clubs && clubs.length > 0) ? clubs : initialClubs, [clubs]);
  const allApplications = useMemo(() => (clubApplications && clubApplications.length > 0) ? clubApplications : initialClubApplications, [clubApplications]);

  // Separate applications by type
  const newClubApps = useMemo(() => allApplications.filter(a => a.type === 'new_club' || !a.type), [allApplications]);
  const budgetApps = useMemo(() => allApplications.filter(a => a.type === 'event_budget'), [allApplications]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalClubs = allClubs.length;
    const totalMembers = allClubs.reduce((acc, c) => acc + (c.memberCount || 0), 0);
    const pendingClubApps = newClubApps.filter(a => a.status === 'pending').length;
    const pendingBudgetApps = budgetApps.filter(a => a.status === 'pending').length;
    const totalAllocatedBudget = allClubs.reduce((acc, c) => acc + (c.budget?.allocated || 0), 0);
    return { totalClubs, totalMembers, pendingClubApps, pendingBudgetApps, totalAllocatedBudget };
  }, [allClubs, newClubApps, budgetApps]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(allClubs.map(c => c.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [allClubs]);

  // Filtered active clubs
  const filteredClubs = useMemo(() => {
    return allClubs.filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.advisor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.president?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [allClubs, searchQuery, categoryFilter]);

  // Filtered new club apps
  const filteredNewClubApps = useMemo(() => {
    return newClubApps.filter(a => 
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.advisorName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [newClubApps, searchQuery]);

  // Filtered budget apps
  const filteredBudgetApps = useMemo(() => {
    return budgetApps.filter(a => 
      a.club?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [budgetApps, searchQuery]);

  // ACTION: Approve New Club Application
  const handleApproveClubApp = (app) => {
    const newClub = {
      id: 'CLUB-' + Date.now(),
      code: 'club_' + (app.name || 'yeni').toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: app.name,
      category: app.category || 'Genel',
      description: app.purpose || 'İstanbul Esenyurt Üniversitesi resmî öğrenci kulübü.',
      presidentId: app.userId || 'STU-NEW',
      president: {
        id: app.userId || 'STU-NEW',
        name: app.applicant || 'Kurucu Öğrenci',
        department: 'Öğrenci',
        year: '2. Sınıf'
      },
      advisor: app.advisorName || 'Atanmadı',
      status: 'Aktif',
      memberCount: app.estimatedMembers || 15,
      budget: {
        allocated: 25000,
        spent: 0,
        remaining: 25000,
        currency: '₺',
        fiscalYear: '2026-2027'
      },
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent((app.name || 'Kulüp').substring(0, 2))}&background=990000&color=fff`,
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      boardMembers: [
        { id: 'BM-1', name: app.applicant || 'Kurucu Başkan', role: 'Kulüp Başkanı', department: 'Öğrenci' },
        { id: 'BM-2', name: app.advisorName || 'Akademik Danışman', role: 'Danışman Öğretim Üyesi', department: 'Akademik' }
      ],
      events: [],
      announcements: [
        { id: 'ANN-1', title: 'Kulübümüz SKS Tarafından Resmen Onaylandı!', date: new Date().toLocaleDateString('tr-TR'), content: 'Yeni üyelerimizi aramızda görmekten mutluluk duyarız.' }
      ],
      budgetRequests: [],
      members: [
        { id: app.userId || 'STU-NEW', name: app.applicant || 'Kurucu Öğrenci', role: 'Kurucu Başkan', joinedDate: new Date().toLocaleDateString('tr-TR') }
      ]
    };

    if (setClubs) {
      setClubs([newClub, ...allClubs]);
    }
    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { ...a, status: 'approved' } : a));
    }
    toast.success(`"${app.name}" kulübü onaylandı ve aktif kulüpler havuzuna eklendi!`);
  };

  // ACTION: Reject New Club Application
  const handleRejectClubApp = (app) => {
    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a));
    }
    toast.info(`"${app.name}" başvurusu reddedildi.`);
  };

  // ACTION: Approve Budget / Event Application
  const handleApproveBudgetApp = (app) => {
    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { ...a, status: 'approved', approvalNote: 'SKS Daire Başkanlığı tarafından onaylandı.' } : a));
    }
    
    // Deduct / update in related club if exists
    if (setClubs && app.club) {
      setClubs(allClubs.map(c => {
        if (c.name === app.club || c.id === app.clubId) {
          const reqAmount = parseInt(String(app.amount).replace(/[^0-9]/g, '')) || 0;
          const currentSpent = c.budget?.spent || 0;
          const currentAllocated = c.budget?.allocated || 45000;
          const newSpent = currentSpent + reqAmount;
          return {
            ...c,
            budget: {
              ...c.budget,
              spent: newSpent,
              remaining: Math.max(0, currentAllocated - newSpent)
            },
            budgetRequests: (c.budgetRequests || []).map(r => r.id === app.id ? { ...r, status: 'approved', approvalNote: 'SKS Onayladı' } : r)
          };
        }
        return c;
      }));
    }
    toast.success(`"${app.eventName || app.title || 'Etkinlik'}" için bütçe talebi onaylandı!`);
  };

  // ACTION: Reject Budget Application
  const handleRejectBudgetApp = (app) => {
    const reason = prompt('Ret gerekçesini giriniz:', 'Bütçe limitleri veya etkinlik takvimi çakışması.');
    if (reason === null) return;

    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { ...a, status: 'rejected', approvalNote: reason } : a));
    }
    if (setClubs && app.club) {
      setClubs(allClubs.map(c => {
        if (c.name === app.club || c.id === app.clubId) {
          return {
            ...c,
            budgetRequests: (c.budgetRequests || []).map(r => r.id === app.id ? { ...r, status: 'rejected', approvalNote: reason } : r)
          };
        }
        return c;
      }));
    }
    toast.error('Bütçe talebi reddedildi.');
  };

  // ACTION: Transfer Club President
  const handleTransferPresident = (club) => {
    const newName = prompt(`"${club.name}" için yeni Kulüp Başkanı Adı ve Öğrenci No:`, club.president?.name || '');
    if (!newName) return;

    if (setClubs) {
      setClubs(allClubs.map(c => c.id === club.id ? {
        ...c,
        president: {
          ...(c.president || {}),
          name: newName
        }
      } : c));
    }
    toast.success('Kulüp başkanı başarıyla güncellendi.');
  };

  // ACTION: Update Budget
  const handleUpdateBudget = (club) => {
    const newBudgetStr = prompt(`"${club.name}" için tahsis edilecek yeni yıllık bütçe (TL):`, club.budget?.allocated || 45000);
    if (!newBudgetStr) return;
    const newBudget = parseInt(newBudgetStr);
    if (isNaN(newBudget) || newBudget < 0) {
      toast.error('Geçersiz bütçe tutarı.');
      return;
    }

    if (setClubs) {
      setClubs(allClubs.map(c => c.id === club.id ? {
        ...c,
        budget: {
          ...(c.budget || {}),
          allocated: newBudget,
          remaining: Math.max(0, newBudget - (c.budget?.spent || 0))
        }
      } : c));
    }
    toast.success('Yıllık bütçe başarıyla güncellendi.');
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in relative">
      <PanelHeader 
        title="Öğrenci Kulüpleri ve Bütçe Yönetimi (SKS)" 
        sub="Üniversitemiz bünyesindeki tüm öğrenci kulüpleri, yeni kurulum başvuruları (EK-1) ve etkinlik/bütçe onay havuzu."
      />

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Kulüpler</span>
            <Building2 className="text-[#990000]" size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900">{metrics.totalClubs} Kulüp</h3>
          <p className="text-xs text-slate-500 mt-1">SKS Onaylı Resmî Topluluk</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kayıtlı Öğrenci Üye</span>
            <Users className="text-emerald-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900">{metrics.totalMembers.toLocaleString('tr-TR')}</h3>
          <p className="text-xs text-slate-500 mt-1">Aktif Öğrenci Üyeliği</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kurulum Başvuruları</span>
            <FileText className="text-amber-500" size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900">{metrics.pendingClubApps} Bekleyen</h3>
          <p className="text-xs text-slate-500 mt-1">Değerlendirme Aşamasında</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Etkinlik & Bütçe Havuzu</span>
            <Wallet className="text-blue-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900">{metrics.pendingBudgetApps} Talep</h3>
          <p className="text-xs text-slate-500 mt-1">Onay Bekleyen Harcama</p>
        </div>
      </div>

      {/* 3 MAIN TABLE TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('active_clubs')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'active_clubs' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={16} />
            <span>Aktif Kulüpler & Bütçe ({allClubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_club_apps')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'new_club_apps' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            <span>Kurulum Başvuruları (EK-1)</span>
            {metrics.pendingClubApps > 0 && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {metrics.pendingClubApps}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('budget_apps')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'budget_apps' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet size={16} />
            <span>Etkinlik & Bütçe Onay Havuzu</span>
            {metrics.pendingBudgetApps > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {metrics.pendingBudgetApps}
              </span>
            )}
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Kulüp veya yetkili ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#990000] w-48 sm:w-60"
            />
          </div>

          {activeTab === 'active_clubs' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE CLUBS & BUDGET TABLE */}
      {/* ======================================================== */}
      {activeTab === 'active_clubs' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Kulüp Adı & Kategori</th>
                <th className="py-3.5 px-4">Danışman Öğretim Üyesi</th>
                <th className="py-3.5 px-4">Kulüp Başkanı</th>
                <th className="py-3.5 px-4 text-center">Üye Sayısı</th>
                <th className="py-3.5 px-4">Yıllık Bütçe / Kalan</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredClubs.map(club => (
                <tr key={club.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={club.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(club.name.substring(0, 2))}&background=990000&color=fff`} 
                        alt={club.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{club.name}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">{club.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {club.advisor || 'Atanmadı'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{club.president?.name || 'Belirtilmedi'}</div>
                    <div className="text-[11px] text-slate-400">{club.president?.department || ''}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-gray-900">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-full text-xs">
                      {club.memberCount || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-emerald-700">
                      {(club.budget?.remaining || 25000).toLocaleString('tr-TR')} ₺ Kalan
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Toplam: {(club.budget?.allocated || 45000).toLocaleString('tr-TR')} ₺
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {club.status || 'Aktif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedClubForView(club)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1"
                        title="Kulüp Detaylarını İncele"
                      >
                        <Eye size={13} /> İncele
                      </button>
                      <button
                        onClick={() => handleUpdateBudget(club)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-emerald-200"
                        title="Bütçeyi Düzenle"
                      >
                        <Wallet size={13} /> Bütçe
                      </button>
                      <button
                        onClick={() => handleTransferPresident(club)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-amber-200"
                        title="Kulüp Başkanlığını Devret"
                      >
                        Devret
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClubs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Arama kriterine uygun kulüp bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NEW CLUB APPLICATIONS TABLE (EK-1) */}
      {/* ======================================================== */}
      {activeTab === 'new_club_apps' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Başvuru Kodu / Tarih</th>
                <th className="py-3.5 px-4">Önerilen Kulüp Adı</th>
                <th className="py-3.5 px-4">Kurucu Öğrenci</th>
                <th className="py-3.5 px-4">Danışman Öğretim Üyesi</th>
                <th className="py-3.5 px-4">Kuruluş Amacı</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredNewClubApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-900 block">{app.id}</span>
                    <span className="text-[11px] text-slate-400">{app.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div>{app.name}</div>
                    <span className="text-[10px] text-slate-400 font-medium">{app.category || 'Bilim ve Teknoloji'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.applicant || 'Öğrenci'}</div>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {app.userId || '—'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-bold">
                    {app.advisorName || 'Atanmadı'}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-slate-600 line-clamp-2">{app.purpose || app.description || '—'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'approved' ? 'Onaylandı' : app.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {app.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveClubApp(app)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle size={13} /> Onayla
                        </button>
                        <button
                          onClick={() => handleRejectClubApp(app)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition text-[11px] flex items-center gap-1"
                        >
                          <XCircle size={13} /> Reddet
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-normal">Tamamlandı</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredNewClubApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Bekleyen kurulum başvurusu bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CLUB EVENT & BUDGET REQUEST POOL */}
      {/* ======================================================== */}
      {activeTab === 'budget_apps' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Talep No / Tarih</th>
                <th className="py-3.5 px-4">İlgili Kulüp Adı</th>
                <th className="py-3.5 px-4">Etkinlik Adı & Konumu</th>
                <th className="py-3.5 px-4">Talep Edilen Bütçe</th>
                <th className="py-3.5 px-4">Açıklama / Gerekçe</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBudgetApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-900 block">{app.id}</span>
                    <span className="text-[11px] text-slate-400">{app.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-gray-900">
                    {app.club || 'Kulüp'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.eventName || app.title}</div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin size={11} /> {app.location || 'Merkez Kampüs'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-blue-700 text-sm">
                    {app.amount}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-slate-600 line-clamp-2">{app.description || 'Kulüp etkinliği ve organizasyon desteği.'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'approved' ? 'Onaylandı' : app.status === 'rejected' ? 'Reddedildi' : 'İnceleniyor'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {app.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveBudgetApp(app)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle size={13} /> Onayla
                        </button>
                        <button
                          onClick={() => handleRejectBudgetApp(app)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition text-[11px] flex items-center gap-1"
                        >
                          <XCircle size={13} /> Reddet
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-normal">İşlendi</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBudgetApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Bekleyen bütçe onay talebi bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* CLUB INSPECTION DETAIL MODAL */}
      {/* ======================================================== */}
      {selectedClubForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedClubForView(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
            >
              <X size={20} />
            </button>

            {/* Club Header in Modal */}
            <div className="flex items-start gap-5 mb-6 pb-6 border-b border-slate-200">
              <img 
                src={selectedClubForView.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClubForView.name.substring(0, 2))}&background=990000&color=fff`} 
                alt={selectedClubForView.name} 
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <span className="px-2.5 py-0.5 bg-red-50 text-[#990000] text-xs font-black rounded-md uppercase tracking-wider">
                  {selectedClubForView.category}
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">{selectedClubForView.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Danışman: <strong>{selectedClubForView.advisor}</strong> • Başkan: <strong>{selectedClubForView.president?.name}</strong>
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kayıtlı Üye</span>
                <h4 className="text-xl font-black text-gray-900 mt-1">{selectedClubForView.memberCount || 0} Öğrenci</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tahsis Edilen Bütçe</span>
                <h4 className="text-xl font-black text-gray-900 mt-1">{(selectedClubForView.budget?.allocated || 45000).toLocaleString('tr-TR')} ₺</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kalan Harcanabilir</span>
                <h4 className="text-xl font-black text-emerald-700 mt-1">{(selectedClubForView.budget?.remaining || 25000).toLocaleString('tr-TR')} ₺</h4>
              </div>
            </div>

            {/* Club Events in Modal */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-[#990000]" />
                Planlanmış Kulüp Etkinlikleri ({(selectedClubForView.events || []).length})
              </h4>
              <div className="space-y-2">
                {(selectedClubForView.events || []).map((evt, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{evt.title}</span>
                      <span className="text-slate-400">{evt.date} • {evt.location}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {evt.status}
                    </span>
                  </div>
                ))}
                {(!selectedClubForView.events || selectedClubForView.events.length === 0) && (
                  <p className="text-xs text-slate-400 italic">Etkinlik kaydı bulunmuyor.</p>
                )}
              </div>
            </div>

            {/* Board Members in Modal */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Users size={16} className="text-[#990000]" />
                Yönetim Kurulu Üyeleri ({(selectedClubForView.boardMembers || []).length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(selectedClubForView.boardMembers || []).map((bm, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-black text-[#990000] text-[10px] uppercase block">{bm.role}</span>
                    <strong className="text-gray-900 text-sm">{bm.name}</strong>
                    <p className="text-slate-500">{bm.department}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedClubForView(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-black text-white font-bold text-xs rounded-xl transition"
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
