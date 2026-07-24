import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Library, CheckCircle2, XCircle, ArrowDownToLine, RefreshCw, UploadCloud, ChevronDown, ChevronRight, FileDown } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard, SearchFilterBar, Badge } from './AdminCMSLayout';

export default function CMSAcademicCatalog({ academicCatalog, setAcademicCatalog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  
  // Tablo görünümünü basitleştirmek için sadece fakülteleri ve altındaki bölüm sayılarını listeliyoruz
  // Genişletilebilir (Accordion) yapısı ile bölümler gösterilebilir.
  const [expandedFaculties, setExpandedFaculties] = useState({});

  const toggleFaculty = (id) => {
    setExpandedFaculties(prev => ({...prev, [id]: !prev[id]}));
  };

  const activeFaculties = (academicCatalog || []).filter(f => f.status === 'Aktif').length;
  const totalDepartments = (academicCatalog || []).reduce((sum, f) => sum + (f.departments?.length || 0), 0);
  const totalPrograms = (academicCatalog || []).reduce((sum, f) => sum + (f.departments || []).reduce((pSum, d) => pSum + (d.programs?.length || 0), 0), 0);

  const filteredCatalog = (academicCatalog || []).filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.departments || []).some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminCMSLayout title="Akademik Katalog" subtitle="Üniversite akademik birimlerinin merkezi yönetimi.">
      
      {/* Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TopInfoCard icon={<Library size={20} />} title="Toplam Fakülte" value={(academicCatalog || []).length} color="blue" />
        <TopInfoCard icon={<CheckCircle2 size={20} />} title="Aktif Fakülteler" value={activeFaculties} color="emerald" />
        <TopInfoCard icon={<Library size={20} />} title="Toplam Bölüm" value={totalDepartments} color="purple" />
        <TopInfoCard icon={<Library size={20} />} title="Toplam Program" value={totalPrograms} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sol Taraf: Liste */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-gray-50/50">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Fakülte veya bölüm ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <UploadCloud size={16} /> İçe Aktar (CSV)
                </button>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
                  <Plus size={16} /> Yeni Fakülte
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredCatalog.map(faculty => (
                <div key={faculty.id} className="bg-white">
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaculty(faculty.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${expandedFaculties[faculty.id] ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        {expandedFaculties[faculty.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{faculty.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{faculty.departments.length} Bölüm • {faculty.departments.reduce((acc, d) => acc + d.programs.length, 0)} Program</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge status={faculty.status} />
                      <button className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition" onClick={(e) => { e.stopPropagation(); setSelectedFaculty(faculty); }}>
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Content: Departments */}
                  {expandedFaculties[faculty.id] && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-4 pl-12 space-y-3">
                      {faculty.departments.map(dept => (
                        <div key={dept.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-gray-800">{dept.name}</h5>
                            <div className="mt-2 space-y-1.5">
                              {dept.programs.map(prog => (
                                <div key={prog.id} className="flex items-center gap-2 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                  <span className="font-medium text-gray-700">{prog.name}</span>
                                  <span className="text-gray-500">({prog.level})</span>
                                  {prog.doubleMajorEligible && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">ÇAP</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge status={dept.status} />
                            <button aria-label="İşlem Butonu" className="text-gray-500 hover:text-blue-600 p-1">
                              <Edit size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2">
                        <Plus size={14} /> Yeni Bölüm Ekle
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredCatalog.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Library className="text-gray-500" size={24} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
                  <p className="text-sm text-gray-500">Arama kriterlerinize uygun akademik birim bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Form / Detay */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Edit size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Fakülte / Birim Düzenle</h3>
                <p className="text-xs text-gray-500 mt-0.5">Akademik birim detaylarını yönetin</p>
              </div>
            </div>

            {selectedFaculty ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Fakülte/Birim Adı</label>
                  <input type="text" value={selectedFaculty.name} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium" value={selectedFaculty.status} readOnly>
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm Sayısı</label>
                  <input type="text" value={selectedFaculty.departments.length} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 mt-4">
                  <p className="text-xs text-yellow-800 font-medium">Bu paneli kullanarak mevcut fakültelerin isimlerini veya durumlarını (Aktif/Pasif) güncelleyebilirsiniz. Birimleri silmek yerine pasife almanız önerilir.</p>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                  <button onClick={() => setSelectedFaculty(null)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition">İptal</button>
                  <button className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">Kaydet</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Library className="text-gray-400" size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Birim Seçilmedi</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Düzenlemek için sol taraftaki listeden bir fakülte veya bölüm seçin.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminCMSLayout>
  );
}
