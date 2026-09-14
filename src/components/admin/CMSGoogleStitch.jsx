import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Palette, Sparkles, Layers, Wand2, RefreshCw, CheckCircle2, Eye, ShieldCheck, Sliders, Moon, Sun, Cpu } from 'lucide-react';
import { Card, Badge, BtnPrimary, BtnGreen } from './AdminShared';
import useAppStore from '../../store/useAppStore';

export default function CMSGoogleStitch() {
  const [activeTheme, setActiveTheme] = useState('obsidian_gold');
  const [glassIntensity, setGlassIntensity] = useState('high');
  const [shimmerEnabled, setShimmerEnabled] = useState(true);
  const [buttonStyle, setButtonStyle] = useState('kinetic_lux');

  const themes = [
    { id: 'obsidian_gold', name: 'Obsidian Sapphire & Gold (Lüks Derin)', primary: '#0A1828', accent: '#D4AF37', preview: 'from-[#0A1828] via-[#050C1A] to-[#122B4F]' },
    { id: 'iesu_corporate', name: 'İESÜ Kurumsal Lacivert & Bordo', primary: '#7A0000', accent: '#0A2342', preview: 'from-[#7A0000] via-[#500000] to-[#0A2342]' },
    { id: 'emerald_executive', name: 'Emerald Executive Gold', primary: '#064E3B', accent: '#F59E0B', preview: 'from-[#064E3B] via-[#022C22] to-[#0F766E]' }
  ];

  const handleApplyStitch = (themeId) => {
    setActiveTheme(themeId);
    window.toast?.success(`✨ Google Stitch Protokolü uygulandı: ${themes.find(t=>t.id===themeId)?.name}`);
  };

  return (
    <div className="animate-fade-in space-y-6 font-sans">
      <PanelHeader 
        title="🌐 Google Stitch & Arayüz Protokolü (Visual Design Studio)" 
        sub="Tüm platformun renk paletlerini, cam efektlerini (Glassmorphism), buton ışıltılarını ve UI bileşen dillerini canlı dikiş (stitch) teknolojisiyle yönetin." 
      />

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border-l-4 border-amber-500">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Aktif Tasarım Teması</p>
            <h4 className="text-base font-black text-gray-900 mt-1">Obsidian Gold 2.0</h4>
          </div>
          <Palette size={24} className="text-amber-500" />
        </Card>

        <Card className="p-5 flex items-center justify-between border-l-4 border-purple-500">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Glassmorphism Derinliği</p>
            <h4 className="text-base font-black text-gray-900 mt-1">20px Blur (Sat 180%)</h4>
          </div>
          <Layers size={24} className="text-purple-500" />
        </Card>

        <Card className="p-5 flex items-center justify-between border-l-4 border-emerald-500">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Kinetic Shimmer Efekti</p>
            <h4 className="text-base font-black text-emerald-600 mt-1">✓ Aktif (45° Beam)</h4>
          </div>
          <Sparkles size={24} className="text-emerald-500" />
        </Card>

        <Card className="p-5 flex items-center justify-between border-l-4 border-blue-500">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Google Stitch Sürümü</p>
            <h4 className="text-base font-black text-blue-600 mt-1">v4.2 Executive</h4>
          </div>
          <Cpu size={24} className="text-blue-500" />
        </Card>
      </div>

      {/* THEME SELECTION & PREVIEW */}
      <Card className="p-6">
        <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
          <Palette size={18} className="text-amber-600" /> Kurumsal Renk & Tema Dikiş Sistemleri (Stitch Palettes)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map(t => (
            <div 
              key={t.id}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                activeTheme === t.id ? 'border-amber-500 shadow-xl bg-slate-900 text-white' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
              }`}
              onClick={() => handleApplyStitch(t.id)}
            >
              <div className={`w-full h-20 rounded-xl bg-gradient-to-r ${t.preview} mb-4 border border-white/20 shadow-inner flex items-center justify-center`}>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                  Canlı Önizleme
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm">{t.name}</h4>
                {activeTheme === t.id && <CheckCircle2 size={18} className="text-amber-400" />}
              </div>

              <p className="text-xs opacity-75 font-medium mb-4">
                Tüm öğrenci, mezun ve akademi panellerinde uygulanacak lüks kristal renk paleti.
              </p>

              <button 
                onClick={(e) => { e.stopPropagation(); handleApplyStitch(t.id); }}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTheme === t.id ? 'bg-amber-400 text-slate-950 font-black' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Wand2 size={14} /> {activeTheme === t.id ? 'Aktif Tema' : 'Temayı Uygula'}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* COMPONENT STYLES & CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" /> Dynamic Shimmer & Buton Işıltı Kontrolleri
          </h3>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Kinetic Light Beam (45° Işık Hüzmesi)</span>
              <input 
                type="checkbox" 
                checked={shimmerEnabled} 
                onChange={(e) => setShimmerEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-600"
              />
            </div>
            <p className="text-[11px] text-gray-500">Butonların üzerinde imleç gezdirildiğinde geçen dinamik altın/gümüş yansıması.</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-700 block">Buton Kenar Yuvarlatma (Border Radius)</span>
            <div className="grid grid-cols-3 gap-2">
              {['Rounded-xl (12px)', 'Rounded-2xl (16px)', 'Rounded-full (Pill)'].map((r, idx) => (
                <button 
                  key={r}
                  onClick={() => window.toast?.info(`Radius değiştirildi: ${r}`)}
                  className={`py-2 text-[11px] font-bold rounded-xl border transition ${idx === 1 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Layers size={16} className="text-purple-600" /> Glassmorphism 2.0 Buzlu Cam Parametreleri
          </h3>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-gray-700 block">Arka Plan Bulanıklık Oranı (Backdrop Blur)</span>
            <div className="grid grid-cols-3 gap-2">
              {['Soft (8px)', 'High Lux (20px)', 'Ultra Obsidian (32px)'].map((b, idx) => (
                <button 
                  key={b}
                  onClick={() => { setGlassIntensity(b); window.toast?.info(`Glass Blur: ${b}`); }}
                  className={`py-2 text-[11px] font-bold rounded-xl border transition ${idx === 1 ? 'bg-purple-600 text-white border-purple-700' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-900">Otomatik Karanlık Mod Uyumlaması</p>
              <p className="text-[10px] text-purple-700">Kullanıcının işletim sistemi temasına göre otomatik harmanlama.</p>
            </div>
            <Badge status="Aktif" />
          </div>
        </Card>
      </div>
    </div>
  );
}
