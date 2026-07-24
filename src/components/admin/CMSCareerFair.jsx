import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Settings, Edit3, Eye, Users, Calendar, Plus, Trash2, Check, X, Megaphone, MapPin, Send, Briefcase } from 'lucide-react';

const CMSCareerFair = () => {
  const careerFairEvent = useAppStore(state => state.careerFairEvent);
  const setCareerFairEvent = useAppStore(state => state.setCareerFairEvent);
  const careerFairFormTemplate = useAppStore(state => state.careerFairFormTemplate);
  const setCareerFairFormTemplate = useAppStore(state => state.setCareerFairFormTemplate);
  const careerFairApplications = useAppStore(state => state.careerFairApplications);
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);
  
  // To post announcements
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);

  const [activeTab, setActiveTab] = useState('form_builder');
  
  // Local state for event details editing
  const [eventDetails, setEventDetails] = useState({ ...careerFairEvent });
  
  // Local state for new form field
  const [newField, setNewField] = useState({ label: '', type: 'text', required: false, description: '', options: '' });

  // Announcement state
  const [announcementText, setAnnouncementText] = useState('');

  // Table assignment state
  const [editingTableId, setEditingTableId] = useState(null);
  const [tableNumber, setTableNumber] = useState('');

  const handleSaveEventDetails = () => {
    setCareerFairEvent(eventDetails);
    if(window.toast) window.toast.success("Etkinlik detayları güncellendi.");
  };

  const handleAddField = () => {
    if (!newField.label) return;
    const fieldToAdd = {
      id: 'f_' + Math.random().toString(36).substr(2, 9),
      label: newField.label,
      type: newField.type,
      required: newField.required,
      description: newField.description
    };
    if (newField.type === 'select') {
      fieldToAdd.options = newField.options.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    setCareerFairFormTemplate([...careerFairFormTemplate, fieldToAdd]);
    setNewField({ label: '', type: 'text', required: false, description: '', options: '' });
    if(window.toast) window.toast.success("Yeni soru forma eklendi.");
  };

  const handleRemoveField = (id) => {
    setCareerFairFormTemplate(careerFairFormTemplate.filter(f => f.id !== id));
  };

  const handleApproveApplication = (appId) => {
    setCareerFairApplications(careerFairApplications.map(app => 
      app.id === appId ? { ...app, status: 'Onaylandı' } : app
    ));
    if(window.toast) window.toast.success("Firma başvurusu onaylandı.");
  };

  const handleRejectApplication = (appId) => {
    setCareerFairApplications(careerFairApplications.map(app => 
      app.id === appId ? { ...app, status: 'Reddedildi' } : app
    ));
    if(window.toast) window.toast.error("Firma başvurusu reddedildi.");
  };

  const handleSaveTable = (appId) => {
    setCareerFairApplications(careerFairApplications.map(app => 
      app.id === appId ? { ...app, tableNumber } : app
    ));
    setEditingTableId(null);
    if(window.toast) window.toast.success("Masa numarası atandı.");
  };

  const handlePostAnnouncement = () => {
    if(!announcementText) return;
    const newPost = {
      id: 'PF-' + Date.now(),
      author: {
        name: 'Kariyer Geliştirme Koordinatörlüğü',
        role: 'admin',
        avatar: '/logo.png'
      },
      content: announcementText,
      createdAt: new Date().toISOString(),
      likes: 0, comments: 0,
      tags: ['Kariyer Günleri', 'Duyuru']
    };
    setPosts([newPost, ...posts]);
    setAnnouncementText('');
    if(window.toast) window.toast.success('Duyuru başarıyla yayınlandı!');
  };

  const handleNotifyCompanies = () => {
    const approvedCompanies = careerFairApplications.filter(app => app.status === 'Onaylandı');
    if(approvedCompanies.length === 0) {
      if(window.toast) window.toast.error('Onaylanmış firma bulunamadı.');
      return;
    }

    const newNotifications = approvedCompanies.map(app => ({
      id: 'NOTIF-' + Math.random().toString(36).substr(2, 9),
      userId: app.companyId,
      type: 'system',
      title: 'Masa Atamanız Yapıldı!',
      message: `Değerli ${app.companyName}, Kariyer Günleri etkinlik programı ve masa (Stant: ${app.tableNumber || 'Atanmadı'}) atamanız tamamlanmıştır. Detaylar için e-postanızı kontrol edebilirsiniz.`,
      read: false,
      date: new Date().toLocaleDateString('tr-TR')
    }));

    setNotifications([...newNotifications, ...(notifications || [])]);
    if(window.toast) window.toast.success(`${approvedCompanies.length} firmaya e-posta ve bildirim gönderildi!`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventDetails({ ...eventDetails, banner: reader.result });
        if(window.toast) window.toast.success('Görsel başarıyla yüklendi.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-red-900 to-[#990000] p-8 rounded-xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Calendar size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Kariyer Günleri Yönetimi</h2>
          <p className="text-red-100 text-[15px] max-w-xl">
            Geleneksel kariyer günleri etkinliklerini planlayın, firma başvuru formunu tasarlayın, onay süreçlerini yönetip masaları belirleyin.
          </p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex bg-white/10 p-1.5 rounded-xl backdrop-blur-md">
          <button onClick={() => setActiveTab('form_builder')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'form_builder' ? 'bg-white text-red-900 shadow-md' : 'text-white hover:bg-white/10'}`}>Form & Önizleme</button>
          <button onClick={() => setActiveTab('applications')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'applications' ? 'bg-white text-red-900 shadow-md' : 'text-white hover:bg-white/10'}`}>Firma Başvuruları ({careerFairApplications.length})</button>
          <button onClick={() => setActiveTab('announcements')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'announcements' ? 'bg-white text-red-900 shadow-md' : 'text-white hover:bg-white/10'}`}>Duyuru Çık</button>
        </div>
      </div>

      {activeTab === 'form_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Kolon: Etkinlik Ayarları ve Form Builder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><Settings size={18} className="text-red-600"/> Etkinlik Detayları</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Etkinlik Başlığı</label>
                  <input type="text" value={eventDetails.title} onChange={e => setEventDetails({...eventDetails, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Etkinlik Tarihi</label>
                  <input type="text" value={eventDetails.date} onChange={e => setEventDetails({...eventDetails, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Kısa Açıklama</label>
                  <textarea rows="2" value={eventDetails.description} onChange={e => setEventDetails({...eventDetails, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Banner Görseli Yükle</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-center font-medium text-gray-600 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      Bilgisayardan Resim Seç (.jpg, .png)
                    </label>
                  </div>
                  {eventDetails.banner && eventDetails.banner.startsWith('data:image') && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">Görsel seçildi.</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={eventDetails.isActive} onChange={e => setEventDetails({...eventDetails, isActive: e.target.checked})} className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                    Başvuruları Açık Tut (Firmalar Görebilir)
                  </label>
                  <button onClick={handleSaveEventDetails} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">Kaydet</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><Edit3 size={18} className="text-orange-500"/> Soru Ekle / Form Düzenle</h3>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6 space-y-3">
                <input type="text" placeholder="Soru Başlığı (Örn: Eşantiyon Dağıtacak Mısınız?)" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} className="w-full border-gray-300 rounded-xl px-3 py-2 text-sm" />
                <input type="text" placeholder="Açıklama veya İpucu (İsteğe Bağlı)" value={newField.description} onChange={e => setNewField({...newField, description: e.target.value})} className="w-full border-gray-300 rounded-xl px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <select value={newField.type} onChange={e => setNewField({...newField, type: e.target.value})} className="border-gray-300 rounded-xl px-3 py-2 text-sm flex-1">
                    <option value="text">Kısa Metin</option>
                    <option value="textarea">Uzun Metin (Paragraf)</option>
                    <option value="select">Çoktan Seçmeli (Açılır Menü)</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-xl">
                    <input type="checkbox" checked={newField.required} onChange={e => setNewField({...newField, required: e.target.checked})} /> Zorunlu
                  </label>
                </div>
                {newField.type === 'select' && (
                  <input type="text" placeholder="Seçenekleri virgülle ayırarak yazın (Konuşmacı, Stant, vb.)" value={newField.options} onChange={e => setNewField({...newField, options: e.target.value})} className="w-full border-gray-300 rounded-xl px-3 py-2 text-sm" />
                )}
                <button onClick={handleAddField} className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Forma Soru Ekle
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mevcut Sorular ({careerFairFormTemplate.length})</p>
                {careerFairFormTemplate.map(field => (
                  <div key={field.id} className="flex flex-col p-3 border border-gray-100 rounded-xl bg-white shadow-sm group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{field.label}</span>
                        {field.required && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-black">ZORUNLU</span>}
                      </div>
                      <button onClick={() => handleRemoveField(field.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Tür: {field.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Canlı Önizleme */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Eye size={16}/> Firmaların Göreceği Form Önizlemesi</h3>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden relative">
                {/* Sahte Tarayıcı Başlığı */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                  <div className="mx-auto bg-white px-4 py-1 rounded-md text-[10px] text-gray-400 font-medium">Şirket Arayüzü Önizlemesi</div>
                </div>
                
                <div className="p-6 md:p-8 bg-gray-50 h-[600px] overflow-y-auto">
                  {/* Banner */}
                  <div className="w-full h-40 bg-gray-200 rounded-2xl mb-6 relative overflow-hidden">
                    <img src={eventDetails.banner} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{eventDetails.date}</span>
                      <h2 className="text-white text-2xl font-black">{eventDetails.title}</h2>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-600 mb-6 font-medium">{eventDetails.description}</p>
                    <div className="space-y-5">
                      {careerFairFormTemplate.map(field => (
                        <div key={field.id}>
                          <label className="block text-[13px] font-bold text-gray-800 mb-1.5">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.description && <p className="text-[11px] text-gray-500 mb-2">{field.description}</p>}
                          
                          {field.type === 'text' && <input type="text" disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400 cursor-not-allowed" placeholder="Metin girişi..." />}
                          {field.type === 'textarea' && <textarea disabled rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400 cursor-not-allowed resize-none" placeholder="Uzun metin girişi..."></textarea>}
                          {field.type === 'select' && (
                            <select disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                              <option>Seçim yapınız</option>
                              {(field.options || []).map((opt, i) => <option key={i}>{opt}</option>)}
                            </select>
                          )}
                        </div>
                      ))}
                      
                      <button disabled className="w-full bg-[#990000] text-white font-bold py-3.5 rounded-xl opacity-50 cursor-not-allowed mt-4">
                        Başvuruyu Gönder (Önizleme)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><Briefcase size={18} className="text-red-600"/> Firmalardan Gelen Başvurular</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Firma Bilgisi</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Başvuru Tarihi</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Durum & Masa No</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Katılımcı / Eşantiyon / Logo</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {careerFairApplications.map(app => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{app.companyName}</div>
                      <div className="text-[11px] text-gray-500">ID: {app.id}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {new Date(app.appliedAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider mb-2 ${
                        app.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : 
                        app.status === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {app.status}
                      </span>
                      {app.status === 'Onaylandı' && (
                        <div>
                          {editingTableId === app.id ? (
                            <div className="flex items-center gap-1">
                              <input type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Masa (A-12)" className="w-20 text-xs border border-gray-300 rounded px-2 py-1" />
                              <button onClick={() => handleSaveTable(app.id)} className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600"><Check size={14}/></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                              Masa: {app.tableNumber || 'Atanmadı'} 
                              <button onClick={() => {setEditingTableId(app.id); setTableNumber(app.tableNumber || '');}} className="text-red-500 hover:text-red-700"><Edit3 size={12}/></button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <div className="text-xs"><span className="font-bold text-gray-700">Katılım Türü:</span> <span className="text-gray-600">{app.answers?.f_booth}</span></div>
                        <div className="text-xs"><span className="font-bold text-gray-700">İsimler:</span> <span className="text-gray-600">{app.answers?.f_names}</span></div>
                        <div className="text-xs"><span className="font-bold text-gray-700">TC:</span> <span className="text-gray-600">{app.answers?.f_tc}</span></div>
                        <div className="text-xs truncate"><span className="font-bold text-gray-700">Eşantiyon:</span> <span className="text-gray-600">{app.answers?.f_swag || '-'}</span></div>
                        {app.answers?.f_logo && <a href={app.answers.f_logo} target="_blank" rel="noreferrer" className="text-[10px] text-red-500 hover:underline flex items-center gap-1 mt-1"><Eye size={10}/> Logoyu Görüntüle</a>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {app.status !== 'Onaylandı' && (
                        <button onClick={() => handleApproveApplication(app.id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg mr-2 transition-colors" title="Onayla"><Check size={16}/></button>
                      )}
                      {app.status !== 'Reddedildi' && (
                        <button onClick={() => handleRejectApplication(app.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reddet"><X size={16}/></button>
                      )}
                    </td>
                  </tr>
                ))}
                {careerFairApplications.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">Henüz firma başvurusu bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2"><Megaphone size={18} className="text-red-600"/> Ana Akışa Duyuru Çık</h3>
            <p className="text-sm text-gray-500 mb-6">Öğrencilerin ana akışında (Haber Kaynağı) "Kariyer Günleri" etiketiyle profesyonel duyurular paylaşın.</p>
            
            <textarea 
              rows="5" 
              placeholder="Örn: Kariyer günlerine katılacak firmalar belli oldu! Hemen inceleyin..."
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none mb-4"
            ></textarea>
            
            <button onClick={handlePostAnnouncement} className="w-full bg-gradient-to-r from-red-600 to-[#990000] text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Send size={18} /> Öğrencilere Duyur
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 mb-4">
               <MapPin size={24} />
             </div>
             <h4 className="font-bold text-gray-900 mb-2">Firmalara E-posta ve Bildirim Gönder</h4>
             <p className="text-sm text-gray-500 max-w-sm mb-6">Masa atamaları tamamlanan (Onaylanmış) tüm firmalara e-posta ve sistem içi bildirim gönderin.</p>
             <button onClick={handleNotifyCompanies} className="w-full max-w-[200px] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2">
               <Send size={16} /> Gönderimi Başlat
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSCareerFair;
