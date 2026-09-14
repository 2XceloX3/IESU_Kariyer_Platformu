import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  X,
  Mail,
  Phone,
  FileText,
  Calendar,
  ShieldCheck,
  Edit3,
  RefreshCw,
  Award,
  Eye,
  Users,
  AlertCircle,
  Filter,
  Trash2
} from 'lucide-react';

const INITIAL_PARTNERSHIPS = [
  {
    id: 'PRT-2026-01',
    companyName: 'Aselsan A.Ş.',
    contactPerson: 'Dr. Mehmet Yılmaz',
    contactEmail: 'myilmaz@aselsan.com.tr',
    scope: 'Savunma Sanayii Özel Staj Kontenjanı & Ar-Ge Mentorluğu',
    slots: 25,
    signedDate: '2024-01-15',
    validUntil: '2027-06-30',
    status: 'Aktif Protokol',
    logo: 'https://ui-avatars.com/api/?name=Aselsan+AS&background=1e3a8a&color=fff',
    notes: 'Her akademik yıl için 25 Ar-Ge staj kontenjanı tahsis edilmiştir. Başarılı öğrencilere burs imkanı sağlanmaktadır.'
  },
  {
    id: 'PRT-2026-02',
    companyName: 'Baykar Teknoloji',
    contactPerson: 'Zeynep Kaya',
    contactEmail: 'z.kaya@baykartech.com',
    scope: 'Milli Teknoloji Hamlesi Burs & İstihdam Protokolü',
    slots: 30,
    signedDate: '2023-09-01',
    validUntil: '2028-12-31',
    status: 'Aktif Protokol',
    logo: 'https://ui-avatars.com/api/?name=Baykar+Teknoloji&background=0284c7&color=fff',
    notes: 'Havacılık ve yazılım mühendisliği öğrencilerine öncelikli uzun dönem aday mühendislik ve staj kontenjanı.'
  },
  {
    id: 'PRT-2026-03',
    companyName: 'Türk Hava Yolları (THY)',
    contactPerson: 'Ahmet Demir',
    contactEmail: 'ademir@thy.com',
    scope: 'Teknik Bakım & Yazılım Staj Programı',
    slots: 15,
    signedDate: '2023-05-10',
    validUntil: '2026-08-15',
    status: 'Yenileme Bekliyor',
    logo: 'https://ui-avatars.com/api/?name=THY&background=b91c1c&color=fff',
    notes: 'Protokol süresi dolmak üzere. İnsan Kaynakları ile ek kontenjan artırımı talebi görüşülüyor.'
  },
  {
    id: 'PRT-2026-04',
    companyName: 'Turkcell',
    contactPerson: 'Elif Şahin',
    contactEmail: 'elif.sahin@turkcell.com.tr',
    scope: 'GNCTRKCLC Kampüs & Bulut Bilişim Sertifikasyonu',
    slots: 20,
    signedDate: '2024-02-20',
    validUntil: '2027-02-20',
    status: 'Aktif Protokol',
    logo: 'https://ui-avatars.com/api/?name=Turkcell&background=eab308&color=fff',
    notes: 'Yazılım ve telekomünikasyon alanında sertifikasyon programları ve veri analitiği stajları dahildir.'
  },
  {
    id: 'PRT-2026-05',
    companyName: 'Trendyol',
    contactPerson: 'Caner Öztürk',
    contactEmail: 'cozturk@trendyol.com',
    scope: 'E-Ticaret & Veri Mühendisliği Yetiştirme Programı',
    slots: 18,
    signedDate: '2025-01-10',
    validUntil: '2026-12-31',
    status: 'Aktif Protokol',
    logo: 'https://ui-avatars.com/api/?name=Trendyol&background=f97316&color=fff',
    notes: 'Bootcamp mezunları ve dereceye giren öğrenciler için junior pozisyon mülakat önceliği tanımlanmıştır.'
  },
  {
    id: 'PRT-2026-06',
    companyName: 'Logo Yazılım',
    contactPerson: 'Selin Aydın',
    contactEmail: 'selin.aydin@logo.com.tr',
    scope: 'ERP Kurumsal Yazılım Uzmanlığı Akademisi',
    slots: 12,
    signedDate: '2025-11-01',
    validUntil: '2026-11-01',
    status: 'Görüşme Aşamasında',
    logo: 'https://ui-avatars.com/api/?name=Logo+Yazilim&background=4f46e5&color=fff',
    notes: 'Ön protokol taslağı Hukuk Müşavirliği incelemesinde. İmzalanması halinde 12 kontenjan açılacak.'
  },
  {
    id: 'PRT-2026-07',
    companyName: 'HAVELSAN',
    contactPerson: 'Murat Arslan',
    contactEmail: 'marslan@havelsan.com.tr',
    scope: 'Siber Güvenlik & Simülasyon Sistemleri Stajı',
    slots: 10,
    signedDate: '2022-04-15',
    validUntil: '2025-12-31',
    status: 'Süre Doldu',
    logo: 'https://ui-avatars.com/api/?name=HAVELSAN&background=0369a1&color=fff',
    notes: 'Protokol süresi tamamlandı. Yeni dönem revize maddeleriyle imzaya sunulacak.'
  },
  {
    id: 'PRT-2026-08',
    companyName: 'Arçelik',
    contactPerson: 'Deniz Koç',
    contactEmail: 'deniz.koc@arcelik.com',
    scope: 'Akıllı Ev Teknolojileri & IoT Staj Kontenjanı',
    slots: 15,
    signedDate: '2024-06-01',
    validUntil: '2027-06-01',
    status: 'Aktif Protokol',
    logo: 'https://ui-avatars.com/api/?name=Arcelik&background=dc2626&color=fff',
    notes: 'Üretim tesisleri ve Ar-Ge merkezlerinde 15 stajyer kontenjanı ayrılmıştır.'
  }
];

