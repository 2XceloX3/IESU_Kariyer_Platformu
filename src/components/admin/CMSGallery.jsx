import React, { useState } from 'react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import { Images, Plus, Edit, Trash2, Search, Filter, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Card, Badge, BtnPrimary, StatCard } from './AdminShared';

export default function CMSGallery({ galleryImages = [], setGalleryImages }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    category: 'Kariyer Fuarı',
    date: '',
    url: ''
  });

  const categories = ['Kariyer Fuarı', 'Festival', 'Sektör Buluşması', 'Dijital Eğitim', 'İŞKUR İşbirliği', 'Seminer'];

  const handleAddNew = () => {
    setForm({
      title: '',
      category: 'Kariyer Fuarı',
      date: '',
      url: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (img) => {
    setForm({ ...img });
    setCurrentId(img.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu fotoğrafı galeriden silmek istediğinize emin misiniz?")) {
      setGalleryImages((galleryImages || []).filter(item => item.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.url) return window.toast.info("Başlık ve görsel bağlantısı zorunludur.");

    const newId = currentId || ('GAL-' + Date.now());

    if (currentId) {
      setGalleryImages((galleryImages || []).map(item => item.id === currentId ? { ...item, ...form } : item));
    } else {
      setGalleryImages([...galleryImages, { ...form, id: newId }]);
    }
    setIsEditing(false);
  };

  const filtered = (galleryImages || []).filter(img => {
    const matchQ = (img.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchC = categoryFilter === 'all' || img.category === categoryFilter;
    return matchQ && matchC;
  });

  const listView = (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-[#A80016] tracking-tight">Etkinlik Galerisi Yönetimi</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Öğrenci arayüzündeki Etkinlik Arşivi galerisindeki gerçek fotoğrafları yönetin.</p>
          </div>
          <BtnPrimary onClick={handleAddNew} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md">
            <Plus size={18} /> Yeni Fotoğraf Ekle
          </BtnPrimary>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard label="Toplam Fotoğraf" value={(galleryImages || []).length} icon={<Images size={24} />} color="blue" />
          <StatCard label="Kategoriler" value={new Set((galleryImages || []).map(g=>g.category)).size} icon={<CheckCircle size={24} />} color="emerald" />
        </div>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Fotoğraf ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Kategoriler</option>
            {Array.from(new Set((galleryImages || []).map(img => img.category))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grid List View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(img => (
          <Card key={img.id} className="p-0 overflow-hidden group hover:shadow-md transition">
            <div className="h-40 overflow-hidden relative">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => handleEdit(img)} className="p-1.5 bg-white/95 text-gray-600 rounded-lg hover:text-indigo-600 shadow transition">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(img.id)} className="p-1.5 bg-white/95 text-red-600 rounded-lg hover:bg-red-50 shadow transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <Badge status={img.category} />
              <h4 className="text-xs font-bold text-gray-900 mt-2 line-clamp-2">{img.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1 font-semibold">{img.date}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const formView = (
    <form onSubmit={handleSave} className="space-y-5">
      <div>
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Fotoğraf Başlığı</label>
        <input 
          type="text" 
          value={form.title} 
          onChange={e => setForm({...form, title: e.target.value})} 
          placeholder="Örn: Next Gen Kariyer Fuarı'26 Stant Alanı" 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 outline-none font-medium" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Kategori</label>
          <select 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 outline-none font-medium"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Tarih / Dönem</label>
          <input 
            type="text" 
            value={form.date} 
            onChange={e => setForm({...form, date: e.target.value})} 
            placeholder="Örn: 5 Mayıs 2026 veya Güz 2025" 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 outline-none font-medium" 
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Görsel Bağlantısı (URL)</label>
        <input 
          type="text" 
          value={form.url} 
          onChange={e => setForm({...form, url: e.target.value})} 
          placeholder="https://..." 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 outline-none font-medium" 
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
        <BtnPrimary type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition">Fotoğrafı Kaydet</BtnPrimary>
      </div>
    </form>
  );

  const previewView = (
    <Card className="p-0 overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        {form.url ? (
          <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={32} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Ön İzleme Yok</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Badge status={form.category} />
        <h4 className="text-xs font-bold text-gray-900 mt-2 line-clamp-2">{form.title || 'Fotoğraf Başlığı'}</h4>
        <p className="text-[10px] text-gray-400 mt-1 font-semibold">{form.date || 'Tarih belirtilmedi'}</p>
      </div>
    </Card>
  );

  return (
    <AdminCMSLayout
      title={isEditing ? (currentId ? 'Fotoğrafı Düzenle' : 'Yeni Fotoğraf Ekle') : 'Etkinlik Galerisi Yönetimi'}
      sub={isEditing ? 'Fotoğraf detaylarını ve bağlantılarını güncelleyebilirsiniz.' : 'Etkinlik Arşivi galerisindeki gerçek kampüs ve fuar fotoğraflarını yönetin.'}
      isEditing={isEditing}
      listView={listView}
      formView={formView}
      previewView={previewView}
    />
  );
}
