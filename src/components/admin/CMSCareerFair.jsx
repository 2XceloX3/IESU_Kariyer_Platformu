import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { 
  Settings, Edit3, Eye, Calendar, Plus, Trash2, Check, X, Megaphone, 
  MapPin, Send, Briefcase, Monitor, Smartphone, Tablet, ChevronUp, 
  ChevronDown, Layers, Building2, AlertCircle, Sparkles, LayoutGrid, 
  CheckCircle2, AlertTriangle, RefreshCw, Clock
} from 'lucide-react';

const CMSCareerFair = () => {
  // Store Hooks
  const careerFairEvent = useAppStore(state => state.careerFairEvent);
  const setCareerFairEvent = useAppStore(state => state.setCareerFairEvent);
  
  const careerFairFormTemplate = useAppStore(state => state.careerFairFormTemplate);
  const setCareerFairFormTemplate = useAppStore(state => state.setCareerFairFormTemplate);
  const addFormFieldStore = useAppStore(state => state.addFormField);
  const removeFormFieldStore = useAppStore(state => state.removeFormField);
  const updateFormFieldStore = useAppStore(state => state.updateFormField);
  const reorderFormFieldsStore = useAppStore(state => state.reorderFormFields);

  const careerFairApplications = useAppStore(state => state.careerFairApplications);
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);

  const careerFairStands = useAppStore(state => state.careerFairStands);
  const setCareerFairStands = useAppStore(state => state.setCareerFairStands);
  const assignStandToCompanyStore = useAppStore(state => state.assignStandToCompany);

  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const addNotification = useAppStore(state => state.addNotification);
  
  const logAction = useAppStore(state => state.logAction);

  // Active Tab state
  const [activeTab, setActiveTab] = useState('form_builder');
  
  // Device view mode for simulator preview ('desktop' | 'tablet' | 'mobile')
  const [deviceView, setDeviceView] = useState('desktop');

  // Event Details editing state
  const [eventDetails, setEventDetails] = useState(() => ({ 
    title: careerFairEvent?.title || 'İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı',
    date: careerFairEvent?.date || '15-18 Mayıs 2026',
    location: careerFairEvent?.location || 'Merkez Kampüs Rektörlük Bahçesi & Fuaye Alanı',
    description: careerFairEvent?.description || 'Esenyurt Üniversitesi öğrencilerini ve mezunlarını sektör lideri şirketlerle buluşturan resmî kariyer etkinliği.',
    banner: careerFairEvent?.banner || 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
    isActive: careerFairEvent?.isActive ?? true,
    quota: careerFairEvent?.quota || 50
  }));

  // Stage theme background state ('bordo' | 'midnight' | 'emerald' | 'amber')
  const [stageTheme, setStageTheme] = useState('bordo');

  // 2D Floorplan Map Theme State ('dark' | 'neon' | 'cyber' | 'crimson')
  const [mapTheme, setMapTheme] = useState('cyber');

  // Dynamic Live Stage Sessions State
  const [stageSessions, setStageSessions] = useState([
    { id: 'SESS-1', time: '10:30 - 11:15', speaker: 'Esenyurt Bilişim & İK Direktörlüğü', company: 'Trendyol Tech', topic: 'Yapay Zeka ve Yazılım Sektöründe Kariyer Fırsatları', status: 'CANLI SAHNEDE', isLive: true },
    { id: 'SESS-2', time: '11:30 - 12:15', speaker: 'Zuhal ŞAHİN', company: 'İESÜ Kariyer Geliştirme Ofisi', topic: 'Geleceğin Yetkinlikleri ve Etkili CV Hazırlama', status: 'Sıradaki', isLive: false },
    { id: 'SESS-3', time: '14:00 - 15:00', speaker: 'Caner DEMİR', company: 'Garanti BBVA Teknoloji', topic: 'Fintech ve Dijital Dönüşüm Zirvesi', status: 'Bekliyor', isLive: false }
  ]);
  const [newSession, setNewSession] = useState({ time: '', speaker: '', company: '', topic: '' });
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Dynamic Student Q&A State
  const [stageQuestions, setStageQuestions] = useState([
    { id: 'Q-1', student: 'Alperen YILMAZ', question: 'Yazılım mühendisliği öğrencileri için Trendyol staj başvuruları ne zaman açılacak?', votes: 42 },
    { id: 'Q-2', student: 'Zeynep KAYA', question: 'Yeni mezunlara yönelik uzaktan çalışma (Remote) imkanlarınız bulunuyor mu?', votes: 28 },
    { id: 'Q-3', student: 'Ahmet DEMİR', question: 'Mülakat süreçlerinde teknik değerlendirme aşaması nasıl ilerliyor?', votes: 19 }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');

  // Question Builder Form state
  const [newField, setNewField] = useState({ label: '', type: 'text', required: false, description: '', options: '' });
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editingFieldData, setEditingFieldData] = useState({ label: '', type: 'text', required: false, description: '', options: '' });

  // Announcement state
  const [announcementText, setAnnouncementText] = useState('');

  // Table & Stand Allocator state
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL'); // 'ALL' | 'A' | 'B'
  const [activeModalStand, setActiveModalStand] = useState(null); // Stand object being configured in modal
  const [modalSelectedCompany, setModalSelectedCompany] = useState('');
  const [modalSelectedStatus, setModalSelectedStatus] = useState('Atandı');
  const [modalCustomName, setModalCustomName] = useState('');

  // Quick Table assignment state for Applications tab
  const [editingTableAppId, setEditingTableAppId] = useState(null);
  const [quickTableInput, setQuickTableInput] = useState('');

  // --- Handlers: Event Details ---
  const handleSaveEventDetails = () => {
    if (setCareerFairEvent) {
      setCareerFairEvent(eventDetails);
    }
    if (logAction) {
      logAction('Admin', 'Kariyer Günleri etkinlik detayları güncellendi', 'Kariyer Günleri');
    }
    if (window.toast) window.toast.success("Etkinlik detayları güncellendi.");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventDetails(prev => ({ ...prev, banner: reader.result }));
        if (window.toast) window.toast.success('Görsel başarıyla yüklendi.');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers: Question Builder ---
  const handleAddField = () => {
    if (!newField?.label?.trim()) return;
    const fieldToAdd = {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      label: newField.label.trim(),
      type: newField.type || 'text',
      required: Boolean(newField.required),
      description: newField.description?.trim() || '',
      order: (careerFairFormTemplate?.length || 0) + 1,
      options: newField.type === 'select' 
        ? (newField.options || '').split(',').map(s => s.trim()).filter(Boolean)
        : []
    };

    if (addFormFieldStore) {
      addFormFieldStore(fieldToAdd);
    } else if (setCareerFairFormTemplate) {
      setCareerFairFormTemplate([...(careerFairFormTemplate || []), fieldToAdd]);
    }
    setNewField({ label: '', type: 'text', required: false, description: '', options: '' });
    if (window.toast) window.toast.success("Yeni soru forma eklendi.");
  };

  const handleRemoveField = (id) => {
    if (removeFormFieldStore) {
      removeFormFieldStore(id);
    } else if (setCareerFairFormTemplate) {
      setCareerFairFormTemplate((careerFairFormTemplate || []).filter(f => f.id !== id));
    }
    if (window.toast) window.toast.info("Soru formdan çıkarıldı.");
  };

  const handleStartEditField = (field) => {
    setEditingFieldId(field.id);
    setEditingFieldData({
      label: field.label || '',
      type: field.type || 'text',
      required: Boolean(field.required),
      description: field.description || '',
      options: Array.isArray(field.options) ? field.options.join(', ') : ''
    });
  };

  const handleSaveEditField = (id) => {
    if (!editingFieldData.label || !editingFieldData.label.trim()) return;
    const updated = {
      label: editingFieldData.label.trim(),
      type: editingFieldData.type,
      required: editingFieldData.required,
      description: editingFieldData.description.trim(),
      options: editingFieldData.type === 'select'
        ? (editingFieldData.options || '').split(',').map(s => s.trim()).filter(Boolean)
        : []
    };

    if (updateFormFieldStore) {
      updateFormFieldStore(id, updated);
    } else if (setCareerFairFormTemplate) {
      setCareerFairFormTemplate((careerFairFormTemplate || []).map(f => f.id === id ? { ...f, ...updated } : f));
    }
    setEditingFieldId(null);
    if (window.toast) window.toast.success("Soru güncellendi.");
  };

  const handleMoveField = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= (careerFairFormTemplate?.length || 0)) return;

    if (reorderFormFieldsStore) {
      reorderFormFieldsStore(index, targetIndex);
    } else if (setCareerFairFormTemplate) {
      const list = Array.from(careerFairFormTemplate || []);
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      setCareerFairFormTemplate(list);
    }
  };

  // --- Handlers: Stand Allocator & Modal ---
  const handleOpenStandModal = (stand) => {
    setActiveModalStand(stand);
    setModalSelectedCompany(stand.assignedCompanyName || '');
    setModalSelectedStatus(stand.status || (stand.assignedCompanyName ? 'Atandı' : 'Boş'));
    setModalCustomName('');
  };

  const handleConfirmStandAssignment = () => {
    if (!activeModalStand) return;
    
    const companyToAssign = modalSelectedCompany === 'CUSTOM' ? modalCustomName : modalSelectedCompany;
    const matchedApp = (careerFairApplications || []).find(a => a.companyName === companyToAssign);
    const companyId = matchedApp ? matchedApp.companyId : null;

    if (assignStandToCompanyStore) {
      assignStandToCompanyStore(activeModalStand.id, companyToAssign, companyId, modalSelectedStatus);
    } else {
      // Manual fallback logic
      const updatedStands = (careerFairStands || []).map(s => {
        if (s.id === activeModalStand.id || s.code === activeModalStand.code) {
          return {
            ...s,
            status: modalSelectedStatus,
            assignedCompanyId: companyId,
            assignedCompanyName: modalSelectedStatus === 'Boş' ? null : companyToAssign
          };
        }
        return s;
      });
      if (setCareerFairStands) setCareerFairStands(updatedStands);

      if (setCareerFairApplications) {
        setCareerFairApplications((careerFairApplications || []).map(app => {
          if (companyToAssign && app.companyName === companyToAssign) {
            return { ...app, tableNumber: modalSelectedStatus === 'Boş' ? null : activeModalStand.code };
          }
          if (app.tableNumber === activeModalStand.code && modalSelectedStatus === 'Boş') {
            return { ...app, tableNumber: null };
          }
          return app;
        }));
      }

      if (addNotification) {
        addNotification({
          id: 'NOTIF-' + Math.random().toString(36).substring(2, 9),
          type: 'system',
          title: 'Stant Ataması Yapıldı',
          message: `${activeModalStand.code} yerleşimi "${companyToAssign || 'Boş'}" olarak atandı.`,
          read: false,
          date: new Date().toLocaleDateString('tr-TR')
        });
      }
      if (logAction) {
        logAction('Admin', `Stant ${activeModalStand.code} -> ${companyToAssign || 'Boş'}`, 'Kariyer Günleri');
      }
    }

    if (window.toast) window.toast.success(`${activeModalStand.code} yerleşimi kaydedildi.`);
    setActiveModalStand(null);
  };

  const handleClearStandAssignment = () => {
    if (!activeModalStand) return;
    if (assignStandToCompanyStore) {
      assignStandToCompanyStore(activeModalStand.id, null, null, 'Boş');
    }
    if (window.toast) window.toast.info(`${activeModalStand.code} boşaltıldı.`);
    setActiveModalStand(null);
  };

  // --- Handlers: Applications & Quick Table ---
  const handleApproveApplication = (appId) => {
    if (setCareerFairApplications) {
      setCareerFairApplications((careerFairApplications || []).map(app => 
        app.id === appId ? { ...app, status: 'Onaylandı' } : app
      ));
    }
    if (logAction) logAction('Admin', `Firma başvurusu onaylandı (${appId})`, 'Kariyer Günleri');
    if (window.toast) window.toast.success("Firma başvurusu onaylandı.");
  };

  const handleRejectApplication = (appId) => {
    if (setCareerFairApplications) {
      setCareerFairApplications((careerFairApplications || []).map(app => 
        app.id === appId ? { ...app, status: 'Reddedildi' } : app
      ));
    }
    if (logAction) logAction('Admin', `Firma başvurusu reddedildi (${appId})`, 'Kariyer Günleri');
    if (window.toast) window.toast.error("Firma başvurusu reddedildi.");
  };

  const handleSaveQuickTable = (appId) => {
    const targetApp = (careerFairApplications || []).find(a => a.id === appId);
    if (setCareerFairApplications) {
      setCareerFairApplications((careerFairApplications || []).map(app => 
        app.id === appId ? { ...app, tableNumber: quickTableInput } : app
      ));
    }
    if (targetApp && assignStandToCompanyStore && quickTableInput) {
      assignStandToCompanyStore(quickTableInput, targetApp.companyName, targetApp.companyId, 'Atandı');
    }
    setEditingTableAppId(null);
    if (window.toast) window.toast.success("Masa numarası atandı.");
  };

  // --- Handlers: Announcements & Notifications ---
  const handlePostAnnouncement = () => {
    if (!announcementText?.trim()) return;
    const newPost = {
      id: 'PF-' + Date.now(),
      author: {
        name: 'Kariyer Geliştirme Merkezi',
        role: 'admin',
        avatar: '/logo.png'
      },
      content: announcementText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0, 
      comments: 0,
      tags: ['Kariyer Günleri', 'Duyuru']
    };
    if (setPosts) setPosts([newPost, ...(posts || [])]);
    setAnnouncementText('');
    if (logAction) logAction('Admin', 'Kariyer Günleri duyurusu yayınlandı', 'Kariyer Günleri');
    if (window.toast) window.toast.success('Duyuru başarıyla yayınlandı!');
  };

  const handleNotifyCompanies = () => {
    const approvedCompanies = (careerFairApplications || []).filter(app => app.status === 'Onaylandı');
    if ((approvedCompanies?.length || 0) === 0) {
      if (window.toast) window.toast.error('Onaylanmış firma bulunamadı.');
      return;
    }

    const newNotifications = approvedCompanies.map(app => ({
      id: 'NOTIF-' + Math.random().toString(36).substring(2, 9),
      userId: app.companyId,
      type: 'system',
      title: 'Kariyer Günleri Masa Atamanız Yapıldı!',
      message: `Değerli ${app.companyName}, Kariyer Günleri masa atamanız (${app.tableNumber || 'Atanmadı'}) tamamlanmıştır.`,
      read: false,
      date: new Date().toLocaleDateString('tr-TR')
    }));

    if (setNotifications) {
      setNotifications([...newNotifications, ...(notifications || [])]);
    }
    if (logAction) {
      logAction('Admin', `${approvedCompanies.length} onaylı firmaya e-posta ve bildirim gönderildi`, 'Kariyer Günleri');
    }
    if (window.toast) window.toast.success(`${approvedCompanies.length} firmaya e-posta ve bildirim gönderildi!`);
  };

  // Stand statistics
  const standsList = careerFairStands || [];
  const totalStandsCount = standsList.length || 0;
  const assignedStandsCount = standsList.filter(s => s.status === 'Atandı').length || 0;
  const reservedStandsCount = standsList.filter(s => s.status === 'Rezerve').length || 0;
  const emptyStandsCount = standsList.filter(s => s.status === 'Boş' || !s.status).length || 0;

  const filteredStands = standsList.filter(s => {
    if (selectedZoneFilter === 'A') return s.zone === 'A';
    if (selectedZoneFilter === 'B') return s.zone === 'B';
    return true;
  });

  const approvedApplications = (careerFairApplications || []).filter(a => a.status === 'Onaylandı');

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* HEADER: Google Stitch Crimson Corporate Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-[#7A0000] to-[#5C0000] p-8 md:p-10 text-white shadow-2xl border border-red-900/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-12 w-60 h-60 rounded-full bg-red-400/10 blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block">
          <Calendar size={180} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wide border border-white/10">
              <Sparkles size={14} className="animate-pulse text-amber-300" />
              <span>Geleneksel Kariyer Günleri Google Stitch Yükseltmesi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {eventDetails?.title || careerFairEvent?.title || 'İESÜ Kariyer Zirvesi & Fuarı CMS'}
            </h1>
            <p className="text-red-100/90 text-sm md:text-base leading-relaxed">
              Etkinlik parametrelerini yönetin, firma başvuru formunu canlı simülatör ile tasarlayın, 2D haritada stant tahsislerini gerçekleştirin.
            </p>
          </div>

          {/* Stitch Corporate Navigation Tabs */}
          <div className="flex flex-wrap items-center bg-black/20 p-1.5 rounded-2xl backdrop-blur-xl border border-white/10 gap-1 self-start xl:self-auto">
            <button 
              onClick={() => setActiveTab('form_builder')} 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'form_builder' 
                  ? 'bg-white text-[#990000] shadow-lg scale-[1.02]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutGrid size={16} /> Form & Canlı Önizleme
            </button>
            <button 
              onClick={() => setActiveTab('stand_allocator')} 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'stand_allocator' 
                  ? 'bg-white text-[#990000] shadow-lg scale-[1.02]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers size={16} /> Stant Alokatörü (2D Harita)
            </button>
            <button 
              onClick={() => setActiveTab('applications')} 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'applications' 
                  ? 'bg-white text-[#990000] shadow-lg scale-[1.02]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase size={16} /> Başvurular ({careerFairApplications?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('live_stage')} 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'live_stage' 
                  ? 'bg-white text-[#990000] shadow-lg scale-[1.02]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles size={16} className="text-amber-300 animate-pulse" /> Canlı Zirve Sahnesi & Soru-Cevap
            </button>
            <button 
              onClick={() => setActiveTab('announcements')} 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'announcements' 
                  ? 'bg-white text-[#990000] shadow-lg scale-[1.02]' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Megaphone size={16} /> Duyuru & Bildirim
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FORM BUILDER & LIVE SIDE-BY-SIDE SIMULATOR */}
      {activeTab === 'form_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon (5 cols): Etkinlik Detayları & Soru Yöneticisi */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Etkinlik Ayarları */}
            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Settings size={18} className="text-[#990000]"/> Etkinlik Genel Detayları
                </h3>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  eventDetails.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {eventDetails.isActive ? 'BAŞVURULAR AÇIK' : 'KAPALI'}
                </span>
              </div>

              <div className="space-y-3.5 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Etkinlik Başlığı</label>
                  <input 
                    type="text" 
                    value={eventDetails.title} 
                    onChange={e => setEventDetails({...eventDetails, title: e.target.value})} 
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#990000] focus:bg-white outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Tarih / Aralık</label>
                    <input 
                      type="text" 
                      value={eventDetails.date} 
                      onChange={e => setEventDetails({...eventDetails, date: e.target.value})} 
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#990000] focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Firma Kontenjanı</label>
                    <input 
                      type="number" 
                      value={eventDetails.quota || 50} 
                      onChange={e => setEventDetails({...eventDetails, quota: parseInt(e.target.value) || 0})} 
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#990000] focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Etkinlik Konumu</label>
                  <input 
                    type="text" 
                    value={eventDetails.location} 
                    onChange={e => setEventDetails({...eventDetails, location: e.target.value})} 
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#990000] focus:bg-white outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Açıklama / Metin</label>
                  <textarea 
                    rows="2" 
                    value={eventDetails.description} 
                    onChange={e => setEventDetails({...eventDetails, description: e.target.value})} 
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#990000] focus:bg-white outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Banner Görsel Yükleme</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-xs text-center font-semibold text-gray-600 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      Görsel Seç (.jpg, .png)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={eventDetails.isActive} 
                      onChange={e => setEventDetails({...eventDetails, isActive: e.target.checked})} 
                      className="w-4 h-4 text-[#990000] rounded border-gray-300 focus:ring-[#990000]" 
                    />
                    Form Başvurulara Açık
                  </label>
                  <button 
                    onClick={handleSaveEventDetails} 
                    className="bg-[#990000] hover:bg-[#7A0000] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Detayları Kaydet
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Soru Oluşturucu (Question Builder) */}
            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Edit3 size={18} className="text-[#990000]"/> Soru Ekle & Düzenle
              </h3>
              
              {/* Form Input Box */}
              <div className="bg-red-50/40 p-4 rounded-xl border border-red-100 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Soru Başlığı / Metni</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Eşantiyon Dağıtacak Mısınız?" 
                    value={newField.label} 
                    onChange={e => setNewField({...newField, label: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#990000] outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Açıklama veya İpucu (Opsiyonel)</label>
                  <input 
                    type="text" 
                    placeholder="Aday firmalara yardım metni..." 
                    value={newField.description} 
                    onChange={e => setNewField({...newField, description: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#990000] outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Soru Tipi</label>
                    <select 
                      value={newField.type} 
                      onChange={e => setNewField({...newField, type: e.target.value})} 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                    >
                      <option value="text">Kısa Metin (text)</option>
                      <option value="textarea">Uzun Metin (textarea)</option>
                      <option value="select">Çoktan Seçmeli (select)</option>
                      <option value="file">Dosya / Logo Yükleme (file)</option>
                      <option value="checkbox">Onay Kutusu (checkbox)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl w-full cursor-pointer h-[38px]">
                      <input 
                        type="checkbox" 
                        checked={newField.required} 
                        onChange={e => setNewField({...newField, required: e.target.checked})} 
                        className="w-4 h-4 text-[#990000] rounded focus:ring-[#990000]" 
                      /> Zorunlu Alan
                    </label>
                  </div>
                </div>

                {newField.type === 'select' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Seçenekler (Virgülle ayırın)</label>
                    <input 
                      type="text" 
                      placeholder="Konuşmacı, Stant, Sponsorluk" 
                      value={newField.options} 
                      onChange={e => setNewField({...newField, options: e.target.value})} 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#990000] outline-none" 
                    />
                  </div>
                )}

                <button 
                  onClick={handleAddField} 
                  className="w-full bg-[#990000] hover:bg-[#7A0000] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus size={16} /> Forma Soru Ekle
                </button>
              </div>

              {/* Existing Questions List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Mevcut Form Soruları ({careerFairFormTemplate?.length || 0})
                  </p>
                </div>

                {(careerFairFormTemplate || []).map((field, idx) => (
                  <div key={field.id} className="p-3.5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-2 group transition-all hover:border-red-200">
                    {editingFieldId === field.id ? (
                      /* Inline Edit Mode */
                      <div className="space-y-2 text-xs">
                        <input 
                          type="text" 
                          value={editingFieldData.label} 
                          onChange={e => setEditingFieldData({...editingFieldData, label: e.target.value})} 
                          className="w-full border rounded-lg px-2.5 py-1.5 font-bold" 
                        />
                        <input 
                          type="text" 
                          value={editingFieldData.description} 
                          placeholder="Açıklama"
                          onChange={e => setEditingFieldData({...editingFieldData, description: e.target.value})} 
                          className="w-full border rounded-lg px-2.5 py-1" 
                        />
                        <div className="flex gap-2">
                          <select 
                            value={editingFieldData.type} 
                            onChange={e => setEditingFieldData({...editingFieldData, type: e.target.value})} 
                            className="border rounded-lg px-2 py-1 flex-1"
                          >
                            <option value="text">Kısa Metin</option>
                            <option value="textarea">Uzun Metin</option>
                            <option value="select">Çoktan Seçmeli</option>
                            <option value="file">Dosya Yükleme</option>
                            <option value="checkbox">Onay Kutusu</option>
                          </select>
                          <label className="flex items-center gap-1 font-bold">
                            <input 
                              type="checkbox" 
                              checked={editingFieldData.required} 
                              onChange={e => setEditingFieldData({...editingFieldData, required: e.target.checked})} 
                            /> Zorunlu
                          </label>
                        </div>
                        {editingFieldData.type === 'select' && (
                          <input 
                            type="text" 
                            value={editingFieldData.options} 
                            placeholder="Seçenekler (virgülle)"
                            onChange={e => setEditingFieldData({...editingFieldData, options: e.target.value})} 
                            className="w-full border rounded-lg px-2 py-1" 
                          />
                        )}
                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => setEditingFieldId(null)} className="px-2.5 py-1 bg-gray-100 rounded text-gray-600 font-bold">İptal</button>
                          <button onClick={() => handleSaveEditField(field.id)} className="px-3 py-1 bg-[#990000] text-white rounded font-bold">Kaydet</button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-[#990000] font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-gray-900">{field.label}</span>
                            {field.required && (
                              <span className="text-[9px] bg-red-100 text-[#990000] px-1.5 py-0.5 rounded font-black">ZORUNLU</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleMoveField(idx, 'up')} 
                              disabled={idx === 0} 
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" 
                              title="Yukarı Taşı"
                            >
                              <ChevronUp size={14}/>
                            </button>
                            <button 
                              onClick={() => handleMoveField(idx, 'down')} 
                              disabled={idx === (careerFairFormTemplate?.length || 0) - 1} 
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" 
                              title="Aşağı Taşı"
                            >
                              <ChevronDown size={14}/>
                            </button>
                            <button 
                              onClick={() => handleStartEditField(field)} 
                              className="p-1 text-gray-400 hover:text-[#990000]" 
                              title="Düzenle"
                            >
                              <Edit3 size={14}/>
                            </button>
                            <button 
                              onClick={() => handleRemoveField(field.id)} 
                              className="p-1 text-gray-400 hover:text-red-600" 
                              title="Sil"
                            >
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-[10px] text-gray-600">Tür: {field.type}</span>
                          {field.description && <span className="truncate max-w-[200px] text-gray-400">{field.description}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon (7 cols): Sticky Top-24 Live Preview Simulator */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-4">
              
              {/* Simulator Controls & Device View Switcher */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-[#990000] animate-pulse" />
                  <span className="text-xs md:text-sm font-bold text-gray-900">Canlı Başvuru Simülatörü</span>
                </div>

                {/* Device Selector Buttons */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
                  <button 
                    onClick={() => setDeviceView('desktop')} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      deviceView === 'desktop' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Monitor size={14} /> Masaüstü
                  </button>
                  <button 
                    onClick={() => setDeviceView('tablet')} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      deviceView === 'tablet' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Tablet size={14} /> Tablet
                  </button>
                  <button 
                    onClick={() => setDeviceView('mobile')} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      deviceView === 'mobile' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Smartphone size={14} /> Mobil
                  </button>
                </div>
              </div>

              {/* Simulator Frame Wrapper */}
              <div className={`transition-all duration-300 mx-auto ${
                deviceView === 'desktop' ? 'w-full' :
                deviceView === 'tablet' ? 'max-w-md' : 'max-w-xs'
              }`}>
                <div className="bg-white rounded-3xl border border-gray-300 shadow-2xl overflow-hidden relative border-t-8 border-t-[#990000]">
                  
                  {/* Fake Browser Bar */}
                  <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white px-3 py-0.5 rounded-md text-[10px] font-mono text-gray-500 truncate max-w-[220px]">
                      https://kariyer.esenyurt.edu.tr/fuar-basvuru
                    </div>
                    <div className="w-4"></div>
                  </div>

                  {/* Simulator Screen Content */}
                  <div className="p-5 md:p-6 bg-gray-50 max-h-[620px] overflow-y-auto space-y-5">
                    
                    {/* Event Banner Card */}
                    <div className="w-full h-36 bg-gradient-to-r from-[#990000] via-[#7A0000] to-[#5C0000] rounded-2xl relative overflow-hidden shadow-md">
                      {eventDetails.banner && (
                        <img 
                          src={eventDetails.banner} 
                          alt="Event Banner" 
                          className="w-full h-full object-cover opacity-60" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-amber-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                          {eventDetails.date || '15-18 Mayıs 2026'}
                        </span>
                        <h2 className="text-white font-black text-lg leading-tight truncate">
                          {eventDetails.title || 'İESÜ Kariyer Günleri'}
                        </h2>
                        <span className="text-gray-300 text-[10px] flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {eventDetails.location || 'Merkez Kampüs'}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Form Preview Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Firma Katılım Başvuru Formu</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{eventDetails.description}</p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {(careerFairFormTemplate || []).map(field => (
                          <div key={field.id} className="space-y-1">
                            <label className="block text-xs font-bold text-gray-800">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {field.description && <p className="text-[10px] text-gray-400">{field.description}</p>}
                            
                            {field.type === 'text' && (
                              <input 
                                type="text" 
                                disabled 
                                placeholder="Yanıtınızı buraya yazın..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400 cursor-not-allowed" 
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea 
                                disabled 
                                rows="2" 
                                placeholder="Detaylı açıklamanızı buraya girin..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400 cursor-not-allowed resize-none"
                              ></textarea>
                            )}

                            {field.type === 'select' && (
                              <select 
                                disabled 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400 cursor-not-allowed"
                              >
                                <option>Lütfen seçim yapınız</option>
                                {(field.options || []).map((opt, idx) => (
                                  <option key={idx}>{opt}</option>
                                ))}
                              </select>
                            )}

                            {field.type === 'file' && (
                              <div className="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 text-center text-xs text-gray-400">
                                <span>Logo / Dosya Yükle (.png, .pdf)</span>
                              </div>
                            )}

                            {field.type === 'checkbox' && (
                              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-not-allowed">
                                <input type="checkbox" disabled className="w-4 h-4 text-[#990000] rounded" />
                                <span>Onaylıyorum / Kabul Ediyorum</span>
                              </label>
                            )}
                          </div>
                        ))}

                        {(careerFairFormTemplate?.length || 0) === 0 && (
                          <p className="text-center text-xs text-gray-400 py-6">Henüz forma soru eklenmedi.</p>
                        )}

                        <button 
                          disabled 
                          className="w-full bg-[#990000] text-white font-bold py-3 rounded-xl text-xs opacity-60 cursor-not-allowed mt-4 shadow"
                        >
                          Başvuruyu Tamamla (Canlı Önizleme)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 2D FLOORPLAN MAP / LAYOUT STAND ALLOCATOR */}
      {activeTab === 'stand_allocator' && (
        <div className="space-y-6">
          
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold">
                <LayoutGrid size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Toplam Stant</p>
                <p className="text-2xl font-black text-gray-900">{totalStandsCount}</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Atanan Stantlar</p>
                <p className="text-2xl font-black text-rose-600">{assignedStandsCount}</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Rezerve Stantlar</p>
                <p className="text-2xl font-black text-amber-600">{reservedStandsCount}</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Boş Stantlar</p>
                <p className="text-2xl font-black text-emerald-600">{emptyStandsCount}</p>
              </div>
            </div>
          </div>

          {/* Interactive Map Filter & Legend Bar */}
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <button 
              onClick={() => setActiveTab('live_stage')} 
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'live_stage' ? 'bg-[#990000] text-white shadow-md' : 'bg-red-50 text-[#990000] hover:bg-red-100'}`}
            >
              <Sparkles size={14} className="text-amber-500 animate-pulse" /> Canlı Zirve Sahnesi & Soru-Cevap
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase mr-2">Bölge Seçimi:</span>
              <button 
                onClick={() => setSelectedZoneFilter('ALL')} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedZoneFilter === 'ALL' ? 'bg-[#990000] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tüm Alan (24 Stant)
              </button>
              <button 
                onClick={() => setSelectedZoneFilter('A')} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedZoneFilter === 'A' ? 'bg-[#990000] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Zone A (A-01 - A-12)
              </button>
              <button 
                onClick={() => setSelectedZoneFilter('B')} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedZoneFilter === 'B' ? 'bg-[#990000] text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Zone B (B-01 - B-12)
              </button>
            </div>

            {/* Map Legend */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Boş</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Atandı</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Rezerve</span>
            </div>
          </div>

          {/* 2D Interactive Map Matrix Canvas */}
          <div className={`rounded-3xl p-6 md:p-8 shadow-2xl border transition-all duration-500 text-white space-y-8 ${
            mapTheme === 'cyber' ? 'bg-slate-950 border-cyan-500/40 shadow-cyan-900/30' :
            mapTheme === 'crimson' ? 'bg-red-950 border-red-600/40 shadow-red-900/30' :
            mapTheme === 'emerald' ? 'bg-emerald-950 border-emerald-500/40 shadow-emerald-900/30' :
            'bg-slate-900 border-indigo-500/40 shadow-indigo-900/30'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <MapPin className={mapTheme === 'cyber' ? 'text-cyan-400' : mapTheme === 'crimson' ? 'text-red-500' : mapTheme === 'emerald' ? 'text-emerald-400' : 'text-indigo-400'} size={22} /> 
                  2D İnteraktif Fuar Yerleşim Planı
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Stant kutularına tıklayarak firma atamasını doğrudan gerçekleştirebilirsiniz.
                </p>
              </div>

              {/* Dynamic Theme Background Switcher Bar */}
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/15 backdrop-blur-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 px-1">Harita Teması:</span>
                {[
                  { id: 'cyber', name: 'Siber Neon', bgClass: 'bg-cyan-500' },
                  { id: 'crimson', name: 'Bordo Ateşi', bgClass: 'bg-red-600' },
                  { id: 'emerald', name: 'Zümrüt Parlak', bgClass: 'bg-emerald-500' },
                  { id: 'dark', name: 'Gece Mavisi', bgClass: 'bg-indigo-600' }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      setMapTheme(t.id);
                      if (window.toast) window.toast.success(`Harita teması '${t.name}' olarak ayarlandı.`);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      mapTheme === t.id ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.bgClass}`}></span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Matrix View */}
            <div className="space-y-8">
              
              {/* Zone A Section */}
              {(selectedZoneFilter === 'ALL' || selectedZoneFilter === 'A') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-900/60 text-red-300 rounded-lg text-xs font-extrabold border border-red-700/50">
                      ZONE A — Ana Fuaye Alanı (12 Stant)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredStands.filter(s => s.zone === 'A').map(stand => {
                      const isAssigned = stand.status === 'Atandı';
                      const isReserved = stand.status === 'Rezerve';
                      return (
                        <div
                          key={stand.id}
                          onClick={() => handleOpenStandModal(stand)}
                          className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 ${
                            isAssigned 
                              ? 'bg-rose-950/70 border-rose-500/80 shadow-rose-900/40 hover:border-rose-400' 
                              : isReserved 
                              ? 'bg-amber-950/70 border-amber-500/80 shadow-amber-900/40 hover:border-amber-400' 
                              : mapTheme === 'cyber' ? 'bg-cyan-950/50 border-cyan-400/60 shadow-cyan-900/30 hover:border-cyan-300 hover:shadow-cyan-500/40' 
                              : mapTheme === 'emerald' ? 'bg-emerald-950/50 border-emerald-400/60 shadow-emerald-900/30 hover:border-emerald-300'
                              : mapTheme === 'crimson' ? 'bg-red-950/50 border-red-500/60 shadow-red-900/30 hover:border-red-400'
                              : 'bg-slate-900/80 border-indigo-400/60 shadow-indigo-900/30 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-sm text-white">{stand.code}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isAssigned ? 'bg-rose-500 text-white shadow-sm' :
                              isReserved ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-emerald-400 text-slate-950 shadow-sm'
                            }`}>
                              {stand.status || 'Boş'}
                            </span>
                          </div>

                          <div className="min-h-[42px] flex flex-col justify-center">
                            {stand.assignedCompanyName ? (
                              <p className="text-xs font-bold text-white truncate">{stand.assignedCompanyName}</p>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic">Tıkla & Firma Ata</p>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                            <span>Masa #{stand.id}</span>
                            <span className="text-amber-300 font-bold group-hover:underline">Atama Yap &rarr;</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Central Walkway Visual Separator */}
              {selectedZoneFilter === 'ALL' && (
                <div className="py-2 flex items-center gap-4 text-xs font-bold text-slate-400">
                  <div className="flex-1 border-b border-dashed border-white/20"></div>
                  <span className="px-4 py-1.5 rounded-full bg-black/40 text-slate-200 border border-white/15 backdrop-blur-md shadow-inner">
                    🚶 KORİDOR & ETKİNLİK GEÇİŞ YOLU
                  </span>
                  <div className="flex-1 border-b border-dashed border-white/20"></div>
                </div>
              )}

              {/* Zone B Section */}
              {(selectedZoneFilter === 'ALL' || selectedZoneFilter === 'B') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-900/60 text-blue-300 rounded-lg text-xs font-extrabold border border-blue-700/50">
                      ZONE B — Rektörlük Bahçesi Stantları (12 Stant)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredStands.filter(s => s.zone === 'B').map(stand => {
                      const isAssigned = stand.status === 'Atandı';
                      const isReserved = stand.status === 'Rezerve';
                      return (
                        <div
                          key={stand.id}
                          onClick={() => handleOpenStandModal(stand)}
                          className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 ${
                            isAssigned 
                              ? 'bg-rose-950/70 border-rose-500/80 shadow-rose-900/40 hover:border-rose-400' 
                              : isReserved 
                              ? 'bg-amber-950/70 border-amber-500/80 shadow-amber-900/40 hover:border-amber-400' 
                              : mapTheme === 'cyber' ? 'bg-cyan-950/50 border-cyan-400/60 shadow-cyan-900/30 hover:border-cyan-300 hover:shadow-cyan-500/40' 
                              : mapTheme === 'emerald' ? 'bg-emerald-950/50 border-emerald-400/60 shadow-emerald-900/30 hover:border-emerald-300'
                              : mapTheme === 'crimson' ? 'bg-red-950/50 border-red-500/60 shadow-red-900/30 hover:border-red-400'
                              : 'bg-slate-900/80 border-indigo-400/60 shadow-indigo-900/30 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-sm text-white">{stand.code}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isAssigned ? 'bg-rose-500 text-white shadow-sm' :
                              isReserved ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-emerald-400 text-slate-950 shadow-sm'
                            }`}>
                              {stand.status || 'Boş'}
                            </span>
                          </div>

                          <div className="min-h-[42px] flex flex-col justify-center">
                            {stand.assignedCompanyName ? (
                              <p className="text-xs font-bold text-white truncate">{stand.assignedCompanyName}</p>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic">Tıkla & Firma Ata</p>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                            <span>Masa #{stand.id}</span>
                            <span className="text-amber-300 font-bold group-hover:underline">Atama Yap &rarr;</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-[#990000]"/> Firmalardan Gelen Katılım Başvuruları
            </h3>
            <span className="text-xs font-bold text-gray-500">Toplam: {careerFairApplications?.length || 0} Başvuru</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="p-4 text-xs font-extrabold text-gray-500 uppercase">Firma / ID</th>
                  <th className="p-4 text-xs font-extrabold text-gray-500 uppercase">Başvuru Tarihi</th>
                  <th className="p-4 text-xs font-extrabold text-gray-500 uppercase">Durum & Stant Masa</th>
                  <th className="p-4 text-xs font-extrabold text-gray-500 uppercase">Katılım Yanıtları</th>
                  <th className="p-4 text-xs font-extrabold text-gray-500 uppercase text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {(careerFairApplications || []).map(app => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-red-50/20 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900 text-sm">{app.companyName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">ID: {app.id}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-600">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider mb-1.5 ${
                        app.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : 
                        app.status === 'Reddedildi' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>

                      {app.status === 'Onaylandı' && (
                        <div>
                          {editingTableAppId === app.id ? (
                            <div className="flex items-center gap-1 mt-1">
                              <input 
                                type="text" 
                                value={quickTableInput} 
                                onChange={e => setQuickTableInput(e.target.value)} 
                                placeholder="Stant A-01" 
                                className="w-24 text-xs border border-gray-300 rounded px-2 py-1" 
                              />
                              <button onClick={() => handleSaveQuickTable(app.id)} className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700">
                                <Check size={14}/>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                              <span>Masa: {app.tableNumber || 'Atanmadı'}</span>
                              <button 
                                onClick={() => { setEditingTableAppId(app.id); setQuickTableInput(app.tableNumber || ''); }} 
                                className="text-[#990000] hover:underline"
                              >
                                <Edit3 size={12}/>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      <div className="space-y-1 max-w-xs">
                        {app.answers && Object.entries(app.answers).slice(0, 3).map(([k, v]) => (
                          <div key={k} className="truncate"><span className="font-semibold text-gray-700">{k}:</span> {String(v)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {app.status !== 'Onaylandı' && (
                        <button 
                          onClick={() => handleApproveApplication(app.id)} 
                          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg mr-2 transition-colors font-bold text-xs" 
                          title="Onayla"
                        >
                          <Check size={16}/>
                        </button>
                      )}
                      {app.status !== 'Reddedildi' && (
                        <button 
                          onClick={() => handleRejectApplication(app.id)} 
                          className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-bold text-xs" 
                          title="Reddet"
                        >
                          <X size={16}/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {(careerFairApplications?.length || 0) === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 text-xs">Henüz başvuru bulunmamaktadır.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CANLI ZİRVE SAHNESİ, KONUŞMACI AKIŞI & İNTERAKTİF SORU-CEVAP (Live Stage Studio) */}
      {activeTab === 'live_stage' && (
        <div className="space-y-6 animate-fade-in">
          {/* Dynamic Theme Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${
            stageTheme === 'bordo' ? 'bg-gradient-to-r from-red-950 via-[#990000] to-red-900' :
            stageTheme === 'midnight' ? 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900' :
            stageTheme === 'emerald' ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950' :
            'bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950'
          }`}>
            <div className="relative z-10">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-300/30 inline-flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
                Canlı Yayın: Rektörlük & Kariyer Merkezi Ana Sahne
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Canlı Zirve Sahnesi & Soru-Cevap</h3>
              <p className="text-xs sm:text-sm text-red-100/90 mt-2 max-w-xl font-medium leading-relaxed">
                Fuar günü ana sahnede sunum yapan CEO, İK Direktörleri ve mezun konuşmacıların zaman akışını yönetin; öğrencilerin sorularını düzenleyin ve canlı yayın temasını değiştirin.
              </p>
            </div>

            {/* Tema Rengi Seçici & Ekleme Butonu */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0">
              <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/80 px-2">Tema:</span>
                {[
                  { id: 'bordo', name: 'Bordo', class: 'bg-[#990000]' },
                  { id: 'midnight', name: 'Gece', class: 'bg-indigo-900' },
                  { id: 'emerald', name: 'Zümrüt', class: 'bg-emerald-700' },
                  { id: 'amber', name: 'Kehribar', class: 'bg-amber-600' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => { setStageTheme(t.id); if(window.toast) window.toast.success(`Sahne teması '${t.name}' olarak değiştirildi.`); }}
                    className={`w-6 h-6 rounded-xl ${t.class} border-2 transition cursor-pointer ${stageTheme === t.id ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    title={t.name}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sol Kolon: Günün Sahne Akış Programı (DÜZENLENEBİLİR) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock size={18} className="text-[#990000]" /> Zirve Sahnesi Oturum Akışı ({stageSessions.length})
                </h4>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">Canlı Yayın</span>
              </div>

              {/* Yeni Oturum Ekleme / Düzenleme Formu */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <p className="font-black text-slate-700">Yeni Oturum / Konuşmacı Ekle</p>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Saat (Örn: 10:30 - 11:15)" 
                    value={newSession.time} 
                    onChange={e => setNewSession({...newSession, time: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                  <input 
                    type="text" 
                    placeholder="Firma / Kurum (Örn: Trendyol)" 
                    value={newSession.company} 
                    onChange={e => setNewSession({...newSession, company: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Konuşmacı Adı & Unvanı" 
                  value={newSession.speaker} 
                  onChange={e => setNewSession({...newSession, speaker: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Oturum / Sunum Başlığı" 
                  value={newSession.topic} 
                  onChange={e => setNewSession({...newSession, topic: e.target.value})} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
                <button 
                  onClick={() => {
                    if (!newSession.topic || !newSession.speaker) return;
                    const sess = {
                      id: `SESS-${Date.now()}`,
                      time: newSession.time || '14:00 - 14:45',
                      speaker: newSession.speaker,
                      company: newSession.company || 'İESÜ',
                      topic: newSession.topic,
                      status: 'Bekliyor',
                      isLive: false
                    };
                    setStageSessions([...stageSessions, sess]);
                    setNewSession({ time: '', speaker: '', company: '', topic: '' });
                    if(window.toast) window.toast.success("Yeni oturum eklendi.");
                  }}
                  className="w-full py-2 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Oturumu Programa Ekle
                </button>
              </div>

              {/* Oturum Listesi */}
              <div className="space-y-3 pt-1">
                {stageSessions.map((session) => (
                  <div key={session.id} className={`p-4 rounded-2xl border transition-all ${session.isLive ? 'bg-red-50/70 border-red-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#990000] bg-white px-2.5 py-1 rounded-lg border border-red-100">{session.time}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setStageSessions(stageSessions.map(s => s.id === session.id ? { ...s, isLive: !s.isLive, status: !s.isLive ? 'CANLI SAHNEDE' : 'Bekliyor' } : { ...s, isLive: false, status: 'Bekliyor' }));
                            if(window.toast) window.toast.success(`${session.speaker} yayını güncellendi.`);
                          }}
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full cursor-pointer transition ${session.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                          {session.status}
                        </button>
                        <button 
                          onClick={() => setStageSessions(stageSessions.filter(s => s.id !== session.id))}
                          className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h5 className="font-black text-slate-900 text-sm leading-snug">{session.topic}</h5>
                    <p className="text-xs text-slate-600 font-bold mt-1">{session.speaker} — <span className="text-[#990000]">{session.company}</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Kolon: DÜZENLENEBİLİR Canlı Öğrenci Soru-Cevap Modülü */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Salondan Gelen Sorular ({stageQuestions.length})
                </h4>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">Düzenlenebilir Hub</span>
              </div>

              {/* Soru Ekleme Formu */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3 text-xs">
                <p className="font-black text-amber-900">Salondan Soru / Söyleşi Konusu Ekle</p>
                <input 
                  type="text" 
                  placeholder="Öğrenci Adı Soyadı (Örn: Selin YILMAZ)" 
                  value={newStudentName} 
                  onChange={e => setNewStudentName(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
                <textarea 
                  rows="2" 
                  placeholder="Konuşmacıya sorulacak soru metni..." 
                  value={newQuestionText} 
                  onChange={e => setNewQuestionText(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold resize-none"
                ></textarea>
                <button 
                  onClick={() => {
                    if (!newQuestionText) return;
                    const q = {
                      id: `Q-${Date.now()}`,
                      student: newStudentName || 'Öğrenci',
                      question: newQuestionText,
                      votes: 1
                    };
                    setStageQuestions([q, ...stageQuestions]);
                    setNewQuestionText('');
                    setNewStudentName('');
                    if (window.toast) window.toast.success("Yeni soru ekrana gönderildi!");
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Soruyu Yayın Akışına Ekle
                </button>
              </div>

              {/* Sorular Listesi & Düzenleme */}
              <div className="space-y-3 pt-1">
                {stageQuestions.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    {editingQuestionId === q.id ? (
                      <div className="space-y-2">
                        <textarea 
                          rows="2" 
                          value={editingQuestionText} 
                          onChange={e => setEditingQuestionText(e.target.value)} 
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                        ></textarea>
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => setEditingQuestionId(null)} 
                            className="px-3 py-1 bg-slate-200 rounded-lg text-xs font-bold"
                          >
                            İptal
                          </button>
                          <button 
                            onClick={() => {
                              setStageQuestions(stageQuestions.map(item => item.id === q.id ? { ...item, question: editingQuestionText } : item));
                              setEditingQuestionId(null);
                              if (window.toast) window.toast.success("Soru güncellendi.");
                            }} 
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#990000] uppercase tracking-wider">{q.student} sordu:</span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => { setEditingQuestionId(q.id); setEditingQuestionText(q.question); }} 
                                className="text-slate-400 hover:text-amber-600 transition cursor-pointer p-1"
                                title="Soruyu Düzenle"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                onClick={() => setStageQuestions(stageQuestions.filter(item => item.id !== q.id))} 
                                className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                                title="Soruyu Sil"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.question}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setStageQuestions(stageQuestions.map(item => item.id === q.id ? { ...item, votes: item.votes + 1 } : item));
                            if (window.toast) window.toast.success("Sorunuza oy verildi!");
                          }}
                          className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-black text-xs transition cursor-pointer shrink-0 shadow-sm flex items-center gap-1"
                        >
                          ▲ {q.votes}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Post Announcement to Feed */}
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Megaphone size={20} className="text-[#990000]"/> Öğrenci Haber Kaynağına Duyuru Paylaş
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Öğrencilerin ve mezunların ana akışında "Kariyer Günleri" etiketiyle yayınlanacak resmî duyuruyu oluşturun.
            </p>
            
            <textarea 
              rows="5" 
              placeholder="Örn: Kariyer günleri katılım stant haritası yayınlandı! Tüm öğrencilerimizi fuar alanına bekliyoruz..."
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#990000] outline-none resize-none"
            ></textarea>
            
            <button 
              onClick={handlePostAnnouncement} 
              className="w-full bg-[#990000] hover:bg-[#7A0000] text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Send size={18} /> Duyuruyu Akışa Çık
            </button>
          </div>

          {/* Card 2: Bulk Email / Push Notifications */}
          <div className="bg-gradient-to-br from-red-900/10 via-red-800/5 to-slate-50 rounded-2xl p-8 border border-red-200/50 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
             <div className="w-16 h-16 bg-[#990000] rounded-2xl flex items-center justify-center shadow-lg text-white">
               <Send size={28} />
             </div>
             <h4 className="font-extrabold text-gray-900 text-lg">Firmalara Toplu E-Posta & Bildirim</h4>
             <p className="text-xs text-gray-600 max-w-sm leading-relaxed">
               Masa ve stant atamaları yapılan onaylı ({approvedApplications?.length || 0}) firmaya bilgilendirme ve giriş kartı detaylarını iletin.
             </p>
             <button 
               onClick={handleNotifyCompanies} 
               className="w-full max-w-xs bg-[#990000] hover:bg-[#7A0000] text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 text-sm"
             >
               <Send size={16} /> Toplu Bildirim Tetikle
             </button>
          </div>
        </div>
      )}

      {/* GLASSMORPHIC STAND ASSIGNMENT MODAL */}
      {activeModalStand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#990000] flex items-center justify-center font-black">
                  {activeModalStand.code?.substring(6) || activeModalStand.id}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">{activeModalStand.code} Tahsis Paneli</h3>
                  <p className="text-xs text-gray-500">Zone {activeModalStand.zone} Stant Konfigürasyonu</p>
                </div>
              </div>
              <button onClick={() => setActiveModalStand(null)} className="p-2 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Stant Durumu</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setModalSelectedStatus('Atandı')} 
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      modalSelectedStatus === 'Atandı' ? 'bg-rose-600 text-white border-rose-600 shadow' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Atandı
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setModalSelectedStatus('Rezerve')} 
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      modalSelectedStatus === 'Rezerve' ? 'bg-amber-500 text-white border-amber-500 shadow' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Rezerve
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setModalSelectedStatus('Boş')} 
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      modalSelectedStatus === 'Boş' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Boş
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Onaylı Firma Seçin</label>
                  <select 
                    value={modalSelectedCompany} 
                    onChange={e => {
                      setModalSelectedCompany(e.target.value);
                      if (e.target.value && modalSelectedStatus === 'Boş') {
                        setModalSelectedStatus('Atandı');
                      }
                    }} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                  >
                    <option value="">Lütfen firma seçin...</option>
                    {approvedApplications.map(app => (
                      <option key={app.id} value={app.companyName}>
                        {app.companyName} (ID: {app.companyId})
                      </option>
                    ))}
                    <option value="Protokol Rezervasyonu">Protokol Rezervasyonu</option>
                    <option value="CUSTOM">+ Manuel İsim Gir...</option>
                  </select>
                </div>

                {modalSelectedCompany === 'CUSTOM' && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Firma / Kurum Adı</label>
                    <input 
                      type="text" 
                      value={modalCustomName} 
                      onChange={e => setModalCustomName(e.target.value)} 
                      placeholder="Kurum adını yazın..." 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleClearStandAssignment} 
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Stant Boşalt
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmStandAssignment} 
                  className="flex-1 py-2.5 bg-[#990000] hover:bg-[#7A0000] text-white font-bold rounded-xl text-xs transition-all shadow active:scale-95"
                >
                  Atamayı Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSCareerFair;

