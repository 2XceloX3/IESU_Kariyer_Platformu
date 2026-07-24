import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { GraduationCap, Edit, Trash2, Plus, Search, Filter, UserCircle2, Mail, Briefcase, FileText, Star, CheckCircle2, Download, ClipboardList, Compass, X } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import CMSSurveys from './CMSSurveys';
import useAppStore from '../../store/useAppStore';

export default function CMSAlumni({ alumni = [], setAlumni, surveys, setSurveys, currentUser, setPosts, posts }) {
  const { alumniSurveyResponses } = useAppStore();
  const [activeTab, setActiveTab] = useState('mezunlar');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const [form, setForm] = useState({
    name: '',
    department: '',
    graduationYear: '',
    currentCompany: '',
    currentPosition: '',
    email: '',
    status: 'Mezun',
    isMentor: false,
    avatar: '',
    cvData: null,
    cvName: '',
    skills: '',
    careerStatus: 'Belirtilmedi', // 'Çalışıyorum', 'İş Arıyorum', 'Eğitimime Devam Ediyorum', 'Çalışmıyorum', 'Belirtilmedi'
    isMatch: 'Belirtilmedi' // 'Evet', 'Hayır', 'Belirtilmedi'
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      department: '',
      graduationYear: '',
      currentCompany: '',
      currentPosition: '',
      email: '',
      status: 'Mezun',
      isMentor: false,
      avatar: '',
      cvData: null,
      cvName: '',
      skills: '',
      careerStatus: 'Belirtilmedi',
      isMatch: 'Belirtilmedi'
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (al) => {
    setForm({ ...al, skills: al.skills || '', isMentor: al.isMentor || false });
    setCurrentId(al.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu mezun kaydını silmek/arşivlemek istediğinize emin misiniz?")) {
      setAlumni(prev => (prev || []).filter(a => a.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.graduationYear) return window.toast.info("Ad Soyad ve Mezuniyet Yılı zorunludur.");

    if (currentId) {
      setAlumni(prev => (prev || []).map(a => a.id === currentId ? { ...a, ...form, updatedAt: new Date().toISOString() } : a));
    } else {
      setAlumni(prev => [{ ...form, id: 'ALM-' + Date.now(), createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const handleSPSSExport = () => {
    if (!alumniSurveyResponses || alumniSurveyResponses.length === 0) {
      return window.toast?.info('Dışa aktarılacak anket verisi bulunmuyor.');
    }
    // KVKK Compliant: Strip PII (name, tc, phone, email etc)
    const exportData = alumniSurveyResponses.map(r => {
      const { name, tc, phone, email, ...safeData } = r;
      return safeData;
    });
    exportToCSV(exportData, 'kariyer_checkup_spss_anonim.csv');
  };

  const safeAlumni = alumni || [];

  const filtered = safeAlumni.filter(a => {
    const matchQ = (a.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (a.currentCompany||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (a.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const mentorCount = safeAlumni.filter(a => a.isMentor).length;
  
  // Analitikler
  const employedCount = safeAlumni.filter(a => a.careerStatus === 'Çalışıyorum' || a.currentCompany).length;
  const totalWithStatus = safeAlumni.filter(a => a.careerStatus && a.careerStatus !== 'Belirtilmedi').length || 1;
  const employmentRate = Math.round((employedCount / totalWithStatus) * 100);
  
  const matchedCount = safeAlumni.filter(a => (a.careerStatus === 'Çalışıyorum' || a.currentCompany) && a.isMatch === 'Evet').length;
  const matchRate = employedCount > 0 ? Math.round((matchedCount / employedCount) * 100) : 0;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title={activeTab === 'mezunlar' ? "Mezun Havuzu" : "Mezun Anketleri"} 
        sub={activeTab === 'mezunlar' ? "Sisteme kayıtlı mezunları yönetin ve kariyer durumlarını takip edin." : "Mezunlara yönelik anketler oluşturun ve performans değerlendirmelerini takip edin."} 
        action={
          activeTab === 'mezunlar' ? (
            <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
              <Plus size={18} /> Mezun Ekle
            </button>
          ) : null
        } 
      />

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('mezunlar')} 
          className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'mezunlar' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <GraduationCap size={18} /> Mezun Yönetimi
        </button>
        <button 
          onClick={() => setActiveTab('anketler')} 
          className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'anketler' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <ClipboardList size={18} /> Anket Havuzu
        </button>
      </div>

      {activeTab === 'anketler' ? (
        <CMSSurveys surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} isAlumniTab={true} />
      ) : (
        <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><GraduationCap size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Mezun</p><p className="text-2xl font-black text-gray-900">{safeAlumni.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">İstihdam Oranı</p><p className="text-2xl font-black text-gray-900">%{employmentRate}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Alan Uyumu</p><p className="text-2xl font-black text-gray-900">%{matchRate}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Star size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Gönüllü Mentor</p><p className="text-2xl font-black text-gray-900">{mentorCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Ad Soyad veya Firma ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="mezun">Mezun</option>
            <option value="pasif">Pasif</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
          <button onClick={() => exportToCSV(filtered, 'mezunlar.csv')} className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm font-bold">
            <Download size={18} /> Excel
          </button>
          <button onClick={handleSPSSExport} className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition text-sm font-bold shadow-sm">
            <Download size={18} /> SPSS (Anonim)
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><GraduationCap size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun mezun bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mezun</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bölüm & Yıl</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kariyer Durumu</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sistem Durumu</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {a.avatar ? <img src={a.avatar} className="w-full h-full object-cover" /> : <UserCircle2 size={20} className="text-gray-500"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          {a.name}
                          {a.isMentor && <Star size={12} className="text-yellow-500 fill-current" />}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">{a.email || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700">{a.department || 'Belirtilmedi'}</p>
                    <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">{a.graduationYear ? `${a.graduationYear} Mezunu` : '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    {a.careerStatus && a.careerStatus !== 'Belirtilmedi' ? (
                      <div>
                        <p className={`text-xs font-bold px-2 py-0.5 rounded w-fit uppercase ${a.careerStatus === 'Çalışıyorum' ? 'bg-emerald-50 text-emerald-700' : a.careerStatus === 'İş Arıyorum' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>{a.careerStatus}</p>
                        {a.currentCompany && <p className="text-[10px] font-bold text-gray-500 mt-1">{a.currentCompany} - {a.currentPosition}</p>}
                        {a.careerStatus === 'Çalışıyorum' && (
                          <p className="text-[9px] font-bold mt-1 uppercase" style={{color: a.isMatch === 'Evet' ? '#10B981' : '#F43F5E'}}>
                            Alan Uyumu: {a.isMatch}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">Belirtilmedi</span>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${a.status === 'Mezun' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      {alumniSurveyResponses?.find(r => r.email === a.email || r.department === a.department) && (
                        <button 
                          title="Anket Yanıtını Gör"
                          onClick={() => {
                            const sr = alumniSurveyResponses.find(r => r.email === a.email || r.department === a.department);
                            setSelectedSurvey({ alumni: a, response: sr });
                          }} 
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Compass size={16}/>
                        </button>
                      )}
                      <button onClick={() => handleEdit(a)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
        </>
      )}
    </div>
  );

  const formView = (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Mezun Profili Düzenle' : 'Yeni Mezun Ekle'}</h3>
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">Listeye Dön</button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-full sm:w-1/3 shrink-0">
            <MediaUploader 
              label="Profil Fotoğrafı" 
              image={form.avatar} 
              onImageChange={(val) => setForm({...form, avatar: val})} 
              aspect="1:1" 
            />
          </div>
          
          <div className="w-full sm:w-2/3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezun Olduğu Bölüm</label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezuniyet Yılı <span className="text-red-500">*</span></label>
                <input type="number" value={form.graduationYear} onChange={e=>setForm({...form, graduationYear: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required placeholder="Örn: 2024" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalıştığı Firma</label>
                <input type="text" value={form.currentCompany} onChange={e=>setForm({...form, currentCompany: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Pozisyon / Unvan</label>
                <input type="text" value={form.currentPosition} onChange={e=>setForm({...form, currentPosition: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Kariyer Durumu</label>
                <select value={form.careerStatus} onChange={e=>setForm({...form, careerStatus: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="Belirtilmedi">Belirtilmedi</option>
                  <option value="Çalışıyorum">Çalışıyorum</option>
                  <option value="İş Arıyorum">İş Arıyorum</option>
                  <option value="Eğitimime Devam Ediyorum">Eğitimime Devam Ediyorum</option>
                  <option value="Çalışmıyorum">Çalışmıyorum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölümle Alakalı Çalışma (Alan Uyumu)</label>
                <select value={form.isMatch} onChange={e=>setForm({...form, isMatch: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="Belirtilmedi">Belirtilmedi</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Yetenekler & Uzmanlıklar</label>
            <input type="text" value={form.skills} onChange={e=>setForm({...form, skills: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Virgülle ayırın" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
              <option>Mezun</option>
              <option>Pasif</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <AttachmentUploader 
            label="CV / Özgeçmiş (PDF)" 
            file={form.cvData} 
            onFileChange={(val) => setForm({...form, cvData: val})} 
          />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isMentor} onChange={e=>setForm({...form, isMentor: e.target.checked})} className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20" />
            <span className="text-sm font-bold text-gray-700">Öğrencilere Gönüllü Mentorluk Yapıyor</span>
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Kaydet</button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="animate-fade-in relative">
      {isEditing ? formView : listView}

      {/* Survey Modal */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up">
            
            {/* Left Pane: Alumni Info */}
            <div className="md:w-1/3 bg-gray-50 border-r border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border border-gray-200 overflow-hidden mb-4 flex items-center justify-center">
                {selectedSurvey.alumni.avatar ? <img src={selectedSurvey.alumni.avatar} className="w-full h-full object-cover" /> : <UserCircle2 size={48} className="text-gray-400"/>}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">{selectedSurvey.alumni.name}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase">{selectedSurvey.alumni.department || 'Belirtilmedi'} - {selectedSurvey.alumni.graduationYear}</p>
              
              <div className="mt-6 w-full space-y-3 text-left">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">E-Posta</p>
                  <p className="text-xs font-medium text-gray-800 break-all">{selectedSurvey.alumni.email || '-'}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Kayıtlı Durum</p>
                  <p className="text-xs font-medium text-gray-800">{selectedSurvey.alumni.careerStatus}</p>
                </div>
              </div>
            </div>

            {/* Right Pane: Likert Survey Answers */}
            <div className="md:w-2/3 flex flex-col bg-white h-full max-h-[90vh]">
              <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Compass className="text-indigo-600" size={20} />
                  Kariyer Check-up Yanıtları
                </h3>
                <button onClick={() => setSelectedSurvey(null)} className="p-2 text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-5">
                {[
                  { q: 'Şu anda aktif olarak çalışıyor musunuz?', a: selectedSurvey.response.q1_calisma },
                  { q: 'İlk işinizi ne kadar sürede buldunuz?', a: selectedSurvey.response.q2_sure },
                  { q: 'Çalıştığınız sektör', a: selectedSurvey.response.q3_sektor },
                  { q: 'Kurumun türü', a: selectedSurvey.response.q4_kurum_turu },
                  { q: 'Mevcut göreviniz / ünvanınız', a: selectedSurvey.response.q5_gorev },
                  { q: 'İşin bölümle ilişkisi (1-5 Likert)', a: selectedSurvey.response.q6_iliskili ? `${selectedSurvey.response.q6_iliskili} / 5` : '-' },
                  { q: 'Çalıştığınız il / ülke', a: selectedSurvey.response.q7_il },
                  { q: 'Çalışma şekli', a: selectedSurvey.response.q8_calisma_sekli },
                  { q: 'Lisansüstü eğitim', a: selectedSurvey.response.q9_lisansustu },
                  { q: 'Görüş ve öneriler', a: selectedSurvey.response.q12_oneri },
                ].map((item, i) => (
                  <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-gray-500 mb-1">{i+1}. {item.q}</p>
                    <p className="text-sm font-medium text-gray-900">{item.a || <span className="text-gray-500 italic">Yanıtlanmadı</span>}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
