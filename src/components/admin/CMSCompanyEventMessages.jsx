import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { MessageSquare, CheckCircle2, XCircle, Clock, Building2, Mail, Phone, Search, Eye, Send } from 'lucide-react';

const CMSCompanyEventMessages = () => {
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailModal, setDetailModal] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = adminMessages.filter(msg => {
    const matchSearch = (msg.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (msg.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (msg.message || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) => {
    if (setAdminMessages) {
      setAdminMessages(adminMessages.map(msg =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      ));
    }
    setDetailModal(null);
    window.toast?.success?.(`Mesaj durumu "${newStatus}" olarak güncellendi.`);
  };

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    if (setAdminMessages) {
      setAdminMessages(adminMessages.map(msg =>
        msg.id === id ? { ...msg, status: 'Yanıtlandı', reply: replyText, repliedAt: new Date().toLocaleString('tr-TR') } : msg
      ));
    }
    setReplyText('');
    setDetailModal(null);
    window.toast?.success?.('Firma mesajına yanıt gönderildi.');
  };

  const stats = {
    total: adminMessages.length,
    pending: adminMessages.filter(m => m.status === 'Beklemede').length,
    replied: adminMessages.filter(m => m.status === 'Yanıtlandı').length,
    resolved: adminMessages.filter(m => m.status === 'Çözüldü').length,
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#990000] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={28} className="text-amber-300" />
            <h1 className="text-2xl font-black">Şirket Etkinlik & Yönetici Mesaj Talepleri</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">Şirketlerin KGM yöneticisine ilettiği özel etkinlik, seminer ve iş birliği talepleri burada listelenir.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
          {[
            { label: 'Toplam Mesaj', val: stats.total, color: 'bg-white/10' },
            { label: 'Beklemede', val: stats.pending, color: 'bg-amber-500/20 text-amber-200' },
            { label: 'Yanıtlandı', val: stats.replied, color: 'bg-blue-500/20 text-blue-200' },
            { label: 'Çözüldü', val: stats.resolved, color: 'bg-emerald-500/20 text-emerald-200' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Firma adı, konu veya mesaj içeriği ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 bg-white focus:ring-2 focus:ring-red-200 outline-none">
          <option value="all">Tüm Durumlar</option>
          <option value="Beklemede">Beklemede</option>
          <option value="Yanıtlandı">Yanıtlandı</option>
          <option value="Çözüldü">Çözüldü</option>
        </select>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700 text-lg">Henüz şirket mesajı/talebi yok</h3>
          <p className="text-sm text-gray-400 mt-1">Şirketler etkinlik veya iş birliği talebi gönderdiğinde burada listelenecektir.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-red-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setDetailModal(msg)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-black shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-gray-900 text-sm">{msg.companyName}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        msg.status === 'Yanıtlandı' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        msg.status === 'Çözüldü' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>{msg.status}</span>
                    </div>
                    <p className="font-bold text-[#990000] text-xs mt-0.5">{msg.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{msg.message}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 block">{msg.date}</span>
                  <div className="flex items-center gap-1 mt-1 text-gray-400">
                    {msg.email && <Mail size={12} />}
                    {msg.phone && <Phone size={12} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 to-[#990000] p-6 text-white shrink-0">
              <h2 className="text-lg font-black">Mesaj Detayı</h2>
              <p className="text-slate-300 text-xs mt-1">{detailModal.companyName} — {detailModal.subject}</p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs font-bold text-gray-400 block">Firma</span><span className="font-bold text-gray-900">{detailModal.companyName}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Konu</span><span className="font-bold text-[#990000]">{detailModal.subject}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">E-Posta</span><span className="font-semibold text-gray-800">{detailModal.email || '-'}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Telefon</span><span className="font-semibold text-gray-800">{detailModal.phone || '-'}</span></div>
                <div className="col-span-2"><span className="text-xs font-bold text-gray-400 block">Mesaj İçeriği</span><p className="font-semibold text-gray-800 text-xs leading-relaxed mt-1 bg-slate-50 p-3 rounded-xl">{detailModal.message}</p></div>
                <div><span className="text-xs font-bold text-gray-400 block">Gönderim Tarihi</span><span className="font-bold text-gray-900">{detailModal.date}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Durum</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    detailModal.status === 'Yanıtlandı' ? 'bg-blue-50 text-blue-700' :
                    detailModal.status === 'Çözüldü' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>{detailModal.status}</span>
                </div>
              </div>

              {detailModal.reply && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <span className="text-[10px] font-black text-blue-700 uppercase">Gönderilen Yanıt ({detailModal.repliedAt})</span>
                  <p className="text-xs text-blue-800 font-medium mt-1">{detailModal.reply}</p>
                </div>
              )}

              {/* Reply Box */}
              {detailModal.status !== 'Çözüldü' && (
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Firmaya Yanıt Yaz</label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Firmaya iletilecek yanıt mesajınız..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none"
                  />
                </div>
              )}
            </div>
            <div className="p-5 bg-slate-50 border-t border-gray-100 flex items-center gap-3 shrink-0 flex-wrap">
              {replyText.trim() && (
                <button onClick={() => handleReply(detailModal.id)} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer"><Send size={14} /> Yanıtla</button>
              )}
              <button onClick={() => updateStatus(detailModal.id, 'Çözüldü')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer"><CheckCircle2 size={15} /> Çözüldü</button>
              <button onClick={() => { setDetailModal(null); setReplyText(''); }} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSCompanyEventMessages;
