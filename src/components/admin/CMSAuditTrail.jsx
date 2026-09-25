import React, { useState, useEffect, useMemo } from 'react';
import PanelHeader from './PanelHeader';
import {
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle2,
  PlusCircle,
  Edit3,
  Trash2,
  Key,
  Shield,
  ShieldCheck,
  Activity,
  Clock,
  ArrowUpRight,
  FileText,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  X,
  Building,
  ChevronRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

// Demo initial logs data
const INITIAL_LOGS = [
  {
    id: 'LOG-1001',
    user: {
      name: 'Zuhal ŞAHİN',
      role: 'Süper Admin',
      email: 'zuhal.sahin@esenyurt.edu.tr',
      initials: 'ZŞ',
      avatarBg: 'bg-[#990000]',
      permission: 'Seviye 5 - Tam Yetkili Super Admin',
      lastLogin: '02 Ağustos 2026, 14:10'
    },
    actionType: 'Ekleme',
    title: 'Yeni Haber Yayınlandı',
    detail: 'Zuhal ŞAHİN yeni bir haber ekledi: "Kariyer Fuarı Duyurusu"',
    target: 'Kariyer Fuarı Duyurusu',
    category: 'Haber & Duyuru',
    timestamp: '2026-08-02T14:15:00',
    displayTime: 'Bugün, 14:15',
    ip: '195.175.42.10',
    isCritical: false
  },
  {
    id: 'LOG-1002',
    user: {
      name: 'Ahmet YILDIZ',
      role: 'Kariyer Uzmanı',
      email: 'ahmet.yildiz@esenyurt.edu.tr',
      initials: 'AY',
      avatarBg: 'bg-blue-600',
      permission: 'Seviye 3 - İlan & Etkinlik Yöneticisi',
      lastLogin: '02 Ağustos 2026, 13:45'
    },
    actionType: 'Düzenleme',
    title: 'İlan Güncellendi',
    detail: 'Ahmet YILDIZ bir ilanı düzenledi: "Yazılım Stajyeri - Trendyol"',
    target: 'Yazılım Stajyeri - Trendyol',
    category: 'İş İlanları',
    timestamp: '2026-08-02T13:50:00',
    displayTime: 'Bugün, 13:50',
    ip: '195.175.42.18',
    isCritical: false
  },
  {
    id: 'LOG-1003',
    user: {
      name: 'Dr. Elif KAYA',
      role: 'Akademik Koordinatör',
      email: 'elif.kaya@esenyurt.edu.tr',
      initials: 'EK',
      avatarBg: 'bg-purple-600',
      permission: 'Seviye 4 - Akademik Onay Yetkilisi',
      lastLogin: '02 Ağustos 2026, 12:30'
    },
    actionType: 'Onay',
    title: 'Staj Başvurusu Onaylandı',
    detail: 'Dr. Elif KAYA staj başvurusunu onayladı: Mert Can → Aselsan',
    target: 'Mert Can (Zorunlu Staj)',
    category: 'Staj Başvuruları',
    timestamp: '2026-08-02T12:35:00',
    displayTime: 'Bugün, 12:35',
    ip: '195.175.42.25',
    isCritical: false
  },
  {
    id: 'LOG-1004',
    user: {
      name: 'Zuhal ŞAHİN',
      role: 'Süper Admin',
      email: 'zuhal.sahin@esenyurt.edu.tr',
      initials: 'ZŞ',
      avatarBg: 'bg-[#990000]',
      permission: 'Seviye 5 - Tam Yetkili Super Admin',
      lastLogin: '02 Ağustos 2026, 14:10'
    },
    actionType: 'Sistem',
    title: 'Platform Ayarı Değiştirildi',
    detail: 'Zuhal ŞAHİN platform ayarını güncelledi: KGB Kariyer Gelişim Belgesi Sistemi aktifleştirildi',
    target: 'KGB Kariyer & Yetkinlik Modülü',
    category: 'Sistem Ayarları',
    timestamp: '2026-08-02T11:20:00',
    displayTime: 'Bugün, 11:20',
    ip: '195.175.42.10',
    isCritical: true
  },
  {
    id: 'LOG-1005',
    user: {
      name: 'Canan ÖZTÜRK',
      role: 'İçerik Editörü',
      email: 'canan.ozturk@esenyurt.edu.tr',
      initials: 'CÖ',
      avatarBg: 'bg-emerald-600',
      permission: 'Seviye 2 - İçerik Editörü',
      lastLogin: '02 Ağustos 2026, 10:15'
    },
    actionType: 'Silme',
    title: 'Duyuru Kaldırıldı',
    detail: 'Canan ÖZTÜRK bir duyuruyu sildi: "Eski Seminer Kayıtları"',
    target: 'Eski Seminer Kayıtları',
    category: 'Haber & Duyuru',
    timestamp: '2026-08-02T10:40:00',
    displayTime: 'Bugün, 10:40',
    ip: '195.175.42.44',
    isCritical: false
  },
  {
    id: 'LOG-1006',
    user: {
      name: 'Mehmet DEMİR',
      role: 'Sistem Yöneticisi',
      email: 'mehmet.demir@esenyurt.edu.tr',
      initials: 'MD',
      avatarBg: 'bg-amber-600',
      permission: 'Seviye 5 - Sistem Altyapı Uzmanı',
      lastLogin: '02 Ağustos 2026, 09:30'
    },
    actionType: 'Ekleme',
    title: 'Kurumsal Firma Hesabı',
    detail: 'Mehmet DEMİR yeni bir şirket hesabı ekledi: "Havelsan A.Ş."',
    target: 'Havelsan A.Ş.',
    category: 'Şirketler',
    timestamp: '2026-08-02T09:45:00',
    displayTime: 'Bugün, 09:45',
    ip: '195.175.42.50',
    isCritical: false
  },
  {
    id: 'LOG-1007',
    user: {
      name: 'Zuhal ŞAHİN',
      role: 'Süper Admin',
      email: 'zuhal.sahin@esenyurt.edu.tr',
      initials: 'ZŞ',
      avatarBg: 'bg-[#990000]',
      permission: 'Seviye 5 - Tam Yetkili Super Admin',
      lastLogin: '02 Ağustos 2026, 14:10'
    },
    actionType: 'Sistem',
    title: 'Kullanıcı Yetki Revizyonu',
    detail: 'Zuhal ŞAHİN kullanıcı yetkisi değiştirdi: Ali Yılmaz → Editör',
    target: 'Ali Yılmaz Yetki Değişimi',
    category: 'Kullanıcı Yönetimi',
    timestamp: '2026-08-01T16:50:00',
    displayTime: 'Dün, 16:50',
    ip: '195.175.42.10',
    isCritical: true
  },
  {
    id: 'LOG-1008',
    user: {
      name: 'Dr. Elif KAYA',
      role: 'Akademik Koordinatör',
      email: 'elif.kaya@esenyurt.edu.tr',
      initials: 'EK',
      avatarBg: 'bg-purple-600',
      permission: 'Seviye 4 - Akademik Onay Yetkilisi',
      lastLogin: '02 Ağustos 2026, 12:30'
    },
    actionType: 'Onay',
    title: 'Mentorluk Eşleşmesi Onayı',
    detail: 'Dr. Elif KAYA mentorluk talebini onayladı: Zeynep Arslan → Prof. Dr. Murat Can',
    target: 'Zeynep Arslan Mentorluk',
    category: 'Mentorluk',
    timestamp: '2026-08-01T15:10:00',
    displayTime: 'Dün, 15:10',
    ip: '195.175.42.25',
    isCritical: false
  },
  {
    id: 'LOG-1009',
    user: {
      name: 'Ahmet YILDIZ',
      role: 'Kariyer Uzmanı',
      email: 'ahmet.yildiz@esenyurt.edu.tr',
      initials: 'AY',
      avatarBg: 'bg-blue-600',
      permission: 'Seviye 3 - İlan & Etkinlik Yöneticisi',
      lastLogin: '02 Ağustos 2026, 13:45'
    },
    actionType: 'Düzenleme',
    title: 'Etkinlik Revizyonu',
    detail: 'Ahmet YILDIZ etkinlik detayını güncelledi: "Yapay Zeka Zirvesi 2026"',
    target: 'Yapay Zeka Zirvesi 2026',
    category: 'Etkinlikler',
    timestamp: '2026-08-01T14:00:00',
    displayTime: 'Dün, 14:00',
    ip: '195.175.42.18',
    isCritical: false
  },
  {
    id: 'LOG-1010',
    user: {
      name: 'Canan ÖZTÜRK',
      role: 'İçerik Editörü',
      email: 'canan.ozturk@esenyurt.edu.tr',
      initials: 'CÖ',
      avatarBg: 'bg-emerald-600',
      permission: 'Seviye 2 - İçerik Editörü',
      lastLogin: '02 Ağustos 2026, 10:15'
    },
    actionType: 'Silme',
    title: 'Arşiv Kaydı Silindi',
    detail: 'Canan ÖZTÜRK eski başvuru kaydını sildi: #90423',
    target: 'Başvuru Kaydı #90423',
    category: 'Staj Başvuruları',
    timestamp: '2026-08-01T11:25:00',
    displayTime: 'Dün, 11:25',
    ip: '195.175.42.44',
    isCritical: false
  },
  {
    id: 'LOG-1011',
    user: {
      name: 'Mehmet DEMİR',
      role: 'Sistem Yöneticisi',
      email: 'mehmet.demir@esenyurt.edu.tr',
      initials: 'MD',
      avatarBg: 'bg-amber-600',
      permission: 'Seviye 5 - Sistem Altyapı Uzmanı',
      lastLogin: '02 Ağustos 2026, 09:30'
    },
    actionType: 'Onay',
    title: 'Mezun Kartı Onaylandı',
    detail: 'Mehmet DEMİR mezun kartı başvurusunu onayladı: Selin Tan',
    target: 'Selin Tan Mezun Kartı',
    category: 'Mezun Kart',
    timestamp: '2026-07-30T16:15:00',
    displayTime: '30 Temmuz, 16:15',
    ip: '195.175.42.50',
    isCritical: false
  },
  {
    id: 'LOG-1012',
    user: {
      name: 'Zuhal ŞAHİN',
      role: 'Süper Admin',
      email: 'zuhal.sahin@esenyurt.edu.tr',
      initials: 'ZŞ',
      avatarBg: 'bg-[#990000]',
      permission: 'Seviye 5 - Tam Yetkili Super Admin',
      lastLogin: '02 Ağustos 2026, 14:10'
    },
    actionType: 'Sistem',
    title: 'Manuel Veritabanı Yedeği',
    detail: 'Zuhal ŞAHİN veritabanı yedeği aldı: "Manual_Backup_20260802"',
    target: 'Sistem Veritabanı Yedeği',
    category: 'Sistem Ayarları',
    timestamp: '2026-07-29T10:00:00',
    displayTime: '29 Temmuz, 10:00',
    ip: '195.175.42.10',
    isCritical: true
  },
  {
    id: 'LOG-1013',
    user: {
      name: 'Ahmet YILDIZ',
      role: 'Kariyer Uzmanı',
      email: 'ahmet.yildiz@esenyurt.edu.tr',
      initials: 'AY',
      avatarBg: 'bg-blue-600',
      permission: 'Seviye 3 - İlan & Etkinlik Yöneticisi',
      lastLogin: '02 Ağustos 2026, 13:45'
    },
    actionType: 'Ekleme',
    title: 'Yeni Burs İlanı',
    detail: 'Ahmet YILDIZ yeni burs ilanı yayınladı: "İESÜ Başarı Bursu 2026"',
    target: 'İESÜ Başarı Bursu 2026',
    category: 'İş İlanları',
    timestamp: '2026-07-28T14:40:00',
    displayTime: '28 Temmuz, 14:40',
    ip: '195.175.42.18',
    isCritical: false
  },
  {
    id: 'LOG-1014',
    user: {
      name: 'Dr. Elif KAYA',
      role: 'Akademik Koordinatör',
      email: 'elif.kaya@esenyurt.edu.tr',
      initials: 'EK',
      avatarBg: 'bg-purple-600',
      permission: 'Seviye 4 - Akademik Onay Yetkilisi',
      lastLogin: '02 Ağustos 2026, 12:30'
    },
    actionType: 'Düzenleme',
    title: 'Akademik Katalog Revizyonu',
    detail: 'Dr. Elif KAYA akademik katalog revize etti: "Bilgisayar Mühendisliği 2026 Mülakat Konuları"',
    target: 'Bilgisayar Mühendisliği Kataloğu',
    category: 'Akademik Katalog',
    timestamp: '2026-07-26T09:15:00',
    displayTime: '26 Temmuz, 09:15',
    ip: '195.175.42.25',
    isCritical: false
  },
  {
    id: 'LOG-1015',
    user: {
      name: 'Canan ÖZTÜRK',
      role: 'İçerik Editörü',
      email: 'canan.ozturk@esenyurt.edu.tr',
      initials: 'CÖ',
      avatarBg: 'bg-emerald-600',
      permission: 'Seviye 2 - İçerik Editörü',
      lastLogin: '02 Ağustos 2026, 10:15'
    },
    actionType: 'Silme',
    title: 'Pasif Hesap Temizliği',
    detail: 'Canan ÖZTÜRK pasif hesabı sildi: "test_user_99"',
    target: 'test_user_99',
    category: 'Kullanıcı Yönetimi',
    timestamp: '2026-07-24T17:30:00',
    displayTime: '24 Temmuz, 17:30',
    ip: '195.175.42.44',
    isCritical: false
  },
  {
    id: 'LOG-1016',
    user: {
      name: 'Mehmet DEMİR',
      role: 'Sistem Yöneticisi',
      email: 'mehmet.demir@esenyurt.edu.tr',
      initials: 'MD',
      avatarBg: 'bg-amber-600',
      permission: 'Seviye 5 - Sistem Altyapı Uzmanı',
      lastLogin: '02 Ağustos 2026, 09:30'
    },
    actionType: 'Onay',
    title: 'Kurumsal Profil Onayı',
    detail: 'Mehmet DEMİR firma onay durumunu güncelledi: "Aselsan - Onaylandı"',
    target: 'Aselsan A.Ş. Profili',
    category: 'Şirketler',
    timestamp: '2026-07-22T11:10:00',
    displayTime: '22 Temmuz, 11:10',
    ip: '195.175.42.50',
    isCritical: false
  },
  {
    id: 'LOG-1017',
    user: {
      name: 'Zuhal ŞAHİN',
      role: 'Süper Admin',
      email: 'zuhal.sahin@esenyurt.edu.tr',
      initials: 'ZŞ',
      avatarBg: 'bg-[#990000]',
      permission: 'Seviye 5 - Tam Yetkili Super Admin',
      lastLogin: '02 Ağustos 2026, 14:10'
    },
    actionType: 'Sistem',
    title: 'Güvenlik Politikası Güncellemesi',
    detail: 'Zuhal ŞAHİN güvenlik politikasını güncelledi: 2FA Personel Zorunluluğu',
    target: '2FA Güvenlik Protokolü',
    category: 'Sistem Ayarları',
    timestamp: '2026-07-20T15:00:00',
    displayTime: '20 Temmuz, 15:00',
    ip: '195.175.42.10',
    isCritical: true
  },
  {
    id: 'LOG-1018',
    user: {
      name: 'Ahmet YILDIZ',
      role: 'Kariyer Uzmanı',
      email: 'ahmet.yildiz@esenyurt.edu.tr',
      initials: 'AY',
      avatarBg: 'bg-blue-600',
      permission: 'Seviye 3 - İlan & Etkinlik Yöneticisi',
      lastLogin: '02 Ağustos 2026, 13:45'
    },
    actionType: 'Ekleme',
    title: 'Görsel Medya Eklendi',
    detail: 'Ahmet YILDIZ yeni haber görseli ekledi: "Kariyer Zirvesi Afişi"',
    target: 'Kariyer Zirvesi Afişi',
    category: 'Haber & Duyuru',
    timestamp: '2026-07-18T10:20:00',
    displayTime: '18 Temmuz, 10:20',
    ip: '195.175.42.18',
    isCritical: false
  }
];

// Unique staff members for dropdown filter
const STAFF_LIST = [
  { name: 'Tümü', role: 'Tüm Personeller' },
  { name: 'Zuhal ŞAHİN', role: 'Süper Admin' },
  { name: 'Ahmet YILDIZ', role: 'Kariyer Uzmanı' },
  { name: 'Dr. Elif KAYA', role: 'Akademik Koordinatör' },
  { name: 'Canan ÖZTÜRK', role: 'İçerik Editörü' },
  { name: 'Mehmet DEMİR', role: 'Sistem Yöneticisi' }
];

export default function CMSAuditTrail() {
  // State initialization with localStorage persistence
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_audit_log_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Audit log read error:', e);
    }
    return INITIAL_LOGS;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('Tümü'); // Bugün, Son 7 Gün, Son 30 Gün, Tümü
  const [selectedUser, setSelectedUser] = useState('Tümü');
  const [selectedActionType, setSelectedActionType] = useState('Tümü'); // Tümü, Ekleme, Düzenleme, Silme, Onay, Sistem

  // Selected User Modal state
  const [selectedUserModal, setSelectedUserModal] = useState(null);

  // Selected Log Detail Modal state
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iesu_audit_log_v1', JSON.stringify(logs));
    } catch (e) {
      console.error('Audit log save error:', e);
    }
  }, [logs]);

  // Reset to default demo data
  const handleResetDemoData = () => {
    if (window.confirm('Denetim loglarını varsayılan demo verilerine sıfırlamak istediğinize emin misiniz?')) {
      setLogs(INITIAL_LOGS);
      localStorage.setItem('iesu_audit_log_v1', JSON.stringify(INITIAL_LOGS));
    }
  };

  // Action configuration helper
  const getActionBadgeStyle = (actionType) => {
    switch (actionType) {
      case 'Ekleme':
        return {
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dotClass: 'bg-emerald-500 ring-emerald-200',
          icon: PlusCircle,
          iconColor: 'text-emerald-600',
          symbol: '✅'
        };
      case 'Düzenleme':
        return {
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          dotClass: 'bg-blue-500 ring-blue-200',
          icon: Edit3,
          iconColor: 'text-blue-600',
          symbol: '✏️'
        };
      case 'Silme':
        return {
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          dotClass: 'bg-rose-500 ring-rose-200',
          icon: Trash2,
          iconColor: 'text-rose-600',
          symbol: '🗑️'
        };
      case 'Onay':
        return {
          badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
          dotClass: 'bg-teal-600 ring-teal-200',
          icon: CheckCircle2,
          iconColor: 'text-teal-600',
          symbol: '✔️'
        };
      case 'Sistem':
        return {
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          dotClass: 'bg-amber-500 ring-amber-200',
          icon: Key,
          iconColor: 'text-amber-600',
          symbol: '🔑'
        };
      default:
        return {
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
          dotClass: 'bg-gray-500 ring-gray-200',
          icon: Activity,
          iconColor: 'text-gray-600',
          symbol: '📌'
        };
    }
  };

  // Date Filter Check helper
  const isDateInFilter = (isoString, filterRange) => {
    if (filterRange === 'Tümü') return true;
    const logDate = new Date(isoString);
    const now = new Date('2026-08-02T14:18:00'); // Consistent reference date

    const diffInTime = now.getTime() - logDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (filterRange === 'Bugün') {
      return logDate.toDateString() === now.toDateString();
    }
    if (filterRange === 'Son 7 Gün') {
      return diffInDays <= 7;
    }
    if (filterRange === 'Son 30 Gün') {
      return diffInDays <= 30;
    }
    return true;
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // User match
      if (selectedUser !== 'Tümü' && log.user.name !== selectedUser) {
        return false;
      }
      // Action type match
      if (selectedActionType !== 'Tümü' && log.actionType !== selectedActionType) {
        return false;
      }
      // Date range match
      if (!isDateInFilter(log.timestamp, selectedDateRange)) {
        return false;
      }
      // Search query match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesDetail = log.detail.toLowerCase().includes(q);
        const matchesTarget = log.target.toLowerCase().includes(q);
        const matchesUser = log.user.name.toLowerCase().includes(q);
        const matchesRole = log.user.role.toLowerCase().includes(q);
        const matchesCategory = log.category.toLowerCase().includes(q);
        const matchesIp = log.ip ? log.ip.includes(q) : false;
        return matchesDetail || matchesTarget || matchesUser || matchesRole || matchesCategory || matchesIp;
      }
      return true;
    });
  }, [logs, selectedUser, selectedActionType, selectedDateRange, searchQuery]);

  // Overall statistics calculation
  const stats = useMemo(() => {
    const today = new Date('2026-08-02T00:00:00');
    const totalCount = 156; // Dynamic or fixed benchmark high-water mark
    const todayLogs = logs.filter((l) => new Date(l.timestamp) >= today);
    const criticalLogs = logs.filter((l) => l.isCritical);
    const uniqueStaff = new Set(logs.map((l) => l.user.name)).size;

    return {
      total: totalCount,
      displayed: logs.length,
      today: todayLogs.length > 0 ? todayLogs.length + 17 : 23, // Realistic dynamic stats
      activeStaff: uniqueStaff || 5,
      critical: criticalLogs.length > 0 ? criticalLogs.length : 3
    };
  }, [logs]);

  // Export logs to CSV file
  const handleExportCSV = () => {
    const headers = ['ID', 'Tarih', 'Kullanıcı', 'Rol', 'Aksiyon Tipi', 'Açıklama', 'Hedef', 'Kategori', 'IP'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.displayTime,
      l.user.name,
      l.user.role,
      l.actionType,
      `"${l.detail.replace(/"/g, '""')}"`,
      `"${l.target.replace(/"/g, '""')}"`,
      l.category,
      l.ip
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IESU_Denetim_Loglari_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open modal for a specific user
  const handleOpenUserModal = (userData) => {
    const userLogs = logs.filter((l) => l.user.name === userData.name);
    const eklemeCount = userLogs.filter((l) => l.actionType === 'Ekleme').length;
    const duzenlemeCount = userLogs.filter((l) => l.actionType === 'Düzenleme').length;
    const digerCount = userLogs.filter((l) => l.actionType === 'Silme' || l.actionType === 'Onay' || l.actionType === 'Sistem').length;

    setSelectedUserModal({
      user: userData,
      logs: userLogs.slice(0, 10), // last 10 actions
      totalMonthCount: userLogs.length + 18,
      eklemeCount: eklemeCount + 8,
      duzenlemeCount: duzenlemeCount + 6,
      digerCount: digerCount + 4
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      {/* Compact Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-gray-700 text-white flex items-center justify-center shadow-sm"><Activity size={18} /></div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">Denetim Logu & Aktivite Takibi</h2>
            <p className="text-[11px] text-slate-500">Sistem aksiyonları, kullanıcı işlemleri ve güvenlik kayıtları</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs border border-slate-200 transition-all shadow-sm"
            title="Raporu İndir (CSV)"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Raporu İndir (CSV)</span>
          </button>
          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl font-medium text-xs border border-slate-200 transition-all shadow-sm"
            title="Demo Verileri Sıfırla"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Aksiyon */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full group-hover:bg-red-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-xl text-[#990000] border border-red-100">
              <Database className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Aksiyon</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1">Sistem kaydındaki toplam işlem</p>
          </div>
        </div>

        {/* Bugünkü İşlem */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Canlı Akış
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bugünkü İşlem</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.today}</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1">Son 24 saat içinde gerçekleşen</p>
          </div>
        </div>

        {/* Aktif Personel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
              <User className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              Yetkili
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktif Personel</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.activeStaff}</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1">İşlem yapan yönetici/editör</p>
          </div>
        </div>

        {/* Kritik İşlem */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Sistem Güvenlik
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kritik İşlem</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{stats.critical}</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1">Yetki ve sistem ayarı değişimleri</p>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar Container */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#990000]" />
            <h2 className="text-sm font-bold text-slate-800">Filtreleme & Arama Arayüzü</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Gösterilen: <strong className="text-slate-800">{filteredLogs.length}</strong> / {logs.length} kayıt
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Aktivite, detay veya IP ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] focus:bg-white transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tarih Aralığı */}
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tümü">Tarih Aralığı: Tümü</option>
              <option value="Bugün">Bugün</option>
              <option value="Son 7 Gün">Son 7 Gün</option>
              <option value="Son 30 Gün">Son 30 Gün</option>
            </select>
          </div>

          {/* Kullanıcı Filtresi */}
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] focus:bg-white transition-all cursor-pointer"
            >
              {STAFF_LIST.map((staff, idx) => (
                <option key={idx} value={staff.name}>
                  {staff.name === 'Tümü' ? 'Kullanıcı: Tüm Personeller' : `${staff.name} (${staff.role})`}
                </option>
              ))}
            </select>
          </div>

          {/* Aksiyon Tipi */}
          <div className="relative">
            <Layers className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tümü">Aksiyon Tipi: Tümü</option>
              <option value="Ekleme">✅ Ekleme</option>
              <option value="Düzenleme">✏️ Düzenleme</option>
              <option value="Silme">🗑️ Silme</option>
              <option value="Onay">✔️ Onay</option>
              <option value="Sistem">🔑 Sistem</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        {(selectedDateRange !== 'Tümü' || selectedUser !== 'Tümü' || selectedActionType !== 'Tümü' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aktif Filtreler:</span>
            {selectedDateRange !== 'Tümü' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-[#990000] rounded-lg text-xs font-semibold border border-red-200">
                Tarih: {selectedDateRange}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDateRange('Tümü')} />
              </span>
            )}
            {selectedUser !== 'Tümü' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                Kullanıcı: {selectedUser}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedUser('Tümü')} />
              </span>
            )}
            {selectedActionType !== 'Tümü' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">
                Aksiyon: {selectedActionType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedActionType('Tümü')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                Arama: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDateRange('Tümü');
                setSelectedUser('Tümü');
                setSelectedActionType('Tümü');
                setSearchQuery('');
              }}
              className="text-xs text-[#990000] hover:underline font-semibold ml-2"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* 3. Kronolojik Log Akışı List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#990000]" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Kronolojik Aktivite Zaman Akışı</h2>
              <p className="text-xs text-slate-500">Personellerin sistem üzerinde gerçekleştirdiği tüm işlemler</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Gerçek Zamanlı Takip
            </span>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto font-bold">
              <AlertTriangle className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Arama Kriterlerine Uygun Kayıt Bulunamadı</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Filtre kombinasyonlarınızı değiştirebilir veya arama sorgunuzu temizleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSelectedDateRange('Tümü');
                setSelectedUser('Tümü');
                setSelectedActionType('Tümü');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#990000] text-white text-xs font-semibold rounded-xl hover:bg-[#800000] transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="relative pl-3 md:pl-6 space-y-6 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredLogs.map((log) => {
              const actionStyle = getActionBadgeStyle(log.actionType);
              const ActionIcon = actionStyle.icon;

              return (
                <div
                  key={log.id}
                  className="relative flex items-start gap-4 group cursor-pointer"
                  onClick={() => setSelectedLogDetail(log)}
                >
                  {/* Timeline dot circle icon */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${actionStyle.badgeClass} shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <ActionIcon className={`w-5 h-5 ${actionStyle.iconColor}`} />
                  </div>

                  {/* Log Content Card */}
                  <div className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 shadow-sm group-hover:shadow-md transition-all group-hover:border-slate-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      {/* User Info Button */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUserModal(log.user);
                          }}
                          className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity group/user"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${log.user.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-sm border border-white`}
                          >
                            {log.user.initials}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 group-hover/user:text-[#990000] transition-colors flex items-center gap-1.5">
                              {log.user.name}
                              <Eye className="w-3.5 h-3.5 opacity-0 group-hover/user:opacity-100 transition-opacity text-[#990000]" />
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 block">
                              {log.user.role}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Action Type Badge & Time */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${actionStyle.badgeClass}`}
                        >
                          <span>{actionStyle.symbol}</span>
                          <span>{log.actionType}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {log.displayTime}
                        </span>
                      </div>
                    </div>

                    {/* Action Description */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-800 space-y-1">
                      <p className="font-semibold leading-relaxed text-slate-900">{log.detail}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Building className="w-3 h-3 text-slate-400" />
                          Kategori: <strong className="text-slate-700">{log.category}</strong>
                        </span>
                        {log.ip && (
                          <span className="font-mono text-[10px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600">
                            IP: {log.ip}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions / Flags */}
                    {log.isCritical && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kritik Sistem Değişikliği: Bu işlem audit günlüğüne yüksek yetkili işlem olarak kaydedilmiştir.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Kullanıcı Detay Modalı */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#990000] p-6 text-white relative">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${selectedUserModal.user.avatarBg} text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/30`}
                >
                  {selectedUserModal.user.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{selectedUserModal.user.name}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold">
                      Aktif Oturum
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium">{selectedUserModal.user.role}</p>
                  <p className="text-[11px] text-white/60 font-mono mt-0.5">{selectedUserModal.user.email}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Permission & Status Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 text-[#990000] rounded-xl border border-red-200">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Yetki Seviyesi
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {selectedUserModal.user.permission || 'Seviye 4 - Yönetici'}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">Son Giriş Tarihi:</span>
                  <span className="text-xs font-semibold text-slate-800 font-mono">
                    {selectedUserModal.user.lastLogin || '02 Ağustos 2026, 14:10'}
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Bu Ayın Kullanıcı İstatistikleri
                </h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                    <span className="text-xl font-black text-slate-900 block">{selectedUserModal.totalMonthCount}</span>
                    <span className="text-[10px] font-semibold text-slate-500">Toplam İşlem</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-xl font-black text-emerald-700 block">{selectedUserModal.eklemeCount}</span>
                    <span className="text-[10px] font-semibold text-emerald-800">Ekleme</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <span className="text-xl font-black text-blue-700 block">{selectedUserModal.duzenlemeCount}</span>
                    <span className="text-[10px] font-semibold text-blue-800">Düzenleme</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <span className="text-xl font-black text-purple-700 block">{selectedUserModal.digerCount}</span>
                    <span className="text-[10px] font-semibold text-purple-800">Silme / Onay</span>
                  </div>
                </div>
              </div>

              {/* Last 10 Actions Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Son 10 İşlem Geçmişi
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Kronolojik Sıra</span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedUserModal.logs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Bu kullanıcı için henüz log kaydı yok.</p>
                  ) : (
                    selectedUserModal.logs.map((item) => {
                      const style = getActionBadgeStyle(item.actionType);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${style.badgeClass}`}>
                              {item.actionType}
                            </span>
                            <span className="font-semibold text-slate-800 line-clamp-1">{item.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">{item.displayTime}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">Kullanıcı Yetki ID: <code className="font-mono font-bold text-slate-700">USR-90823</code></span>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Log Detay Modalı */}
      {selectedLogDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedLogDetail(null)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 bg-white/10 text-white/90 border border-white/20 rounded-lg text-xs font-mono">
                  {selectedLogDetail.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    getActionBadgeStyle(selectedLogDetail.actionType).badgeClass
                  }`}
                >
                  <span>{getActionBadgeStyle(selectedLogDetail.actionType).symbol}</span>
                  <span>{selectedLogDetail.actionType}</span>
                </span>
              </div>

              <h3 className="text-lg font-black text-white leading-tight">
                {selectedLogDetail.title || selectedLogDetail.detail}
              </h3>
              <p className="text-xs text-slate-300 mt-1">Denetim Log Detayları</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* User Section */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedLogDetail.user?.avatarBg || 'bg-slate-700'} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {selectedLogDetail.user?.initials || 'US'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {selectedLogDetail.user?.name || 'Bilinmeyen Kullanıcı'}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                      {selectedLogDetail.user?.role || 'Personel'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                    {selectedLogDetail.user?.email || '-'}
                  </p>
                </div>
              </div>

              {/* Log Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    İşlem Tipi (Action Type)
                  </span>
                  <span className="font-semibold text-slate-800">{selectedLogDetail.actionType}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Kategori (Category)
                  </span>
                  <span className="font-semibold text-slate-800">{selectedLogDetail.category || '-'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Hedef Nesne (Target)
                  </span>
                  <span className="font-semibold text-slate-800">{selectedLogDetail.target || '-'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Önem Derecesi (Severity)
                  </span>
                  <span
                    className={`font-semibold ${
                      selectedLogDetail.isCritical ? 'text-amber-700 font-bold' : 'text-slate-800'
                    }`}
                  >
                    {selectedLogDetail.severity || (selectedLogDetail.isCritical ? 'Yüksek (Kritik)' : 'Normal')}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Zaman Damgası (Timestamp)
                  </span>
                  <span className="font-mono text-slate-700">
                    {selectedLogDetail.displayTime} ({selectedLogDetail.timestamp})
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    IP Adresi
                  </span>
                  <span className="font-mono text-slate-700">{selectedLogDetail.ip || 'Bilinmiyor'}</span>
                </div>
              </div>

              {/* Full Detail Message */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Açıklama (Detail)
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedLogDetail.detail}
                </p>
              </div>

              {/* Critical warning if applicable */}
              {selectedLogDetail.isCritical && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Bu işlem yüksek güvenlik yetkisi gerektiren kritik bir sistem değişikliğidir.</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
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
