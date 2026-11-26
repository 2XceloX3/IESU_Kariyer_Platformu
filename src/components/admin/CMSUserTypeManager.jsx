import React, { useState, useEffect } from 'react';
import { 
  Crown, FileText, BookOpen, Building2, Eye,
  Plus, Edit2, Shield, Activity, Power, X,
  Save, Search, Filter, ShieldCheck, Key, Check, Trash2
} from 'lucide-react';
import {
  hashStaffPassword,
  DEFAULT_STAFF_ACCOUNTS,
  normalizeStaffUsername,
  STAFF_PERMISSION_GROUPS,
  DEFAULT_PERMISSIONS_BY_TYPE
} from '../../utils/staffAuth';
import { exportToCSV } from '../../utils/export';

const DEFAULT_USER_TYPES = [
  { id: '1', name: 'Süper Admin', desc: 'Tam yetki, tüm panellere erişim', color: 'bg-amber-500', text: 'text-amber-600', bgSoft: 'bg-amber-50', icon: 'Crown', permissionCount: 30 },
  { id: '6', name: 'Birim Yöneticisi', desc: 'İdari yönetim, onay ve birim yetkileri', color: 'bg-[#990000]', text: 'text-[#990000]', bgSoft: 'bg-red-50', icon: 'ShieldCheck', permissionCount: 25 },
  { id: '2', name: 'İçerik Editörü', desc: 'Haber/duyuru/etkinlik ekleme ve düzenleme', color: 'bg-emerald-500', text: 'text-emerald-600', bgSoft: 'bg-emerald-50', icon: 'FileText', permissionCount: 12 },
  { id: '3', name: 'Mezun İlişkileri Sorumlusu', desc: 'Mezun ağı, MBS, kart ve mentörlük yönetimi', color: 'bg-teal-600', text: 'text-teal-700', bgSoft: 'bg-teal-50', icon: 'BookOpen', permissionCount: 18 },
  { id: '4', name: 'İşveren İlişkileri Sorumlusu', desc: 'Firma yönetimi, ilan ve aday havuzu', color: 'bg-blue-500', text: 'text-blue-600', bgSoft: 'bg-blue-50', icon: 'Building2', permissionCount: 15 },
  { id: '5', name: 'Gözlemci / Raporcu', desc: 'Sadece okuma ve dışa aktarma', color: 'bg-gray-500', text: 'text-gray-600', bgSoft: 'bg-gray-50', icon: 'Eye', permissionCount: 5 }
];

const DEFAULT_ACCOUNTS = DEFAULT_STAFF_ACCOUNTS;

const MODULES = [
  'İçerik Yönetimi', 'İlan & Staj Yönetimi', 'Öğrenci, Mezun & Firma Yönetimi', 
  'Mezun & Protokol İşlemleri', 'Sistem Ayarları', 'Analitik & Raporlar'
];

const ACTIONS = ['Okuma', 'Ekleme', 'Düzenleme', 'Silme', 'Onaylama'];

const IconMap = {
  Crown: Crown,
  ShieldCheck: ShieldCheck,
  FileText: FileText,
  BookOpen: BookOpen,
  Building2: Building2,
  Eye: Eye
};

