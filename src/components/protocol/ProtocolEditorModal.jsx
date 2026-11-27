import React, { useState, useMemo, useRef } from 'react';
import {
  X, FileText, Plus, Trash2, ArrowUp, ArrowDown, Upload,
  Download, Printer, Save, RotateCcw, Eye, Settings2, CheckCircle2, Paperclip
} from 'lucide-react';
import {
  PROTOCOL_TYPES,
  PROTOCOL_SECTORS,
  PROTOCOL_PLACEHOLDERS,
  DEFAULT_PROTOCOL_TEMPLATE,
  loadCustomProtocolTemplate,
  saveCustomProtocolTemplate,
  resetCustomProtocolTemplate,
  generateProtocolCode,
  interpolateProtocolText,
  exportBilateralProtocolDraftPdf,
  exportBilateralProtocolWord
} from '../../services/protocolWorkflow';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB

/**
 * ProtocolEditorModal — İESÜ Özelleştirilebilir Kurumsal Protokol & Şablon Stüdyosu
 * Personel veya Yönetici;
 *   1) Yeni protokol oluşturabilir veya mevcut herhangi bir protokolün bilgilerini + maddelerini değiştirebilir,
 *   2) Üniversitenin kendi resmî protokol şablonunu (başlık, maddeler, imza bloğu) kalıcı olarak düzenleyebilir,
 *   3) Kurumun kendi mevcut .docx / .doc / .pdf / .txt protokol dosyasını sisteme yükleyip indirebilir,
 *   4) Özelleştirilen belgeyi anında önizleyip Microsoft Word (.doc) veya PDF olarak indirebilir.
 */
