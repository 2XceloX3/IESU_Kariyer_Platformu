import React, { useState } from 'react';
import { Heart, Plus, Trash2, CheckCircle, Search, Users, Calendar, Activity, Eye, EyeOff, ImagePlus, X } from 'lucide-react';
import PanelHeader from './PanelHeader';
import PostCard from '../PostCard';

export default function CMSAlumniAssoc({ posts = [], setPosts, currentUser }) {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    contentType: 'Duyuru', // Duyuru, Etkinlik, Buluşma
    visibility: 'alumni', // public, alumni, students, academic
    imageUrl: '', // Afiş URL
  });
  const [search, setSearch] = useState('');

  const assocPosts = (posts || []).filter(p => p.author?.id === 'mezun_dernegi');
  const filtered = assocPosts.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.content?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    const newPost = {
      id: `AA-POST-${Date.now()}`,
      author: {
        id: 'mezun_dernegi',
        name: 'Mezun Derneği',
        avatar: 'https://ui-avatars.com/api/?name=Mezun+Dernegi&background=0A2342&color=fff',
        title: 'Resmi Topluluk',
        type: 'admin'
      },
      ...form,
      image: form.imageUrl,
      date: new Date().toLocaleDateString('tr-TR'),
      likes: 0,
      comments: 0,
      status: 'Yayında',
      source: 'admin'
    };
    
    setPosts([newPost, ...(posts || [])]);
    setForm({ title: '', content: '', contentType: 'Duyuru', visibility: 'alumni', imageUrl: '' });
    setShowForm(false);
    setShowPreview(false);
  };

  const deletePost = (id) => {
    setPosts((posts || []).filter(p => p.id !== id));
  };

  const toggleStatus = (id) => {
    setPosts((posts || []).map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'Yayında' ? 'Arşiv' : 'Yayında' };
      }
      return p;
    }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Mezun Derneği (CMS)" 
        sub="Mezun derneği duyuru, etkinlik ve buluşma içeriklerini yönetin"
        action={
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            <Plus size={16} /> Yeni İçerik Ekle
          </button>
        }
      />

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Heart size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Toplam İçerik</p><p className="text-2xl font-black text-gray-900">{assocPosts.length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Yayında</p><p className="text-2xl font-black text-gray-900">{assocPosts.filter(p => p.status === 'Yayında').length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><Activity size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Etkileşim (Beğeni)</p><p className="text-2xl font-black text-gray-900">{assocPosts.reduce((a, b) => a + (b.likes || 0), 0)}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Calendar size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Etkinlikler</p><p className="text-2xl font-black text-gray-900">{assocPosts.filter(p => p.contentType === 'Etkinlik').length}</p></div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-[0_8px_30px_rgb(185,28,28,0.05)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Yeni Dernek İçeriği Oluştur</h3>
              <p className="text-sm font-medium text-gray-500">Mezunlar ve öğrencilerle paylaşmak üzere yeni bir duyuru veya etkinlik hazırlayın.</p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-500 transition-colors">
              <EyeOff size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* SOL: FORM */}
            <div className="lg:col-span-3 space-y-5">
              <form id="assoc-post-form" onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Başlık</label>
                  <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Örn: 2026 Mezunlar Buluşması" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">İçerik Türü</label>
                    <select value={form.contentType} onChange={e => setForm({...form, contentType: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium text-gray-900">
                      <option value="Duyuru">Duyuru</option>
                      <option value="Etkinlik">Etkinlik</option>
                      <option value="Buluşma">Buluşma</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Görünürlük</label>
                    <select value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium text-gray-900">
                      <option value="public">Herkes (Genel Akış)</option>
                      <option value="alumni">Sadece Mezunlar</option>
                      <option value="students">Öğrenciler ve Mezunlar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Afiş/Görsel Yükle</label>
                  {!form.imageUrl ? (
                    <label className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-red-300 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <ImagePlus size={24} className="text-gray-500 group-hover:text-red-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Görsel seçmek için tıklayın</span>
                      <span className="text-xs font-medium text-gray-500 mt-1">PNG, JPG veya WEBP (Maks 5MB)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setForm({...form, imageUrl: url});
                        }
                      }} />
                    </label>
                  ) : (
                    <div className="relative w-full h-48 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden group">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button type="button" onClick={() => setForm({...form, imageUrl: ''})} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg flex items-center gap-2">
                          <Trash2 size={18} /> <span className="text-sm font-bold pr-2">Görseli Kaldır</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">İçerik Metni</label>
                  <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows="5" placeholder="İçerik detaylarını buraya yazın..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-500 resize-none"></textarea>
                </div>
              </form>
            </div>

            {/* SAĞ: CANLI ÖN İZLEME */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={14} className="text-blue-500" /> Canlı Akış Ön İzlemesi
                  </label>
                </div>
                
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-dashed border-gray-200 pointer-events-none">
                  {(form.title || form.content) ? (
                    <PostCard 
                      post={{
                        id: 'preview',
                        author: {
                          name: 'Mezun Derneği',
                          avatar: 'https://ui-avatars.com/api/?name=Mezun+Dernegi&background=0A2342&color=fff',
                          title: 'Resmi Topluluk',
                        },
                        title: form.title,
                        content: form.content,
                        contentType: form.contentType,
                        image: form.imageUrl,
                        date: 'Şimdi',
                        likes: 0,
                        comments: 0
                      }} 
                      currentUser={currentUser} 
                      setPosts={() => {}} 
                    />
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <Search size={20} className="text-gray-400" />
                      </div>
                      <p className="text-xs font-bold">Ön izleme için içerik girin</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" form="assoc-post-form" className="flex-1 bg-[#0A2342] text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 shadow-[0_4px_12px_rgb(185,28,28,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Hemen Yayınla
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">İptal</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-gray-900">Dernek İçerikleri</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="İçerik ara..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">İçerik</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Tür & Görünürlük</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Etkileşim</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500 text-sm">İçerik bulunamadı.</td></tr>
              ) : filtered.map(post => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-5">
                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{post.title || 'Başlıksız'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.content}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{post.date}</p>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">{post.contentType}</span>
                      <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><Users size={10}/> {post.visibility === 'public' ? 'Herkes' : post.visibility === 'alumni' ? 'Sadece Mezunlar' : 'Öğrenciler & Mezunlar'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs text-gray-600 font-medium">{post.likes || 0} Beğeni, {post.comments || 0} Yorum</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${post.status === 'Yayında' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleStatus(post.id)} className={`p-1.5 rounded-lg transition ${post.status === 'Yayında' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`} title={post.status === 'Yayında' ? 'Yayından Kaldır' : 'Yayınla'}>
                        {post.status === 'Yayında' ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Sil">
                        <Trash2 size={16} />
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
  );
}
