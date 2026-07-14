import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { MapPin, Users, Building2, Globe2 } from 'lucide-react';

// ISO A2 codes for active student countries
const ACTIVE_COUNTRIES = ['TR', 'GB', 'US', 'DE', 'JP', 'AE'];

export default function GlobeMap() {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [pulse, setPulse] = useState(true);

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
                <p className="text-sm font-bold text-white">5 Uluslararası Bölge</p>
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
          
          // Glowing Polygons (Countries) - Flat on the surface
          polygonsData={countries.features}
          polygonAltitude={0.005}
          polygonCapColor={(d) => {
            if (d.properties.ISO_A2 === 'TR') return pulse ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 215, 0, 0.1)';
            if (ACTIVE_COUNTRIES.includes(d.properties.ISO_A2)) return pulse ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 255, 0.1)';
            return 'rgba(0, 0, 0, 0.01)';
          }}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={(d) => {
            if (d.properties.ISO_A2 === 'TR') return pulse ? '#ffd700' : 'rgba(255,215,0,0.2)';
            if (ACTIVE_COUNTRIES.includes(d.properties.ISO_A2)) return pulse ? '#00ffff' : 'rgba(0,255,255,0.2)';
            return 'rgba(255,255,255, 0.05)';
          }}
          polygonsTransitionDuration={1500}
        />
      </div>
      
      {/* Decorative Grid overlay to match reference */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>
    </div>
  );
}
