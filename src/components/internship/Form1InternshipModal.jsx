import React, { useState } from 'react';
import { 
  X, CheckCircle, AlertCircle, FileText, Building2, ShieldCheck, 
  Calendar, UserCheck, Download, Send, ArrowRight, ArrowLeft, 
  HelpCircle, CheckCircle2, Check, Sparkles 
} from 'lucide-react';
import { 
  validateTCKN, 
  validateSGKSicil, 
  validateVKN, 
  calculateWorkDays, 
  validateForm1Submission, 
  advanceInternshipStatus,
  MIN_INTERNSHIP_WORK_DAYS,
  MAX_INTERNSHIP_WORK_DAYS,
  LAW_REFERENCES 
} from '../../services/internshipWorkflow';
import { downloadReportPdf } from '../../utils/downloadPdf';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../shared/LanguageSwitcher';

export default function Form1InternshipModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onSaveInternship,
  initialData = null 
}) {
  const { t, isEn } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(() => ({
    studentName: currentUser?.name || 'Ayşe Kaya',
    studentNo: currentUser?.studentNo || '20220101001',
    tcNo: currentUser?.tcNo || '10000000146',
    faculty: currentUser?.faculty || 'Mühendislik ve Doğa Bilimleri Fakültesi',
    department: currentUser?.department || currentUser?.dept || 'Bilgisayar Mühendisliği',
    phone: currentUser?.phone || '0555 111 2233',
    email: currentUser?.email || 'ayse.kaya@ogr.esenyurt.edu.tr',
    address: currentUser?.address || 'Esenyurt, İstanbul',
    
    // İşyeri Bilgileri
    companyName: initialData?.companyName || 'Aselsan A.Ş.',
    companyAddress: initialData?.companyAddress || 'ODTÜ Teknokent Titanyum Blok No:12 Çankaya/Ankara',
    sgkSicilNo: initialData?.sgkSicilNo || '2.4510.01.01.1234567.034.01-44',
    taxNo: initialData?.taxNo || '1234567890',
    companyAuthorizedPerson: initialData?.companyAuthorizedPerson || 'Ahmet Yılmaz',
    companyAuthorizedTitle: initialData?.companyAuthorizedTitle || 'Yazılım Grup Lideri',
    companyAuthorizedEmail: initialData?.companyAuthorizedEmail || 'ahmet.yilmaz@aselsan.com.tr',
    companyAuthorizedPhone: initialData?.companyAuthorizedPhone || '0312 555 0000',
    
    // Tarihler & Çalışma Günleri
    startDate: initialData?.startDate || '2026-07-01',
    endDate: initialData?.endDate || '2026-07-31',
    includeSaturdays: Boolean(initialData?.includeSaturdays),
    workDays: initialData?.workDays || 22,
    
    // SGK 5510 Beyanı
    hasFamilyGss: initialData?.hasFamilyGss !== undefined ? initialData.hasFamilyGss : true,
    isEmployedElsewhere: Boolean(initialData?.isEmployedElsewhere),
    receivesPension: Boolean(initialData?.receivesPension),
    sgkCommitmentApproved: initialData?.sgkCommitmentApproved !== undefined ? initialData.sgkCommitmentApproved : true,
    
    // 3308 Ücret & İşveren Onayı
    isPaid: initialData?.isPaid !== undefined ? initialData.isPaid : true,
    monthlyWage: initialData?.monthlyWage || 17500,
    hasUnemploymentFundSupport: initialData?.hasUnemploymentFundSupport !== undefined ? initialData.hasUnemploymentFundSupport : true,
    employerApproved: initialData?.employerApproved !== undefined ? initialData.employerApproved : true,
  }));

  const [validationErrors, setValidationErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Recalculate work days when dates or saturday toggle changes
  const computedWorkDays = calculateWorkDays(formData.startDate, formData.endDate, formData.includeSaturdays);

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'startDate' || field === 'endDate' || field === 'includeSaturdays') {
        const start = field === 'startDate' ? value : prev.startDate;
        const end = field === 'endDate' ? value : prev.endDate;
        const sat = field === 'includeSaturdays' ? value : prev.includeSaturdays;
        next.workDays = calculateWorkDays(start, end, sat);
      }
      return next;
    });
  };

  const isTcValid = validateTCKN(formData.tcNo);
  const isSgkValid = validateSGKSicil(formData.sgkSicilNo);
  const isVknValid = validateVKN(formData.taxNo);

  const handleNextStep = () => {
    setValidationErrors([]);
    if (currentStep === 1) {
      if (!formData.studentName || !formData.studentNo || !formData.department) {
        setValidationErrors(['Lütfen tüm öğrenci ve öğrenim alanlarını eksiksiz doldurunuz.']);
        return;
      }
      if (!isTcValid) {
        setValidationErrors(['T.C. Kimlik Numarası geçersizdir. Algoritmaya uygun 11 haneli kimlik numaranızı giriniz.']);
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.companyName || !formData.companyAddress || !formData.companyAuthorizedPerson) {
        setValidationErrors(['Lütfen tüm kurum ve yetkili bilgilerini doldurunuz.']);
        return;
      }
      if (!isSgkValid) {
        setValidationErrors(['SGK İşyeri Sicil Numarası geçerli formatta değildir.']);
        return;
      }
      if (!isVknValid) {
        setValidationErrors(['Vergi Kimlik Numarası (VKN 10 hane) geçerli değildir.']);
        return;
      }
      if (computedWorkDays < MIN_INTERNSHIP_WORK_DAYS) {
        setValidationErrors([`Staj süresi en az ${MIN_INTERNSHIP_WORK_DAYS} iş günü olmalıdır. Mevcut: ${computedWorkDays} gün`]);
        return;
      }
    } else if (currentStep === 3) {
      if (typeof formData.hasFamilyGss !== 'boolean') {
        setValidationErrors(['Lütfen Genel Sağlık Sigortası (GSS) durumunuzu seçiniz.']);
        return;
      }
      if (!formData.sgkCommitmentApproved) {
        setValidationErrors(['Lütfen 5510 ve 3308 Sayılı Kanun kapsamındaki Resmî SGK Taahhütnamesini onaylayınız.']);
        return;
      }
    }
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    setValidationErrors([]);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleDownloadPdf = () => {
    const lines = [
      'İSTANBUL ESENYURT ÜNİVERSİTESİ',
      'KARİYER GELİŞTİRME KOORDİNATÖRLÜĞÜ',
      'FORM-1: RESMİ STAJ KABUL VE SGK TAAHHÜT FORMU',
      '3308 ve 5510 Sayılı Kanunlar Kapsamında',
      '------------------------------------------------------------',
      `Öğrenci Adı Soyadı: ${formData.studentName}`,
      `T.C. Kimlik No: ${formData.tcNo}`,
      `Öğrenci Numarası: ${formData.studentNo}`,
      `Fakülte: ${formData.faculty}`,
      `Bölüm / Program: ${formData.department}`,
      `Telefon: ${formData.phone}`,
      `E-posta: ${formData.email}`,
      '------------------------------------------------------------',
      `Staj Yapılacak İşletme: ${formData.companyName}`,
      `SGK İşyeri Sicil No: ${formData.sgkSicilNo}`,
      `Vergi Kimlik No: ${formData.taxNo}`,
      `İşletme Adresi: ${formData.companyAddress}`,
      `Kurum Yetkilisi: ${formData.companyAuthorizedPerson} (${formData.companyAuthorizedTitle})`,
      `Yetkili İletişim: ${formData.companyAuthorizedEmail} / ${formData.companyAuthorizedPhone}`,
      `Staj Tarihleri: ${formData.startDate} - ${formData.endDate} (${formData.workDays} İş Günü)`,
      `Haftalık Çalışma: ${formData.includeSaturdays ? 'Haftada 6 Gün (Cumartesi Dahil)' : 'Haftada 5 Gün'}`,
      '------------------------------------------------------------',
      'SGK VE SAĞLIK HİZMETİ BEYANI (5510 Sayılı Kanun Madde 5/b):',
      `Genel Sağlık Sigortası (GSS) Durumu: ${formData.hasFamilyGss ? 'Aile Üzerinden Sağlık Yardımı Alıyor (GSS Hariç, %1 İK/MH)' : 'Sağlık Yardımı Almıyor (Üniversitece GSS Dahil, %6 Prim)'}`,
      `Başka Bir İşte Sigortalı Çalışma: ${formData.isEmployedElsewhere ? 'Evet' : 'Hayır'}`,
      `Yetim/Malullük Aylığı Durumu: ${formData.receivesPension ? 'Evet' : 'Hayır'}`,
      'Taahhüt: Bilgilerin doğruluğunu ve değişiklik halinde bildireceğimi taahhüt ederim. [ONAYLANDI]',
      '------------------------------------------------------------',
      '3308 SAYILI KANUN İŞVEREN KABUL VE ÜCRET BEYANI:',
      `Ücret Durumu: ${formData.isPaid ? `Ücretli (${formData.monthlyWage} TL/Ay)` : 'Ücretsiz'}`,
      `İşsizlik Fonu Devlet Katkısı: ${formData.hasUnemploymentFundSupport ? 'Talep Ediliyor' : 'Talep Edilmiyor'}`,
      'İşletme Yetkilisi Onayı: [Kaşe ve Islak/Elektronik İmza Onaylandı]',
      '',
      `Belge Oluşturma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`,
      `Bölüm Staj Komisyonu Onayı: [İncelemeye Sevk Edildi]`
    ];

    downloadReportPdf('form1-staj-kabul-sgk-taahhut', `Form1_${formData.studentName.replace(/\s+/g, '_')}_Staj_Kabul`, lines);
    window.toast?.success?.('📄 Form-1 Staj Kabul ve SGK Taahhüt Formu PDF olarak oluşturuldu.');
  };

  const handleSubmitApplication = () => {
    const validation = validateForm1Submission(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const newInternship = {
        id: initialData?.id || `INT-${Date.now()}`,
        studentId: currentUser?.id || currentUser?.uid || 'STD-001',
        ...formData,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };

      const advanced = advanceInternshipStatus(newInternship, 'SUBMIT_FORM_1');
      if (onSaveInternship) {
        onSaveInternship(advanced);
      }
      window.toast?.success?.('✅ Form-1 Staj Başvurunuz Bölüm Staj Komisyonu onayına başarıyla iletildi!');
      onClose();
    } catch (err) {
      setValidationErrors([err.message || 'Başvuru kaydedilirken bir hata oluştu.']);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#990000] via-red-900 to-slate-900 text-white p-6 sm:p-8 relative">
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <LanguageSwitcher variant="pill" />
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30">
              {isEn ? 'Form-1 • Official Application' : 'Form-1 • Resmî Başvuru'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-400/30">
              {isEn ? 'Law No. 3308 / 5510' : '3308 / 5510 Sayılı Kanun'}
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t('internship.form1Title')}
          </h2>
          <p className="text-xs sm:text-sm text-red-100/90 mt-1 max-w-2xl">
            {isEn
              ? 'Istanbul Esenyurt University Career Development Coordination Office & Academic Internship Commission official approval workflow.'
              : 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü ve Bölüm Staj Komisyonu resmi staj onay iş akışı.'}
          </p>

          {/* Stepper Wizard Bar */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-white/20">
            {[
              { num: 1, label: t('internship.step1') },
              { num: 2, label: t('internship.step2') },
              { num: 3, label: t('internship.step3') },
              { num: 4, label: t('internship.step4') }
            ].map(step => (
              <div 
                key={step.num}
                onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                className={`flex items-center gap-2 cursor-pointer transition ${currentStep === step.num ? 'opacity-100 font-black' : step.num < currentStep ? 'opacity-90' : 'opacity-40'}`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${currentStep === step.num ? 'bg-amber-400 text-slate-900 shadow-md' : step.num < currentStep ? 'bg-emerald-400 text-slate-900' : 'bg-white/20 text-white'}`}>
                  {step.num < currentStep ? <Check size={14} /> : step.num}
                </div>
                <span className="text-[11px] sm:text-xs truncate hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Errors Box */}
        {validationErrors.length > 0 && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 animate-shake">
            <div className="flex items-center gap-2 font-black text-xs text-[#990000] mb-1">
              <AlertCircle size={16} /> Lütfen Aşağıdaki Eksiklikleri Düzeltiniz:
            </div>
            <ul className="list-disc list-inside text-xs font-medium space-y-0.5 text-red-800">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Body Content by Step */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* STEP 1: Öğrenci Bilgileri */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">1. Öğrenci ve Öğrenim Bilgileri</h3>
                  <p className="text-xs text-slate-500">Resmi kimlik ve fakülte kayıt verilerinizi kontrol ediniz.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Adı ve Soyadı *
                  </label>
                  <input 
                    type="text" 
                    value={formData.studentName} 
                    onChange={e => handleFieldChange('studentName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    T.C. Kimlik Numarası *
                    {isTcValid ? (
                      <span className="ml-2 text-[10px] text-emerald-600 font-black">✓ Algoritma Doğrulandı</span>
                    ) : (
                      <span className="ml-2 text-[10px] text-red-600 font-bold">11 Haneli Resmî TCKN</span>
                    )}
                  </label>
                  <input 
                    type="text" 
                    maxLength={11}
                    value={formData.tcNo} 
                    onChange={e => handleFieldChange('tcNo', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 ${isTcValid ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Öğrenci Numarası *
                  </label>
                  <input 
                    type="text" 
                    value={formData.studentNo} 
                    onChange={e => handleFieldChange('studentNo', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Fakülte / Yüksekokul *
                  </label>
                  <input 
                    type="text" 
                    value={formData.faculty} 
                    onChange={e => handleFieldChange('faculty', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Bölüm / Program *
                  </label>
                  <input 
                    type="text" 
                    value={formData.department} 
                    onChange={e => handleFieldChange('department', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    İletişim Telefonu *
                  </label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => handleFieldChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Kurumsal / Kişisel E-posta *
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => handleFieldChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: İşyeri & Tarihler */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">2. Staj Yapılacak Kurum & Tarihler</h3>
                  <p className="text-xs text-slate-500">İşletmenin resmî SGK sicil bilgileri ve staj takvimi.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    İşletme / Kurum Resmî Ünvanı *
                  </label>
                  <input 
                    type="text" 
                    value={formData.companyName} 
                    onChange={e => handleFieldChange('companyName', e.target.value)}
                    placeholder="Örn: Baykar Teknoloji A.Ş."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    SGK İşyeri Sicil Numarası *
                    {isSgkValid && <span className="ml-2 text-[10px] text-emerald-600 font-black">✓ Geçerli Format</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.sgkSicilNo} 
                    onChange={e => handleFieldChange('sgkSicilNo', e.target.value)}
                    placeholder="2.4510.01.01.1234567.034.01-44"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">İşyeri muhasebesinden veya e-bildirge şifresiyle temin edilir.</p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Vergi Kimlik Numarası (VKN) *
                    {isVknValid && <span className="ml-2 text-[10px] text-emerald-600 font-black">✓ 10 Haneli VKN</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.taxNo} 
                    onChange={e => handleFieldChange('taxNo', e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    İşletme Açık Adresi *
                  </label>
                  <input 
                    type="text" 
                    value={formData.companyAddress} 
                    onChange={e => handleFieldChange('companyAddress', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Staj Yetkilisi Adı ve Soyadı *
                  </label>
                  <input 
                    type="text" 
                    value={formData.companyAuthorizedPerson} 
                    onChange={e => handleFieldChange('companyAuthorizedPerson', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Yetkili Kurumsal E-posta *
                  </label>
                  <input 
                    type="email" 
                    value={formData.companyAuthorizedEmail} 
                    onChange={e => handleFieldChange('companyAuthorizedEmail', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>

                {/* Staj Tarih Seçimi & Hesaplanan Gün */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Staj Başlangıç Tarihi *
                      </label>
                      <input 
                        type="date" 
                        value={formData.startDate} 
                        onChange={e => handleFieldChange('startDate', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                        Staj Bitiş Tarihi *
                      </label>
                      <input 
                        type="date" 
                        value={formData.endDate} 
                        onChange={e => handleFieldChange('endDate', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={formData.includeSaturdays}
                        onChange={e => handleFieldChange('includeSaturdays', e.target.checked)}
                        className="w-4 h-4 text-[#990000] rounded focus:ring-red-400"
                      />
                      <span className="text-xs font-bold text-slate-700">İşyerinde Cumartesi günleri de fiilen çalışılmaktadır (Haftada 6 gün)</span>
                    </label>

                    <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-black text-slate-800 shadow-sm shrink-0">
                      Hesaplanan Fiilî İş Günü: <span className={computedWorkDays >= MIN_INTERNSHIP_WORK_DAYS ? 'text-emerald-700' : 'text-red-600'}>{computedWorkDays} Gün</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 5510 Sayılı Kanun SGK Beyanı & Taahhütname */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">3. SGK 5510 / 5-b Yasal Sağlık Beyanı & Taahhüt</h3>
                  <p className="text-xs text-slate-500">Sigorta primlerinizin doğru kanun maddesinden ödenmesi için zorunlu yasal beyandır.</p>
                </div>
              </div>

              {/* Soru 1: GSS Durumu */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-black text-slate-900 leading-snug">
                  1. Anne/babanız üzerinden veya eşiniz üzerinden Genel Sağlık Sigortası (GSS) kapsamında bakmakla yükümlü olunan kişi sıfatıyla sağlık yardımı alıyor musunuz? *
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleFieldChange('hasFamilyGss', true)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${formData.hasFamilyGss === true ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${formData.hasFamilyGss === true ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                      {formData.hasFamilyGss === true && <Check size={12} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black">EVET, Sağlık Yardımı Alıyorum</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Üniversitemiz sadece İş Kazası ve Meslek Hastalığı priminizi (%1) öder.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleFieldChange('hasFamilyGss', false)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${formData.hasFamilyGss === false ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${formData.hasFamilyGss === false ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                      {formData.hasFamilyGss === false && <Check size={12} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black">HAYIR, Sağlık Yardımı Almıyorum</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Genel Sağlık Sigortası priminiz (%6) de Üniversitemiz bütçesinden karşılanır.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soru 2: Başka İşte Sigortalı Çalışma */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-black text-slate-900 leading-snug">
                  2. Staj süreniz boyunca herhangi bir işyerinde 4/a, 4/b veya 4/c kapsamında sigortalı olarak çalışacak mısınız? *
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input 
                      type="radio" 
                      name="employed" 
                      checked={formData.isEmployedElsewhere === false} 
                      onChange={() => handleFieldChange('isEmployedElsewhere', false)} 
                      className="text-[#990000]"
                    />
                    Hayır, sigortalı bir işte çalışmayacağım.
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input 
                      type="radio" 
                      name="employed" 
                      checked={formData.isEmployedElsewhere === true} 
                      onChange={() => handleFieldChange('isEmployedElsewhere', true)} 
                      className="text-[#990000]"
                    />
                    Evet, aktif sigortalı çalışmaktayım.
                  </label>
                </div>
              </div>

              {/* Yasal Taahhütname Kutusu */}
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#990000]">
                  <ShieldCheck size={16} /> 5510 & 3308 Sayılı Kanunlar Resmî Taahhütnamesi
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  "5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'nun 5/b maddesi ile 3308 Sayılı Mesleki Eğitim Kanunu hükümleri uyarınca; yukarıda verdiğim bilgilerin doğruluğunu, durumumda herhangi bir değişiklik olması halinde (sigortalı bir işe başlama, aylık bağlanması vb.) derhal İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü'ne ve Bölüm Staj Komisyonu'na yazılı olarak bildireceğimi, aksi takdirde doğabilecek idari para cezaları ile Kuruma yersiz ödenecek primleri yasal faiziyle ödemeyi kabul ve taahhüt ederim."
                </p>
                <label className="flex items-center gap-2.5 pt-2 border-t border-red-200 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.sgkCommitmentApproved} 
                    onChange={e => handleFieldChange('sgkCommitmentApproved', e.target.checked)} 
                    className="w-4 h-4 text-[#990000] rounded focus:ring-red-400"
                  />
                  <span className="text-xs font-black text-[#990000]">Yukarıdaki resmî taahhütnameyi okudum, anladım ve onaylıyorum. *</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: İşveren Kabulü, 3308 Ücret/İşsizlik Katkısı & Önizleme */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">4. İşveren Onayı, 3308 Ücret & Form-1 Önizleme</h3>
                  <p className="text-xs text-slate-500">İşletme yetkili onayı ve 3308 Sayılı Kanun Madde 25 devlet katkısı beyanı.</p>
                </div>
              </div>

              {/* 3308 Sayılı Kanun Madde 25 Ücret & Devlet Katkısı */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  3308 Sayılı Kanun Kapsamında Ücret & İşsizlik Fonu Devlet Katkısı
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Stajyer Ücreti Ödenecek mi? *</label>
                    <select 
                      value={formData.isPaid ? 'yes' : 'no'} 
                      onChange={e => handleFieldChange('isPaid', e.target.value === 'yes')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                    >
                      <option value="yes">Evet, Stajyer Ücreti Ödenecektir</option>
                      <option value="no">Hayır, Ücretsiz Stajdır</option>
                    </select>
                  </div>

                  {formData.isPaid && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aylık Net Stajyer Ücreti (TL) *</label>
                      <input 
                        type="number" 
                        value={formData.monthlyWage} 
                        onChange={e => handleFieldChange('monthlyWage', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#990000]"
                      />
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.hasUnemploymentFundSupport} 
                    onChange={e => handleFieldChange('hasUnemploymentFundSupport', e.target.checked)} 
                    className="w-4 h-4 text-[#990000] rounded focus:ring-red-400"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    İşletmemiz, 3308 Sayılı Kanun uyarınca İŞKUR İşsizlik Fonu Devlet Katkısından yararlanmak istemektedir.
                  </span>
                </label>
              </div>

              {/* İşveren Onay Kartı */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                    <UserCheck size={16} /> İşveren / Kurum Staj Kabul Onayı
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                    E-İmzalı / Kaşeli
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Yetkili: <b>{formData.companyAuthorizedPerson}</b> ({formData.companyAuthorizedTitle}) • {formData.companyName}
                </p>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formData.employerApproved} 
                    onChange={e => handleFieldChange('employerApproved', e.target.checked)} 
                    className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-400"
                  />
                  <span className="text-xs font-black text-emerald-900">
                    Yukarıda kimlik ve staj tarihleri belirtilen öğrencinin kurumumuzda staj yapması kabul edilmiştir.
                  </span>
                </label>
              </div>

              {/* Form-1 Belge Özeti ve PDF İndirme Butonu */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isEn ? 'Official Form-1 Document Ready' : 'Resmî Form-1 Belgesi Hazırlandı'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isEn
                      ? 'You can download the official Istanbul Esenyurt University headed Form-1 PDF or submit directly for commission review.'
                      : 'İstanbul Esenyurt Üniversitesi antetli resmi Form-1 çıktısını PDF olarak indirebilir veya doğrudan komisyon onayına iletebilirsiniz.'}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download size={15} /> {t('internship.downloadPdf')}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <button 
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ArrowLeft size={15} /> {t('common.back')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              {t('common.cancel')}
            </button>

            {currentStep < 4 ? (
              <button 
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer"
              >
                <span>{isEn ? 'Next' : 'İlerle'}</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button 
                type="button"
                disabled={submitting}
                onClick={handleSubmitApplication}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-700/25 cursor-pointer disabled:opacity-50"
              >
                <Send size={15} />
                <span>{submitting ? t('internship.submitting') : t('internship.submitToCommission')}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
