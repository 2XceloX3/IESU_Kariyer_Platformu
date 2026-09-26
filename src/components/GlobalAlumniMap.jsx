import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Globe2, MapPin, Users, Briefcase, ExternalLink, Star, 
  Building2, Search, ZoomIn, ZoomOut, RotateCcw, Compass, Sparkles,
  ChevronRight, Navigation, CheckCircle2, Route, Eye, EyeOff, Layers,
  ArrowRight, Activity, Filter, Award
} from 'lucide-react';
import * as RSM from "react-simple-maps";
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';
import { 
  aggregateAlumniHubs, 
  REGION_PRESETS, 
  SUPPORTED_COUNTRIES, 
  matchCountryToTopo, 
  normalizeStr,
  geocodeLocation,
  getCitiesForCountry,
  CITY_COORDINATES,
  CAREER_ROUTES,
  getCareerRoutes,
  getCityListByZoom
} from '../utils/alumniGeoData';

const ComposableMap = RSM.ComposableMap;
const Geographies = RSM.Geographies;
const Geography = RSM.Geography;
const ZoomableGroup = RSM.ZoomableGroup;

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";


// Safe Map Error Boundary to prevent white screen crashes if SVG projection or network fails
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GlobalAlumniMap projection error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center p-8 text-center bg-[#0b1329]/90 backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-cyan-400">
            <Globe2 size={32} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Harita Yüklenemedi</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Coğrafi harita verileri işlenirken geçici bir sorun oluştu. 
            Mezun merkezlerini sağdaki detay panelinden doğrudan inceleyebilirsiniz.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
          >
            Haritayı Yeniden Yükle
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function GlobalAlumniMap({ setView, currentUser, userRole, setSelectedUserId, previousView }) {
  const alumni = useAppStore(state => state.alumni);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);

  // Dynamic aggregation from store and currentUser
  const { hubs, totalCount, activeCountries } = useMemo(() => {
    return aggregateAlumniHubs(alumni, currentUser);
  }, [alumni, currentUser]);

  const [activeHub, setActiveHub] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("all");
  const [sidebarTab, setSidebarTab] = useState("alumni"); // 'alumni' | 'cities' | 'routes' | 'insights'

  // Career routes state
  const [showRoutes, setShowRoutes] = useState(true);
  const [routeOriginFilter, setRouteOriginFilter] = useState('all'); // 'all' | 'Düzce' | 'İstanbul' | 'Ankara' | 'İzmir'
  const [activeRoute, setActiveRoute] = useState(null);

  // Map viewport control (zoom and center) with NaN/undefined defense
  const [position, setPosition] = useState({ coordinates: [20, 40], zoom: 1 });

  const safeCenter = useMemo(() => {
    if (
      Array.isArray(position?.coordinates) && 
      position.coordinates.length >= 2 &&
      Number.isFinite(position.coordinates[0]) &&
      Number.isFinite(position.coordinates[1])
    ) {
      return [position.coordinates[0], position.coordinates[1]];
    }
    return [20, 40];
  }, [position?.coordinates]);

  const safeZoom = useMemo(() => {
    if (Number.isFinite(position?.zoom) && position.zoom > 0) {
      return Math.min(Math.max(position.zoom, 0.5), 10);
    }
    return 1;
  }, [position?.zoom]);

  // Level of Detail (LOD) mode
  const currentLOD = useMemo(() => {
    if (safeZoom < 2.5) return 'world';
    if (safeZoom < 4.5) return 'regional';
    return 'city';
  }, [safeZoom]);

  const lodInfo = useMemo(() => {
    switch (currentLOD) {
      case 'world':
        return {
          code: 'LOD-1',
          label: 'Dünya Görünümü',
          desc: 'Kıta ve Ülke Ekosistemi',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      case 'regional':
        return {
          code: 'LOD-2',
          label: 'Bölgesel Hublar',
          desc: 'Metropol Odakları & Koridorlar',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        };
      case 'city':
      default:
        return {
          code: 'LOD-3',
          label: 'Detaylı Şehir & İhtisas',
          desc: 'İlçe, Sektör ve Koordinat Ağı',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
    }
  }, [currentLOD]);

  const handleMoveEnd = (pos) => {
    if (!pos) return;
    const newCoords = Array.isArray(pos.coordinates) && 
      Number.isFinite(pos.coordinates[0]) && 
      Number.isFinite(pos.coordinates[1]) 
        ? pos.coordinates 
        : [20, 40];
    const newZoom = Number.isFinite(pos.zoom) && pos.zoom > 0 ? pos.zoom : 1;
    setPosition({ coordinates: newCoords, zoom: newZoom });
  };

  const handleZoomIn = () => {
    setPosition(prev => {
      const curZoom = Number.isFinite(prev?.zoom) && prev.zoom > 0 ? prev.zoom : 1;
      const curCoords = Array.isArray(prev?.coordinates) && prev.coordinates.length >= 2 ? prev.coordinates : [20, 40];
      return {
        coordinates: curCoords,
        zoom: Math.min(curZoom * 1.5, 8)
      };
    });
  };

  const handleZoomOut = () => {
    setPosition(prev => {
      const curZoom = Number.isFinite(prev?.zoom) && prev.zoom > 0 ? prev.zoom : 1;
      const curCoords = Array.isArray(prev?.coordinates) && prev.coordinates.length >= 2 ? prev.coordinates : [20, 40];
      return {
        coordinates: curCoords,
        zoom: Math.max(curZoom / 1.5, 1)
      };
    });
  };

  const handleReset = () => {
    setPosition({ coordinates: [20, 40], zoom: 1 });
    setActiveRegion("all");
    setActiveHub(null);
    setActiveRoute(null);
    setSearchQuery("");
  };

  const handleRegionSelect = (preset) => {
    if (!preset) return;
    setActiveRegion(preset.id || 'all');
    const safeCoords = Array.isArray(preset.center) && preset.center.length >= 2 &&
      Number.isFinite(preset.center[0]) && Number.isFinite(preset.center[1])
        ? preset.center
        : [20, 40];
    const safeZoomLevel = Number.isFinite(preset.zoom) && preset.zoom > 0 ? preset.zoom : 1;
    setPosition({ coordinates: safeCoords, zoom: safeZoomLevel });

    if (preset.id === 'duzce_corridor') {
      setShowRoutes(true);
      setRouteOriginFilter('Düzce');
      setTooltipContent("🌲 Düzce ➔ Avrupa & Global Kariyer Koridoru (3.06z)");
    }
  };

  const handleHubSelect = (hub) => {
    if (!hub) return;
    setActiveHub(hub);
    const safeCoords = Array.isArray(hub.coordinates) && hub.coordinates.length >= 2 &&
      Number.isFinite(hub.coordinates[0]) && Number.isFinite(hub.coordinates[1])
        ? hub.coordinates
        : [20, 40];
    const curZoom = Number.isFinite(position?.zoom) && position.zoom > 0 ? position.zoom : 1;
    setPosition({
      coordinates: safeCoords,
      zoom: Math.max(3.2, curZoom)
    });
  };

  // Filtered career routes based on origin filter
  const displayedRoutes = useMemo(() => {
    if (!showRoutes) return [];
    return getCareerRoutes(routeOriginFilter);
  }, [showRoutes, routeOriginFilter]);

  // Distinct origin & destination endpoints for route pins
  const routeEndpoints = useMemo(() => {
    const origins = new Map();
    const destinations = new Map();

    displayedRoutes.forEach(r => {
      if (!origins.has(r.fromCity)) {
        origins.set(r.fromCity, {
          city: r.fromCity,
          country: r.fromCountry,
          coords: r.fromCoords,
          isDuzce: normalizeStr(r.originHub) === 'duzce' || normalizeStr(r.fromCity) === 'duzce',
          count: 0
        });
      }
      origins.get(r.fromCity).count += r.alumniCount;

      if (!destinations.has(r.toCity)) {
        destinations.set(r.toCity, {
          city: r.toCity,
          country: r.toCountry,
          coords: r.toCoords,
          count: 0
        });
      }
      destinations.get(r.toCity).count += r.alumniCount;
    });

    return {
      origins: Array.from(origins.values()),
      destinations: Array.from(destinations.values())
    };
  }, [displayedRoutes]);

  const routeEndpointCityNames = useMemo(() => {
    if (!showRoutes) return new Set();
    const set = new Set();
    routeEndpoints.origins.forEach(o => set.add(normalizeStr(o.city)));
    routeEndpoints.destinations.forEach(d => set.add(normalizeStr(d.city)));
    return set;
  }, [showRoutes, routeEndpoints]);

  // Cities dynamically determined by Zoom LOD with alias deduplication
  const visibleCities = useMemo(() => {
    if (safeZoom < 2.5) return [];
    const list = getCityListByZoom(safeZoom, activeHub?.country);
    
    // Deduplicate city aliases (e.g. munih / munich / münih, duzce / düzce)
    const seen = new Set();
    const deduplicated = [];
    for (const c of list) {
      const normCity = normalizeStr(c.city || '');
      const normCountry = normalizeStr(c.country || '');
      const key = `${normCity}_${normCountry}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(c);
      }
    }

    // Suppress label collisions if city is already rendered as route origin/dest
    return deduplicated.filter(c => !routeEndpointCityNames.has(normalizeStr(c.city)));
  }, [safeZoom, activeHub?.country, routeEndpointCityNames]);

  // Cities for the currently selected country/hub
  const countryCities = useMemo(() => {
    if (!activeHub?.country) return [];
    return getCitiesForCountry(activeHub.country);
  }, [activeHub?.country]);

  // Routes associated with the currently selected hub
  const activeHubRoutes = useMemo(() => {
    if (!activeHub) return [];
    const normCity = normalizeStr(activeHub.city || '');
    const normCountry = normalizeStr(activeHub.country || '');
    return CAREER_ROUTES.filter(r => 
      normalizeStr(r.originHub) === normCity ||
      normalizeStr(r.fromCity) === normCity ||
      normalizeStr(r.toCity) === normCity ||
      normalizeStr(r.fromCountry) === normCountry ||
      normalizeStr(r.toCountry) === normCountry
    );
  }, [activeHub]);

  // Live search suggestions (cities & countries)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    const q = normalizeStr(searchQuery);
    const suggestions = [];

    // Search cities in CITY_COORDINATES
    for (const [key, val] of Object.entries(CITY_COORDINATES)) {
      if (suggestions.length >= 5) break;
      if (normalizeStr(val.city).includes(q) || key.includes(q)) {
        if (!suggestions.some(s => s.name === val.city && s.country === val.country)) {
          suggestions.push({
            type: 'city',
            name: val.city,
            country: val.country,
            flag: val.flag,
            coords: val.coords,
            specialty: val.specialty || 'Kariyer & Teknoloji Hubı'
          });
        }
      }
    }

    // Search countries in SUPPORTED_COUNTRIES
    for (const c of SUPPORTED_COUNTRIES) {
      if (suggestions.length >= 8) break;
      if (normalizeStr(c.name).includes(q) || c.code.toLowerCase() === q || c.topoNames.some(t => normalizeStr(t).includes(q))) {
        if (!suggestions.some(s => s.name === c.name)) {
          suggestions.push({
            type: 'country',
            name: c.name,
            country: c.name,
            flag: c.flag,
            coords: c.center,
            zoom: c.zoom
          });
        }
      }
    }

    return suggestions;
  }, [searchQuery]);

  const handleSelectSuggestion = (sug) => {
    setSearchQuery('');
    if (sug.type === 'city') {
      const existingHub = hubs.find(h => h && normalizeStr(h.city) === normalizeStr(sug.name));
      if (existingHub) {
        handleHubSelect(existingHub);
      } else {
        const dynamicHub = {
          id: 'city_' + normalizeStr(sug.name),
          name: sug.name + ', ' + sug.country,
          city: sug.name,
          country: sug.country,
          flag: sug.flag || '📍',
          coordinates: sug.coords,
          count: 1,
          alumniList: [],
          topCompanies: ['Küresel Teknoloji & Kurumlar'],
          topRoles: ['Yazılım Mühendisi', 'Kariyer Lideri'],
          isUserHere: Boolean(currentUser?.city && normalizeStr(currentUser.city) === normalizeStr(sug.name))
        };
        handleHubSelect(dynamicHub);
      }
      setPosition({ coordinates: sug.coords, zoom: 5.5 });
      setTooltipContent(sug.flag + ' ' + sug.name + ' (' + sug.country + ') • Odaklanıldı');
    } else {
      const countryObj = SUPPORTED_COUNTRIES.find(c => c.name === sug.name);
      if (countryObj) {
        const countryHub = hubs.find(h => h && matchCountryToTopo(countryObj.topoNames[0], h.country));
        if (countryHub) {
          handleHubSelect(countryHub);
        } else {
          const dynamicHub = {
            id: 'country_' + countryObj.code,
            name: countryObj.flag + ' ' + countryObj.name,
            city: countryObj.name,
            country: countryObj.name,
            flag: countryObj.flag || '📍',
            coordinates: countryObj.center,
            count: 1,
            alumniList: [],
            topCompanies: ['Global Teknoloji & Kurumlar'],
            topRoles: ['Yazılım Mühendisi', 'Kariyer Lideri']
          };
          handleHubSelect(dynamicHub);
        }
        setPosition({ coordinates: countryObj.center, zoom: countryObj.zoom || 3.5 });
        setTooltipContent(countryObj.flag + ' ' + countryObj.name + ' • Odaklanıldı');
      }
    }
  };

  // User location jump handler with robust geocoding fallback
  const handleJumpToUserLocation = () => {
    const userHub = (hubs || []).find(h => h?.isUserHere);
    if (userHub && Array.isArray(userHub.coordinates)) {
      handleHubSelect(userHub);
    } else if (Array.isArray(currentUser?.coordinates) && currentUser.coordinates.length >= 2 && Number.isFinite(currentUser.coordinates[0])) {
      setPosition({ coordinates: currentUser.coordinates, zoom: 4 });
    } else {
      const geocoded = geocodeLocation(currentUser?.country, currentUser?.city);
      if (geocoded && Array.isArray(geocoded.coordinates)) {
        setPosition({ coordinates: geocoded.coordinates, zoom: 4 });
      }
    }
  };

  const handleSelectRoute = (route) => {
    if (!route) return;
    setActiveRoute(route);
    setShowRoutes(true);
    const midLon = (route.fromCoords[0] + route.toCoords[0]) / 2;
    const midLat = (route.fromCoords[1] + route.toCoords[1]) / 2;
    setPosition({
      coordinates: [midLon, midLat],
      zoom: 3.06
    });
    setTooltipContent(`🚀 Rota: ${route.title} (${route.alumniCount} Mezun)`);
  };

  const showToast = (type, message) => {
    if (typeof window !== 'undefined' && window.toast && typeof window.toast[type] === 'function') {
      window.toast[type](message);
    } else {
      console.log(`[Toast ${type}]: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#0a1224]/95 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const allowedBranches = ['student', 'company', 'academic', 'alumni'];
              const store = useAppStore.getState();
              if (previousView && allowedBranches.includes(previousView)) {
                if (store.setActivePortalBranch) store.setActivePortalBranch(previousView);
                setView(previousView);
              } else {
                if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
                setView('alumni');
              }
            }} 
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 flex items-center justify-center transition shadow-sm shrink-0"
            title="Geri Dön"
            aria-label="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Logo variant="white" className="h-9 w-auto hover:opacity-90 transition shrink-0" />
            <div className="h-6 w-px bg-white/15 hidden sm:block" />
            <div>
              <h1 className="font-black text-white tracking-tight text-base sm:text-lg flex items-center gap-2">
                Küresel Mezun Haritası
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">İESÜ Mezunlarının Dünya Çapındaki Dağılımı ve Kariyer Merkezleri</p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex bg-cyan-950/40 text-cyan-300 px-3.5 py-1.5 rounded-full items-center gap-2 text-xs font-bold border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Users size={14} className="text-cyan-400" /> 
            <span>{totalCount.toLocaleString()}+ Mezun Dünya Çapında</span>
          </div>

          <TopProfileMenu 
            currentUser={currentUser} 
            userRole={userRole} 
            setView={setView} 
            setSelectedUserId={setSelectedUserId} 
            isDark={true}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden">
        
        {/* Map Viewport Area */}
        <div className="flex-1 relative h-[55vh] lg:h-auto overflow-hidden bg-gradient-to-b from-[#020817] via-[#0b1329] to-[#0f172a]">
          {/* Ambient background glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-900/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-900/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-900/20 rounded-full blur-[180px] pointer-events-none" />

          {/* Controls & Search Overlays (Top Section) */}
          <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
            
            {/* Top Bar: Region Filters & Search Bar */}
            <div className="flex flex-col md:flex-row gap-2.5 justify-between items-start md:items-center">
              {/* Region Quick Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto bg-[#0f172a]/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl scrollbar-none">
                {REGION_PRESETS.map(preset => {
                  const isPresetActive = activeRegion === preset.id;
                  const isSpecialCorridor = preset.id === 'duzce_corridor';
                  return (
                    <button
                      key={preset.id}
                      data-testid={`preset-${preset.id}`}
                      onClick={() => handleRegionSelect(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isPresetActive 
                          ? isSpecialCorridor
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                            : 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                          : isSpecialCorridor
                            ? 'text-emerald-300 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isSpecialCorridor && <span>🌲</span>}
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Input Bar with Live Autocomplete Suggestions */}
              <div className="pointer-events-auto w-full md:w-80 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Şehir, ülke veya mezun ara..."
                  className="w-full pl-9 pr-8 py-2.5 bg-[#0f172a]/95 backdrop-blur-md text-white border border-cyan-500/25 rounded-2xl text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 shadow-2xl transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}

                {/* Dropdown Suggestions */}
                <AnimatePresence>
                  {searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-[#0c162e]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-1.5 space-y-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400 border-b border-cyan-500/15 flex items-center justify-between">
                        <span>Arama Önerileri</span>
                        <span className="text-slate-400">Şehir & Ülke</span>
                      </div>
                      {searchSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base">{sug.flag || '📍'}</span>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition truncate">
                                {sug.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {sug.type === 'city' ? `${sug.country} • ${sug.specialty}` : 'Ülke & Mezun Ağı'}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-2">
                            Haritada Git →
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Second Row: Diaspora HUD Strip + Career Routes Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* HUD Strip */}
              <div className="pointer-events-auto flex items-center gap-2 bg-[#0f172a]/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-300 shadow-md">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <Globe2 size={12} className="text-cyan-400" /> {activeCountries.length} Aktif Ülke
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <MapPin size={12} className="text-blue-400" /> {hubs.length} Mezun Merkezi
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Canlı Küresel Ağ
                </span>
              </div>

              {/* Career Routes Toolbar & Origin Filter (REMOVED) */}
            </div>

          </div>

          {/* User Location Floating Banner */}
          {currentUser?.city && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-28 left-4 z-20 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 px-3.5 py-2 rounded-2xl flex items-center gap-3 shadow-2xl text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-200">
                Bulunduğunuz Konum: <strong className="text-white font-bold">{currentUser.city}</strong> {currentUser.country ? `(${currentUser.country})` : ''}
              </span>
              <button
                onClick={handleJumpToUserLocation}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] transition shadow-sm flex items-center gap-1"
              >
                <MapPin size={12} /> Haritada Git
              </button>
            </motion.div>
          )}

          {/* Zoom and Reset Controls (Bottom-Left) */}
          <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2 bg-[#0f172a]/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            <button 
              onClick={handleZoomIn}
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Yakınlaştır"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Uzaklaştır"
            >
              <ZoomOut size={18} />
            </button>
            <div className="h-px bg-white/10 my-0.5" />
            <button 
              onClick={handleReset}
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Görünümü Sıfırla"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Active Route Floating Card (Bottom Center) */}
          <AnimatePresence>
            {activeRoute && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-[#0a1429]/95 backdrop-blur-xl border border-cyan-500/40 p-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-3 text-xs max-w-md w-[92%] sm:w-auto"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Route size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">{activeRoute.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold shrink-0">
                      {activeRoute.alumniCount} Mezun
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{activeRoute.field} • {activeRoute.corridor}</p>
                </div>
                <button
                  onClick={() => setActiveRoute(null)}
                  className="text-slate-400 hover:text-white text-xs p-1 ml-1 shrink-0 rounded-lg hover:bg-white/10 transition"
                  title="Kapat"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyframe styles for breathing glass and dashed lines */}
          <style>{`
            @keyframes countryGlassBreathe {
              0%, 100% {
                stroke: rgba(56, 189, 248, 0.5);
                stroke-width: 0.9px;
                filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.35));
              }
              50% {
                stroke: rgba(125, 211, 252, 1);
                stroke-width: 1.6px;
                filter: drop-shadow(0 0 14px rgba(125, 211, 252, 0.9));
              }
            }

            @keyframes countryGlassSelected {
              0%, 100% {
                stroke: rgba(103, 232, 249, 0.8);
                stroke-width: 1.6px;
                filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6));
              }
              50% {
                stroke: rgba(165, 243, 252, 1);
                stroke-width: 2.3px;
                filter: drop-shadow(0 0 22px rgba(34, 211, 238, 1));
              }
            }

            @keyframes countryGlassUser {
              0%, 100% {
                stroke: rgba(52, 211, 153, 0.6);
                stroke-width: 1.0px;
                filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.35));
              }
              50% {
                stroke: rgba(110, 231, 183, 1);
                stroke-width: 1.8px;
                filter: drop-shadow(0 0 16px rgba(52, 211, 153, 0.95));
              }
            }

            @keyframes dashMove {
              to {
                stroke-dashoffset: -20;
              }
            }

            .country-breathing {
              animation: countryGlassBreathe 3.8s ease-in-out infinite;
              cursor: pointer;
            }

            .country-breathing-selected {
              animation: countryGlassSelected 2.5s ease-in-out infinite;
              cursor: pointer;
            }

            .country-breathing-user {
              animation: countryGlassUser 3.2s ease-in-out infinite;
              cursor: pointer;
            }

            .route-animated-line {
              stroke-dasharray: 6 3;
              animation: dashMove 2.2s linear infinite;
            }

            .route-animated-line-active {
              stroke-dasharray: 8 4;
              animation: dashMove 1.2s linear infinite;
            }
          `}</style>

          {/* Interactive Composable Map with Error Boundary */}
          <MapErrorBoundary>
            <ComposableMap 
              projection="geoMercator" 
              projectionConfig={{ scale: 140 }} 
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup 
                center={safeCenter} 
                zoom={safeZoom} 
                maxZoom={8}
                onMoveEnd={handleMoveEnd}
              >
                {/* 1. Country Geographies with pure glass border shimmer */}
                <Geographies geography={geoUrl}>
                  {({ geographies }) => {
                    if (!geographies || !Array.isArray(geographies) || geographies.length === 0) {
                      return null;
                    }
                    return geographies.map((geo) => {
                      if (!geo || !geo.properties) return null;
                      const countryName = geo.properties.name || '';
                      const isCountryActive = (activeCountries || []).some(ac => matchCountryToTopo(countryName, ac));
                      const isSelectedCountry = Boolean(activeHub?.country && matchCountryToTopo(countryName, activeHub.country));
                      const isUserCountry = Boolean(currentUser?.country && matchCountryToTopo(countryName, currentUser.country));

                      const countryClass = isSelectedCountry 
                        ? 'country-breathing-selected' 
                        : isUserCountry && isCountryActive
                          ? 'country-breathing-user'
                          : isCountryActive 
                            ? 'country-breathing' 
                            : 'transition-colors duration-300';

                      return (
                        <Geography
                          key={geo.rsmKey || geo.id || countryName}
                          geography={geo}
                          className={countryClass}
                          onMouseEnter={() => {
                            const matchedCountryObj = SUPPORTED_COUNTRIES.find(c => matchCountryToTopo(countryName, c.name));
                            const countryHubs = (hubs || []).filter(h => h && matchCountryToTopo(countryName, h.country));
                            const count = countryHubs.reduce((s, h) => s + (h.count || 0), 0);
                            const cities = countryHubs.map(h => h.city).filter(Boolean).slice(0, 3).join(', ');
                            
                            const displayName = matchedCountryObj ? `${matchedCountryObj.flag || '📍'} ${matchedCountryObj.name}` : countryName;
                            const detailText = count > 0 
                              ? `${displayName} • ${count} Mezun${cities ? ` (${cities})` : ''}`
                              : displayName;
                            setTooltipContent(detailText);
                          }}
                          onMouseLeave={() => setTooltipContent("")}
                          onClick={() => {
                            try {
                              const countryHub = (hubs || []).find(h => h && matchCountryToTopo(countryName, h.country));
                              if (countryHub && Array.isArray(countryHub.coordinates) && countryHub.coordinates.length >= 2) {
                                handleHubSelect(countryHub);
                              } else {
                                const countryObj = SUPPORTED_COUNTRIES.find(c => matchCountryToTopo(countryName, c.name));
                                if (countryObj && Array.isArray(countryObj.center) && countryObj.center.length >= 2) {
                                  const countryAlumni = (hubs || [])
                                    .filter(h => h && matchCountryToTopo(countryName, h.country))
                                    .flatMap(h => h.alumniList || []);
                                  const dynamicHub = {
                                    id: `country_${countryObj.code}`,
                                    name: `${countryObj.flag || '📍'} ${countryObj.name}`,
                                    city: countryObj.name,
                                    country: countryObj.name,
                                    flag: countryObj.flag || '📍',
                                    coordinates: countryObj.center,
                                    count: countryAlumni.length || 1,
                                    alumniList: countryAlumni,
                                    topCompanies: ['Global Teknoloji & Kurumlar'],
                                    topRoles: ['Yazılım Mühendisi', 'Kariyer Lideri'],
                                    isUserHere: isUserCountry
                                  };
                                  handleHubSelect(dynamicHub);
                                  setPosition({ 
                                    coordinates: countryObj.center, 
                                    zoom: Number.isFinite(countryObj.zoom) ? countryObj.zoom : 3.5 
                                  });
                                }
                              }
                            } catch (err) {
                              console.error("Error on country click:", err);
                            }
                          }}
                          fill={
                            isSelectedCountry 
                              ? "#17284f" 
                              : isUserCountry && isCountryActive
                                ? "#0f2e24"
                                : isCountryActive
                                  ? "#14223d"
                                  : "#101a2f" 
                          }
                          stroke={
                            isSelectedCountry 
                              ? "#67e8f9" 
                              : isUserCountry && isCountryActive
                                ? "#34d399"
                                : isCountryActive 
                                  ? "#38bdf8" 
                                  : "rgba(255, 255, 255, 0.12)"
                          }
                          strokeWidth={isSelectedCountry ? 1.6 : isCountryActive ? 0.9 : 0.4}
                          style={{
                            default: { 
                              outline: "none", 
                              transition: 'all 0.3s ease'
                            },
                            hover: { 
                              fill: "#1b2c4e", 
                              stroke: "#93c5fd", 
                              strokeWidth: 1.6,
                              outline: "none", 
                              cursor: 'pointer',
                              filter: 'drop-shadow(0 0 12px rgba(147, 197, 253, 0.85))'
                            },
                            pressed: { fill: "#1e3a8a", outline: "none" }
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>

                {/* Map clutter removed per user request */}
              </ZoomableGroup>
            </ComposableMap>
          </MapErrorBoundary>

          {/* Real-Time Live Coordinate & Level of Detail (LOD) HUD Strip (Bottom-Right) */}
          <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2.5 bg-[#0f172a]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-300 font-mono shadow-xl pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>GEO: {safeCenter[1].toFixed(2)}°N, {safeCenter[0].toFixed(2)}°E</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300 font-bold">ÖLÇEK: {safeZoom.toFixed(2)}x</span>
            <span className="text-slate-600">|</span>
            <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] border ${lodInfo.badgeColor}`}>
              {lodInfo.code}: {lodInfo.label}
            </span>
            <div className="flex items-center gap-1 pl-1 border-l border-white/10">
              <button
                onClick={() => setPosition({ coordinates: [20, 40], zoom: 1 })}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="1.0x Dünya Görünümü"
              >
                1x
              </button>
              <button
                onClick={() => setPosition({ coordinates: [10, 44], zoom: 3.06 })}
                className="px-1.5 py-0.5 rounded hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition font-bold"
                title="3.06z Düzce Koridor Görünümü"
              >
                3.06z
              </button>
              <button
                onClick={() => setPosition({ coordinates: safeCenter, zoom: 5.5 })}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="5.5x Şehir Detay Görünümü"
              >
                5.5x
              </button>
            </div>
          </div>

          {/* Floating Map Tooltip */}
          <AnimatePresence>
            {tooltipContent && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute top-24 left-1/2 -translate-x-1/2 bg-[#0f172a]/95 backdrop-blur-xl px-4 py-2 rounded-full border border-cyan-500/30 text-xs font-black text-cyan-300 pointer-events-none z-50 shadow-2xl flex items-center gap-2"
              >
                <Sparkles size={14} className="text-cyan-400 animate-spin" />
                {tooltipContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Sidebar (Live Alumni Details, City Explorer, Career Routes & Hub Stats) */}
        <div className="w-full lg:w-[420px] xl:w-[460px] bg-gradient-to-b from-[#0a1224]/95 via-[#0b162c]/95 to-[#060b17]/95 backdrop-blur-2xl border-l border-cyan-500/20 h-[45vh] lg:h-auto overflow-y-auto flex flex-col z-20 shadow-[-25px_0_50px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            {!activeHub ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-6 lg:p-8 justify-between"
              >
                <div className="text-center my-auto">
                  <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 animate-pulse" />
                    <div className="absolute inset-2 rounded-2xl bg-blue-600/10 border border-blue-400/20" />
                    <Globe2 size={40} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] relative z-10" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-2.5">
                    <Sparkles size={12} /> Küresel İstihbarat & Kariyer Rotaları
                  </div>
                  <h2 className="text-lg font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent mb-2 tracking-tight">
                    Haritadan Bir Ülke veya Rota Seçin
                  </h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Haritada parıldayan ülkelere tıklayarak şehirleri ve mezunları görüntüleyin; 
                    veya Düzce ve Türkiye merkezli uluslararası kariyer koridorlarını doğrudan inceleyin.
                  </p>
                </div>

                {/* Featured Career Corridors (Google Maps Diaspora Routes) */}
                <div className="space-y-2.5 my-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Route size={13} /> Öne Çıkan Kariyer Koridorları
                    </span>
                    <span className="text-[10px] text-slate-500">Google Maps 3.06z</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      CAREER_ROUTES.find(r => r.id === 'route_duzce_stuttgart'),
                      CAREER_ROUTES.find(r => r.id === 'route_duzce_munich'),
                      CAREER_ROUTES.find(r => r.id === 'route_duzce_london'),
                      CAREER_ROUTES.find(r => r.id === 'route_ist_sf')
                    ].filter(Boolean).map(route => {
                      const isDuzce = route.originHub === 'Düzce';
                      return (
                        <button
                          key={route.id}
                          onClick={() => handleSelectRoute(route)}
                          className="w-full p-2.5 bg-[#0d172e]/80 hover:bg-[#132347] border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-left transition-all duration-200 group flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.12)]"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{isDuzce ? '🌲' : '🚀'}</span>
                              <p className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition truncate">
                                {route.title}
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {route.field} • <span className="text-slate-300 font-medium">{route.corridor}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-bold text-cyan-400">{route.alumniCount}</span>
                            <span className="text-[9px] text-slate-500 block">Mezun</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Top Global Hubs Quick Jump List (Includes quick-hub-hub_berlin) */}
                <div className="space-y-2.5 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Compass size={13} /> Lider Mezun Hubları
                    </span>
                    <span className="text-[11px] text-slate-500">Hızlı İncele</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(hubs || []).slice(0, 4).map(hub => {
                      if (!hub) return null;
                      const hubCount = Number.isFinite(hub.count) ? hub.count : 0;
                      return (
                        <button
                          key={hub.id}
                          data-testid={`quick-hub-${hub.id}`}
                          onClick={() => handleHubSelect(hub)}
                          className="p-2.5 bg-[#0d172e]/80 hover:bg-[#132347] border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl text-left transition-all duration-200 group shadow-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">{hub.flag || '📍'}</span>
                            <span className="text-xs font-black text-cyan-400 font-mono">{hubCount.toLocaleString()}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition truncate">{hub.city || 'Şehir'}</p>
                          <p className="text-[10px] text-slate-400 truncate">{hub.country || 'Ülke'}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeHub.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="p-6 md:p-8 flex flex-col space-y-6"
              >
                {/* Header & Location Badge */}
                <div className="bg-[#0c162e]/90 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.08)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-widest">
                      <MapPin size={13} /> Küresel Diaspora Merkezi
                    </div>
                    {activeHub.isUserHere && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        🌟 Buradasınız
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight flex items-center gap-2.5">
                    <span className="text-3xl">{activeHub.flag || '📍'}</span>
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">{activeHub.name}</span>
                  </h2>
                </div>

                {/* Hub Stats Cards */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#0b162d]/90 p-4 rounded-2xl border border-cyan-500/25 flex flex-col justify-center shadow-inner">
                    <div className="flex items-center justify-between mb-1">
                      <Users className="text-cyan-400" size={17} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Mezun</span>
                    </div>
                    <span className="text-2xl font-black text-cyan-300 font-mono">{(Number.isFinite(activeHub.count) ? activeHub.count : 0).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 mt-1">İESÜ Mezun Ekosistemi</span>
                  </div>

                  <div className="bg-[#0b162d]/90 p-4 rounded-2xl border border-amber-500/25 flex flex-col justify-center shadow-inner">
                    <div className="flex items-center justify-between mb-1">
                      <Star className="text-amber-400" size={17} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Şehir Sayısı</span>
                    </div>
                    <span className="text-2xl font-black text-amber-300 font-mono">{countryCities.length > 0 ? countryCities.length : '1'}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{activeHub.country}</span>
                  </div>
                </div>

                {/* Sidebar Tab Switcher (4 Tabs: Mezunlar, Şehirler, Rotalar, Kurum & Roller) */}
                <div className="flex border-b border-cyan-500/20 text-xs font-bold gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                  <button
                    data-testid="sidebar-tab-alumni"
                    onClick={() => setSidebarTab('alumni')}
                    className={`pb-2.5 px-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                      sidebarTab === 'alumni' 
                        ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(34,211,238,0.3)]' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users size={14} /> Mezunlar ({(activeHub.alumniList || []).length})
                  </button>

                  <button
                    data-testid="sidebar-tab-cities"
                    onClick={() => setSidebarTab('cities')}
                    className={`pb-2.5 px-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                      sidebarTab === 'cities' 
                        ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(34,211,238,0.3)]' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Navigation size={14} /> Şehirler ({countryCities.length})
                  </button>

                  <button
                    data-testid="sidebar-tab-routes"
                    onClick={() => setSidebarTab('routes')}
                    className={`pb-2.5 px-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                      sidebarTab === 'routes' 
                        ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(34,211,238,0.3)]' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Route size={14} /> Rotalar ({activeHubRoutes.length})
                  </button>

                  <button
                    data-testid="sidebar-tab-insights"
                    onClick={() => setSidebarTab('insights')}
                    className={`pb-2.5 px-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                      sidebarTab === 'insights' 
                        ? 'border-cyan-400 text-cyan-300 shadow-[0_2px_10px_rgba(34,211,238,0.3)]' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Briefcase size={14} /> Kurum & Roller
                  </button>
                </div>

                {/* Tab 1: Real Alumni in this Hub */}
                {sidebarTab === 'alumni' && (
                  <div className="space-y-3">
                    {activeHub.alumniList && activeHub.alumniList.length > 0 ? (
                      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                        {activeHub.alumniList.filter(Boolean).map((alumnus, idx) => {
                          const alumnusName = alumnus.name || 'İESÜ Mezunu';
                          const alumnusTitle = alumnus.title || alumnus.role || 'Mezun';
                          const alumnusCompany = alumnus.company || 'Global Kurum';
                          const alumnusDepartment = alumnus.department || 'İESÜ Mezunu';

                          return (
                            <div 
                              key={alumnus.id || idx}
                              className="bg-[#0d1830]/80 hover:bg-[#132347] border border-cyan-500/20 hover:border-cyan-400/50 p-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 group shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.12)]"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <SafeAvatar 
                                  src={alumnus.avatar} 
                                  name={alumnusName} 
                                  className="w-10 h-10 rounded-full border border-cyan-400/30 shrink-0 shadow-md" 
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-100 truncate group-hover:text-cyan-300 transition">
                                    {alumnusName}
                                  </p>
                                  <p className="text-xs text-slate-400 truncate">
                                    {alumnusTitle} • <span className="text-slate-300">{alumnusCompany}</span>
                                  </p>
                                  <p className="text-[10px] text-cyan-400 font-medium truncate">
                                    {alumnusDepartment}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 shrink-0">
                                {setSelectedUserId && alumnus.id && (
                                  <button
                                    onClick={() => {
                                      setSelectedUserId(alumnus.id);
                                      setView('public_profile');
                                    }}
                                    className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                  >
                                    Profil
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    showToast('success', `${alumnusName} için bağlantı isteği gönderildi.`);
                                  }}
                                  className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 rounded-lg text-[11px] font-medium transition"
                                >
                                  Bağlan
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-5 bg-[#0d1830]/60 rounded-2xl border border-cyan-500/20 text-center text-xs text-slate-400">
                        <Users size={24} className="mx-auto mb-2 text-cyan-500/50" />
                        <p className="font-bold text-slate-300">Bu merkezde henüz bireysel profil listelenmedi.</p>
                        <p className="text-[11px] mt-1 text-slate-400">İESÜ mezunları "Bilgilerimi Düzenle" panelinden bu konumu seçtikçe listeye otomatik dahil olurlar.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Country Cities & Hubs */}
                {sidebarTab === 'cities' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>{activeHub.country} Şehirleri & Ağ Merkezleri</span>
                      <span className="text-cyan-400 font-bold">{countryCities.length} Şehir Kayıtlı</span>
                    </div>

                    {countryCities.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {countryCities.map((cityObj, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-3 bg-[#0d1830]/80 hover:bg-[#132347] border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 group shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.12)]"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{cityObj.flag || '📍'}</span>
                                <h4 className="text-xs font-black text-slate-100 group-hover:text-cyan-300 transition truncate">
                                  {cityObj.city}
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {cityObj.specialty}
                              </p>
                              <span className="text-[9px] font-mono text-cyan-400/80">
                                {cityObj.coords[1].toFixed(2)}°N, {cityObj.coords[0].toFixed(2)}°E
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setPosition({ coordinates: cityObj.coords, zoom: 5.5 });
                                setTooltipContent(`${cityObj.flag || '📍'} ${cityObj.city} (${cityObj.country}) • Haritada Odaklanıldı`);
                              }}
                              className="px-2.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0"
                              title="Haritada Bu Şehre Git"
                            >
                              <span>Odaklan</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 bg-[#0d1830]/60 rounded-2xl border border-cyan-500/20 text-center text-xs text-slate-400">
                        <MapPin size={24} className="mx-auto mb-2 text-cyan-500/50" />
                        <p className="font-bold text-slate-300">Bu ülkeye ait ayrıntılı şehir listesi işleniyor.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Connected Career Routes */}
                {sidebarTab === 'routes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Bu Bölgeye Bağlı Kariyer Koridorları</span>
                      <span className="text-cyan-400 font-bold">{activeHubRoutes.length} Rota</span>
                    </div>

                    {activeHubRoutes.length > 0 ? (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {activeHubRoutes.map(route => {
                          const isSelected = activeRoute?.id === route.id;
                          return (
                            <div
                              key={route.id}
                              className={`p-3 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'bg-[#122449] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                                  : 'bg-[#0d1830]/80 border-cyan-500/20 hover:border-cyan-400/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <Route size={13} className="text-cyan-400" />
                                  {route.fromCity} ➔ {route.toCity}
                                </span>
                                <span className="text-xs font-mono font-bold text-cyan-400">
                                  {route.alumniCount} Mezun
                                </span>
                              </div>
                              <p className="text-[11px] text-cyan-300 font-medium">{route.field}</p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{route.description}</p>
                              <button
                                onClick={() => handleSelectRoute(route)}
                                className="mt-2.5 w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                              >
                                <span>Haritada Rotayı İncele (3.06z)</span>
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-5 bg-[#0d1830]/60 rounded-2xl border border-cyan-500/20 text-center text-xs text-slate-400">
                        <Route size={24} className="mx-auto mb-2 text-cyan-500/50" />
                        <p className="font-bold text-slate-300">Bu merkez için tanımlı doğrudan koridor bulunamadı.</p>
                        <button
                          onClick={() => {
                            setShowRoutes(true);
                            setRouteOriginFilter('all');
                            showToast('info', 'Tüm küresel kariyer rotaları haritada gösteriliyor.');
                          }}
                          className="mt-3 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition"
                        >
                          Tüm Rotaları Aç
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Companies & Roles */}
                {sidebarTab === 'insights' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Building2 size={15} className="text-cyan-400" /> En Çok Çalışılan Kurumlar
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeHub.topCompanies || []).map((comp, idx) => (
                          <div 
                            key={idx} 
                            className="bg-[#0d1830]/80 border border-cyan-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-[#142345] hover:border-cyan-400/40 transition cursor-default flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            {comp}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Briefcase size={15} className="text-cyan-400" /> Popüler Pozisyonlar
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(activeHub.topRoles || []).map((role, idx) => (
                          <div 
                            key={idx} 
                            className="bg-blue-500/10 text-cyan-300 border border-cyan-500/25 px-3 py-1.5 rounded-xl text-xs font-bold"
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-cyan-500/20 space-y-2.5 mt-auto">
                  <button 
                    onClick={() => {
                      showToast('info', `"${activeHub.name}" bölgesi için çalışma vizesi ve relocation rehberi hazırlanıyor...`);
                      setTimeout(() => {
                        showToast('success', '🌍 İESÜ Global Diaspora: Hedef bölge için Start-up Vizesi, Blue Card ve relocation rehberi hazırlandı.');
                      }, 1800);
                    }}
                    className="w-full bg-[#0d1933] hover:bg-[#13244a] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    <Compass size={16} className="text-cyan-400" />
                    Vize & Relocation Rehberi
                  </button>

                  <button 
                    onClick={() => {
                      showToast('info', `"${activeHub.name}" bölgesindeki mezunlarla tanışma grubu başlatılıyor...`);
                      setTimeout(() => {
                        showToast('success', "✅ Mesaj Taslağı Hazır: 'Merhaba, ben de İESÜ mezunuyum...' taslağı Anka Chat'e aktarıldı.");
                      }, 1800);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 text-xs group"
                  >
                    <span>Bu Bölgedeki Mezunlarla İletişime Geç</span>
                    <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Floating Bottom Dock */}
      <SubPanelFloatingDock 
        currentUser={currentUser}
        userRole={userRole || 'alumni'}
        activeTab="global_map"
        setView={setView}
        setSelectedUserId={setSelectedUserId}
      />
    </div>
  );
}
