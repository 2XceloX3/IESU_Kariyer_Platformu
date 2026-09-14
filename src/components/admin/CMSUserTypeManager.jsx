import React, { useState, useEffect } from 'react';
import { 
  Crown, FileText, BookOpen, Building2, Eye,
  Plus, Edit2, Shield, Activity, Power, X,
  Save, Search, Filter, ShieldCheck, Key, Copy, Check
} from 'lucide-react';

const DEFAULT_USER_TYPES = [
  { id: '1', name: 'Süper Admin', desc: 'Tam yetki, tüm panellere erişim', color: 'bg-amber-500', text: 'text-amber-600', bgSoft: 'bg-amber-50', icon: 'Crown', permissionCount: 30 },
  { id: '6', name: 'Admin', desc: 'İdari yönetim, onay ve birim yetkileri', color: 'bg-[#990000]', text: 'text-[#990000]', bgSoft: 'bg-red-50', icon: 'ShieldCheck', permissionCount: 25 },
  { id: '2', name: 'İçerik Editörü', desc: 'Haber/duyuru/etkinlik ekleme ve düzenleme', color: 'bg-emerald-500', text: 'text-emerald-600', bgSoft: 'bg-emerald-50', icon: 'FileText', permissionCount: 12 },
  { id: '3', name: 'Akademik Koordinatör', desc: 'Staj onayı, danışmanlık, belge inceleme', color: 'bg-purple-500', text: 'text-purple-600', bgSoft: 'bg-purple-50', icon: 'BookOpen', permissionCount: 18 },
  { id: '4', name: 'İşveren İlişkileri Sorumlusu', desc: 'Firma yönetimi, aday havuzu', color: 'bg-blue-500', text: 'text-blue-600', bgSoft: 'bg-blue-50', icon: 'Building2', permissionCount: 15 },
  { id: '5', name: 'Gözlemci / Raporcu', desc: 'Sadece okuma ve dışa aktarma', color: 'bg-gray-500', text: 'text-gray-600', bgSoft: 'bg-gray-50', icon: 'Eye', permissionCount: 5 }
];

const DEFAULT_ACCOUNTS = [
  { id: '101', name: 'Zuhal ŞAHİN', email: 'zuhal.sahin@iesu.edu.tr', pass: 'Zuhal2026!', typeId: '1', typeName: 'Süper Admin', lastLogin: '2026-08-02 09:30', status: 'Aktif' },
  { id: '104', name: 'Mutlu Gülsev YAĞIZ', email: 'myagiz@esenyurt.edu.tr', pass: 'Mutlu2026!', typeId: '6', typeName: 'Admin', lastLogin: '2026-08-02 10:15', status: 'Aktif' },
  { id: '102', name: 'Ahmet Yıldız', email: 'ahmet.yildiz@iesu.edu.tr', pass: 'Ahmet2026!', typeId: '2', typeName: 'İçerik Editörü', lastLogin: '2026-08-01 14:15', status: 'Aktif' },
  { id: '103', name: 'Dr. Elif Kaya', email: 'elif.kaya@iesu.edu.tr', pass: 'Elif2026!', typeId: '3', typeName: 'Akademik Koordinatör', lastLogin: '2026-08-02 11:45', status: 'Aktif' }
];

