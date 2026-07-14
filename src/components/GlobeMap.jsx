import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { MapPin, Users, Building2, Globe2 } from 'lucide-react';

// Neon colors
const COLORS = {
  hub: '#e60000', // IESU red
  node: '#3b82f6', // blue
  arc: 'rgba(230, 0, 0, 0.6)'
};

const HUB = { lat: 41.0082, lng: 28.9784, name: 'İstanbul, Türkiye', count: 40550, isHub: true };

const CITIES = [
  { lat: 40.7128, lng: -74.0060, name: 'New York, ABD', count: 450 },
  { lat: 52.5200, lng: 13.4050, name: 'Berlin, Almanya', count: 1200 },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japonya', count: 85 },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brezilya', count: 60 },
  { lat: 25.2048, lng: 55.2708, name: 'Dubai, BAE', count: 320 },
  { lat: 51.5074, lng: -0.1278, name: 'Londra, Birleşik Krallık', count: 800 },
];

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
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      
      // Point camera to Istanbul
      globeEl.current.pointOfView({ lat: 25, lng: 10, altitude: 2.2 }, 2000);
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
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#0a0f1c] border border-gray-800 shadow-[0_0_40px_rgba(59,130,246,0.15)] group" ref={containerRef} style={{ minHeight: '600px' }}>
      
      {/* Overlay Stats */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Globe2 className="text-blue-400" size={24} />
            <h3 className="text-lg font-black tracking-tight">Global Mezun Ağı</h3>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide mb-6">İESÜ mezunları dünyanın dört bir yanında.</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <Building2 className="text-red-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Merkez Kampüs</p>
                <p className="text-sm font-bold text-white">İstanbul, Türkiye</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Users className="text-blue-400" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global İletişim</p>
                <p className="text-sm font-bold text-white">42.500+ Toplam Mezun</p>
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
          arcStroke={0.5}
          
          // Glowing points
          pointsData={pointsData}
          pointColor={(d) => d.isHub ? COLORS.hub : COLORS.node}
          pointAltitude={(d) => d.isHub ? 0.05 : 0.02}
          pointRadius={(d) => d.isHub ? 0.8 : 0.4}
          pointsMerge={false}
          
          // HTML Labels for Cities
          htmlElementsData={pointsData}
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="transform: translate(-50%, -100%); margin-top: -10px; pointer-events: none;">
                <div style="background: rgba(10, 15, 28, 0.8); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 10px; color: white; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                  <div style="font-size: 11px; font-weight: 800; color: ${d.isHub ? '#f87171' : '#60a5fa'};">${d.name}</div>
                  <div style="font-size: 9px; font-weight: 600; color: #9ca3af;">${d.count} Mezun</div>
                </div>
              </div>
            `;
            return el;
          }}
        />
      </div>
      
      {/* Decorative Grid overlay to match reference */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-10"></div>
    </div>
  );
}