export default function ProtocolEditorModal({
  isOpen,
  onClose,
  initialMode = 'protocol', // 'protocol' | 'template'
  protocol = null, // null -> yeni protokol
  existingCount = 0,
  onSaveProtocol
}) {
  const [mode, setMode] = useState(initialMode); // 'protocol' | 'template'
  const [activeTab, setActiveTab] = useState(initialMode === 'template' ? 'articles' : 'info'); // 'info' | 'articles' | 'preview'
  const [template, setTemplate] = useState(() => loadCustomProtocolTemplate());

  const [form, setForm] = useState(() => {
    const base = protocol || {};
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return {
      id: base.id || `PRT-${Date.now()}`,
      protocolCode: base.protocolCode || generateProtocolCode(existingCount + 1),
      companyName: base.companyName || '',
      sector: base.sector || PROTOCOL_SECTORS[0],
      protocolType: base.protocolType || PROTOCOL_TYPES.COOPERATION,
      taxNo: base.taxNo || '',
      mersisNo: base.mersisNo || '',
      companyAddress: base.companyAddress || '',
      contactPerson: base.contactPerson || '',
      contactTitle: base.contactTitle || '',
      contactEmail: base.contactEmail || '',
      contactPhone: base.contactPhone || '',
      assignedFaculty: base.assignedFaculty || 'Tüm Fakülte ve MYO Programları',
      committedQuota: base.committedQuota ?? base.internshipQuota ?? 10,
      signedDate: base.signedDate || base.startDate || today,
      validUntil: base.validUntil || base.endDate || nextYear,
      senateDecisionNo: base.senateDecisionNo || '',
      scope: base.scope || '',
      status: base.status || 'PENDING_APPROVAL',
      attachedFile: base.attachedFile || null,
      customArticles: Array.isArray(base.customArticles) && base.customArticles.length > 0
        ? base.customArticles
        : loadCustomProtocolTemplate().articles.map(a => ({ ...a }))
    };
  });

  const fileInputRef = useRef(null);
  const templateFileInputRef = useRef(null);

  const previewProtocol = useMemo(() => {
    if (mode === 'template') {
      return {
        ...form,
        companyName: form.companyName || 'Örnek Kurumsal İşletme A.Ş.',
        contactPerson: form.contactPerson || 'İnsan Kaynakları Direktörü',
        contactTitle: form.contactTitle || 'Yetkili',
        customArticles: template.articles
      };
    }
    return form;
  }, [mode, form, template.articles]);

  if (!isOpen) return null;

  const activeArticles = mode === 'template' ? template.articles : form.customArticles;
  const setActiveArticles = (updater) => {
    if (mode === 'template') {
      setTemplate(prev => ({
        ...prev,
        articles: typeof updater === 'function' ? updater(prev.articles) : updater
      }));
    } else {
      setForm(prev => ({
        ...prev,
        customArticles: typeof updater === 'function' ? updater(prev.customArticles) : updater
      }));
    }
  };

  const handleAddArticle = () => {
    setActiveArticles(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        title: `Madde ${prev.length + 1} — Ek Hüküm`,
        body: ''
      }
    ]);
  };

  const handleMoveArticle = (idx, dir) => {
    setActiveArticles(prev => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const handleRemoveArticle = (id) => {
    setActiveArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateArticle = (id, field, value) => {
    setActiveArticles(prev => prev.map(a => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const handleFileUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      window.toast?.error?.('Dosya boyutu 4 MB sınırını aşıyor.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const payload = {
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        dataUrl: ev.target.result,
        uploadedAt: new Date().toLocaleDateString('tr-TR')
      };
      if (target === 'template') {
        const nextTpl = { ...template, uploadedTemplateFile: payload };
        setTemplate(nextTpl);
        saveCustomProtocolTemplate(nextTpl);
        window.toast?.success?.(`Kurumsal şablon dosyası (${file.name}) yüklendi.`);
      } else {
        setForm(prev => ({ ...prev, attachedFile: payload }));
        window.toast?.success?.(`Protokol dosyası (${file.name}) eklendi.`);
      }
      // Metin tabanlı dosya (.txt) ise içeriği madde olarak da içe aktarabilme kolaylığı
      if (file.name.toLowerCase().endsWith('.txt')) {
        const textReader = new FileReader();
        textReader.onload = (tev) => {
          const text = String(tev.target.result || '').trim();
          if (text) {
            setActiveArticles([{ id: `m-import-${Date.now()}`, title: 'Özel Protokol Metni', body: text }]);
            window.toast?.info?.('Metin dosyasının içeriği protokol maddelerine aktarıldı.');
          }
        };
        textReader.readAsText(file, 'utf-8');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const downloadAttachedFile = (fileObj) => {
    if (!fileObj?.dataUrl) return;
    const a = document.createElement('a');
    a.href = fileObj.dataUrl;
    a.download = fileObj.name || 'IESU_Protokol_Belgesi';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSave = () => {
    if (mode === 'template') {
      const saved = saveCustomProtocolTemplate(template);
      setTemplate(saved);
      window.toast?.success?.('Üniversite özel protokol şablonu kaydedildi! Tüm yeni çıktılar bu şablonla hazırlanacak.');
      onClose?.();
      return;
    }
    if (!form.companyName.trim()) {
      window.toast?.error?.('Lütfen firma / kurum adını yazın.');
      setActiveTab('info');
      return;
    }
    onSaveProtocol?.({
      ...form,
      committedQuota: Number(form.committedQuota) || 0,
      internshipQuota: Number(form.committedQuota) || 0,
      updatedAt: new Date().toISOString()
    });
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Protokol ve Şablon Editörü"
      data-testid="protocol-editor-modal"
    >
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Üst Başlık */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black truncate">
                {mode === 'template'
                  ? 'Üniversite Özel Protokol Şablonu Yönetimi'
                  : (protocol ? `Protokolü Düzenle — ${protocol.companyName || protocol.protocolCode}` : 'Yeni Kurumsal İş Birliği Protokolü Oluştur')}
              </h2>
              <p className="text-[11px] text-indigo-200 truncate">
                Kendi kurum maddelerinizi yazın, mevcut dosyanızı yükleyin, Word (.doc) veya PDF olarak indirin.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mod & Sekme Çubuğu */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setMode('protocol'); setActiveTab('info'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                mode === 'protocol' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Bu Protokolü Düzenle
            </button>
            <button
              type="button"
              onClick={() => { setMode('template'); setActiveTab('articles'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                mode === 'template' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Settings2 size={13} /> Kurumsal Ana Şablon
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {mode === 'protocol' && (
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  activeTab === 'info' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 font-black' : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                1. Kurum & Dosya
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                activeTab === 'articles' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 font-black' : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {mode === 'template' ? '1. Başlık, Maddeler & Dosya' : '2. Maddeleri Özelleştir'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 font-black' : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Eye size={13} /> Canlı Önizleme
            </button>
          </div>
        </div>

        {/* Gövde (Kaydırılabilir) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* SEKME 1: PROTOKOL BİLGİLERİ & DOSYA EKİ */}
          {mode === 'protocol' && activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Firma / Kurum Adı *</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="Örn: Türk Hava Yolları Teknik A.Ş."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Protokol Kodu</label>
                  <input
                    type="text"
                    value={form.protocolCode}
                    onChange={(e) => setForm(f => ({ ...f, protocolCode: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Sektör</label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm(f => ({ ...f, sector: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {PROTOCOL_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Protokol Türü</label>
                  <select
                    value={form.protocolType}
                    onChange={(e) => setForm(f => ({ ...f, protocolType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {Object.values(PROTOCOL_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">İmza Yetkilisi</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                    placeholder="Ad Soyad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Yetkili Unvanı</label>
                  <input
                    type="text"
                    value={form.contactTitle}
                    onChange={(e) => setForm(f => ({ ...f, contactTitle: e.target.value }))}
                    placeholder="Örn: İnsan Kaynakları Müdürü"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="yetkili@firma.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="0212 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Vergi No / MERSİS</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.taxNo}
                      onChange={(e) => setForm(f => ({ ...f, taxNo: e.target.value }))}
                      placeholder="Vergi No"
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={form.mersisNo}
                      onChange={(e) => setForm(f => ({ ...f, mersisNo: e.target.value }))}
                      placeholder="MERSİS No"
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Yıllık Kontenjan & Tarihler</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={form.committedQuota}
                      onChange={(e) => setForm(f => ({ ...f, committedQuota: e.target.value }))}
                      placeholder="Kontenjan"
                      className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                    <input
                      type="date"
                      value={form.signedDate}
                      onChange={(e) => setForm(f => ({ ...f, signedDate: e.target.value }))}
                      className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold"
                    />
                    <input
                      type="date"
                      value={form.validUntil}
                      onChange={(e) => setForm(f => ({ ...f, validUntil: e.target.value }))}
                      className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Resmî Adres</label>
                  <input
                    type="text"
                    value={form.companyAddress}
                    onChange={(e) => setForm(f => ({ ...f, companyAddress: e.target.value }))}
                    placeholder="Firma resmî adresi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1">Hedef Fakülte / Birim & İş Birliği Kapsamı</label>
                  <textarea
                    rows={2}
                    value={form.scope}
                    onChange={(e) => setForm(f => ({ ...f, scope: e.target.value }))}
                    placeholder="Staj, 7+1 uygulamalı eğitim, teknik gezi, istihdam önceliği vb..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium resize-none"
                  />
                </div>
              </div>

              {/* Kendi Protokol Dosyasını Yükleme Alanı */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Paperclip size={14} /> Kendi Protokol Dosyanızı Yükleyin (.pdf, .docx, .doc, .txt)
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Kurumunuzun hazır protokol dosyası veya imzalı taranmış nüshası varsa doğrudan bu protokole ekleyebilirsiniz.
                  </p>
                  {form.attachedFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span className="truncate max-w-[220px]">{form.attachedFile.name}</span>
                      <span className="text-slate-400">({form.attachedFile.sizeKb} KB)</span>
                      <button type="button" onClick={() => downloadAttachedFile(form.attachedFile)} className="text-indigo-600 hover:underline cursor-pointer">İndir</button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, attachedFile: null }))} className="text-rose-500 hover:underline cursor-pointer">Kaldır</button>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.odt"
                    onChange={(e) => handleFileUpload(e, 'protocol')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload size={14} /> Dosya Seç / Yükle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEKME 2: MADDELERİ & KURUMSAL ŞABLONU DÜZENLE */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              {mode === 'template' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Üst Başlık & İmza Bloğu</h4>
                    <div className="flex items-center gap-2">
                      <input
                        ref={templateFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.odt"
                        onChange={(e) => handleFileUpload(e, 'template')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => templateFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Upload size={12} /> Resmî Şablon Dosyası Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const def = resetCustomProtocolTemplate();
                          setTemplate(def);
                          window.toast?.info?.('Varsayılan şablon geri yüklendi.');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} /> Sıfırla
                      </button>
                    </div>
                  </div>

                  {template.uploadedTemplateFile && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 text-xs">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 truncate">
                        Yüklü Kurumsal Dosya: {template.uploadedTemplateFile.name} ({template.uploadedTemplateFile.sizeKb} KB)
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => downloadAttachedFile(template.uploadedTemplateFile)} className="text-indigo-700 dark:text-indigo-300 font-black hover:underline cursor-pointer">İndir</button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...template, uploadedTemplateFile: null };
                            setTemplate(next);
                            saveCustomProtocolTemplate(next);
                          }}
                          className="text-rose-600 font-black hover:underline cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Üst Kurum Başlığı</label>
                      <input
                        type="text"
                        value={template.headerTitle}
                        onChange={(e) => setTemplate(t => ({ ...t, headerTitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Alt Başlık / Protokol Adı</label>
                      <input
                        type="text"
                        value={template.headerSubtitle}
                        onChange={(e) => setTemplate(t => ({ ...t, headerSubtitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Üniversite Tarafı & Birim</label>
                      <input
                        type="text"
                        value={template.institutionParty}
                        onChange={(e) => setTemplate(t => ({ ...t, institutionParty: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Üniversite Resmî Adresi</label>
                      <input
                        type="text"
                        value={template.institutionAddress}
                        onChange={(e) => setTemplate(t => ({ ...t, institutionAddress: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Sol İmza Bloğu (Üniversite)</label>
                      <input
                        type="text"
                        value={template.signerLeftRole}
                        onChange={(e) => setTemplate(t => ({ ...t, signerLeftRole: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">Sağ İmza Bloğu (Karşı Kurum)</label>
                      <input
                        type="text"
                        value={template.signerRightRole}
                        onChange={(e) => setTemplate(t => ({ ...t, signerRightRole: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dinamik Alan Kısayolları */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40">
                <p className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-1.5">
                  Otomatik Değişkenler (Maddelerde kullanabilirsiniz — firma bilgileri otomatik dolar)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PROTOCOL_PLACEHOLDERS.slice(0, 10).map(ph => (
                    <span
                      key={ph.token}
                      title={ph.label}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300"
                    >
                      {ph.token}
                    </span>
                  ))}
                </div>
              </div>

              {/* Maddeler Listesi */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Protokol Maddeleri ({activeArticles.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddArticle}
                    className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Yeni Madde Ekle
                  </button>
                </div>

                {activeArticles.map((art, idx) => (
                  <div key={art.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={art.title}
                        onChange={(e) => handleUpdateArticle(art.id, 'title', e.target.value)}
                        placeholder={`Madde ${idx + 1} Başlığı`}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black"
                      />
                      <button type="button" onClick={() => handleMoveArticle(idx, -1)} disabled={idx === 0} aria-label="Yukarı Taşı" className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer">
                        <ArrowUp size={13} />
                      </button>
                      <button type="button" onClick={() => handleMoveArticle(idx, 1)} disabled={idx === activeArticles.length - 1} aria-label="Aşağı Taşı" className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-30 cursor-pointer">
                        <ArrowDown size={13} />
                      </button>
                      <button type="button" onClick={() => handleRemoveArticle(art.id)} aria-label="Maddeyi Sil" className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={art.body}
                      onChange={(e) => handleUpdateArticle(art.id, 'body', e.target.value)}
                      placeholder="Madde içeriğini kurumunuzun resmî metnine göre yazın..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEKME 3: CANLI A4 BELGE ÖNİZLEME */}
          {activeTab === 'preview' && (
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 shadow-inner p-6 sm:p-8 space-y-5 max-w-3xl mx-auto">
              <div className="border-b-2 border-[#990000] pb-3 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0a2342]">
                    {interpolateProtocolText(template.headerTitle, previewProtocol)}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500">
                    {interpolateProtocolText(template.headerSubtitle, previewProtocol)}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-700 shrink-0">
                  {previewProtocol.protocolCode || 'TASLAK'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div><span className="font-black text-slate-600">Üniversite:</span> {template.institutionParty}</div>
                <div><span className="font-black text-slate-600">İşletme:</span> {previewProtocol.companyName || '—'}</div>
                <div><span className="font-black text-slate-600">Yetkili:</span> {previewProtocol.contactPerson || '—'} ({previewProtocol.contactTitle || '—'})</div>
                <div><span className="font-black text-slate-600">Kontenjan / Süre:</span> {previewProtocol.committedQuota || 0} Aday • {previewProtocol.signedDate} — {previewProtocol.validUntil}</div>
              </div>

              <div className="space-y-3">
                {activeArticles.map((art) => (
                  <div key={art.id} className="space-y-1">
                    <h4 className="text-xs font-black text-[#0a2342]">
                      {interpolateProtocolText(art.title, previewProtocol)}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {interpolateProtocolText(art.body, previewProtocol)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
                <div className="p-3 rounded-xl border border-dashed border-slate-300">
                  <p className="font-black">{interpolateProtocolText(template.signerLeftTitle, previewProtocol)}</p>
                  <p className="text-slate-600 text-[11px]">{interpolateProtocolText(template.signerLeftRole, previewProtocol)}</p>
                  <p className="mt-6 text-slate-400">İmza / Kaşe</p>
                </div>
                <div className="p-3 rounded-xl border border-dashed border-slate-300">
                  <p className="font-black">{interpolateProtocolText(template.signerRightTitle, previewProtocol)}</p>
                  <p className="text-slate-600 text-[11px]">{interpolateProtocolText(template.signerRightRole, previewProtocol)}</p>
                  <p className="mt-6 text-slate-400">İmza / Kaşe</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alt Aksiyon Çubuğu (Tek, net eylem çubuğu) */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportBilateralProtocolWord(previewProtocol, template)}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700/50 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download size={14} /> Word (.doc) İndir
            </button>
            <button
              type="button"
              onClick={() => exportBilateralProtocolDraftPdf(previewProtocol, template)}
              className="px-3.5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer size={14} /> PDF / Yazdır
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Save size={14} /> {mode === 'template' ? 'Kurumsal Şablonu Kaydet' : 'Protokolü Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
