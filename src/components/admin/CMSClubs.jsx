import React, { useState, useMemo } from 'react';
import { 
  Building2, Users, FileText, CheckCircle, XCircle, Clock, 
  Search, Plus, Filter, Download, ArrowUpRight, ShieldCheck, 
  Wallet, Trophy, ChevronRight, X, Eye, Edit3, Trash2, Calendar, MapPin,
  Check, UserCheck, Shield, Sparkles, AlertCircle
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
  const [activeTab, setActiveTab] = useState('active_clubs'); // 'active_clubs' | 'new_club_apps' | 'budget_apps' | 'club_members'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedClubForView, setSelectedClubForView] = useState(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState(null);
  
  // Member monitoring filters
  const [memberClubFilter, setMemberClubFilter] = useState('all');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Fallback to rich sample data if store pools are empty
  const allClubs = useMemo(() => (clubs && clubs.length > 0) ? clubs : initialClubs, [clubs]);
  const allApplications = useMemo(() => (clubApplications && clubApplications.length > 0) ? clubApplications : initialClubApplications, [clubApplications]);

  // Separate applications by type
  const newClubApps = useMemo(() => allApplications.filter(a => a.type === 'new_club' || !a.type), [allApplications]);
  const budgetApps = useMemo(() => allApplications.filter(a => a.type === 'event_budget'), [allApplications]);

  // Aggregated all club members for SKS inspection table
  const allMembersFlat = useMemo(() => {
    const list = [];
    allClubs.forEach(club => {
      (club.members || []).forEach(member => {
        list.push({
          ...member,
          clubId: club.id,
          clubName: club.name,
          clubCategory: club.category,
          clubPresident: club.president?.name || 'Belirtilmedi'
        });
      });
    });
    return list;
  }, [allClubs]);

  // Filtered members for Tab 4
  const filteredMembers = useMemo(() => {
    return allMembersFlat.filter(m => {
      const matchClub = memberClubFilter === 'all' || m.clubId === memberClubFilter || m.clubName === memberClubFilter;
      const matchRole = memberRoleFilter === 'all' || (m.role && m.role.toLowerCase().includes(memberRoleFilter.toLowerCase()));
      const q = memberSearchQuery.toLowerCase();
      const matchSearch = !memberSearchQuery || 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.studentNo && m.studentNo.includes(q)) ||
        (m.tcKimlik && m.tcKimlik.includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q));
      return matchClub && matchRole && matchSearch;
    });
  }, [allMembersFlat, memberClubFilter, memberRoleFilter, memberSearchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalClubs = allClubs.length;
    const totalMembers = allMembersFlat.length || allClubs.reduce((acc, c) => acc + (c.memberCount || 0), 0);
    const pendingClubApps = newClubApps.filter(a => a.status === 'pending').length;
    const pendingBudgetApps = budgetApps.filter(a => a.status === 'pending').length;
    const totalAllocatedBudget = allClubs.reduce((acc, c) => acc + (c.budget?.allocated || 0), 0);
    return { totalClubs, totalMembers, pendingClubApps, pendingBudgetApps, totalAllocatedBudget };
  }, [allClubs, allMembersFlat, newClubApps, budgetApps]);

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
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.venue?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [budgetApps, searchQuery]);

  // ACTION: Export Members CSV
  const handleExportMembersCSV = () => {
    const headers = ['Ogrenci No', 'TC Kimlik No', 'Ad Soyad', 'Kulup', 'Kulup Rolu', 'Bolum', 'Sinif', 'Telefon', 'E-Posta', 'Kayit Tarihi', 'Durum'];
    const rows = filteredMembers.map(m => [
      m.studentNo || '',
      m.tcKimlik || '',
      m.name || '',
      m.clubName || '',
      m.role || 'Aktif Üye',
      m.department || '',
      m.grade || '',
      m.phone || '',
      m.email || '',
      m.joinedDate || '',
      m.status || 'Aktif'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IESU_SKS_Kulup_Uyeleri_Listesi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Kulüp üye listesi resmî CSV formatında dışa aktarıldı!');
  };

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
        studentNo: '2024010999',
        tcKimlik: '11111111111',
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
      authorizedOfficers: [
        { id: app.userId || 'STU-NEW', name: app.applicant || 'Kurucu Başkan', role: 'Kulüp Başkanı' }
      ],
      events: [],
      announcements: [
        { id: 'ANN-1', title: 'Kulübümüz SKS Tarafından Resmen Onaylandı!', date: new Date().toLocaleDateString('tr-TR'), content: 'Yeni üyelerimizi aramızda görmekten mutluluk duyarız.' }
      ],
      budgetRequests: [],
      members: [
        { 
          id: app.userId || 'STU-NEW', 
          studentNo: '2024010999', 
          tcKimlik: '11111111111', 
          name: app.applicant || 'Kurucu Öğrenci', 
          department: 'Öğrenci', 
          grade: '2. Sınıf', 
          role: 'Kurucu Başkan', 
          joinedDate: new Date().toLocaleDateString('tr-TR'),
          status: 'Aktif'
        }
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
    const reason = prompt('Kulüp kurulum ret gerekçesini giriniz:', 'Yönerge şartlarına uygun tüzük veya danışman onayı eksik.');
    if (reason === null) return;

    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { ...a, status: 'rejected', rejectionReason: reason } : a));
    }
    toast.error('Kulüp kurulum başvurusu reddedildi.');
  };

  // ACTION: Approve Venue & Event Application (SKS unit sets formal budget allocation)
  const handleApproveBudgetApp = (app) => {
    const targetClub = allClubs.find(c => c.name === app.club || c.id === app.clubId);
    const suggestedAmount = prompt(
      `"${app.eventName || app.title}" etkinliği için SKS tarafından tahsis edilecek bütçe tutarı (TL):`, 
      app.assignedBudget ? parseInt(app.assignedBudget) : (app.amount ? parseInt(app.amount) : 10000)
    );
    if (suggestedAmount === null) return;
    const finalAllocatedBudget = parseInt(suggestedAmount) || 0;

    if (setClubApplications) {
      setClubApplications(allApplications.map(a => a.id === app.id ? { 
        ...a, 
        status: 'approved',
        assignedBudget: `${finalAllocatedBudget.toLocaleString('tr-TR')} TL`,
        approvalNote: `SKS tarafından salon tahsisi ve ${finalAllocatedBudget.toLocaleString('tr-TR')} TL bütçe onaylandı.`
      } : a));
    }
    
    // Deduct / update in related club if exists
    if (setClubs && app.club) {
      setClubs(allClubs.map(c => {
        if (c.name === app.club || c.id === app.clubId) {
          const currentSpent = c.budget?.spent || 0;
          const currentAllocated = c.budget?.allocated || 45000;
          const newSpent = currentSpent + finalAllocatedBudget;
          return {
            ...c,
            budget: {
              ...c.budget,
              spent: newSpent,
              remaining: Math.max(0, currentAllocated - newSpent)
            },
            budgetRequests: (c.budgetRequests || []).map(r => r.id === app.id ? { 
              ...r, 
              status: 'approved', 
              approvalNote: `SKS Onayladı (${finalAllocatedBudget.toLocaleString('tr-TR')} TL tahsis)` 
            } : r)
          };
        }
        return c;
      }));
    }
    toast.success(`"${app.eventName || app.title || 'Etkinlik'}" için mekan tahsisi ve ${finalAllocatedBudget.toLocaleString('tr-TR')} TL bütçe onaylandı!`);
  };

  // ACTION: Reject Venue & Event Application
  const handleRejectBudgetApp = (app) => {
    const reason = prompt('Ret gerekçesini giriniz:', 'Salon takvimi doluluğu veya uygunluk kriteri eksikliği.');
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
    toast.error('Mekan & tahsis talebi reddedildi.');
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
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in relative font-sans">
      <PanelHeader 
        title="Öğrenci Kulüpleri, SKS Mekan Tahsisi & Kadro İzleme" 
        sub="Tüm aktif kulüpler, tüzükler, üye listeleri, EK-1 kurulum başvuruları ve SKS yer/bütçe onay havuzu."
      />

      {/* 4 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aktif Kulüpler</span>
            <Building2 className="text-[#990000]" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{metrics.totalClubs} Kulüp</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">SKS Onaylı Resmî Topluluk</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kayıtlı Öğrenci Üye</span>
            <Users className="text-emerald-700" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{metrics.totalMembers.toLocaleString('tr-TR')}</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">TC & No Doğrulanmış Kayıt</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kurulum Başvuruları</span>
            <FileText className="text-amber-600" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{metrics.pendingClubApps} Bekleyen</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">EK-1 Değerlendirme Süreci</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yer & Bütçe Havuzu</span>
            <Wallet className="text-blue-700" size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{metrics.pendingBudgetApps} Talep</h3>
          <p className="text-xs text-slate-600 font-medium mt-1">Mekan & Donanım Onayı</p>
        </div>
      </div>

      {/* 4 MAIN TABLE TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('active_clubs')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'active_clubs' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={16} />
            <span>Aktif Kulüpler & Bütçe ({allClubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('club_members')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'club_members' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={16} />
            <span>👥 Kulüp Kadroları & Üye İzleme ({allMembersFlat.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_club_apps')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'new_club_apps' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={16} />
            <span>EK-1 Kurulum ({newClubApps.length})</span>
            {metrics.pendingClubApps > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-black">
                {metrics.pendingClubApps}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('budget_apps')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'budget_apps' 
                ? 'bg-[#990000] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet size={16} />
            <span>SKS Mekan & Bütçe Onay ({budgetApps.length})</span>
            {metrics.pendingBudgetApps > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-black">
                {metrics.pendingBudgetApps}
              </span>
            )}
          </button>
        </div>

        {/* Global Search Bar */}
        {activeTab !== 'club_members' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kulüp veya danışman ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#990000] focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACTIVE CLUBS & OFFICIAL SKS BUDGET MANAGEMENT     */}
      {/* ======================================================== */}
      {activeTab === 'active_clubs' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Kulüp Adı & Kategori</th>
                <th className="py-3.5 px-4">Danışman Öğretim Üyesi</th>
                <th className="py-3.5 px-4">Kulüp Başkanı</th>
                <th className="py-3.5 px-4 text-center">Kayıtlı Üye</th>
                <th className="py-3.5 px-4">SKS Yıllık Bütçe / Kalan</th>
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
                      {club.members?.length || club.memberCount || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-black text-emerald-700">
                      {(club.budget?.remaining || 25000).toLocaleString('tr-TR')} ₺ Kalan
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tahsis: {(club.budget?.allocated || 45000).toLocaleString('tr-TR')} ₺ • Harcanan: {(club.budget?.spent || 0).toLocaleString('tr-TR')} ₺
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
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Kulüp Detaylarını İncele"
                      >
                        <Eye size={13} /> İncele
                      </button>
                      <button
                        onClick={() => handleUpdateBudget(club)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-emerald-200 cursor-pointer"
                        title="Bütçeyi Düzenle"
                      >
                        <Wallet size={13} /> SKS Bütçe
                      </button>
                      <button
                        onClick={() => handleTransferPresident(club)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-amber-200 cursor-pointer"
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
      {/* TAB 2: NEW CLUB APPLICATIONS TABLE (EK-1)                */}
      {/* ======================================================== */}
      {activeTab === 'new_club_apps' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Kulüp Başvuru Adı</th>
                <th className="py-3.5 px-4">Kurucu Öğrenci</th>
                <th className="py-3.5 px-4">Önerilen Danışman</th>
                <th className="py-3.5 px-4">Kategori & Amaç</th>
                <th className="py-3.5 px-4">Başvuru Tarihi</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">Karar İşlemleri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredNewClubApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                    {app.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.applicant}</div>
                    <div className="text-[11px] text-slate-400">No: {app.userId || 'STU-NEW'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {app.advisorName || 'Belirtilmedi'}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-bold text-[#990000] text-[10px] block uppercase">{app.category}</span>
                    <p className="text-slate-500 line-clamp-2 text-[11px]">{app.purpose || app.description}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {app.date}
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
                          onClick={() => handleApproveClubApp(app)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={13} /> Onayla (EK-1)
                        </button>
                        <button
                          onClick={() => handleRejectClubApp(app)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-rose-200 cursor-pointer"
                        >
                          <XCircle size={13} /> Reddet
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Karar Verildi</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredNewClubApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Bekleyen veya tamamlanmış kurulum başvurusu bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SKS VENUE, EVENT & ALLOCATION APPROVAL POOL       */}
      {/* ======================================================== */}
      {activeTab === 'budget_apps' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Etkinlik / Organizasyon</th>
                <th className="py-3.5 px-4">İlgili Kulüp</th>
                <th className="py-3.5 px-4">Talep Edilen Salon / Yer</th>
                <th className="py-3.5 px-4">Tarih & Saat Aralığı</th>
                <th className="py-3.5 px-4">Başvuran Yetkili</th>
                <th className="py-3.5 px-4">SKS Tahsis Tutarı</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">Tahsis & Onay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBudgetApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 text-sm">{app.eventName || app.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{app.description}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {app.club}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700">
                      {app.venue || app.requestedVenue || 'Merkez Kampüs'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {app.eventDate ? `${app.eventDate} (${app.startTime || '10:00'} - ${app.endTime || '17:00'})` : app.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{app.requesterName || app.requester || 'Kulüp Başkanı'}</span>
                    <span className="text-[10px] text-slate-400">{app.requesterRole || 'Yönetim Kurulu'}</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-700">
                    {app.assignedBudget || app.amount || '0 TL (Tahsis)'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'approved' ? 'Tahsis Onaylandı' : app.status === 'rejected' ? 'Reddedildi' : 'İnceleniyor'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAppForDetail(app)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Donanım ve detayları incele"
                      >
                        <Eye size={13} />
                      </button>
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveBudgetApp(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <CheckCircle size={13} /> Onayla
                          </button>
                          <button
                            onClick={() => handleRejectBudgetApp(app)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition text-[11px] flex items-center gap-1 border border-rose-200 cursor-pointer"
                          >
                            <XCircle size={13} /> Reddet
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Tamamlandı</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBudgetApps.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Yer ve bütçe tahsis talebi bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: COMPREHENSIVE CLUB MEMBERS MONITORING TABLE       */}
      {/* ======================================================== */}
      {activeTab === 'club_members' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Club Dropdown, Role Filter, Search & Export */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Club Dropdown */}
              <div>
                <select
                  value={memberClubFilter}
                  onChange={(e) => setMemberClubFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#990000] focus:ring-1 focus:ring-red-500/20"
                >
                  <option value="all">Tüm Kulüpler ({allClubs.length})</option>
                  {allClubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Role Dropdown */}
              <div>
                <select
                  value={memberRoleFilter}
                  onChange={(e) => setMemberRoleFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#990000] focus:ring-1 focus:ring-red-500/20"
                >
                  <option value="all">Tüm Roller</option>
                  <option value="Başkan">Kulüp Başkanı</option>
                  <option value="Başkan Yardımcısı">Başkan Yardımcısı</option>
                  <option value="Mali Sorumlu">Mali Sorumlu</option>
                  <option value="Genel Sekreter">Genel Sekreter</option>
                  <option value="Aktif Üye">Aktif Üye</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="İsim, No veya TC ile ara..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#990000] focus:ring-1 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
                {filteredMembers.length} Kayıtlı Üye
              </span>
              <button
                onClick={handleExportMembersCSV}
                className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download size={14} /> CSV / Excel İndir
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Öğrenci No & TC</th>
                  <th className="py-3.5 px-4">Ad Soyad</th>
                  <th className="py-3.5 px-4">Kayıtlı Kulüp</th>
                  <th className="py-3.5 px-4">Kulüp Rolü</th>
                  <th className="py-3.5 px-4">Fakülte & Bölüm</th>
                  <th className="py-3.5 px-4">Sınıf</th>
                  <th className="py-3.5 px-4">İletişim</th>
                  <th className="py-3.5 px-4">Katılım Tarihi</th>
                  <th className="py-3.5 px-4 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-gray-900 block">{m.studentNo || '2023010482'}</span>
                      <span className="text-[10px] text-slate-400">
                        TC: {m.tcKimlik ? `${m.tcKimlik.slice(0, 3)}*****${m.tcKimlik.slice(-2)}` : '39281749102'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {m.name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {m.clubName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.role?.includes('Başkan') ? 'bg-red-100 text-[#990000]' :
                        m.role?.includes('Mali') ? 'bg-amber-100 text-amber-800' :
                        m.role?.includes('Sekreter') ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {m.role || 'Aktif Üye'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {m.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {m.grade || '2. Sınıf'}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      <div>{m.email}</div>
                      <div>{m.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {m.joinedDate || '2024'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status || 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Filtre kriterlerine uygun kulüp üyesi bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CLUB INSPECTION DETAIL                            */}
      {/* ======================================================== */}
      {selectedClubForView && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedClubForView(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img 
                src={selectedClubForView.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClubForView.name.substring(0, 2))}&background=990000&color=fff`} 
                alt={selectedClubForView.name} 
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
              <div>
                <span className="text-xs font-black text-[#990000] uppercase tracking-wider">{selectedClubForView.category}</span>
                <h3 className="text-xl font-black text-slate-900">{selectedClubForView.name}</h3>
                <p className="text-xs text-slate-700 font-semibold">Kuruluş Yılı: {selectedClubForView.establishedYear || 2021} • {selectedClubForView.members?.length || selectedClubForView.memberCount || 0} Aktif Üye</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Kulüp Misyonu & Amacı</span>
                <p className="leading-relaxed text-slate-700 font-medium">{selectedClubForView.purpose || selectedClubForView.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Akademik Danışman</span>
                  <p className="font-bold text-slate-800">{selectedClubForView.advisor}</p>
                  <p className="text-slate-600 font-medium mt-1">{selectedClubForView.advisorEmail}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Kulüp Başkanı</span>
                  <p className="font-bold text-slate-800">{selectedClubForView.president?.name}</p>
                  <p className="text-slate-600 font-medium mt-1">{selectedClubForView.president?.email} • {selectedClubForView.president?.phone}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-2">SKS Bütçe Durumu</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-700 font-bold block">Yıllık Tahsis</span>
                    <span className="font-black text-sm text-slate-900">{(selectedClubForView.budget?.allocated || 45000).toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold block">Harcanan</span>
                    <span className="font-black text-sm text-amber-800">{(selectedClubForView.budget?.spent || 0).toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold block">Kalan Bakiye</span>
                    <span className="font-black text-sm text-emerald-800">{(selectedClubForView.budget?.remaining || 25000).toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              </div>

              {/* Authorized Officers */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-2">SKS Yetkili Görevlileri</span>
                <div className="space-y-1.5">
                  {(selectedClubForView.authorizedOfficers || []).map((off, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900">{off.name}</span>
                      <span className="text-[10px] bg-red-50 text-[#990000] font-bold px-2 py-0.5 rounded border border-red-100">{off.role}</span>
                    </div>
                  ))}
                  {(!selectedClubForView.authorizedOfficers || selectedClubForView.authorizedOfficers.length === 0) && (
                    <p className="text-slate-600 font-medium">Atanmış yetkili temsilci bulunamadı.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SKS VENUE REQUEST INSPECTION DETAIL               */}
      {/* ======================================================== */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedAppForDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-1 border border-blue-100">
                SKS Salon & Donanım İncelemesi
              </span>
              <h3 className="text-xl font-black text-slate-900">{selectedAppForDetail.eventName || selectedAppForDetail.title}</h3>
              <p className="text-xs text-slate-700 font-bold">{selectedAppForDetail.club}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Mekan & Saat</span>
                <p className="font-black text-slate-900 text-sm">{selectedAppForDetail.venue || selectedAppForDetail.requestedVenue || 'Merkez Kampüs'}</p>
                <p className="text-slate-700 font-medium mt-1">{selectedAppForDetail.eventDate || selectedAppForDetail.date} ({selectedAppForDetail.startTime || '10:00'} - {selectedAppForDetail.endTime || '17:00'})</p>
                {selectedAppForDetail.setupTime && <p className="text-slate-600 font-medium mt-0.5">Kurulum Saati: {selectedAppForDetail.setupTime}</p>}
              </div>

              {selectedAppForDetail.equipment && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1.5">Talep Edilen Malzeme & Donanım</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(selectedAppForDetail.equipment) ? selectedAppForDetail.equipment.map((eq, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 font-bold rounded-lg text-[11px] shadow-2xs">
                        ✓ {eq}
                      </span>
                    )) : (
                      <p className="text-slate-700 font-medium">{selectedAppForDetail.equipment}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Başvuran Yetkili & Açıklama</span>
                <p className="font-bold text-slate-900">{selectedAppForDetail.requesterName || selectedAppForDetail.requester || 'Kulüp Yetkilisi'}</p>
                <p className="text-slate-700 font-medium mt-1 leading-relaxed">{selectedAppForDetail.description}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">SKS Tahsis Edilen Bütçe</span>
                  <span className="text-[11px] text-emerald-850 font-medium">Birim tarafından karşılanacak resmi meblağ</span>
                </div>
                <span className="font-black text-emerald-800 text-base">{selectedAppForDetail.assignedBudget || selectedAppForDetail.amount || '0 TL'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