const MODULES = [
  'İçerik Yönetimi', 'İlan Yönetimi', 'Kullanıcı Yönetimi', 
  'Akademik İşlemler', 'Sistem Ayarları', 'Analitik & Raporlar'
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
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', typeId: '', department: '' });
  
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
      else alert("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      if (window.toast?.error) window.toast.error("Şifreler birbiriyle eşleşmiyor!");
      else alert("Şifreler birbiriyle eşleşmiyor!");
      return;
    }

    const updated = accounts.map(a => {
      if (a.id === targetStaffForPassChange.id) {
        return { 
          ...a, 
          pass: newPasswordInput,
          lastPassChange: new Date().toLocaleString('tr-TR')
        };
      }
      return a;
    });

    saveAccounts(updated);
    const msg = `Tebrikler! ${targetStaffForPassChange.name} şifresi başarıyla güncellendi. Yeni şifre ("${newPasswordInput}") anında İdari Yönetici / Admin paneline senkronize edildi.`;
    if (window.toast?.success) window.toast.success(msg);
    else alert(msg);
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
        if (!parsedAccs || !parsedAccs.some(a => a.typeId === '6')) {
          setAccounts(DEFAULT_ACCOUNTS);
          localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(DEFAULT_ACCOUNTS));
        } else {
          setAccounts(parsedAccs);
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
    setAccounts(newAccs);
    localStorage.setItem('iesu_staff_accounts_v1', JSON.stringify(newAccs));
  };

  const openPermModal = (type) => {
    setSelectedType(type);
    
    // Simulate loading existing permissions
    const initialMatrix = {};
    MODULES.forEach(mod => {
      initialMatrix[mod] = {};
      ACTIONS.forEach(act => {
        // Super Admin gets all true, others randomized based on logic for demo
        if (type.id === '1') {
          initialMatrix[mod][act] = true;
        } else if (type.id === '5' && act === 'Okuma') {
          initialMatrix[mod][act] = true;
        } else {
          initialMatrix[mod][act] = Math.random() > 0.5;
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
      t.id === selectedType.id ? { ...t, permissionCount: count } : t
    );
    saveTypes(updatedTypes);
    setIsPermModalOpen(false);
  };

  const handleStaffFormSubmit = (e) => {
    e.preventDefault();
    const type = userTypes.find(t => t.id === staffForm.typeId);
    
    const newStaff = {
      id: Date.now().toString(),
      name: staffForm.name,
      email: staffForm.email,
      pass: staffForm.password || 'Esenyurt2026!',
      typeId: staffForm.typeId,
      typeName: type?.name || 'Bilinmiyor',
      lastLogin: 'Hiç giriş yapmadı',
      status: 'Aktif'
    };
    
    saveAccounts([newStaff, ...accounts]);
    setIsStaffModalOpen(false);
    setStaffForm({ name: '', email: '', password: '', typeId: '', department: '' });
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
                let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
                csvContent += `İSTANBUL ESENYURT ÜNİVERSİTESİ - PERSONEL YETKİ LİSTESİ\n\n`;
                csvContent += `Personel ID;Adı Soyadı;E-posta;Kullanıcı Rolü;Son Giriş Tarihi;Durum\n`;
                accounts.forEach(a => {
                  csvContent += `${a.id};"${a.name}";"${a.email}";"${a.typeName}";"${a.lastLogin}";"${a.status}"\n`;
                });
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `IESU_Personel_Yetki_Listesi_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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
              onClick={() => setIsStaffModalOpen(true)}
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
                    return a.name.toLowerCase().includes(staffSearchTerm.toLowerCase()) || 
                           a.email.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
                           a.typeName.toLowerCase().includes(staffSearchTerm.toLowerCase());
                  }).map(account => (
                    <tr 
                      key={account.id} 
                      onClick={() => setSelectedStaffDetail(account)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">{account.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{account.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeStyle(account.typeId)}`}>
                          {account.typeName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                          <Key size={13} className="text-[#990000]" />
                          <span>{account.pass || 'Esenyurt2026!'}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(account.pass || 'Esenyurt2026!');
                              const text = `${account.name} için giriş şifresi (${account.pass || 'Esenyurt2026!'}) panoya kopyalandı!`;
                              if (window.toast?.success) window.toast.success(text);
                              else alert(text);
                            }}
                            className="p-1 hover:bg-white rounded transition text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Şifreyi Kopyala"
                          >
                            <Copy size={12} />
                          </button>
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
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setTargetStaffForPassChange(account);
                              setNewPasswordInput('');
                              setConfirmPasswordInput('');
                              setIsChangePassModalOpen(true);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-[11px] border border-amber-200 cursor-pointer"
                            title="Kullanıcı Kendi Şifresini Değiştirsin"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            <span>Şifre Değiştir</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openAuditLog(account); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Aksiyonlarını Gör"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedStaffDetail(account); }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Detayları Gör"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleStaffStatus(account.id); }}
                            className={`p-1.5 rounded-md transition-colors ${account.status === 'Aktif' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            title={account.status === 'Aktif' ? 'Pasifleştir' : 'Aktifleştir'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
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

      {/* 2. New Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Yeni Personel Ekle</h3>
              <button 
                onClick={() => setIsStaffModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleStaffFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                <input 
                  required
                  type="text"
                  value={staffForm.name}
                  onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                <input 
                  required
                  type="email"
                  value={staffForm.email}
                  onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Geçici Şifre</label>
                <input 
                  required
                  type="password"
                  value={staffForm.password}
                  onChange={e => setStaffForm({...staffForm, password: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Tipi (Rol)</label>
                <select 
                  required
                  value={staffForm.typeId}
                  onChange={e => setStaffForm({...staffForm, typeId: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                >
                  <option value="">Seçiniz...</option>
                  {userTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bölüm / Departman (Opsiyonel)</label>
                <input 
                  type="text"
                  value={staffForm.department}
                  onChange={e => setStaffForm({...staffForm, department: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000]"
                />
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#990000] text-white hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Personeli Ekle
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
                  type="text"
                  disabled
                  value={targetStaffForPassChange.pass || 'Esenyurt2026!'}
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

