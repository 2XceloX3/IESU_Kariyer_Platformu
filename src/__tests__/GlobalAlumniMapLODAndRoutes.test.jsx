/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  SUPPORTED_COUNTRIES, 
  CITY_COORDINATES, 
  CAREER_ROUTES, 
  getCareerRoutes, 
  getCityListByZoom,
  REGION_PRESETS,
  geocodeLocation
} from '../utils/alumniGeoData';
import GlobalAlumniMap from '../components/GlobalAlumniMap';
import useAppStore from '../store/useAppStore';

// Mock react-simple-maps with both Marker and Line
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
      data-coords={coordinates?.join(',')} 
      onClick={onClick} 
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  ),
  Line: ({ from, to, onClick, onMouseEnter }) => (
    <div 
      data-testid="map-line" 
      data-from={from?.join(',')} 
      data-to={to?.join(',')} 
      onClick={onClick} 
      onMouseEnter={onMouseEnter}
    />
  )
}));

describe('Global Alumni Map — Zoom LOD & Career Routes Architecture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      currentUser: {
        id: 'ALU-1',
        name: 'Düzce Mühendisi',
        role: 'alumni',
        country: 'Türkiye',
        city: 'Düzce',
        showOnGlobalMap: true
      },
      alumni: [
        { id: 'A1', name: 'Caner Şen', country: 'Türkiye', city: 'Düzce', showOnGlobalMap: true },
        { id: 'A2', name: 'Zeynep Ak', country: 'Almanya', city: 'Stuttgart', showOnGlobalMap: true },
        { id: 'A3', name: 'Burak Demir', country: 'Birleşik Krallık', city: 'Londra', showOnGlobalMap: true }
      ]
    });
  });

  describe('1. Global City Data & 108 Country Coverage', () => {
    it('covers all 108 supported countries with registered cities in CITY_COORDINATES', () => {
      expect(SUPPORTED_COUNTRIES.length).toBe(108);

      const supportedCountryNames = new Set(SUPPORTED_COUNTRIES.map(c => c.name.toLowerCase()));
      const coveredCountries = new Set(Object.values(CITY_COORDINATES).map(c => c.country?.toLowerCase()).filter(Boolean));

      supportedCountryNames.forEach(cName => {
        expect(coveredCountries.has(cName)).toBe(true);
      });
    });

    it('contains Düzce with exact coordinates, industrial specialty and Tier 1 ranking', () => {
      const duzce = CITY_COORDINATES['duzce'];
      expect(duzce).toBeDefined();
      expect(duzce.city).toBe('Düzce');
      expect(duzce.country).toBe('Türkiye');
      expect(duzce.coords).toEqual([31.1626, 40.8387]);
      expect(duzce.tier).toBe(1);
      expect(duzce.specialty).toContain('Orman Ürünleri, Makine');

      // Geocoding Düzce accurately resolves
      const geocoded = geocodeLocation('Türkiye', 'Düzce');
      expect(geocoded.coordinates).toEqual([31.1626, 40.8387]);
    });
  });

  describe('2. Career Corridors (Google Maps Migration Routes)', () => {
    it('contains 18 total career routes including 5 origin hubs from Düzce', () => {
      expect(CAREER_ROUTES.length).toBe(18);

      const duzceRoutes = getCareerRoutes('Düzce');
      expect(duzceRoutes.length).toBe(5);

      const targetCities = duzceRoutes.map(r => r.toCity);
      expect(targetCities).toContain('Stuttgart');
      expect(targetCities).toContain('Münih');
      expect(targetCities).toContain('Londra');
      expect(targetCities).toContain('Detroit');
      expect(targetCities).toContain('Tokyo');
    });

    it('filters routes correctly by origin hub', () => {
      const istRoutes = getCareerRoutes('İstanbul');
      expect(istRoutes.length).toBe(7);

      const ankaraRoutes = getCareerRoutes('Ankara');
      expect(ankaraRoutes.length).toBe(3);

      const izmirRoutes = getCareerRoutes('İzmir');
      expect(izmirRoutes.length).toBe(3);

      const allRoutes = getCareerRoutes('all');
      expect(allRoutes.length).toBe(18);
    });

    it('contains Düzce corridor preset at 3.06z matching user Google Maps direction URL', () => {
      const preset = REGION_PRESETS.find(p => p.id === 'duzce_corridor');
      expect(preset).toBeDefined();
      expect(preset.zoom).toBe(3.06);
      expect(preset.center).toEqual([10, 44]);
    });
  });

  describe('3. Level of Detail (LOD) Algorithm', () => {
    it('returns empty list at World Zoom (< 2.5) to avoid visual clutter', () => {
      const worldCities = getCityListByZoom(1.0);
      expect(worldCities).toEqual([]);

      const zoomedCities = getCityListByZoom(2.4);
      expect(zoomedCities).toEqual([]);
    });

    it('returns Tier 1 cities only at Regional Zoom (2.5 to 4.4)', () => {
      const regionalCities = getCityListByZoom(3.06);
      expect(regionalCities.length).toBeGreaterThan(0);
      regionalCities.forEach(c => {
        expect(c.tier).toBe(1);
      });
      // Düzce is Tier 1 so it is included
      const hasDuzce = regionalCities.some(c => c.city === 'Düzce');
      expect(hasDuzce).toBe(true);
    });

    it('returns all cities at City Zoom (>= 4.5)', () => {
      const allCities = getCityListByZoom(5.5);
      expect(allCities.length).toBeGreaterThanOrEqual(400);
    });

    it('filters cities by country when country parameter is provided', () => {
      const trCities = getCityListByZoom(5.5, 'Türkiye');
      expect(trCities.length).toBeGreaterThanOrEqual(10);
      trCities.forEach(c => {
        expect(c.country).toBe('Türkiye');
      });
    });

    it('includes major global metropolitan hubs as Tier 1 at zoom 3.06 alongside Düzce', () => {
      const regionalCities = getCityListByZoom(3.06);
      const cityNames = new Set(regionalCities.map(c => c.city));

      expect(cityNames.has('Düzce')).toBe(true);
      expect(cityNames.has('Berlin')).toBe(true);
      expect(cityNames.has('Londra')).toBe(true);
      expect(cityNames.has('San Francisco')).toBe(true);
      expect(cityNames.has('Tokyo')).toBe(true);
      expect(cityNames.has('İstanbul')).toBe(true);
      expect(cityNames.has('Ankara')).toBe(true);
      expect(cityNames.has('İzmir')).toBe(true);
    });
  });

  describe('4. GlobalAlumniMap UI with Routes & LOD Controls', () => {



    it('allows switching to Düzce corridor preset (3.06z)', () => {
      render(<GlobalAlumniMap setView={vi.fn()} currentUser={useAppStore.getState().currentUser} userRole="alumni" />);

      const duzcePresetBtn = screen.getByTestId('preset-duzce_corridor');
      fireEvent.click(duzcePresetBtn);

      expect(screen.getByTitle(/3\.06z Düzce Koridor Görünümü/i)).toBeInTheDocument();
    });

    it('displays connected career routes tab in sidebar when hub is selected', async () => {
      render(<GlobalAlumniMap setView={vi.fn()} currentUser={useAppStore.getState().currentUser} userRole="alumni" />);

      // Select Berlin hub
      const berlinHubBtn = screen.getByTestId('quick-hub-hub_berlin');
      fireEvent.click(berlinHubBtn);

      await waitFor(() => {
        expect(screen.getByTestId('sidebar-tab-routes')).toBeInTheDocument();
      });

      // Click routes tab
      const routesTab = screen.getByTestId('sidebar-tab-routes');
      fireEvent.click(routesTab);

      // Verify connected corridor or routes header is shown
      expect(screen.getByText(/Bu Bölgeye Bağlı Kariyer Koridorları/i)).toBeInTheDocument();
    });
  });
});
