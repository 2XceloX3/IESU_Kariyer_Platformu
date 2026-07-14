import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { MapPin, Users, Building2, Globe2 } from 'lucide-react';

// Neon colors
const COLORS = {
  hub: '#ff1493', // Vibrant pink/red
  node: '#00ffff', // Cyan
  arc: 'rgba(255, 20, 147, 0.8)'
};

const HUB = { lat: 41.0082, lng: 28.9784, name: 'İstanbul, Türkiye', count: 40550, isHub: true };

// Sadece gerçek (veya merkez) veriler, sahte şehirleri sildik.
const CITIES = []; 

export default function GlobeMap() {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();

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

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate kapalı (Kullanıcı kendi döndürecek)
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().enableZoom = true;
      
      // Point camera to Istanbul
      globeEl.current.pointOfView({ lat: 30, lng: 20, altitude: 2.0 }, 2000);
    }
  }, []);

  const arcsData = useMemo(() => {
    return CITIES.map(city => ({
      startLat: HUB.lat,
      startLng: HUB.lng,
      endLat: city.lat,
      endLng: city.lng,
      color: [COLORS.hub, COLORS.node]
    }));
  }, []);

  const pointsData = useMemo(() => {
    return [HUB, ...CITIES];
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
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-pink-500/20">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/40 shadow-[0_0_15px_rgba(255,20,147,0.4)]">
                <Building2 className="text-pink-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Merkez Kampüs</p>
                <p className="text-sm font-bold text-white">İstanbul, Türkiye</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                <Users className="text-cyan-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global İletişim</p>
                <p className="text-sm font-bold text-white">Aktif Mezun Ağı</p>
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
          
          // Arcs connecting Istanbul to the world
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={2500}
          arcStroke={0.8}
          
          // Glowing points
          pointsData={pointsData}
          pointColor={(d) => d.isHub ? COLORS.hub : COLORS.node}
          pointAltitude={(d) => d.isHub ? 0.05 : 0.02}
          pointRadius={(d) => d.isHub ? 1.0 : 0.5}
          pointsMerge={false}
          
          // HTML Labels for Cities
          htmlElementsData={pointsData}
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="transform: translate(-50%, -100%); margin-top: -15px; pointer-events: none;">
                <div style="background: rgba(5, 8, 20, 0.9); backdrop-filter: blur(8px); border: 1px solid ${d.isHub ? 'rgba(255,20,147,0.4)' : 'rgba(0,255,255,0.3)'}; border-radius: 8px; padding: 6px 10px; color: white; white-space: nowrap; box-shadow: 0 0 15px ${d.isHub ? 'rgba(255,20,147,0.5)' : 'rgba(0,255,255,0.3)'};">
                  <div style="font-size: 12px; font-weight: 900; color: ${d.isHub ? '#ff1493' : '#00ffff'}; text-shadow: 0 0 8px ${d.isHub ? '#ff1493' : '#00ffff'};">${d.name}</div>
                </div>
              </div>
            `;
            return el;
          }}
        />
      </div>
      
      {/* Decorative Grid overlay to match reference */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>
    </div>
  );
}