export default function CMSUserTypeManager() {
  const [userTypes, setUserTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  
  // Modals
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [matrix, setMatrix] = useState({});
  
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    typeId: '6',
    department: '',
    allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['6']]
  });
  
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStaffDetail, setSelectedStaffDetail] = useState(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  // Password Change Simulation State
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [targetStaffForPassChange, setTargetStaffForPassChange] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      if (window.toast?.error) window.toast.error("Yeni şifre en az 6 karakter olmalıdır.");
      else console.warn("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      if (window.toast?.error) window.toast.error("Şifreler birbiriyle eşleşmiyor!");
      else console.warn("Şifreler birbiriyle eşleşmiyor!");
      return;
    }

    const updated = accounts.map(a => {
      if (a.id === targetStaffForPassChange.id) {
        return { 
          ...a, 
          passwordHash: hashStaffPassword(a.email, newPasswordInput),
          hasPassword: true,
          lastPassChange: new Date().toLocaleString('tr-TR')
        };
      }
      return a;
    });

    saveAccounts(updated);
    const msg = `${targetStaffForPassChange.name} şifresi güncellendi ve Personel Portalı girişine senkronize edildi.`;
    if (window.toast?.success) window.toast.success(msg);
    else console.info(msg);
    setIsChangePassModalOpen(false);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  useEffect(() => {
    try {
      const savedTypes = localStorage.getItem('iesu_user_types_v1');
      if (savedTypes) {
        const parsed = JSON.parse(savedTypes);
        // If the 6th Admin role is missing from stored types, reset/update with DEFAULT_USER_TYPES
        if (!parsed || parsed.length < 6 || !parsed.some(t => t.id === '6')) {
          setUserTypes(DEFAULT_USER_TYPES);
          localStorage.setItem('iesu_user_types_v1', JSON.stringify(DEFAULT_USER_TYPES));
        } else {
          setUserTypes(parsed);
        }
      } else {
        setUserTypes(DEFAULT_USER_TYPES);
        localStorage.setItem('iesu_user_types_v1', JSON.stringify(DEFAULT_USER_TYPES));
      }

      const savedAccs = localStorage.getItem('iesu_staff_accounts_v1');
      if (savedAccs) {
        const parsedAccs = JSON.parse(savedAccs);
        if (Array.isArray(parsedAccs) && parsedAccs.length > 0) {
          setAccounts(parsedAccs.map(acc => ({
            ...acc,
            username: acc.username || normalizeStaffUsername('', acc.email)
          })));
        } else {
          setAccounts(DEFAULT_ACCOUNTS);
          localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(DEFAULT_ACCOUNTS));
        }
      } else {
        setAccounts(DEFAULT_ACCOUNTS);
        localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(DEFAULT_ACCOUNTS));
      }
    } catch {
      setUserTypes(DEFAULT_USER_TYPES);
      setAccounts(DEFAULT_ACCOUNTS);
    }
  }, []);

  const saveTypes = (newTypes) => {
    setUserTypes(newTypes);
    localStorage.setItem('iesu_user_types_v1', JSON.stringify(newTypes));
  };

  const saveAccounts = (newAccs) => {
    // KVKK & Güvenlik Kalkanı: Parolaları localStorage'da asla düz metin depolama
    const sanitized = (newAccs || []).map(({ pass, password, ...rest }) => ({
      ...rest,
      hasPassword: true
    }));
    setAccounts(sanitized);
    localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(sanitized));
  };

  const openPermModal = (type) => {
    setSelectedType(type);
    
    if (type?.matrix && Object.keys(type.matrix).length > 0) {
      setMatrix(type.matrix);
      setIsPermModalOpen(true);
      return;
    }

    // Role-based deterministic permission initialization
    const initialMatrix = {};
    MODULES.forEach(mod => {
      initialMatrix[mod] = {};
      ACTIONS.forEach(act => {
        if (type.id === '1') {
          initialMatrix[mod][act] = true;
        } else if (type.id === '6') {
          initialMatrix[mod][act] = !(mod === 'Sistem Ayarları' && act === 'Silme');
        } else if (type.id === '2') {
          initialMatrix[mod][act] = mod === 'İçerik Yönetimi' || act === 'Okuma';
        } else if (type.id === '3') {
          initialMatrix[mod][act] = mod === 'Mezun & Protokol İşlemleri' || act === 'Okuma' || act === 'Onaylama';
        } else if (type.id === '4') {
          initialMatrix[mod][act] = mod === 'İlan & Staj Yönetimi' || mod === 'Öğrenci, Mezun & Firma Yönetimi' || act === 'Okuma';
        } else if (type.id === '5') {
          initialMatrix[mod][act] = act === 'Okuma';
        } else {
          initialMatrix[mod][act] = act === 'Okuma';
        }
      });
    });
    
    setMatrix(initialMatrix);
    setIsPermModalOpen(true);
  };

  const handleMatrixToggle = (mod, act) => {
    if (selectedType?.id === '1') return; // Super admin locked
    setMatrix(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [act]: !prev[mod][act]
      }
    }));
  };

  const savePermissions = () => {
    // Count permissions
    let count = 0;
    Object.values(matrix).forEach(mod => {
      Object.values(mod).forEach(val => {
        if (val) count++;
      });
    });
    
    const updatedTypes = userTypes.map(t => 
      t.id === selectedType.id ? { ...t, permissionCount: count, matrix } : t
    );
    saveTypes(updatedTypes);
    setIsPermModalOpen(false);
  };

  const openEditStaffModal = (account) => {
    setEditingStaffId(account.id);
    const defaultMods = DEFAULT_PERMISSIONS_BY_TYPE[String(account.typeId || '6')] || ['content', 'messages'];
    setStaffForm({
      name: account.name || '',
      username: account.username || normalizeStaffUsername('', account.email),
      email: account.email || '',
      password: '',
      typeId: account.typeId || '6',
      department: account.department || '',
      allowedModules: Array.isArray(account.allowedModules) ? [...account.allowedModules] : [...defaultMods]
    });
    setIsStaffModalOpen(true);
  };

  const toggleStaffModule = (modId) => {
    setStaffForm(prev => {
      const current = Array.isArray(prev.allowedModules) ? prev.allowedModules : [];
      const exists = current.includes(modId);
      return {
        ...prev,
        allowedModules: exists ? current.filter(m => m !== modId) : [...current, modId]
      };
    });
  };

  const handleDeleteStaff = (account) => {
    if (account.typeId === '1') {
      window.toast?.error?.('Süper Admin hesabı silinemez.');
      return;
    }
    const updated = accounts.filter(a => a.id !== account.id);
    saveAccounts(updated);
    window.toast?.success?.(`${account.name} (@${account.username || ''}) personel hesabı kaldırıldı.`);
  };

  const handleStaffFormSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = String(staffForm.email || '').trim().toLowerCase();
    const cleanUsername = normalizeStaffUsername(staffForm.username, cleanEmail);
    const initialPass = String(staffForm.password || '').trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      window.toast?.error?.('Kullanıcı adı en az 3 karakter olmalıdır (harf, rakam, nokta veya alt çizgi).');
      return;
    }
    if (!editingStaffId && (!initialPass || initialPass.length < 6)) {
      window.toast?.error?.('Personel giriş şifresi en az 6 karakter olmalıdır.');
      return;
    }
    if (editingStaffId && initialPass && initialPass.length < 6) {
      window.toast?.error?.('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (staffForm.typeId === '1') {
      window.toast?.error?.('Güvenlik gereği buradan yeni Süper Admin eklenemez. Lütfen kurumsal personel rolü seçin.');
      return;
    }
    const isDuplicate = accounts.some(a =>
      a.id !== editingStaffId && (
        (a.username && a.username.toLowerCase() === cleanUsername) ||
        (a.email && a.email.toLowerCase() === cleanEmail)
      )
    );
    if (isDuplicate) {
      window.toast?.error?.('Bu kullanıcı adı veya e-posta adresi ile kayıtlı bir personel zaten mevcut.');
      return;
    }

    const type = userTypes.find(t => t.id === staffForm.typeId);
    const selectedModules = Array.isArray(staffForm.allowedModules) ? staffForm.allowedModules : [];
    if (selectedModules.length === 0) {
      window.toast?.error?.('Personel için en az 1 yetkili çalışma alanı seçmelisiniz.');
      return;
    }

    if (editingStaffId) {
      const updated = accounts.map(a => {
        if (a.id !== editingStaffId) return a;
        const emailChanged = a.email?.toLowerCase() !== cleanEmail;
        if (emailChanged && !initialPass) {
          window.toast?.error?.('E-posta adresi değiştirildiğinde güvenlik gereği yeni bir giriş şifresi de belirlemelisiniz.');
          return a;
        }
        return {
          ...a,
          name: staffForm.name.trim(),
          username: cleanUsername,
          email: cleanEmail,
          department: staffForm.department?.trim() || 'Kariyer Geliştirme Merkezi',
          typeId: staffForm.typeId || a.typeId,
          typeName: type?.name || a.typeName,
          allowedModules: selectedModules,
          passwordHash: initialPass ? hashStaffPassword(cleanEmail, initialPass) : a.passwordHash,
          hasPassword: true
        };
      });
      saveAccounts(updated);
      window.toast?.success?.(`${staffForm.name.trim()} (@${cleanUsername}) bilgileri ve ${selectedModules.length} yetki alanı güncellendi.`);
      setIsStaffModalOpen(false);
      setEditingStaffId(null);
      setStaffForm({ name: '', username: '', email: '', password: '', typeId: '6', department: '', allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['6']] });
      return;
    }

    const newStaff = {
      id: Date.now().toString(),
      name: staffForm.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      department: staffForm.department?.trim() || 'Kariyer Geliştirme Merkezi',
      typeId: staffForm.typeId || '6',
      typeName: type?.name || 'Kurumsal Personel',
      allowedModules: selectedModules,
      passwordHash: hashStaffPassword(cleanEmail, initialPass),
      hasPassword: true,
      lastLogin: 'Hiç giriş yapmadı',
      status: 'Aktif'
    };
    
    saveAccounts([newStaff, ...accounts]);
    if (window.toast?.success) {
      window.toast.success(`${newStaff.name} (@${cleanUsername}) ${selectedModules.length} yetki alanı ile oluşturuldu!`);
    }
    setIsStaffModalOpen(false);
    setEditingStaffId(null);
    setStaffForm({ name: '', username: '', email: '', password: '', typeId: '6', department: '', allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['6']] });
  };

  const toggleStaffStatus = (id) => {
    const updated = accounts.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'Aktif' ? 'Pasif' : 'Aktif' };
      }
      return a;
    });
    saveAccounts(updated);
  };

  const openAuditLog = (staff) => {
    setSelectedStaff(staff);
    setIsAuditModalOpen(true);
  };

  const getTypeStyle = (typeId) => {
    const type = userTypes.find(t => t.id === typeId);
    return type ? `${type.bgSoft} ${type.text}` : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Institutional Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-50/80 via-white to-red-50/40 p-6 rounded-3xl border border-red-100/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#990000] to-red-800 text-white flex items-center justify-center shadow-md shadow-red-900/10 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#990000] text-white">
                  İESÜ İdari Güvenlik & Yetki Portalı
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                Personel & Yetki Yönetimi
              </h2>
              <p className="text-xs text-slate-500 font-medium">Kullanıcı rolleri, modüler yetki matrisi, IP/Aksiyon günlükleri ve personel hesap takibi.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                exportToCSV(
                  accounts.map(a => ({
                    'Personel ID': a.id,
                    'Ad Soyad': a.name,
                    'Kullanıcı Adı': a.username || normalizeStaffUsername('', a.email),
                    'E-posta': a.email,
                    'Departman': a.department || 'Kariyer Geliştirme Merkezi',
                    'Kullanıcı Rolü': a.typeName,
                    'Son Giriş Tarihi': a.lastLogin,
                    'Durum': a.status
                  })),
                  `IESU_Personel_Yetki_Listesi_${new Date().toISOString().slice(0,10)}.csv`
                );
              }}
              className="flex items-center gap-2 bg-[#990000] hover:bg-red-800 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
            >
              <FileText size={14} />
              <span>Personel Listesini Excele Aktar (.CSV)</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Tanımlı Rol</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{userTypes.length} Rol</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Crown size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kayıtlı İdari Personel</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{accounts.length} Personel</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Shield size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Oturum Sahibi</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{accounts.filter(a => a.status === 'Aktif').length} Aktif</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Activity size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam İzin Noktası</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{MODULES.length * ACTIONS.length} Kural</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* SECTION 1: Kullanıcı Tipleri */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#990000]" />
              Kullanıcı Tipleri & Rol Tanımları
            </h2>
            <span className="text-xs text-slate-500 font-bold">{userTypes.length} Tanımlı Kurumsal Rol</span>
          </div>
          
          {/* COMPACT ROLE CARDS GRID (6 ROLES) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {userTypes.map((type) => {
              const Icon = IconMap[type.icon] || Shield;
              const userCount = accounts.filter(a => a.typeId === type.id).length;
              
              return (
                <div key={type.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#990000]/40 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className={`p-2.5 rounded-xl ${type.bgSoft} ${type.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={() => openPermModal(type)}
                        className="p-1.5 text-slate-400 hover:text-[#990000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Yetkileri Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-black text-slate-900 text-xs mb-1">{type.name}</h3>
                    <p className="text-slate-500 text-[11px] leading-snug line-clamp-2 mb-3 font-medium">{type.desc}</p>
                  </div>
                  
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">
                      <b className="text-slate-900 font-black">{type.permissionCount}</b> yetki
                    </span>
                    <span className="bg-red-50 text-[#990000] px-2 py-0.5 rounded-md font-black text-[10px] border border-red-100">
                      {userCount} Personel
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Personel Hesapları */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#990000]" />
                Personel Hesapları & Erişim Kayıtları
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Sistemde yetkilendirilmiş idari, akademik ve yönetici personel hesapları.</p>
            </div>
            <button 
              onClick={() => {
                setEditingStaffId(null);
                setStaffForm({
                  name: '',
                  username: '',
                  email: '',
                  password: '',
                  typeId: '6',
                  department: '',
                  allowedModules: [...DEFAULT_PERMISSIONS_BY_TYPE['6']]
                });
                setIsStaffModalOpen(true);
              }}
              className="bg-[#990000] hover:bg-red-800 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Yeni Personel Hesabı Ekle
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/60">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Personel adı, e-posta veya unvan ara..." 
                  value={staffSearchTerm || ''}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] text-xs font-medium bg-white"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-[#990000] to-red-900 text-white font-black uppercase text-[10px] tracking-wider">
                    <th className="px-6 py-3.5">Ad Soyad</th>
                    <th className="px-6 py-3.5">Kullanıcı Adı</th>
                    <th className="px-6 py-3.5">E-posta Adresi</th>
                    <th className="px-6 py-3.5">Kullanıcı Rolü</th>
                    <th className="px-6 py-3.5">Giriş Şifresi</th>
                    <th className="px-6 py-3.5">Son Giriş Zamanı</th>
                    <th className="px-6 py-3.5">Hesap Durumu</th>
                    <th className="px-6 py-3.5 text-right">Aksiyonlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.filter(a => {
                    if (!staffSearchTerm) return true;
                    const q = staffSearchTerm.toLowerCase();
                    return (a.name || '').toLowerCase().includes(q) || 
                           (a.username || '').toLowerCase().includes(q) ||
                           (a.email || '').toLowerCase().includes(q) ||
                           (a.typeName || '').toLowerCase().includes(q);
                  }).map(account => (
                    <tr 
                      key={account.id} 
                      onClick={() => setSelectedStaffDetail(account)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">{account.name}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                          @{account.username || normalizeStaffUsername('', account.email)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{account.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getTypeStyle(account.typeId)}`}>
                            {account.typeName}
                          </span>
                          {account.typeId !== '1' && (
                            <span className="text-[10px] font-bold text-indigo-700">
                              {(Array.isArray(account.allowedModules) ? account.allowedModules : (DEFAULT_PERMISSIONS_BY_TYPE[String(account.typeId)] || [])).length} / {STAFF_PERMISSION_GROUPS.length} Yetki Alanı
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                          <Key size={13} className="text-[#990000]" />
                          <span>••••••••</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{account.lastLogin}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${account.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {account.typeId !== '1' && (
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setTargetStaffForPassChange(account);
                                setNewPasswordInput('');
                                setConfirmPasswordInput('');
                                setIsChangePassModalOpen(true);
                              }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-[11px] border border-amber-200 cursor-pointer"
                              title="Personel Şifresini Güncelle"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-600" />
                              <span>Şifre Değiştir</span>
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); openAuditLog(account); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Aksiyonlarını Gör"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          {account.typeId !== '1' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditStaffModal(account); }}
                              className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                              title="Personel Bilgilerini Düzenle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {account.typeId !== '1' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleStaffStatus(account.id); }}
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${account.status === 'Aktif' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                              title={account.status === 'Aktif' ? 'Pasifleştir' : 'Aktifleştir'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )}
                          {account.typeId !== '1' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteStaff(account); }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Personel Hesabını Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* MODALS */}

      {/* 1. Permission Matrix Modal */}
      {isPermModalOpen && selectedType && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Yetki Matrisi</h3>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">{selectedType.name}</span> rolü için yetkilendirmeleri düzenliyorsunuz.
                </p>
              </div>
              <button 
                onClick={() => setIsPermModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
              {selectedType.id === '1' && (
                <div className="mb-4 bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-center gap-3 border border-amber-100">
                  <Crown className="w-5 h-5 text-amber-600" />
                  Süper Admin rolünün yetkileri sabittir ve değiştirilemez. Tüm modüllerde tam yetkiye sahiptir.
                </div>
              )}
              
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 font-medium text-slate-700">Modül</th>
                      {ACTIONS.map(act => (
                        <th key={act} className="px-4 py-3 font-medium text-slate-700 text-center">{act}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MODULES.map((mod, idx) => (
                      <tr key={mod} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                        <td className="px-4 py-3 font-medium text-slate-800">{mod}</td>
                        {ACTIONS.map(act => (
                          <td key={act} className="px-4 py-3 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox"
                                disabled={selectedType.id === '1'}
                                checked={matrix[mod]?.[act] || false}
                                onChange={() => handleMatrixToggle(mod, act)}
                                className="w-4 h-4 rounded border-slate-300 text-[#990000] focus:ring-[#990000] disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button 
                onClick={() => setIsPermModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={savePermissions}
                disabled={selectedType.id === '1'}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#990000] text-white hover:bg-red-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Yetkileri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. New / Edit Staff Modal (With Granular Module Permissions) */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editingStaffId ? 'Personel Hesabı & Yetkilerini Düzenle' : 'Yeni Personel Ekle & Yetkilendir'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personel yalnızca aşağıda seçtiğiniz yetki alanlarına erişebilir.</p>
              </div>
              <button 
                onClick={() => { setIsStaffModalOpen(false); setEditingStaffId(null); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleStaffFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ad Soyad *</label>
                  <input 
                    required
                    type="text"
                    placeholder="Örn: Ayşe Yılmaz"
                    value={staffForm.name}
                    onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Personel Kullanıcı Adı *</label>
                  <input 
                    required
                    type="text"
                    placeholder="Örn: ayse.yilmaz"
                    value={staffForm.username}
                    onChange={e => setStaffForm({...staffForm, username: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kurumsal E-posta *</label>
                  <input 
                    required
                    type="email"
                    placeholder="ad.soyad@iesu.edu.tr"
                    value={staffForm.email}
                    onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {editingStaffId ? 'Yeni Şifre (Opsiyonel)' : 'Giriş Şifresi (Min 6) *'}
                  </label>
                  <input 
                    required={!editingStaffId}
                    minLength={6}
                    type="password"
                    placeholder="••••••••"
                    value={staffForm.password}
                    onChange={e => setStaffForm({...staffForm, password: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kullanıcı Tipi (Rol Şablonu)</label>
                  <select 
                    required
                    value={staffForm.typeId}
                    onChange={e => {
                      const nextTypeId = e.target.value;
                      const preset = DEFAULT_PERMISSIONS_BY_TYPE[String(nextTypeId)] || ['content', 'messages'];
                      setStaffForm({ ...staffForm, typeId: nextTypeId, allowedModules: [...preset] });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  >
                    <option value="">Seçiniz...</option>
                    {userTypes.filter(t => t.id !== '1').map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bölüm / Birim</label>
                  <input 
                    type="text"
                    placeholder="Kariyer Geliştirme Merkezi"
                    value={staffForm.department}
                    onChange={e => setStaffForm({...staffForm, department: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                  />
                </div>
              </div>

              {/* GRANULAR MODULE PERMISSION CHECKBOXES */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#990000]" />
                    Yetkili Olduğu Çalışma Alanları ({(staffForm.allowedModules || []).length}/{STAFF_PERMISSION_GROUPS.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = STAFF_PERMISSION_GROUPS.map(g => g.id);
                      const allSelected = (staffForm.allowedModules || []).length === allIds.length;
                      setStaffForm(prev => ({ ...prev, allowedModules: allSelected ? ['messages'] : allIds }));
                    }}
                    className="text-[11px] font-bold text-[#990000] hover:underline cursor-pointer"
                  >
                    {(staffForm.allowedModules || []).length === STAFF_PERMISSION_GROUPS.length ? 'Asgariye İndir' : 'Tümünü Seç'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STAFF_PERMISSION_GROUPS.map(group => {
                    const checked = (staffForm.allowedModules || []).includes(group.id);
                    return (
                      <label
                        key={group.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                          checked
                            ? 'bg-indigo-50/70 border-indigo-400 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStaffModule(group.id)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 leading-snug">{group.label}</div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{group.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#990000] text-white hover:bg-red-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingStaffId ? 'Yetkileri & Bilgileri Kaydet' : 'Personeli Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Audit Log Modal (Mini) */}
      {isAuditModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Aktivite Dökümü</h3>
                <p className="text-sm text-slate-500">{selectedStaff.name}</p>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {[
                  { time: 'Bugün, 14:30', text: 'Sistem ayarlarında değişiklik yaptı.', icon: Edit2, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { time: 'Dün, 09:15', text: 'Yeni bir haber içeriği yayımladı.', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { time: '2 gün önce', text: 'Sisteme giriş yaptı.', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' },
                ].map((log, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-md ${log.bg} ${log.color}`}>
                          <log.icon className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{log.time}</span>
                      </div>
                      <div className="text-sm text-slate-700">{log.text}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-center">
              <button className="text-sm font-medium text-[#990000] hover:text-red-800 transition-colors">
                Tüm dökümü görüntüle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Staff Account Detail Modal */}
      {selectedStaffDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-700 text-white font-bold flex items-center justify-center text-base shadow-sm">
                  {selectedStaffDetail.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedStaffDetail.name}</h3>
                  <p className="text-xs text-slate-500">Personel Detay Bilgileri</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStaffDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Ad Soyad</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedStaffDetail.name}</p>
                </div>
                
                <div className="border-t border-slate-200/60 pt-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">E-posta</span>
                  <p className="text-sm font-medium text-slate-700">{selectedStaffDetail.email}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Kullanıcı Tipi</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(selectedStaffDetail.typeId)}`}>
                    {selectedStaffDetail.typeName}
                  </span>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Son Giriş</span>
                  <p className="text-sm font-medium text-slate-700">{selectedStaffDetail.lastLogin}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Durum</span>
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${selectedStaffDetail.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {selectedStaffDetail.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedStaffDetail(null)}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. User Password Change Simulation Modal */}
      {isChangePassModalOpen && targetStaffForPassChange && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black">Personel Şifre Yenileme</h3>
                  <p className="text-xs text-amber-100 font-medium">{targetStaffForPassChange.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePassModalOpen(false)}
                className="text-amber-100 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4 text-xs">
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70 text-amber-900 leading-relaxed font-medium">
                🔒 <b>Sistem Bildirimi:</b> Personel geçici şifre ile giriş yaptıktan sonra yeni şifresini belirler. Belirlenen yeni şifre güvenlik protokolü gereğince <b>İdari Yönetici / Admin paneline anında yansır</b>.
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Mevcut Şifre</label>
                <input
                  type="password"
                  disabled
                  value="••••••••"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Yeni Şifre Oluştur *</label>
                <input
                  type="password"
                  required
                  placeholder="En az 6 karakterli yeni şifre..."
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">Yeni Şifreyi Tekrar Girin *</label>
                <input
                  type="password"
                  required
                  placeholder="Yeni şifreyi tekrar edin..."
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePassModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black transition shadow-md cursor-pointer"
                >
                  <Save size={15} /> Şifreyi Güncelle & Admne Bildir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

