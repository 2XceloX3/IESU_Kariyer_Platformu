const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const startIdx = code.indexOf('{/* Job Publishing Modal */}');
const endIdx = code.lastIndexOf('</div>\n  );\n}');

const newModals = `
      {/* Job Publishing Modal (Live Preview & File Upload) */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl my-8 shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 z-10"></div>
            
            {/* Form Column */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 border-r border-gray-100 flex flex-col max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{editingJob ? 'İlanı Düzenle' : 'Yeni İlan Yayınla'}</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingJob ? 'İlan bilgilerini güncelleyin.' : 'Öğrenci ve mezunların akışına yeni bir ilan ekleyin.'}</p>
                </div>
                <button onClick={() => setShowJobModal(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Başlığı</label>
                    <input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required placeholder="Örn: Frontend Geliştirici" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma / Kurum Adı</label>
                    <input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required placeholder="Örn: TechNova Inc." />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çalışma Türü</label>
                    <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="TAM ZAMANLI">Tam Zamanlı</option>
                      <option value="YARI ZAMANLI">Yarı Zamanlı</option>
                      <option value="STAJ">Staj</option>
                      <option value="GÖNÜLLÜ">Gönüllü</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Konum (Şehir/İlçe)</label>
                    <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Örn: İstanbul, Şişli" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Afiş / Görsel (Opsiyonel)</label>
                  <div className="relative group">
                    <input type="file" id="job-poster-upload" accept="image/*" className="hidden" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        setJobForm({...jobForm, poster: fileUrl});
                      }
                    }} />
                    <label htmlFor="job-poster-upload" className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all">
                      <UploadCloud className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" size={28} />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">Görsel Yüklemek İçin Tıklayın</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG veya WEBP (Maks. 2MB)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Detayı / Açıklama</label>
                  <textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" required placeholder="İş tanımı, aranan nitelikler ve diğer detaylar..."></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-auto">
                  <button type="button" onClick={() => setShowJobModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                    <CheckCircle size={18} /> {editingJob ? 'Güncelle' : 'Yayınla ve Havuza Ekle'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="hidden md:flex w-1/2 bg-gray-50 p-6 sm:p-8 flex-col max-h-[85vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Eye size={20} className="text-blue-500"/> Canlı Ön İzleme</h3>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-4 transform scale-95 origin-top">
                <div className="p-5 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Briefcase className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Süper Admin (Kariyer Ofisi)</h4>
                      <p className="text-xs text-gray-500">İlan / Duyuru • Şimdi</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-xl text-gray-900">{jobForm.title || 'İlan Başlığı'}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Building size={16} />
                        <span className="font-medium text-sm">{jobForm.company || 'Firma Adı'}</span>
                        {jobForm.location && (
                          <>
                            <span className="text-gray-300">•</span>
                            <MapPin size={16} />
                            <span className="text-sm">{jobForm.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{jobForm.type || 'TAM ZAMANLI'}</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle size={12}/> Aktif İlan</span>
                  </div>

                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{jobForm.description || 'İlan açıklaması burada görünecek...'}</p>
                </div>

                {jobForm.poster && (
                  <div className="w-full h-48 bg-gray-100 border-t border-gray-100 relative">
                    <img src={jobForm.poster} alt="İlan Afişi" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm opacity-50 cursor-not-allowed">Başvur</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Voluntary Internship Modal */}
      {showVoluntaryInternshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-green-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Gönüllü Staj Duyurusu Yayınla</h3>
                    <p className="text-gray-500 text-xs mt-1">Bu ilan tüm öğrenci ve mezun akışlarında paylaşılır.</p>
                  </div>
                </div>
                <button onClick={() => setShowVoluntaryInternshipModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setShowVoluntaryInternshipModal(false);
                // Havuza Ekleme Mantığı Burada Çalışır
                alert("Gönüllü Staj İlanı Başarıyla Yayınlandı!");
              }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Pozisyon / Başlık</label>
                    <input type="text" value={voluntaryForm.title} onChange={e => setVoluntaryForm({...voluntaryForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" required placeholder="Gönüllü Yazılım Stajyeri" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma Adı</label>
                    <input type="text" value={voluntaryForm.company} onChange={e => setVoluntaryForm({...voluntaryForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" required placeholder="XYZ Teknoloji" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Staj Açıklaması</label>
                  <textarea value={voluntaryForm.description} onChange={e => setVoluntaryForm({...voluntaryForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none" required placeholder="Stajyerden beklentiler, stajın içeriği..."></textarea>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Başvuru Linki veya Ek Bilgi</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="url" placeholder="https://ornek.com/basvuru" value={voluntaryForm.link} onChange={e => setVoluntaryForm({...voluntaryForm, link: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Bu ilan yayınlandığında otomatik olarak <strong>Gönüllü Staj Başvuru Havuzu</strong>na eklenecektir. İlanın detayında sigorta işlemleriyle ilgili yasal metinler gizli tutulacak, sadece firmanın bilgileri görünecektir. Öğrenciler başvurularını yaptığında, listeyi dışa aktarıp firmalara Excel olarak gönderebilirsiniz.
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setShowVoluntaryInternshipModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm hover:shadow-lg transition-all flex items-center gap-2">
                    <Send size={18} /> Akışta Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Form Builder Modal */}
      {showMentorFormBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Mentorluk Başvuru Formu Düzenleyicisi</h3>
                    <p className="text-gray-500 text-xs mt-1">Öğrencilerin dolduracağı formu buradan özelleştirin.</p>
                  </div>
                </div>
                <button onClick={() => setShowMentorFormBuilder(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {mentorFormFields.map((field, idx) => (
                  <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg" onClick={() => {
                        setMentorFormFields(mentorFormFields.filter(f => f.id !== field.id));
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Soru Metni</label>
                          <input type="text" value={field.label} onChange={(e) => {
                            const newFields = [...mentorFormFields];
                            newFields[idx].label = e.target.value;
                            setMentorFormFields(newFields);
                          }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="w-1/2">
                            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Cevap Tipi</label>
                            <select value={field.type} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].type = e.target.value;
                              setMentorFormFields(newFields);
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                              <option value="text">Kısa Metin</option>
                              <option value="textarea">Uzun Paragraf</option>
                              <option value="select">Çoktan Seçmeli (Açılır Menü)</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 mt-5">
                            <input type="checkbox" id={\`req-\${field.id}\`} checked={field.required} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].required = e.target.checked;
                              setMentorFormFields(newFields);
                            }} className="w-4 h-4 text-purple-600 rounded" />
                            <label htmlFor={\`req-\${field.id}\`} className="text-sm font-medium text-gray-700 cursor-pointer">Zorunlu Alan</label>
                          </div>
                        </div>
                        {field.type === 'select' && (
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Seçenekler (Virgülle Ayırın)</label>
                            <input type="text" value={field.options || ''} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].options = e.target.value;
                              setMentorFormFields(newFields);
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="Örn: A, B, C" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => {
                  setMentorFormFields([...mentorFormFields, { id: Date.now(), type: 'text', label: 'Yeni Soru', required: false }]);
                }} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-2xl hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all font-bold flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> Yeni Soru Ekle
                </button>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowMentorFormBuilder(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                <button type="button" onClick={() => {
                  setShowMentorFormBuilder(false);
                  alert("Mentorluk Başvuru Formu Güncellendi!");
                }} className="px-5 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors flex items-center gap-2">
                  <CheckCircle size={18} /> Formu Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Call Modal */}
      {showMentorCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl text-red-600">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Mentorluk Çağrısı Yayınla</h3>
                    <p className="text-gray-500 text-xs mt-1">Mezun akışına başvuru formu çağrısı gönder.</p>
                  </div>
                </div>
                <button onClick={() => setShowMentorCallModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handlePublishMentorCall} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çağrı Başlığı</label>
                  <input type="text" value={mentorCallForm.title} onChange={e => setMentorCallForm({...mentorCallForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çağrı İçeriği</label>
                  <textarea value={mentorCallForm.description} onChange={e => setMentorCallForm({...mentorCallForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none" required></textarea>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                  <Heart className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    Bu çağrı yayınlandığında, öğrenci ve mezunların akışında belirecek. Çağrıyı gören kullanıcılar <strong>"Hemen Başvur"</strong> butonuna tıklayarak doğrudan <span className="underline cursor-pointer font-bold" onClick={() => {setShowMentorCallModal(false); setShowMentorFormBuilder(true);}}>Mentorluk Başvuru Formunu</span> doldurabilecekler.
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setShowMentorCallModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-lg transition-all flex items-center gap-2">
                    <Send size={18} /> Akışta Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`;

code = code.substring(0, startIdx) + newModals;
fs.writeFileSync('src/components/AdminDashboard.jsx', code, 'utf8');
