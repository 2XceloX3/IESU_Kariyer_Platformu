import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { MapPin } from "lucide-react";

// Use a reliable CDN for the world map topojson
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Mock data based on the user's request (Alumni distributed across the world)
const markers = [
  { markerOffset: -15, name: "Kanada", coordinates: [-106.3468, 56.1304], count: 12 },
  { markerOffset: 25, name: "Türkiye", coordinates: [35.2433, 38.9637], count: 850 },
  { markerOffset: 25, name: "Almanya", coordinates: [10.4515, 51.1657], count: 45 },
  { markerOffset: -15, name: "İngiltere", coordinates: [-3.4360, 55.3781], count: 22 },
  { markerOffset: 15, name: "ABD", coordinates: [-95.7129, 37.0902], count: 34 },
  { markerOffset: 15, name: "Avustralya", coordinates: [133.7751, -25.2744], count: 5 },
  { markerOffset: -15, name: "Japonya", coordinates: [138.2529, 36.2048], count: 3 }
];

export default function CMSWorldMap() {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 relative col-span-1 lg:col-span-3 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <MapPin size={18} className="text-[#0A2342]" /> Dünyadaki Mezunlarımız
          </h3>
          <p className="text-xs text-gray-500 mt-1">Mezunların bulundukları ülkelere göre coğrafi dağılımı</p>
        </div>
      </div>

      <div className="w-full bg-[#f8f9fa] rounded-2xl border border-gray-100 relative overflow-hidden flex items-center justify-center" style={{ height: "450px" }}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }} style={{ width: "100%", height: "100%" }}>
          <ZoomableGroup center={[20, 30]} zoom={1} maxZoom={5}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHighlighted = markers.some(m => m.name.toLowerCase() === geo.properties.name?.toLowerCase());
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHighlighted ? "#4b6584" : "#e1e5ea"}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#3867d6", outline: "none" },
                        pressed: { fill: "#2d98da", outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {markers.map(({ name, coordinates, markerOffset, count }) => (
              <Marker 
                key={name} 
                coordinates={coordinates}
                onMouseEnter={() => setTooltipContent(`${name}: ${count} Mezun`)}
                onMouseLeave={() => setTooltipContent("")}
              >
                <circle r={5} fill="#eb3b5a" stroke="#ffffff" strokeWidth={2} className="animate-pulse" />
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontFamily: "Inter, system-ui, sans-serif", fill: "#2f3542", fontSize: "10px", fontWeight: "bold" }}
                >
                  {name}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {tooltipContent && (
          <div 
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-bold text-gray-800 pointer-events-none z-50 transition-all"
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </div>
  );
}
