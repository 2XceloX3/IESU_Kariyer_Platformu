import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle2, Briefcase, MapPin, Calendar, Layout, AlertCircle } from 'lucide-react';

export default function JobCreator({ setView, currentUser, jobs, setJobs, addNotification }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'STAJ',
    location: '',
    date: '',
    description: '',
    applicationLink: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.date || !formData.description) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    const newJob = {
      id: 'JOB-' + Date.now(),
      title: formData.title,
      company: currentUser.name,
      location: formData.location,
      type: formData.type,
      date: formData.date,
      description: formData.description,
      applicationLink: formData.applicationLink || '#',
      logo: previewImage || '',
      status: 'Beklemede' // Goes to Admin Queue
    };

    setJobs([newJob, ...jobs]);
    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'info',
        message: 'İlanınız admin onayına gönderildi. Onaylandığında yayına alınacaktır.'
      });
    } else {
      alert('İlanınız admin onayına gönderildi. Onaylandığında yayına alınacaktır.');
    }
    setView('jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 px-4 h-16 flex items-center justify-between shadow-sm">
        <button onClick={() => setView('jobs')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition flex items-center gap-2">
          <ArrowLeft size={20} /> <span className="font-bold text-sm">Geri</span>
        </button>
        <div className="font-black text-gray-900 text-lg">Yeni İlan Oluştur</div>
        <button onClick={handleSubmit} className="px-5 py-2 bg-iesu-red text-white text-sm font-bold rounded-full hover:bg-red-700 transition shadow-md flex items-center gap-2">
          <CheckCircle2 size={16} /> Onaya Gönder
        </button>
      </nav>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 lg:px-8 pt-24 pb-20 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: FORM (DATA ENTRY) */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Layout className="text-iesu-red" size={20} /> İlan Detayları
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">İlan Başlığı *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Örn: Frontend Developer Stajyeri" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">İlan Tipi *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition font-bold text-gray-700">
                    <option value="STAJ">Staj (Öğrenci)</option>
                    <option value="İŞ">İş (Mezun/Genel)</option>
                    <option value="YARI ZAMANLI">Yarı Zamanlı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Son Başvuru Tarihi *</label>
                  <input type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="Örn: 20 Ağustos 2026" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Çalışma Yeri / Lokasyon *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Örn: İstanbul (Hibrit) veya Uzaktan" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Açıklama & Aranan Nitelikler *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Adaylarda aradığınız özellikleri detaylıca yazın..." rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition resize-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Dış Bağlantı URL (Opsiyonel)</label>
                <input type="text" name="applicationLink" value={formData.applicationLink} onChange={handleInputChange} placeholder="https://sirketiniz.com/kariyer" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="text-iesu-red" size={20} /> Afiş / Görsel Yükle
            </h2>
            <div className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-iesu-red transition-colors rounded-2xl flex flex-col items-center justify-center bg-gray-50 relative cursor-pointer group overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <Upload size={32} className="text-gray-400 group-hover:text-iesu-red mb-2 transition-colors" />
              <p className="text-sm font-bold text-gray-600 group-hover:text-iesu-red transition-colors">Tıkla veya Sürükle Bırak</p>
              <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG (Maks 5MB)</p>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:w-1/2 flex flex-col gap-4">
           <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
             <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
             <div>
               <h4 className="font-bold text-blue-900 text-sm">Canlı Önizleme (Live Preview)</h4>
               <p className="text-xs text-blue-700">İlanınız, platformdaki öğrencilere tam olarak bu şekilde görünecektir.</p>
             </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200 sticky top-24">
             {/* Preview Card */}
             <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition duration-300 bg-white">
                <div className="h-56 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 border-b border-gray-100">
                  {previewImage ? (
                    <img src={previewImage} alt="Önizleme" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Briefcase size={48} className="text-red-200 mx-auto mb-2" />
                      <span className="text-xs font-bold text-gray-400">Görsel Yüklenmedi</span>
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 text-white text-[12px] font-bold px-4 py-1.5 rounded-full shadow-md ${formData.type === 'STAJ' ? 'bg-iesu-coral' : 'bg-iesu-red'}`}>
                    {formData.type}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-xl text-gray-900 mb-2 truncate">{formData.title || 'İlan Başlığı'}</h4>
                  <p className="text-gray-500 text-sm mb-2 font-bold">{currentUser?.name || 'Şirketiniz'}</p>
                  
                  <div className="flex items-center gap-4 text-gray-400 text-[13px] mb-5 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {formData.location || 'Lokasyon'}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {formData.date || 'Tarih'}</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-600 text-[13.5px] mb-5 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {formData.description || 'İlanın detaylı açıklaması burada yer alacaktır...'}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button disabled className="px-6 py-2.5 rounded-xl text-[14.5px] font-bold flex items-center gap-2 transition bg-red-50 text-red-600 opacity-80">
                      Hızlı Başvur (Önizleme)
                    </button>
                  </div>
                </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
