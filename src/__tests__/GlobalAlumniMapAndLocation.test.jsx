/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  geocodeLocation, 
  matchCountryToTopo, 
  aggregateAlumniHubs, 
  SUPPORTED_COUNTRIES 
} from '../utils/alumniGeoData';
import GlobalAlumniMap from '../components/GlobalAlumniMap';
import CMSAlumni from '../components/admin/CMSAlumni';
import ProfileUpdate, { BRANCH_CONFIGS } from '../components/ProfileUpdate';
import useAppStore from '../store/useAppStore';

// Mock react-simple-maps to render simple DOM elements in JSDOM
vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <div data-testid="composable-map">{children}</div>,
  ZoomableGroup: ({ children }) => <div data-testid="zoomable-group">{children}</div>,
  Geographies: ({ children }) => (
    <div data-testid="geographies">
      {typeof children === 'function' 
        ? children({
            geographies: [
              { rsmKey: 'geo-tr', properties: { name: 'Turkey' } },
              { rsmKey: 'geo-de', properties: { name: 'Germany' } },
              { rsmKey: 'geo-us', properties: { name: 'United States of America' } },
              { rsmKey: 'geo-gb', properties: { name: 'United Kingdom' } }
            ]
          }) 
        : children}
    </div>
  ),
  Geography: ({ geography, onClick, onMouseEnter }) => (
    <button 
      data-testid={`geo-${geography.properties.name}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {geography.properties.name}
    </button>
  ),
  Marker: ({ coordinates, children, onClick, onMouseEnter }) => (
    <div 
      data-testid="map-marker" 
      data-coords={coordinates.join(',')} 
      onClick={onClick} 
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  )
}));

describe('Global Alumni Diaspora & Map Ecosystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      currentUser: {
        id: 'ALU-CURRENT',
        name: 'Gökhan Çetin',
        role: 'alumni',
        department: 'Yazılım Mühendisliği',
        country: 'Almanya',
        city: 'Berlin',
        company: 'Delivery Hero',
        title: 'Senior Engineer',
        showOnGlobalMap: true
      },
      alumni: [
        { id: 'A1', name: 'Alp Yılmaz', country: 'Türkiye', city: 'İstanbul', company: 'Trendyol', showOnGlobalMap: true },
        { id: 'A2', name: 'Zeynep Ak', country: 'Almanya', city: 'Berlin', company: 'Zalando', showOnGlobalMap: true },
        { id: 'A3', name: 'Mert Demir', country: 'Birleşik Krallık', city: 'Londra', company: 'Amazon UK', showOnGlobalMap: true }
      ]
    });
  });

  describe('1. Geocoding & Aggregation Logic', () => {
    it('geocodes major tech cities to coordinates accurately', () => {
      const berlin = geocodeLocation('Almanya', 'Berlin');
      expect(berlin.city).toBe('Berlin');
      expect(berlin.country).toBe('Almanya');
      expect(berlin.coordinates).toEqual([13.4050, 52.5200]);

      const sf = geocodeLocation('Amerika Birleşik Devletleri', 'San Francisco');
      expect(sf.coordinates).toEqual([-122.4194, 37.7749]);

      const london = geocodeLocation('Birleşik Krallık', 'Londra');
      expect(london.coordinates).toEqual([-0.1276, 51.5072]);
    });

    it('matches TopoJSON country names against Turkish/English names', () => {
      expect(matchCountryToTopo('Turkey', 'Türkiye')).toBe(true);
      expect(matchCountryToTopo('Germany', 'Almanya')).toBe(true);
      expect(matchCountryToTopo('United States of America', 'Amerika Birleşik Devletleri')).toBe(true);
      expect(matchCountryToTopo('United Kingdom', 'Birleşik Krallık')).toBe(true);
    });

    it('dynamically aggregates alumni into hubs with real alumni list', () => {
      const storeAlumni = useAppStore.getState().alumni;
      const currentUser = useAppStore.getState().currentUser;
      const { hubs, totalCount, activeCountries } = aggregateAlumniHubs(storeAlumni, currentUser);

      expect(totalCount).toBeGreaterThan(0);
      expect(activeCountries).toContain('Germany');
      expect(activeCountries).toContain('Turkey');

      const berlinHub = hubs.find(h => h.city === 'Berlin');
      expect(berlinHub).toBeDefined();
      expect(berlinHub.alumniList.length).toBeGreaterThanOrEqual(1);
      expect(berlinHub.isUserHere).toBe(true);
    });
  });

  describe('2. GlobalAlumniMap Component UI', () => {
    it('renders header with total diaspora count, region buttons, and map markers', () => {
      const currentUser = useAppStore.getState().currentUser;
      render(
        <GlobalAlumniMap 
          setView={vi.fn()} 
          currentUser={currentUser} 
          userRole="alumni" 
          setSelectedUserId={vi.fn()} 
        />
      );

      expect(screen.getByText(/Küresel Mezun Haritası/i)).toBeInTheDocument();
      expect(screen.getByText(/Mezun Dünya Çapında/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Şehir, ülke veya mezun ara/i)).toBeInTheDocument();

      // Region buttons
      expect(screen.getByText(/Tüm Dünya/i)).toBeInTheDocument();
      expect(screen.getByText(/Avrupa/i)).toBeInTheDocument();
      expect(screen.getByText(/Kuzey Amerika/i)).toBeInTheDocument();
    });

    it('shows current user location banner when location is defined', () => {
      const currentUser = useAppStore.getState().currentUser;
      render(
        <GlobalAlumniMap 
          setView={vi.fn()} 
          currentUser={currentUser} 
          userRole="alumni" 
          setSelectedUserId={vi.fn()} 
        />
      );

      expect(screen.getByText(/Bulunduğunuz Konum:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Berlin/i).length).toBeGreaterThanOrEqual(1);
    });

    it('selects a hub when clicked and displays real alumni in sidebar', async () => {
      const currentUser = useAppStore.getState().currentUser;
      const setView = vi.fn();
      const setSelectedUserId = vi.fn();

      render(
        <GlobalAlumniMap 
          setView={setView} 
          currentUser={currentUser} 
          userRole="alumni" 
          setSelectedUserId={setSelectedUserId} 
        />
      );

      // Find quick jump button for Berlin hub and click it
      const berlinButton = screen.getByTestId('quick-hub-hub_berlin');
      expect(berlinButton).toBeInTheDocument();
      fireEvent.click(berlinButton);

      // Sidebar now details Berlin Hub
      await waitFor(() => {
        expect(screen.getByText(/Küresel Diaspora Merkezi/i)).toBeInTheDocument();
      });
      expect(screen.getAllByText(/Bu Bölgedeki Mezunlar/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Vize & Relocation Rehberi/i)).toBeInTheDocument();
    });

    it('routes back button to alumni branch when activePortalBranch is alumni, even for admin user role', () => {
      useAppStore.setState({ activePortalBranch: 'alumni' });
      const setView = vi.fn();
      const adminUser = { id: 'admin_1513', name: 'Admin User', role: 'admin' };

      render(
        <GlobalAlumniMap 
          setView={setView} 
          currentUser={adminUser} 
          userRole="admin" 
          setSelectedUserId={vi.fn()} 
          previousView="alumni"
        />
      );

      const backButton = screen.getByTitle('Geri Dön');
      fireEvent.click(backButton);
      expect(setView).toHaveBeenCalledWith('alumni');
    });

    it('routes back button to previousView when provided', () => {
      useAppStore.setState({ activePortalBranch: 'alumni' });
      const setView = vi.fn();

      render(
        <GlobalAlumniMap 
          setView={setView} 
          currentUser={{ role: 'admin' }} 
          userRole="admin" 
          setSelectedUserId={vi.fn()} 
          previousView="student"
        />
      );

      const backButton = screen.getByTitle('Geri Dön');
      fireEvent.click(backButton);
      expect(setView).toHaveBeenCalledWith('student');
    });
  });

  describe('3. ProfileUpdate Location Section', () => {
    it('renders alumni_location tab for alumni branch', () => {
      useAppStore.setState({ activePortalBranch: 'alumni' });
      const currentUser = useAppStore.getState().currentUser;

      render(
        <ProfileUpdate 
          setView={vi.fn()} 
          currentUser={currentUser} 
          userRole="alumni" 
          setCurrentUser={vi.fn()} 
          setSelectedUserId={vi.fn()} 
        />
      );

      // Verify alumni location tab exists
      const locationTab = screen.getByText(/Küresel Konum & Harita/i);
      expect(locationTab).toBeInTheDocument();

      // Click location tab
      fireEvent.click(locationTab);
      expect(screen.getByText(/Küresel Mezun Haritası & Diaspora Konumu/i)).toBeInTheDocument();
      expect(screen.getByText(/Haritada Görün/i)).toBeInTheDocument();
      expect(screen.getByText(/Haritada İncele/i)).toBeInTheDocument();
    });
  });

  describe('4. CMSAlumni Management Panel', () => {
    it('renders kuresel_harita tab with diaspora metrics and country breakdown', () => {
      const alumni = useAppStore.getState().alumni;
      const setView = vi.fn();

      render(
        <CMSAlumni 
          alumni={alumni} 
          setAlumni={vi.fn()} 
          currentUser={{ role: 'admin' }} 
          setView={setView} 
        />
      );

      // Find and click the Küresel Mezun Dağılımı tab
      const diasporaTab = screen.getByText(/Küresel Mezun Dağılımı & Harita/i);
      expect(diasporaTab).toBeInTheDocument();
      fireEvent.click(diasporaTab);

      // Verify KPI metrics are displayed
      expect(screen.getByText(/Aktif Ülke Sayısı/i)).toBeInTheDocument();
      expect(screen.getByText(/Yurt Dışı Mezun/i)).toBeInTheDocument();
      expect(screen.getByText(/Canlı Mezun Haritasını Aç/i)).toBeInTheDocument();

      // Click open live map button
      const openMapBtn = screen.getByText(/Canlı Mezun Haritasını Aç/i);
      fireEvent.click(openMapBtn);
      expect(setView).toHaveBeenCalledWith('global_map');
    });
  });

  describe('5. Expanded Geocoding, Header Polish & Crash Protection Robustness', () => {
    it('resolves Turkish provinces and international tech hubs accurately', () => {
      // Munich / Münih
      const munih = geocodeLocation('Almanya', 'Münih');
      const munich = geocodeLocation('Germany', 'Munich');
      expect(munih.coordinates).toEqual([11.5820, 48.1351]);
      expect(munich.coordinates).toEqual([11.5820, 48.1351]);

      // Kadıköy & Ankara & İzmir
      const kadikoy = geocodeLocation('Türkiye', 'Kadıköy');
      expect(kadikoy.coordinates).toEqual([29.0253, 40.9819]);
      const ankara = geocodeLocation('Türkiye', 'Ankara');
      expect(ankara.coordinates).toEqual([32.8597, 39.9334]);
      const izmir = geocodeLocation('Türkiye', 'İzmir');
      expect(izmir.coordinates).toEqual([27.1428, 38.4237]);

      // San Jose & Austin
      const sanJose = geocodeLocation('USA', 'San Jose');
      expect(sanJose.coordinates[0]).toBeCloseTo(-121.88, 1);
      const austin = geocodeLocation('ABD', 'Austin');
      expect(austin.coordinates[0]).toBeCloseTo(-97.74, 1);

      // Eindhoven, Doha, Baku, Paris
      const eindhoven = geocodeLocation('Hollanda', 'Eindhoven');
      expect(eindhoven.coordinates).toEqual([5.4697, 51.4416]);
      const doha = geocodeLocation('Katar', 'Doha');
      expect(doha.coordinates).toEqual([51.5310, 25.2854]);
      const baku = geocodeLocation('Azerbaycan', 'Baku');
      expect(baku.coordinates).toEqual([49.8671, 40.4093]);
      const paris = geocodeLocation('Fransa', 'Paris');
      expect(paris.coordinates).toEqual([2.3522, 48.8566]);

      // Additional Turkish provinces
      expect(geocodeLocation('', 'Antalya').coordinates).toEqual([30.7133, 36.8969]);
      expect(geocodeLocation('', 'Trabzon').coordinates).toEqual([39.7168, 41.0027]);
      expect(geocodeLocation('', 'Gaziantep').coordinates).toEqual([37.3822, 37.0662]);
      expect(geocodeLocation('', 'Bursa').coordinates).toEqual([29.0610, 40.1885]);
    });

    it('cleans header by removing Canlı Diaspora badge and Geri text', () => {
      render(
        <GlobalAlumniMap 
          setView={vi.fn()} 
          currentUser={null} 
          userRole="student" 
          setSelectedUserId={vi.fn()} 
        />
      );

      // Verify "Canlı Diaspora" is gone
      expect(screen.queryByText(/Canlı Diaspora/i)).not.toBeInTheDocument();

      // Verify back button has no "Geri" text
      expect(screen.queryByText(/^Geri$/i)).not.toBeInTheDocument();
      const backButton = screen.getByTitle('Geri Dön');
      expect(backButton).toBeInTheDocument();
      expect(backButton.textContent).not.toContain('Geri');
    });

    it('protects against crashes with null, undefined, or corrupt data in aggregation and geocoding', () => {
      // Null geocoding inputs
      const fallbackLoc = geocodeLocation(null, null);
      expect(fallbackLoc.coordinates).toBeDefined();
      expect(Number.isFinite(fallbackLoc.coordinates[0])).toBe(true);

      // Null matchCountryToTopo inputs
      expect(matchCountryToTopo(null, null)).toBe(false);
      expect(matchCountryToTopo(undefined, 'Türkiye')).toBe(false);

      // Corrupt alumni list in aggregation
      const corruptList = [
        null,
        undefined,
        { id: 'bad1', showOnGlobalMap: true },
        { id: 'bad2', country: '', city: '', showOnGlobalMap: true },
        { id: 'bad3', checkupAnswers: 'not an array', showOnGlobalMap: true }
      ];
      const result = aggregateAlumniHubs(corruptList, null);
      expect(result.hubs).toBeDefined();
      expect(Array.isArray(result.hubs)).toBe(true);
      expect(Number.isFinite(result.totalCount)).toBe(true);
    });
  });
});
