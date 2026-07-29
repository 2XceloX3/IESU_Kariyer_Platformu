import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Users, Plus, Edit2, Trash2, Phone, Mail, ExternalLink, ShieldCheck, Image, Save, X } from 'lucide-react';

const defaultStaffList = [
  {
    id: 'STAFF-1',
    name: 'Zuhal ŞAHİN',
    title: 'Kariyer Geliştirme Ofis Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'zsahin@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/405.jpg',
    yokLink: 'https://www.esenyurt.edu.tr/kadro/kariyer-gelistirme-ofisi-kadro-1'
  },
  {
    id: 'STAFF-2',
    name: 'Mutlu Gülsev YAĞIZ',
    title: 'Kariyer Geliştirme Ofisi Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'myagiz@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/278.jpg',
    yokLink: 'http://akademik.yok.gov.tr/AkademikArama/AkademisyenGorevOgrenimBilgileri?islem=direct&authorId=CAC066B35D650BC1'
  }
];

export default function CMSStaff() {
  const storeStaffList = useAppStore((state) => state.staffList);
  const staffList = (storeStaffList && storeStaffList.length > 0) ? storeStaffList : defaultStaffList;
  const addStaffMember = useAppStore((state) => state.addStaffMember);
  const updateStaffMember = useAppStore((state) => state.updateStaffMember);
  const deleteStaffMember = useAppStore((state) => state.deleteStaffMember);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phone: '',
    email: '',
    photo: '',
    yokLink: ''
  });

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      title: '',
      phone: '444 9 123',
      email: '',
      photo: 'https://www.esenyurt.edu.tr/uploads/staffs/278.jpg',
      yokLink: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      title: staff.title,
      phone: staff.phone,
      email: staff.email,
      photo: staff.photo,
      yokLink: staff.yokLink || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaffMember({
        ...editingStaff,
        ...formData
      });
    } else {
      addStaffMember({
        id: `STAFF-${Date.now()}`,
        ...formData
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu ekip üyesini kadrodan silmek istediğinize emin misiniz?')) {
      deleteStaffMember(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-red-950 flex items-center gap-2">
            <Users className="text-[#990000]" size={24} /> Kariyer Ofisi Ekip & Kadro Yönetimi
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            "Hakkımızda" panelinde yayınlanan İESÜ Kariyer Geliştirme Ofisi kadrosunu buradan ekleyip düzenleyebilirsiniz.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#990000] hover:bg-red-800 text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Yeni Ekip Üyesi Ekle
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
            <div>
              <div className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow backdrop-blur-md transition cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="p-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl shadow backdrop-blur-md transition cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-base font-black text-red-950 mb-1">{staff.name}</h3>
                <span className="text-[11px] font-black text-[#990000] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 inline-block mb-3">
                  {staff.title}
                </span>

                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2"><Phone size={13} className="text-[#990000]" /> {staff.phone}</div>
                  <div className="flex items-center gap-2"><Mail size={13} className="text-[#990000]" /> {staff.email}</div>
                </div>
              </div>
            </div>

            {staff.yokLink && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <a
                  href={staff.yokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#990000] hover:underline"
                >
                  <ExternalLink size={13} /> YÖK Akademik Profil
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Modal - Google Stitch Side-by-Side Live Preview Redesign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 animate-scaleUp overflow-hidden flex flex-col lg:flex-row my-auto max-h-[90vh]">
            
            {/* SOL KOLON: Form Giriş Paneli */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <h3 className="text-lg font-black text-red-950 flex items-center gap-2">
                  <Users className="text-[#990000]" size={20} />
                  {editingStaff ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 mb-1">Ad Soyad & Unvan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Öğr. Gör. Mutlu Gülsev YAĞIZ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">Görevi / Pozisyonu *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Kariyer Geliştirme Ofis Müdürü / Koordinatör"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-slate-700 mb-1">Telefon</label>
                    <input
                      type="text"
                      placeholder="444 9 123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black text-slate-700 mb-1">E-Posta Adresi</label>
                    <input
                      type="email"
                      placeholder="ornek@esenyurt.edu.tr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold"
                    />
                  </div>
                </div>

                {/* Bilgisayardan Fotoğraf Yükleme Paneli */}
                <div>
                  <label className="block font-black text-slate-700 mb-1">Profil Fotoğrafı *</label>
                  <div className="flex flex-col gap-2">
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#990000] bg-slate-50 hover:bg-red-50/40 rounded-2xl p-4 transition flex flex-col items-center justify-center gap-1 cursor-pointer group">
                      <Image size={24} className="text-slate-400 group-hover:text-[#990000] transition-colors" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-[#990000]">Bilgisayardan Fotoğraf Seç (.jpg, .png)</span>
                      <span className="text-[10px] font-semibold text-slate-400">Yüklemek için tıklayın veya dosyayı sürükleyin</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, photo: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">YÖK Akademik Profil Bağlantısı (Opsiyonel)</label>
                  <input
                    type="url"
                    placeholder="http://akademik.yok.gov.tr/..."
                    value={formData.yokLink}
                    onChange={(e) => setFormData({ ...formData, yokLink: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#990000] font-bold"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-black transition shadow cursor-pointer"
                  >
                    <Save size={16} /> Kaydet ve Yayınla
                  </button>
                </div>
              </form>
            </div>

            {/* SAĞ KOLON: Canlı Kart Önizlemesi */}
            <div className="w-full lg:w-80 bg-slate-900 p-6 flex flex-col justify-between relative border-t lg:border-t-0 lg:border-l border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="hidden lg:flex absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer z-10"
                title="Kapat"
              >
                <X size={18} />
              </button>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 inline-block mb-4">
                  Sitede Nasıl Görünecek?
                </span>
                
                {/* Canlı Kart Simülatörü */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                  <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Önizleme"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                        <Users size={36} />
                        <span className="text-xs font-bold">Fotoğraf Yüklenmedi</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h4 className="text-sm font-black text-slate-900 mb-1 leading-snug">
                      {formData.name || 'Ad Soyad & Unvan'}
                    </h4>
                    <span className="text-[10px] font-black text-[#990000] bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-100 inline-block mb-3">
                      {formData.title || 'Pozisyon / Görev'}
                    </span>

                    <div className="space-y-1.5 text-[11px] font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-[#990000]" /> {formData.phone || '444 9 123'}
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={12} className="text-[#990000]" /> {formData.email || 'ornek@esenyurt.edu.tr'}
                      </div>
                    </div>
                  </div>

                  {formData.yokLink && (
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <span className="text-[11px] font-bold text-[#990000] flex items-center justify-center gap-1">
                        <ExternalLink size={12} /> YÖK Akademik Profil
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center font-medium">
                Sol tarafta değişiklik yaptıkça kartınız eşzamanlı olarak burada güncellenir.
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
