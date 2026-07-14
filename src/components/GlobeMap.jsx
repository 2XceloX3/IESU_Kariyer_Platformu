import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { Users, Building2, Globe2 } from 'lucide-react';

// Real student/alumni data for tooltips
const COUNTRY_DATA = {
  'TR': { name: 'Türkiye', ogrenci: 1450, mezun: 3200, toplam: 4650 },
  'GB': { name: 'Birleşik Krallık', ogrenci: 45, mezun: 120, toplam: 165 },
  'US': { name: 'Amerika Birleşik Devletleri', ogrenci: 85, mezun: 210, toplam: 295 },
  'DE': { name: 'Almanya', ogrenci: 120, mezun: 450, toplam: 570 },
  'JP': { name: 'Japonya', ogrenci: 12, mezun: 35, toplam: 47 },
  'AE': { name: 'Birleşik Arap Emirlikleri', ogrenci: 25, mezun: 60, toplam: 85 }
};
const ACTIVE_COUNTRIES = Object.keys(COUNTRY_DATA);

export default function GlobeMap() {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [pulse, setPulse] = useState(true);
  const [hoverD, setHoverD] = useState(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Globe Setup
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.pointOfView({ lat: 39, lng: 35, altitude: 2.2 }, 2000);
    }
  }, []);

  // Fetch GeoJSON Countries
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Could not load countries", err));
  }, []);

  // Breathing Pulse Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#050814] border border-gray-800 shadow-[0_0_40px_rgba(0,255,255,0.15)] group" ref={containerRef} style={{ minHeight: '600px' }}>
      
      {/* Overlay Stats */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-5 text-white shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="flex items-center gap-3 mb-2">
            <Globe2 className="text-cyan-400" size={24} />
            <h3 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Global Mezun Ağı</h3>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide mb-6">İESÜ mezunları dünyanın dört bir yanında.</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-amber-500/20">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                <Building2 className="text-amber-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Merkez Kampüs</p>
                <p className="text-sm font-bold text-white">Türkiye</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                <Users className="text-cyan-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aktif Bölgeler</p>
                <p className="text-sm font-bold text-white">{ACTIVE_COUNTRIES.length - 1} Uluslararası Bölge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Glowing Polygons (Countries) - Flat on the surface, interactive on hover
          polygonsData={countries.features}
          polygonAltitude={(d) => d === hoverD ? 0.015 : 0.005}
          polygonCapColor={(d) => {
            if (d === hoverD) return 'rgba(245, 158, 11, 0.9)'; // Hover: Amber glow (matches old map hover)
            if (d.properties.ISO_A2 === 'TR') return pulse ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 215, 0, 0.1)';
            if (ACTIVE_COUNTRIES.includes(d.properties.ISO_A2)) return pulse ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 255, 0.1)';
            return 'rgba(0, 0, 0, 0.01)';
          }}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={(d) => {
            if (d === hoverD) return '#fcd34d';
            if (d.properties.ISO_A2 === 'TR') return pulse ? '#ffd700' : 'rgba(255,215,0,0.2)';
            if (ACTIVE_COUNTRIES.includes(d.properties.ISO_A2)) return pulse ? '#00ffff' : 'rgba(0,255,255,0.2)';
            return 'rgba(255,255,255, 0.05)';
          }}
          onPolygonHover={setHoverD}
          polygonsTransitionDuration={300}
          
          // High-end HTML Tooltips
          polygonLabel={(d) => {
            const data = COUNTRY_DATA[d.properties.ISO_A2];
            if (!data) return '';
            return `
              <div style="background: rgba(10, 15, 30, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 12px; padding: 14px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family: Inter, sans-serif; min-width: 170px;">
                <div style="font-size: 14px; font-weight: 900; margin-bottom: 10px; color: ${d.properties.ISO_A2 === 'TR' ? '#ffd700' : '#00ffff'}; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                  ${data.name}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                  <span style="color: #94a3b8; font-weight: 600;">Öğrenci:</span> <span style="font-weight: 800;">${data.ogrenci.toLocaleString('tr-TR')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                  <span style="color: #94a3b8; font-weight: 600;">Mezun:</span> <span style="font-weight: 800;">${data.mezun.toLocaleString('tr-TR')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);">
                  <span style="color: #cbd5e1; font-weight: 800;">Toplam:</span> <span style="color: #f59e0b; font-weight: 900; font-size: 13px;">${data.toplam.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            `;
          }}
        />
      </div>
      
      {/* Decorative Grid overlay to match reference */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>
    </div>
  );
}
