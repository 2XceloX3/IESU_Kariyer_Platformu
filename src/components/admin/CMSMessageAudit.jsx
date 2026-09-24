import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, ShieldCheck, ShieldAlert, Search, Filter, Users, User, Building2, 
  GraduationCap, Calendar, Clock, ArrowRight, Eye, ChevronRight, X, Send, 
  CheckCircle2, Download, RefreshCw, Sparkles, BookOpen, Lock, MessageCircle
} from 'lucide-react';
import PanelHeader from './PanelHeader';
import useAppStore from '../../store/useAppStore';

// Default initial communication records across university roles
const DEFAULT_CONVERSATIONS = [
  {
    user1: { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student', dept: 'Yazılım Mühendisliği', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', email: 'alperen@ogr.esenyurt.edu.tr' },
    user2: { id: 'CMP-001', name: 'Aselsan Savunma & Teknoloji', role: 'company', dept: 'Savunma Sanayii & Ar-Ge', avatar: 'https://ui-avatars.com/api/?name=Aselsan&background=0A2342&color=fff', email: 'ik@aselsan.com.tr' },
    messages: [
      { id: 'm1', senderId: 'STU-001', senderName: 'Alperen Yılmaz', text: 'Merhaba, platformda yayınladığınız Yazılım Mühendisliği Staj Programı hakkında bilgi almak istiyorum.', time: '23 Eyl 14:10' },
      { id: 'm2', senderId: 'CMP-001', senderName: 'Aselsan İK', text: 'Merhaba Alperen Bey, başvurunuz değerlendirme havuzumuza alındı. Transkript ve portfolyonuz inceleniyor.', time: '23 Eyl 14:45' },
      { id: 'm3', senderId: 'STU-001', senderName: 'Alperen Yılmaz', text: 'İlginiz için çok teşekkür ederim, GitHub projelerim ve güncel CV bilgilerim profilimde mevcuttur.', time: '23 Eyl 15:02' },
      { id: 'm4', senderId: 'CMP-001', senderName: 'Aselsan İK', text: 'Teşekkürler. Önümüzdeki hafta teknik mülakat daveti için İESÜ Kariyer Platformu üzerinden randevu iletilecektir.', time: '23 Eyl 15:30' }
    ]
  },
  {
    user1: { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student', dept: 'Yazılım Mühendisliği', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', email: 'alperen@ogr.esenyurt.edu.tr' },
    user2: { id: 'ACAD-001', name: 'Doç. Dr. Zeynep Çelik', role: 'academic', dept: 'Yazılım Mühendisliği Bölüm Bşk.', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Celik&background=4C1D95&color=fff', email: 'zeynep.celik@esenyurt.edu.tr' },
    messages: [
      { id: 'm5', senderId: 'STU-001', senderName: 'Alperen Yılmaz', text: 'Hocam merhaba, bitirme projesi kapsamında yapay zeka tabanlı kariyer asistanı projesi üzerine danışmanlık talep ediyorum.', time: '22 Eyl 11:20' },
      { id: 'm6', senderId: 'ACAD-001', senderName: 'Doç. Dr. Zeynep Çelik', text: 'Merhaba Alperen, projenin konusu oldukça güncel. Çarşamba günü saat 14:00 için ofis randevusu oluşturalım.', time: '22 Eyl 12:05' },
      { id: 'm7', senderId: 'STU-001', senderName: 'Alperen Yılmaz', text: 'Harika hocam, randevu sisteminden onayladım, teşekkür ederim.', time: '22 Eyl 12:15' }
    ]
  },
  {
    user1: { id: 'ALU-001', name: 'Caner Öztürk', role: 'alumni', dept: 'Yazılım Mühendisliği (2023)', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', email: 'caner.ozturk@alumni.esenyurt.edu.tr' },
    user2: { id: 'STU-001', name: 'Alperen Yılmaz', role: 'student', dept: 'Yazılım Mühendisliği', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', email: 'alperen@ogr.esenyurt.edu.tr' },
    messages: [
      { id: 'm8', senderId: 'STU-001', senderName: 'Alperen Yılmaz', text: 'Caner Bey merhaba, İESÜ Mezun Ağı üzerinden profilinize ulaştım. Frontend alanında mentörlük desteği alabilir miyim?', time: '21 Eyl 16:30' },
      { id: 'm9', senderId: 'ALU-001', senderName: 'Caner Öztürk', text: 'Selam Alperen! Tabii ki, Trendyol frontend mimarisi ve React/Next.js mülakat süreçleri hakkında haftalık seans yapabiliriz.', time: '21 Eyl 17:10' }
    ]
  },
  {
    user1: { id: 'STU-002', name: 'Ayşe Kaya', role: 'student', dept: 'Bilgisayar Mühendisliği', avatar: 'https://ui-avatars.com/api/?name=Ayse+Kaya&background=990000&color=fff', email: 'ayse.kaya@ogr.esenyurt.edu.tr' },
    user2: { id: 'CMP-002', name: 'Trendyol Tech Labs', role: 'company', dept: 'E-Ticaret & Bulut Bilişim', avatar: 'https://ui-avatars.com/api/?name=Trendyol&background=F97316&color=fff', email: 'talent@trendyol.com' },
    messages: [
      { id: 'm10', senderId: 'CMP-002', senderName: 'Trendyol Tech İK', text: 'Ayşe Hanım merhaba, hackathon ve kodlama yarışmasındaki başarınızı tebrik ederiz. Veri mühendisliği ekibimizle tanışmak ister misiniz?', time: '20 Eyl 09:30' },
      { id: 'm11', senderId: 'STU-002', senderName: 'Ayşe Kaya', text: 'Çok mutlu oldum, teklifiniz benim için büyük bir onur! Görüşme detaylarını heyecanla bekliyorum.', time: '20 Eyl 10:15' }
    ]
  },
  {
    user1: { id: 'ALU-002', name: 'Selin Arslan', role: 'alumni', dept: 'Yazılım Müh. - Senior Developer @ TechCorp', avatar: 'https://ui-avatars.com/api/?name=Selin+Arslan&background=059669&color=fff', email: 'selin@alumni.esenyurt.edu.tr' },
    user2: { id: 'STU-003', name: 'Mehmet Demir', role: 'student', dept: 'Endüstri Mühendisliği', avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir&background=990000&color=fff', email: 'mehmet@ogr.esenyurt.edu.tr' },
    messages: [
      { id: 'm12', senderId: 'STU-003', senderName: 'Mehmet Demir', text: 'Selin Hanım merhaba, tedarik zinciri optimizasyonunda veri analitiği kullanımı üzerine paylaştığınız yazıyı okudum, çok faydalıydı.', time: '19 Eyl 13:40' },
      { id: 'm13', senderId: 'ALU-002', senderName: 'Selin Arslan', text: 'Merhaba Mehmet, beğenmene sevindim. Python SimPy ve Pandas kütüphaneleriyle yaptığımız vaka çalışmalarını da paylaşabilirim.', time: '19 Eyl 14:15' }
    ]
  },
  {
    user1: { id: 'STU-004', name: 'Zeynep Kaya', role: 'student', dept: 'Bilgisayar Mühendisliği', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=990000&color=fff', email: 'zeynep.kaya@ogr.esenyurt.edu.tr' },
    user2: { id: 'CMP-003', name: 'Getir Core Platform', role: 'company', dept: 'Mikroservis Mimarileri', avatar: 'https://ui-avatars.com/api/?name=Getir&background=4C1D95&color=fff', email: 'careers@getir.com' },
    messages: [
      { id: 'm14', senderId: 'CMP-003', senderName: 'Getir Yetenek Ekibi', text: 'Zeynep Hanım merhaba, teknik değerlendirme süreciniz tamamlandı. Backend staj teklifimizi profilinize yönlendirdik.', time: '18 Eyl 11:00' },
      { id: 'm15', senderId: 'STU-004', senderName: 'Zeynep Kaya', text: 'Harika bir haber! İlgili sözleşme ve staj evraklarını hemen inceliyorum, teşekkürler.', time: '18 Eyl 11:35' }
    ]
  }
];

export default function CMSMessageAudit({ currentUser, setView }) {
  const userRole = useAppStore(state => state.userRole);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const academicStaff = useAppStore(state => state.academicStaff);
  const companies = useAppStore(state => state.companies);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatSearch, setChatSearch] = useState('');

  // Super Admin security check - strictly prioritize currentUser if passed
  const isSuperAdmin = currentUser 
    ? (currentUser.role === 'admin' || currentUser.id === 'admin_1513') 
    : (userRole === 'admin');

  // Aggregate all messaging threads across localStorage and in-memory states
  const allConversations = useMemo(() => {
    let list = [...DEFAULT_CONVERSATIONS];

    // Read candidate chats from localStorage
    try {
      const rawChats = localStorage.getItem('iesu_company_candidate_chats_v1');
      if (rawChats) {
        const parsed = JSON.parse(rawChats);
        if (Array.isArray(parsed)) {
          parsed.forEach(chat => {
            if (chat.messages && chat.messages.length > 0) {
              list.push({
                user1: {
                  id: chat.candidateId || 'cand_' + chat.id,
                  name: chat.candidateName || 'Öğrenci',
                  role: 'student',
                  dept: chat.candidateDept || 'İESÜ Öğrencisi',
                  avatar: chat.candidateAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.candidateName || 'A')}&background=0A2342&color=fff`,
                  email: `${(chat.candidateName || 'ogrenci').toLowerCase().replace(/\s+/g, '.')}@ogr.esenyurt.edu.tr`
                },
                user2: {
                  id: 'CMP-' + (chat.companyName || 'Kurumsal').replace(/\s+/g, '-'),
                  name: chat.companyName || 'Kurumsal Firma',
                  role: 'company',
                  dept: chat.candidateRole || 'İşe Alım & ATS',
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.companyName || 'F')}&background=0A2342&color=fff`,
                  email: `ik@${(chat.companyName || 'firma').toLowerCase().replace(/[^a-z]/g, '')}.com`
                },
                messages: (chat.messages || []).map(m => ({
                  id: m.id,
                  senderId: m.sender === 'company' ? ('CMP-' + (chat.companyName || 'Kurumsal')) : (chat.candidateId || 'cand'),
                  senderName: m.senderName || (m.sender === 'company' ? chat.companyName : chat.candidateName),
                  text: m.text,
                  time: m.time || 'Bugün'
                }))
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Audit conversations read error:', e);
    }

    return list;
  }, []);

  // Build aggregated user profiles with their messaging partners
  const aggregatedUsers = useMemo(() => {
    const userMap = new Map();

    const recordUser = (user, partner, msgs) => {
      if (!user || !user.id) return;
      if (!userMap.has(user.id)) {
        userMap.set(user.id, {
          id: user.id,
          name: user.name || 'İsimsiz Kullanıcı',
          role: user.role || 'student',
          dept: user.dept || 'Genel',
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0A2342&color=fff`,
          email: user.email || `${user.id.toLowerCase()}@esenyurt.edu.tr`,
          partners: new Map(),
          totalMessages: 0,
          lastActivity: 'Bugün 12:00'
        });
      }

      const entry = userMap.get(user.id);
      entry.totalMessages += (msgs || []).length;
      if (msgs && msgs.length > 0) {
        entry.lastActivity = msgs[msgs.length - 1].time || entry.lastActivity;
      }

      if (partner && partner.id) {
        if (!entry.partners.has(partner.id)) {
          entry.partners.set(partner.id, {
            partner,
            messages: []
          });
        }
        const partnerEntry = entry.partners.get(partner.id);
        partnerEntry.messages.push(...msgs);
      }
    };

    allConversations.forEach(conv => {
      recordUser(conv.user1, conv.user2, conv.messages);
      recordUser(conv.user2, conv.user1, conv.messages);
    });

    return Array.from(userMap.values()).map(u => ({
      ...u,
      partnerCount: u.partners.size,
      partnerList: Array.from(u.partners.values())
    })).sort((a, b) => b.totalMessages - a.totalMessages);
  }, [allConversations]);

  // Filtering users
  const filteredUsers = useMemo(() => {
    return aggregatedUsers.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [aggregatedUsers, searchQuery, roleFilter]);

  // When a user is selected, default to their first partner
  useEffect(() => {
    if (selectedUser && selectedUser.partnerList && selectedUser.partnerList.length > 0) {
      if (!selectedContact || !selectedUser.partners.has(selectedContact.partner?.id)) {
        setSelectedContact(selectedUser.partnerList[0]);
      }
    } else {
      setSelectedContact(null);
    }
  }, [selectedUser]);

  // Metrics
  const totalMessagesCount = useMemo(() => {
    return allConversations.reduce((acc, c) => acc + (c.messages?.length || 0), 0);
  }, [allConversations]);

  // Export Audit Logs to CSV
  const handleExportCSV = () => {
    try {
      const rows = [
        ['Kullanici_ID', 'Isim', 'Rol', 'Bolum_Firma', 'Muhatap_Sayisi', 'Toplam_Mesaj', 'Son_Aktivite']
      ];
      aggregatedUsers.forEach(u => {
        rows.push([
          u.id,
          `"${u.name}"`,
          u.role,
          `"${u.dept}"`,
          u.partnerCount,
          u.totalMessages,
          `"${u.lastActivity}"`
        ]);
      });
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(';')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `iesu_mesajlasma_denetim_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.toast?.success?.('Denetim Kayıtları CSV olarak başarıyla dışa aktarıldı.');
    } catch (e) {
      window.toast?.error?.('Kayıtlar dışa aktarılırken hata oluştu.');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-red-200 max-w-lg mx-auto my-12 shadow-md">
        <ShieldAlert size={44} className="text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-black text-gray-900">Erişim Yetkisi Bulunmuyor</h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Bu denetim masası yalnızca Süper Yönetici yetkisine sahip hesaplar tarafından görüntülenebilir.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PanelHeader 
          title="Merkezi Mesajlaşma & İletişim Denetim Masası" 
          sub="Platform genelindeki tüm kullanıcılar arası mesajlaşma trafiğini inceleyin, denetleyin ve arşiv kayıtlarını görüntüleyin." 
        />
        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Download size={14} /> Denetim Kayıtlarını İndir (CSV)
        </button>
      </div>

      {/* Top Privilege Badge */}
      <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Lock size={16} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 leading-tight">Süper Yönetici İletişim Denetim Yetkisi</h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Üniversite bünyesindeki tüm öğrenci, mezun, akademisyen ve kurumsal iletişim kayıtları yalnızca yönetim denetimindedir.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-900 font-black rounded-full text-[10px] uppercase tracking-wider">
          Yetkili Erişim
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Mesaj</span>
            <MessageSquare size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalMessagesCount}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Platform geneli arşivlenen</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aktif İletişimci</span>
            <Users size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{aggregatedUsers.length}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Kayıtlı mesajlaşan üye</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Görüşme Kanalı</span>
            <MessageCircle size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{allConversations.length}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Birebir ikili sohbet odası</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Denetim Durumu</span>
            <ShieldCheck size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">100%</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Güvenli merkezi arşiv</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İsim, bölüm, e-posta veya ID ara..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'student', label: 'Öğrenciler' },
              { id: 'alumni', label: 'Mezunlar' },
              { id: 'academic', label: 'Akademisyenler' },
              { id: 'company', label: 'İşverenler' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5">Kullanıcı</th>
                <th className="px-4 py-3.5">Rol / Kovan</th>
                <th className="px-4 py-3.5">Bölüm / Kurum</th>
                <th className="px-4 py-3.5 text-center">Görüşülen Kişi</th>
                <th className="px-4 py-3.5 text-center">Toplam Mesaj</th>
                <th className="px-4 py-3.5">Son İletişim</th>
                <th className="px-5 py-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map(user => {
                const roleBadge = 
                  user.role === 'student' ? { label: 'Öğrenci', bg: 'bg-red-50 text-[#990000] border-red-200' } :
                  user.role === 'alumni' ? { label: 'Mezun', bg: 'bg-emerald-50 text-[#059669] border-emerald-200' } :
                  user.role === 'academic' ? { label: 'Akademik', bg: 'bg-purple-50 text-[#7c3aed] border-purple-200' } :
                  user.role === 'company' ? { label: 'İşveren', bg: 'bg-blue-50 text-[#1e3a5f] border-blue-200' } :
                  { label: 'Yönetici', bg: 'bg-amber-50 text-amber-800 border-amber-200' };

                return (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt="" 
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 group-hover:text-blue-900 transition truncate">
                            {user.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${roleBadge.bg}`}>
                        {roleBadge.label}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 truncate max-w-xs">
                      {user.dept}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                        {user.partnerCount} Kişi
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="font-black px-2 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                        {user.totalMessages} Mesaj
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {user.lastActivity}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> Görüşmeleri İncele
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Arama kriterlerine uygun iletişim kaydı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL / DRAWER: SELECTED USER DEEP-DIVE CONVERSATIONS ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedUser.avatar} 
                  alt="" 
                  className="w-11 h-11 rounded-2xl border-2 border-amber-400/80 object-cover shadow-sm shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base text-white">{selectedUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                      {selectedUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{selectedUser.dept} • {selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/20">
                  {selectedUser.partnerCount} Muhatap • {selectedUser.totalMessages} Mesaj
                </span>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                  title="Kapat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Two-Pane Split Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
              
              {/* Left Pane: List of People They Messaged With ("Kiminle Mesajlaştığı") */}
              <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-3 border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-amber-600" />
                    Mesajlaştığı Kişiler ({selectedUser.partnerList.length})
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {selectedUser.partnerList.map(item => {
                    const isSelected = selectedContact?.partner?.id === item.partner?.id;
                    const lastMsg = item.messages?.[item.messages.length - 1];

                    return (
                      <div
                        key={item.partner.id}
                        onClick={() => setSelectedContact(item)}
                        className={`p-3 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={item.partner.avatar} 
                            alt="" 
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-xs text-slate-900 truncate">{item.partner.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{item.partner.dept}</p>
                          </div>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                            {item.partner.role}
                          </span>
                        </div>

                        {lastMsg && (
                          <p className="text-[11px] text-slate-600 line-clamp-1 font-medium bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            {lastMsg.text}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span>{item.messages.length} mesaj</span>
                          <span>{lastMsg?.time || 'Kayıtlı'}</span>
                        </div>
                      </div>
                    );
                  })}

                  {selectedUser.partnerList.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Görüşme kaydı bulunmuyor.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane: Complete Conversation Flow */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {selectedContact ? (
                  <>
                    {/* Active Conversation Top Banner */}
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={selectedContact.partner.avatar} 
                          alt="" 
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                              {selectedContact.partner.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                              {selectedContact.partner.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {selectedContact.partner.dept} • {selectedContact.partner.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                          <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                          <input 
                            type="text" 
                            value={chatSearch}
                            onChange={(e) => setChatSearch(e.target.value)}
                            placeholder="Sohbet içinde ara..." 
                            className="pl-7 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500 w-40"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 custom-scrollbar bg-slate-50/50">
                      {selectedContact.messages
                        .filter(m => !chatSearch || m.text.toLowerCase().includes(chatSearch.toLowerCase()))
                        .map(msg => {
                          const isSubjectSender = msg.senderId === selectedUser.id;

                          return (
                            <div 
                              key={msg.id} 
                              className={`flex flex-col ${isSubjectSender ? 'items-start' : 'items-end'}`}
                            >
                              <div className="flex items-center gap-1.5 px-1 mb-1">
                                <span className={`text-[10px] font-bold ${isSubjectSender ? 'text-amber-800' : 'text-blue-900'}`}>
                                  {isSubjectSender ? `[${selectedUser.name}]` : `[${selectedContact.partner.name}]`}
                                </span>
                                <span className="text-[10px] text-slate-400">{msg.time}</span>
                              </div>

                              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                                isSubjectSender
                                  ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-medium'
                                  : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-tr-none font-medium'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          );
                        })}

                      {selectedContact.messages.length === 0 && (
                        <div className="p-8 text-center text-xs text-slate-400">
                          Bu görüşmede henüz mesajlaşma kaydı bulunmuyor.
                        </div>
                      )}
                    </div>

                    {/* Bottom Audit Footer */}
                    <div className="p-3 bg-amber-50/80 border-t border-amber-200 flex items-center justify-between text-xs text-amber-950 shrink-0">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck size={15} className="text-amber-700" />
                        <span>Resmi Arşiv Kaydı: Bu görüşme Süper Yönetici denetimi altındadır.</span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        Toplam {selectedContact.messages.length} Mesaj Kaydedildi
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-2">
                    <MessageSquare size={36} className="text-slate-300" />
                    <h4 className="text-sm font-black text-slate-700">Görüşme Seçilmedi</h4>
                    <p className="text-xs text-slate-400">Yazışma detaylarını görüntülemek için sol taraftan bir kişi seçin.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
