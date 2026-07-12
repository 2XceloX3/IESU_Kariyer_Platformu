import React, { useState } from 'react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { Megaphone, CheckCircle2, Edit, Trash2, Plus, Search, Filter, Image as ImageIcon, Calendar, ArrowRight, FileText } from 'lucide-react';

export default function CMSAnnouncements({ announcements = [], setAnnouncements, posts, setPosts, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    date: '',
    description: '',
    imageUrl: '',
    attachmentData: null,
    attachmentName: '',
    importanceLevel: 'Normal', // 'Önemli', 'Normal'
    status: 'Yayında'
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      date: '',
      description: '',
      imageUrl: '',
      attachmentData: null,
      attachmentName: '',
      importanceLevel: 'Normal',
      status: 'Yayında'
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (ann) => {
    setForm({ 
      ...ann,
      importanceLevel: ann.importanceLevel || 'Normal'
    });
    setCurrentId(ann.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) {
      setAnnouncements((announcements || []).filter(a => a.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return window.toast.info("Başlık ve tarih zorunludur.");

    const newId = currentId || ('NE-D' + Date.now());

    if (currentId) {
      setAnnouncements((announcements || []).map(ann => ann.id === currentId ? { ...ann, ...form, updatedAt: new Date().toISOString() } : ann));
      
      // Update existing post in feed if exists
      if (setPosts) {
        setPosts(prev => (prev || []).map(p => p.sourceId === currentId ? {
          ...p,
          content: `📢 **${form.title}**\n\n${form.description}\n\n📅 Tarih: ${form.date}`,
          image: form.imageUrl,
          pdf: form.attachmentData
        } : p));
      }
    } else {
      setAnnouncements([{ ...form, id: newId, type: 'Duyuru', createdAt: new Date().toISOString() }, ...announcements]);
      
      // Add new post to feed
      if (setPosts && form.status === 'Yayında') {
        const newPost = {
          id: 'POST-' + Date.now(),
          sourceId: newId,
          author: {
            name: currentUser?.name || 'Kariyer Geliştirme Koordinatörlüğü',
            avatar: currentUser?.avatar || 'https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg',
            role: 'admin',
            title: 'Süper Yönetici'
          },
          content: `📢 **${form.title}**\n\n${form.description}\n\n📅 Tarih: ${form.date}`,
          image: form.imageUrl,
          pdf: form.attachmentData,
          time: 'Şimdi',
          likes: 0,
          comments: 0
        };
        setPosts(prev => [newPost, ...(prev || [])]);
      }
    }
    setIsEditing(false);
  };

  const filtered = (announcements || []).filter(a => {
    const matchQ = (a.title||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (a.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (announcements || []).filter(a => a.status === 'Yayında').length;
  const draftCount = (announcements || []).filter(a => a.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Duyuru Yönetimi</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Sistemdeki resmi duyuruları ve ilanları yönetin.</p>
          </div>
          <button onClick={handleAddNew} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md">
            <Plus size={18} /> Yeni Duyuru Ekle
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TopInfoCard title="Toplam Duyuru" count={(announcements || []).length} icon={<Megaphone size={24} />} color="blue" />
          <TopInfoCard title="Yayında" count={activeCount} icon={<CheckCircle2 size={24} />} color="emerald" />
          <TopInfoCard title="Taslak Bekleyen" count={draftCount} icon={<Edit size={24} />} color="orange" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Duyuru ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="yayında">Yayında</option>
            <option value="taslak">Taslak</option>
          </select>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4"><Megaphone size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun duyuru bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duyuru</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tarih</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Önem Derecesi</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${a.importanceLevel === 'Önemli' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {a.imageUrl ? <img src={a.imageUrl} className="w-full h-full object-cover rounded-lg" /> : <Megaphone size={18}/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">{a.title}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate max-w-[250px]">{a.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                      <Calendar size={13} className="text-gray-400"/> {a.date || 'Belirtilmedi'}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${a.importanceLevel === 'Önemli' ? 'text-red-600' : 'text-gray-500'}`}>
                      {a.importanceLevel}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${(a.status === 'Yayında') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(a)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const actualFormView = (
    <div className="flex-1">
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Duyuru Başlığı <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Duyuru başlığını girin..." required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Tarih <span className="text-red-500">*</span></label>
              <input type="text" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: 20 Eylül 2026" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Önem Derecesi</label>
              <select value={form.importanceLevel} onChange={e=>setForm({...form, importanceLevel: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Normal</option>
                <option>Önemli</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yayında</option>
                <option>Taslak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Duyuru detayları..."></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Duyuru Görseli (İsteğe Bağlı)" 
              image={form.imageUrl} 
              onImageChange={(val) => setForm({...form, imageUrl: val})} 
              aspect="16:9" 
            />
            <AttachmentUploader 
              label="Ek Dosya (PDF vs.)" 
              file={form.attachmentData} 
              onFileChange={(val) => setForm({...form, attachmentData: val, attachmentName: val ? 'Ek_Dosya' : ''})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Duyuruyu Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );

  const previewView = (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {form.imageUrl && (
        <div className="h-40 bg-gray-100 relative group">
          <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
            <span className={`text-[10px] font-black uppercase tracking-wider ${(form.status === 'Yayında') ? 'text-emerald-600' : 'text-orange-600'}`}>
              {form.status}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        {!form.imageUrl && (
           <div className="flex justify-between items-start mb-4">
             <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block">DUYURU</span>
             <span className={`text-[10px] font-black uppercase tracking-wider ${(form.status === 'Yayında') ? 'text-emerald-600' : 'text-orange-600'}`}>
              {form.status}
            </span>
           </div>
        )}
        {form.imageUrl && (
           <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block mb-3">DUYURU</span>
        )}

        <h3 className="text-[17px] font-black text-gray-900 leading-tight mb-2">
          {form.importanceLevel === 'Önemli' && <span className="text-red-600 mr-1">!</span>}
          {form.title || 'Duyuru Başlığı'}
        </h3>
        
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 mb-4">
          <Calendar size={13} />
          <span>{form.date || 'Tarih Belirtilmedi'}</span>
        </div>

        <p className="text-[13px] font-medium text-gray-600 mb-5 line-clamp-4">
          {form.description || 'Duyuru hakkında detaylı metin burada görünecektir.'}
        </p>

        <button className="text-[12px] font-bold text-red-600 flex items-center gap-1 hover:text-red-700 transition">
          Devamını Oku <ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );

  const feedPreviewView = form.title ? (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
            <Megaphone size={16} className="text-orange-600" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1">Kariyer Geliştirme Ofisi <CheckCircle2 size={12} className="text-emerald-500" /></p>
            <p className="text-[10px] text-gray-400">Az önce • Duyuru Paylaşımı</p>
          </div>
        </div>
        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3 h-28">
            <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <p className="text-[12px] font-bold text-gray-800 mb-1">{form.title}</p>
        <p className="text-[11px] text-gray-500 line-clamp-2">{form.description || ''}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
          <span>📅 {form.date || '...'}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AdminCMSLayout
      title="Duyurular"
      sub="Önemli duyuruları öğrencilere ve mezunlara iletin"
      isEditing={isEditing}
      listView={listView}
      formView={actualFormView}
      previewView={previewView}
      feedPreviewView={feedPreviewView}
    />
  );
}