export default function CMSCorporatePartnerships() {
  const [partnerships, setPartnerships] = useState(INITIAL_PARTNERSHIPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState(null);

  // New Protocol Form State
  const [newProtocol, setNewProtocol] = useState({
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    scope: '',
    slots: 10,
    signedDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    status: 'Aktif Protokol',
    notes: ''
  });

  // Filtered List
  const filteredPartnerships = partnerships.filter((p) => {
    const matchesSearch =
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'Tümü' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats Calculations
  const totalProtocols = partnerships.length;
  const activeSlots = partnerships.reduce((acc, curr) => acc + Number(curr.slots || 0), 0);
  const inNegotiation = partnerships.filter((p) => p.status === 'Görüşme Aşamasında').length;
  const expiredOrPending = partnerships.filter(
    (p) => p.status === 'Süre Doldu' || p.status === 'Yenileme Bekliyor'
  ).length;

  // Status Badge Class Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aktif Protokol':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            Aktif Protokol
          </span>
        );
      case 'Yenileme Bekliyor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            Yenileme Bekliyor
          </span>
        );
      case 'Görüşme Aşamasında':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw size={12} className="text-blue-600 animate-spin-slow" />
            Görüşme Aşamasında
          </span>
        );
      case 'Süre Doldu':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={12} className="text-rose-600" />
            Süre Doldu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Add Handler
  const handleAddProtocol = (e) => {
    e.preventDefault();
    if (!newProtocol.companyName || !newProtocol.contactPerson || !newProtocol.scope) {
      if (window.toast?.error) {
        window.toast.error('Lütfen gerekli alanları doldurunuz (Şirket Adı, İletişim Sorumlusu, Protokol Kapsamı).');
      } else {
        alert('Lütfen gerekli alanları doldurunuz (Şirket Adı, İletişim Sorumlusu, Protokol Kapsamı).');
      }
      return;
    }

    const newId = `PRT-2026-${String(partnerships.length + 1).padStart(2, '0')}`;
    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newProtocol.companyName)}&background=0D8ABC&color=fff`;

    const item = {
      ...newProtocol,
      id: newId,
      logo: logoUrl,
      slots: Number(newProtocol.slots)
    };

    setPartnerships([item, ...partnerships]);
    setShowAddModal(false);
    setNewProtocol({
      companyName: '',
      contactPerson: '',
      contactEmail: '',
      scope: '',
      slots: 10,
      signedDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      status: 'Aktif Protokol',
      notes: ''
    });
  };

  // Renew Protocol Action
  const handleRenewProtocol = (id) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const validUntilStr = nextYear.toISOString().split('T')[0];

    const updated = partnerships.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Aktif Protokol',
          validUntil: validUntilStr
        };
      }
      return p;
    });

    setPartnerships(updated);
    if (selectedPartnership && selectedPartnership.id === id) {
      setSelectedPartnership({
        ...selectedPartnership,
        status: 'Aktif Protokol',
        validUntil: validUntilStr
      });
    }
  };

  // Edit Protocol Submit Handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPartnership) return;

    const updated = partnerships.map((p) => (p.id === editingPartnership.id ? editingPartnership : p));
    setPartnerships(updated);
    if (selectedPartnership && selectedPartnership.id === editingPartnership.id) {
      setSelectedPartnership(editingPartnership);
    }
    setEditingPartnership(null);
  };

  // Delete Protocol Action
  const handleDeleteProtocol = (id) => {
    if (window.confirm('Bu protokol kaydını silmek istediğinize emin misiniz?')) {
      setPartnerships(partnerships.filter((p) => p.id !== id));
      if (selectedPartnership && selectedPartnership.id === id) {
        setSelectedPartnership(null);
      }
    }
  };

  return (
    <div className="space-y-5 font-sans text-slate-800">
      {/* 1. Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-700 text-white flex items-center justify-center shadow-sm">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              Sektör Protokolleri & Kurumsal Ortaklıklar
            </h2>
            <p className="text-[11px] text-slate-500">
              Staj protokolleri, kontenjan anlaşmaları ve istihdam ortaklıkları
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-900 to-indigo-800 hover:from-blue-950 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus size={15} />
          <span>Yeni Protokol Ekle</span>
        </button>
      </div>

      {/* 3. Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Protocols */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Toplam Protokol
            </span>
            <div className="text-2xl font-black text-slate-900">{totalProtocols}</div>
            <p className="text-[10px] text-slate-500 font-medium">Kayıtlı Anlaşmalar</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-100">
            <ShieldCheck size={22} />
          </div>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-800"></div>
        </div>

        {/* Card 2: Active Slots */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Tahsis Edilen Kontenjan
            </span>
            <div className="text-2xl font-black text-emerald-700">{activeSlots}</div>
            <p className="text-[10px] text-slate-500 font-medium">Garanti Öğrenci Slotu</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users size={22} />
          </div>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
        </div>

        {/* Card 3: In Negotiation */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Görüşme Aşamasında
            </span>
            <div className="text-2xl font-black text-amber-600">{inNegotiation}</div>
            <p className="text-[10px] text-slate-500 font-medium">Taslak / İncelemede</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock size={22} />
          </div>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        </div>

        {/* Card 4: Expired / Renewal Pending */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Yenileme / Süre Doldu
            </span>
            <div className="text-2xl font-black text-rose-700">{expiredOrPending}</div>
            <p className="text-[10px] text-slate-500 font-medium">Takip Edilmesi Gereken</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
            <AlertCircle size={22} />
          </div>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600"></div>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Firma adı, protokol kapsamı veya yetkili ara..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-900 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills / Status Select */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
            <Filter size={14} />
            <span>Filtrele:</span>
          </div>
          {['Tümü', 'Aktif Protokol', 'Yenileme Bekliyor', 'Görüşme Aşamasında', 'Süre Doldu'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Partnership Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Firma / Kurum</th>
                <th className="py-3.5 px-4">İletişim Sorumlusu</th>
                <th className="py-3.5 px-4">Protokol Kapsamı</th>
                <th className="py-3.5 px-4 text-center">Kontenjan</th>
                <th className="py-3.5 px-4">İmza / Bitiş Tarihi</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPartnerships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                    <Building2 size={32} className="mx-auto mb-2 opacity-30" />
                    Kriterlere uygun protokol bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredPartnerships.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPartnership(p)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Firma */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.logo}
                          alt={p.companyName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                            {p.companyName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* İletişim Sorumlusu */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{p.contactPerson}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail size={10} />
                        <span>{p.contactEmail}</span>
                      </div>
                    </td>

                    {/* Protokol Kapsamı */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 text-[11px] leading-relaxed">
                        {p.scope}
                      </p>
                    </td>

                    {/* Kontenjan */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold rounded-lg border border-indigo-100">
                        <Users size={12} />
                        {p.slots}
                      </span>
                    </td>

                    {/* İmza / Bitiş Tarihi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{p.validUntil}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">İmza: {p.signedDate}</div>
                    </td>

                    {/* Durum */}
                    <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>

                    {/* İşlemler */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPartnership(p)}
                          title="Detay İncele"
                          className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setEditingPartnership(p)}
                          title="Düzenle"
                          className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProtocol(p.id)}
                          title="Sil"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="bg-slate-50/60 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Toplam {filteredPartnerships.length} protokol gösteriliyor</span>
          <span className="font-semibold text-slate-700">Aktif Slot Toplamı: {activeSlots} Kontenjan</span>
        </div>
      </div>

      {/* 6. Detail Popup Modal */}
      {selectedPartnership && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPartnership.logo}
                  alt={selectedPartnership.companyName}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedPartnership.companyName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedPartnership.id}
                    </span>
                    {getStatusBadge(selectedPartnership.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartnership(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Contact Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    İletişim Sorumlusu
                  </span>
                  <div className="font-bold text-slate-800">{selectedPartnership.contactPerson}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    E-Posta Adresi
                  </span>
                  <a
                    href={`mailto:${selectedPartnership.contactEmail}`}
                    className="font-medium text-blue-900 hover:underline flex items-center gap-1"
                  >
                    <Mail size={12} />
                    {selectedPartnership.contactEmail}
                  </a>
                </div>
              </div>

              {/* Scope */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-900" />
                  Protokol Kapsamı
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  {selectedPartnership.scope}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Kontenjan
                  </span>
                  <span className="text-base font-black text-indigo-700 flex items-center justify-center gap-1">
                    <Users size={15} />
                    {selectedPartnership.slots} Öğrenci
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    İmza Tarihi
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {selectedPartnership.signedDate}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Bitiş Tarihi
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {selectedPartnership.validUntil}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Açıklama & Özel Şartlar
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-600 leading-relaxed">
                  {selectedPartnership.notes || 'Özel bir not veya açıklama eklenmemiş.'}
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
              <button
                onClick={() => handleRenewProtocol(selectedPartnership.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <RefreshCw size={14} />
                <span>Protokolü Yenile (+1 Yıl)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPartnership(selectedPartnership);
                    setSelectedPartnership(null);
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setSelectedPartnership(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add New Protocol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <h3 className="text-base font-black text-slate-900">Yeni Sektör Protokolü Ekle</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProtocol} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Firma / Kurum Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Havelsan A.Ş."
                  value={newProtocol.companyName}
                  onChange={(e) => setNewProtocol({ ...newProtocol, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    İletişim Sorumlusu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ad Soyad"
                    value={newProtocol.contactPerson}
                    onChange={(e) => setNewProtocol({ ...newProtocol, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresi</label>
                  <input
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={newProtocol.contactEmail}
                    onChange={(e) => setNewProtocol({ ...newProtocol, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Protokol Kapsamı *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Staj kontenjanı, Ar-Ge iş birliği, burs imkanları vb..."
                  value={newProtocol.scope}
                  onChange={(e) => setNewProtocol({ ...newProtocol, scope: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kontenjan (Slot)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProtocol.slots}
                    onChange={(e) => setNewProtocol({ ...newProtocol, slots: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İmza Tarihi</label>
                  <input
                    type="date"
                    value={newProtocol.signedDate}
                    onChange={(e) => setNewProtocol({ ...newProtocol, signedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    required
                    value={newProtocol.validUntil}
                    onChange={(e) => setNewProtocol({ ...newProtocol, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Durum</label>
                <select
                  value={newProtocol.status}
                  onChange={(e) => setNewProtocol({ ...newProtocol, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                >
                  <option value="Aktif Protokol">Aktif Protokol</option>
                  <option value="Yenileme Bekliyor">Yenileme Bekliyor</option>
                  <option value="Görüşme Aşamasında">Görüşme Aşamasında</option>
                  <option value="Süre Doldu">Süre Doldu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Açıklama / Notlar</label>
                <textarea
                  rows={2}
                  placeholder="Ek notlar veya özel maddeler..."
                  value={newProtocol.notes}
                  onChange={(e) => setNewProtocol({ ...newProtocol, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Kaydet & Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Edit Protocol Modal */}
      {editingPartnership && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center">
                  <Edit3 size={16} />
                </div>
                <h3 className="text-base font-black text-slate-900">Protokolü Düzenle</h3>
              </div>
              <button
                onClick={() => setEditingPartnership(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Firma / Kurum Adı</label>
                <input
                  type="text"
                  required
                  value={editingPartnership.companyName}
                  onChange={(e) =>
                    setEditingPartnership({ ...editingPartnership, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İletişim Sorumlusu</label>
                  <input
                    type="text"
                    required
                    value={editingPartnership.contactPerson}
                    onChange={(e) =>
                      setEditingPartnership({ ...editingPartnership, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresi</label>
                  <input
                    type="email"
                    value={editingPartnership.contactEmail}
                    onChange={(e) =>
                      setEditingPartnership({ ...editingPartnership, contactEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Protokol Kapsamı</label>
                <textarea
                  rows={2}
                  required
                  value={editingPartnership.scope}
                  onChange={(e) =>
                    setEditingPartnership({ ...editingPartnership, scope: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kontenjan (Slot)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingPartnership.slots}
                    onChange={(e) =>
                      setEditingPartnership({ ...editingPartnership, slots: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İmza Tarihi</label>
                  <input
                    type="date"
                    value={editingPartnership.signedDate}
                    onChange={(e) =>
                      setEditingPartnership({ ...editingPartnership, signedDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    required
                    value={editingPartnership.validUntil}
                    onChange={(e) =>
                      setEditingPartnership({ ...editingPartnership, validUntil: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Durum</label>
                <select
                  value={editingPartnership.status}
                  onChange={(e) =>
                    setEditingPartnership({ ...editingPartnership, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900"
                >
                  <option value="Aktif Protokol">Aktif Protokol</option>
                  <option value="Yenileme Bekliyor">Yenileme Bekliyor</option>
                  <option value="Görüşme Aşamasında">Görüşme Aşamasında</option>
                  <option value="Süre Doldu">Süre Doldu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Açıklama / Notlar</label>
                <textarea
                  rows={2}
                  value={editingPartnership.notes}
                  onChange={(e) =>
                    setEditingPartnership({ ...editingPartnership, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPartnership(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
