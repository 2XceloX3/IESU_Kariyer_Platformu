import React, { useState } from 'react';
import { 
  ArrowLeft, Upload, CheckCircle2, Briefcase, MapPin, Calendar, Layout, 
  AlertCircle, Sparkles, Building2, ShieldCheck, ExternalLink, X, Plus, 
  Home, Layers, Clock, Tag, Globe, Check, FileText
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';

export default function JobCreator({ setView, currentUser: propsCurrentUser, addNotification: propsAddNotification }) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const currentUser = propsCurrentUser || storeCurrentUser;
  const storeAddNotification = useAppStore(state => state.addNotification);
  const addNotification = propsAddNotification || storeAddNotification;

  const jobs = useAppStore(state => state.jobs);
  const setJobs = useAppStore(state => state.setJobs);

  // Default deadline: 30 days from today
  const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    type: 'STAJ',
    workModel: 'Hibrit',
    department: 'Tüm Bölümler & Genel',
    location: 'İstanbul (Hibrit)',
    date: defaultDeadline,
    description: '',
    applicationLink: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Görsel boyutu en fazla 5MB olmalıdır.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        if (error) setError(null);
      };
      reader.onerror = () => {
        setError("Görsel yüklenirken bir hata oluştu.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
  };

  // 🤖 AI Career Wingman — Akıllı İlan Metni Üretici
  const handleGenerateAIDescription = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Lütfen önce bir İlan Başlığı girin (örn: Frontend Developer Stajyeri).");
      return;
    }

    setIsGeneratingAI(true);
    if (window.toast?.info) {
      window.toast.info("AI Career Wingman ilan metnini hazırlıyor...");
    }

    setTimeout(() => {
      const position = formData.title.trim();
      const isIntern = formData.type === 'STAJ' || formData.type === 'CO-OP';
      const companyName = currentUser?.name || 'Kurumsal Şirketimiz';

      const aiText = `${companyName} bünyesinde ${formData.location} lokasyonunda görev alacak, motivasyonu yüksek ve gelişime açık "${position}" takım arkadaşları arıyoruz.

Görev Tanımı & Sorumluluklar:
• İlgili departman süreçlerinde aktif rol almak ve proje geliştirme adımlarına katkı sağlamak
• Güncel sektörel metodolojileri ve teknolojik araçları iş akışlarına uygulamak
• Mentor eşliğinde haftalık hedeflere yönelik araştırmalar ve teknik analizler yürütmek
• Takım içi koordinasyonu sağlamak ve süreç geliştirme önerileri sunmak

Aranan Nitelikler:
• İstanbul Esenyurt Üniversitesi veya ilgili üniversitelerin ilgili bölümlerinde ${isIntern ? 'öğrenci (3. veya 4. sınıf)' : 'yeni mezun veya son sınıf öğrencisi'}
• Analitik düşünme, araştırmacı ruh ve sonuç odaklı problem çözme yetkinliği
• Takım çalışmasına yatkın, dinamik çalışma temposuna uyum sağlayabilecek
• İletişim becerileri kuvvetli ve sürekli öğrenmeye istekli

Sunduğumuz Olanaklar:
• Üniversite onaylı staj/iş deneyimi ve İESÜ Kariyer Koordinatörlüğü onaylı sertifika
• Birebir kıdemli uzman mentörlüğü ve profesyonel kariyer koçluğu
• Esnek ve yenilikçi çalışma ortamı (${formData.workModel})
• Şirket içi eğitim programları ve sektörel networking fırsatları`;

      setFormData(prev => ({ ...prev, description: aiText }));
      setIsGeneratingAI(false);
      if (window.toast?.success) {
        window.toast.success("AI İlan Metni başarıyla oluşturuldu!");
      }
    }, 900);
  };

  const handleSubmit = () => {
    setError(null);
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setError("Lütfen zorunlu alanları (İlan Başlığı, Lokasyon ve Açıklama) doldurun.");
      return;
    }

    const companyName = (currentUser?.role === 'company' || currentUser?.role === 'employer')
      ? (currentUser.name || 'Kurumsal Firma')
      : (currentUser?.name || 'İESÜ Kurumsal Partner');

    const formattedDate = formData.date 
      ? new Date(formData.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Son Başvuru: Yakında';

    const newJob = {
      id: 'JOB-' + Date.now(),
      title: formData.title.trim(),
      company: companyName,
      location: formData.location.trim(),
      type: formData.type,
      workModel: formData.workModel,
      department: formData.department,
      date: formattedDate,
      rawDeadline: formData.date,
      description: formData.description.trim(),
      applicationLink: formData.applicationLink.trim() || '#',
      logo: previewImage || currentUser?.avatar || currentUser?.logo || '',
      imageUrl: previewImage || '',
      status: 'Beklemede', // Admin onay havuzuna gider
      createdAt: new Date().toISOString()
    };

    setJobs([newJob, ...(jobs || [])]);

    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'info',
        title: 'İlan Onaya Gönderildi',
        message: `"${newJob.title}" başlıklı ilanınız üniversite yönetimi onayına gönderildi. Onaylandığında tüm öğrencilere duyurulacaktır.`
      });
    }

    if (window.toast?.success) {
      window.toast.success("İlanınız başarıyla yönetici onayına gönderildi!");
    }

    setSuccess(true);
    setTimeout(() => {
      const store = useAppStore.getState();
      if (store.setActivePortalBranch) store.setActivePortalBranch('company');
      if (setView) setView('company');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-28 font-sans animate-fade-in">
      
      {/* ─── 1. KURUMSAL ÜST NAVBAR (INSTITUTIONAL HEADER) ─── */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Sol: Üniversite Logo & Başlık (Tıklanınca Firma Akışına Döner) */}
          <div 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setView) setView('company');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            title="Firma Paneli & Kurumsal Akışa Dön"
          >
            <Logo color="blue" className="h-9 w-auto shrink-0 group-hover:scale-105 transition-transform" />
            <div className="text-left min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider truncate">
                Kurumsal İnsan Kaynakları & Yetenek Portalı
              </p>
            </div>
          </div>

          {/* Orta: Dal Rozeti */}
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              🏢 Yeni İlan & Yetenek Arama Masası
            </span>
          </div>

          {/* Sağ: Aksiyon Butonları */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('company');
                if (setView) setView('company');
              }} 
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="İptal Et ve Firma Akışına Dön"
            >
              <ArrowLeft size={16} /> 
              <span className="hidden sm:inline">Vazgeç</span>
            </button>

            <button 
              onClick={handleSubmit} 
              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-900 via-[#0A2342] to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white text-xs sm:text-sm font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="İlanı Onaya Gönder"
            >
              <CheckCircle2 size={16} />
              <span>Onaya Gönder</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. KURUMSAL HERO BANNER ─── */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-gradient-to-r from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 border border-blue-400/40 text-blue-200 flex items-center gap-1">
                  <Sparkles size={11} /> Resmî İlan & Staj Portalı
                </span>
                <span className="text-xs text-blue-200/80 font-medium">• Üniversite Onaylı İşveren Paneli</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                Yeni Kariyer & Staj İlanı Yayınlayın
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 font-medium leading-relaxed">
                İstanbul Esenyurt Üniversitesi öğrencileri ve mezunları için kariyer ve staj fırsatınızı oluşturun. İlanınız onaylandıktan sonra üniversitemizin tüm dijital portallarında eşzamanlı yayınlanacaktır.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="w-11 h-11 rounded-xl bg-blue-600/30 text-blue-200 flex items-center justify-center font-black border border-blue-400/30">
                <Building2 size={22} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">İşveren / Kurum</p>
                <p className="text-sm font-black text-white leading-tight mt-0.5 max-w-[180px] truncate">
                  {currentUser?.name || 'Kurumsal Partner'}
                </p>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={11} /> Doğrulanmış Partner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. ANA İÇERİK: SOL FORM + SAĞ CANLI ÖNİZLEME ─── */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-6 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* SOL KOLON: İLAN FORMU */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-bold text-xs flex items-center gap-2.5 animate-shake shadow-2xs">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold text-xs flex items-center gap-2.5 animate-fade-in shadow-2xs">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>İlanınız başarıyla yönetici onayına gönderildi! Kurumsal akışa yönlendiriliyorsunuz...</span>
            </div>
          )}

          {/* Form Kartı 1: Temel İlan Bilgileri */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-black text-xs">
                <Briefcase size={16} />
              </div>
              İlan Detayları & Pozisyon Bilgisi
            </h3>

            <div className="space-y-4">
              {/* İlan Başlığı */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  İlan Başlığı <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Örn: Frontend Developer Stajyeri, Satış & Pazarlama Uzmanı..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition" 
                />
              </div>

              {/* 2'li Grid: İlan Tipi & Çalışma Modeli */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    İlan Tipi <span className="text-rose-600">*</span>
                  </label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition cursor-pointer"
                  >
                    <option value="STAJ">Staj (Öğrenci / Zorunlu / İsteğe Bağlı)</option>
                    <option value="İŞ">Tam Zamanlı İş (Mezun / Genel)</option>
                    <option value="YARI ZAMANLI">Yarı Zamanlı (Part-Time)</option>
                    <option value="CO-OP">Co-Op & Uzun Dönem Staj</option>
                    <option value="ATÖLYE">Kariyer Atölyesi / BootCamp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Çalışma Modeli <span className="text-rose-600">*</span>
                  </label>
                  <select 
                    name="workModel" 
                    value={formData.workModel} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition cursor-pointer"
                  >
                    <option value="Hibrit">Hibrit (Ofis + Uzaktan)</option>
                    <option value="Uzaktan / Remote">Uzaktan / Remote</option>
                    <option value="Ofisten / Yerinde">Ofisten / Yerinde</option>
                  </select>
                </div>
              </div>

              {/* 2'li Grid: Lokasyon & Son Başvuru Tarihi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Çalışma Yeri / Lokasyon <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      placeholder="Örn: İstanbul (Avrupa) veya Teknopark Ar-Ge" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Son Başvuru Tarihi <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition cursor-pointer" 
                    />
                  </div>
                </div>
              </div>

              {/* Hedef Fakülte / Bölüm */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Hedef Fakülte / Bölüm
                </label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition cursor-pointer"
                >
                  <option value="Tüm Bölümler & Genel">Tüm Bölümler & Genel Başvuru</option>
                  <option value="Mühendislik ve Mimarlık Fakültesi">Mühendislik ve Mimarlık Fakültesi</option>
                  <option value="İktisadi, İdari ve Sosyal Bilimler Fakültesi">İktisadi, İdari ve Sosyal Bilimler Fakültesi</option>
                  <option value="Sağlık Bilimleri Fakültesi">Sağlık Bilimleri Fakültesi</option>
                  <option value="Uygulamalı Bilimler Yüksekokulu">Uygulamalı Bilimler Yüksekokulu</option>
                  <option value="Meslek Yüksekokulu (MYO)">Sağlık Hizmetleri / Meslek Yüksekokulu</option>
                </select>
              </div>

              {/* Açıklama & AI Generator */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    İlan Açıklaması & Nitelikler <span className="text-rose-600">*</span>
                  </label>
                  <button 
                    type="button"
                    onClick={handleGenerateAIDescription}
                    disabled={isGeneratingAI}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black shadow-2xs hover:shadow transition-all cursor-pointer disabled:opacity-60"
                    title="İlan Başlığına Göre Otomatik Profesyonel Metin Oluştur"
                  >
                    <Sparkles size={13} className={isGeneratingAI ? 'animate-spin' : ''} />
                    <span>{isGeneratingAI ? 'AI Oluşturuyor...' : 'AI ile İlan Metni Üret'}</span>
                  </button>
                </div>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  maxLength={5000} 
                  onChange={handleInputChange} 
                  placeholder="Pozisyonun görev tanımını, adayda aranan teknik veya sosyal yetkinlikleri ve kurumsal olanakları buraya yazın veya yukarıdaki 'AI ile İlan Metni Üret' butonunu kullanın..." 
                  rows={8} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition resize-y leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium mt-1">
                  <span>Markdown ve madde işaretleri desteklenmektedir.</span>
                  <span>{formData.description.length} / 5000 karakter</span>
                </div>
              </div>

              {/* Dış Bağlantı URL */}
              <div className="pt-1">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Dış Başvuru Bağlantısı (Opsiyonel)
                </label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input 
                    type="url" 
                    name="applicationLink" 
                    value={formData.applicationLink} 
                    onChange={handleInputChange} 
                    placeholder="https://sirketiniz.com/kariyer/basvuru" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15 transition" 
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Boş bırakırsanız aday başvuruları doğrudan İESÜ ATS Aday Takip Panonuza düşer.
                </p>
              </div>

            </div>
          </div>

          {/* Form Kartı 2: Afiş & Görsel Yükle */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-black text-xs">
                <Upload size={16} />
              </div>
              İlan Afişi veya Kurumsal Görsel
            </h3>

            {previewImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 group h-56 bg-slate-100 flex items-center justify-center">
                <img src={previewImage} alt="İlan Afişi" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-slate-950/80 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer backdrop-blur-sm"
                  title="Görseli Kaldır"
                >
                  <X size={14} /> Görseli Kaldır
                </button>
              </div>
            ) : (
              <div className="w-full h-36 border-2 border-dashed border-slate-300 hover:border-blue-900 transition-colors rounded-2xl flex flex-col items-center justify-center bg-slate-50/80 hover:bg-blue-50/30 relative cursor-pointer group overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 group-hover:border-blue-300 shadow-2xs flex items-center justify-center text-slate-500 group-hover:text-blue-900 transition-colors mb-2">
                  <Upload size={20} />
                </div>
                <p className="text-xs font-black text-slate-700 group-hover:text-blue-900 transition-colors">
                  Afiş yüklemek için tıklayın veya sürükleyip bırakın
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP (Maksimum 5MB)
                </p>
              </div>
            )}
          </div>

        </div>

        {/* SAĞ KOLON: CANLI ÖNİZLEME (LIVE PREVIEW) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4 sticky top-24">
          
          {/* Önizleme Bilgi Başlığı */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="font-black text-blue-950 text-xs uppercase tracking-wider">
                Canlı İlan Önizlemesi (Live Preview)
              </h4>
              <p className="text-[11px] text-blue-900/80 font-medium leading-relaxed mt-0.5">
                Bu ilan, üniversitemiz öğrenci ve mezunlarının İş & Staj Portalında tam olarak bu kart biçiminde görüntülenecektir.
              </p>
            </div>
          </div>

          {/* Gerçekçi İlan Kartı */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_15px_35px_rgba(10,35,66,0.08)] transition-all">
            
            {/* Kart Üst Kapak Görseli */}
            <div className="h-44 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-[#0A2342] to-blue-950 flex items-center justify-center">
              {previewImage ? (
                <img src={previewImage} alt="Önizleme" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-white/90">
                  <Briefcase size={36} className="text-blue-300 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-blue-100">İstanbul Esenyurt Üniversitesi</p>
                  <p className="text-[10px] text-blue-200/70 uppercase tracking-widest font-black mt-0.5">
                    Kariyer Geliştirme Koordinatörlüğü
                  </p>
                </div>
              )}

              {/* İlan Tipi Rozeti */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                <span className="text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md bg-gradient-to-r from-blue-700 to-indigo-700 border border-white/20 uppercase tracking-wider">
                  {formData.type}
                </span>
                <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md bg-slate-950/75 backdrop-blur-md border border-white/10">
                  {formData.workModel}
                </span>
              </div>
            </div>

            {/* Kart İçerik Gövdesi */}
            <div className="p-6">
              
              {/* Firma Başlığı & Logo */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <SafeAvatar 
                    src={previewImage || currentUser?.avatar || currentUser?.logo} 
                    name={currentUser?.name || 'Firma'} 
                    size="sm" 
                    alt="Logo" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-lg text-slate-900 leading-tight truncate">
                    {formData.title || 'İlan Başlığı Buraya Gelecek'}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-600 text-xs font-bold">
                    <span>{currentUser?.name || 'Kurumsal Firma Adı'}</span>
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Meta Rozetler: Lokasyon, Departman, Tarih */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600 mb-4 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <MapPin size={13} className="text-blue-900" /> {formData.location || 'Lokasyon'}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Calendar size={13} className="text-blue-900" /> {formData.date || 'Tarih'}
                </span>
                <span className="flex items-center gap-1 bg-blue-50 text-blue-900 px-2.5 py-1 rounded-lg">
                  <Tag size={12} /> {formData.department}
                </span>
              </div>

              {/* İlan Açıklaması Kısmi Önizleme */}
              <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-100 mb-5">
                {formData.description || 'İlanınızın detaylı açıklaması, görev tanımı ve aranan kriterler burada görüntülenecektir...'}
              </div>

              {/* Başvuru Butonu Önizlemesi */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button 
                  disabled 
                  className="flex-1 py-3 bg-gradient-to-r from-blue-900 via-[#0A2342] to-indigo-900 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 opacity-95 cursor-not-allowed"
                >
                  <span>Öğrenci Başvuru Butonu (Önizleme)</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ─── 4. KURUMSAL FİRMA ALT NAVİGASYON DOCK'U (TEMİZ 4'LÜ SİMGE DOCK'U) ─── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
          
          {/* 1. Kurumsal Akış */}
          <button 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setView) setView('company');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="p-2.5 rounded-full text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-slate-950 hover:to-[#0A2342] transition-all cursor-pointer flex items-center justify-center" 
            title="Kurumsal Akış & Ana Sayfa"
          >
            <Home size={22} strokeWidth={2.2} />
          </button>
          
          {/* 2. Yeni İlan Yayınla (Şu an aktif sayfa) */}
          <button 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#0A2342] to-indigo-800 text-white shadow-lg shadow-blue-950/40 flex items-center justify-center mx-1 shrink-0 border border-blue-300/40 cursor-default" 
            title="Yeni İlan Masası (Aktif)"
          >
            <Plus size={24} strokeWidth={2.8} />
          </button>
          
          {/* 3. ATS Aday Takip Panosu */}
          <button 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setView) setView('company_ats');
            }} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
            title="ATS Aday Takip Panosu (Kanban)"
          >
            <Briefcase size={22} strokeWidth={2.5} />
          </button>
          
          {/* 4. Firma Profilim */}
          <button 
            onClick={() => { 
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setSelectedUserId) setSelectedUserId((currentUser?.role === 'company' || currentUser?.role === 'employer') ? currentUser.id : 'CMP-001'); 
              if (setView) setView('user_profile'); 
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Kurumsal Firma Profilim"
          >
            <SafeAvatar 
              src={currentUser?.avatar || currentUser?.logo} 
              name={currentUser?.name || 'Firma'} 
              size="xs" 
              alt="Profile" 
            />
          </button>
        </div>
      </div>

    </div>
  );
}
