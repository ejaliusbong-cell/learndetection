'use client';

import React, { useEffect, useRef } from 'react';
import { NormalizedEarthquake } from '@/lib/bmkg';
import { Map, Layers } from 'lucide-react';

interface EarthquakeMapProps {
  earthquakes: NormalizedEarthquake[];
  latestEarthquake: NormalizedEarthquake | null;
}

export const EarthquakeMap: React.FC<EarthquakeMapProps> = ({
  earthquakes,
  latestEarthquake,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only execute on client side
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet
    import('leaflet').then(L => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered on Indonesian Archipelago
      const defaultCenter: [number, number] = latestEarthquake
        ? [latestEarthquake.latitude, latestEarthquake.longitude]
        : [-2.5489, 118.0149];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: latestEarthquake ? 6 : 5,
        minZoom: 4,
        maxZoom: 12,
        zoomControl: true,
      });

      // CartoDB Dark Matter tile layer (Clean Dark Mode Seismik)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Plot all earthquakes
      earthquakes.forEach((eq, idx) => {
        const isLatest = latestEarthquake?.id === eq.id || idx === 0;
        const mag = eq.magnitude;

        // Magnitude styling
        let fillColor = '#0ea5e9'; // Blue < 5.0
        let radius = 7;

        if (mag >= 7.0) {
          fillColor = '#ef4444'; // Red
          radius = 16;
        } else if (mag >= 6.0) {
          fillColor = '#f97316'; // Orange
          radius = 12;
        } else if (mag >= 5.0) {
          fillColor = '#eab308'; // Yellow
          radius = 9;
        }

        if (isLatest) {
          radius += 4;
        }

        const circleMarker = L.circleMarker([eq.latitude, eq.longitude], {
          radius,
          fillColor,
          color: '#ffffff',
          weight: isLatest ? 2.5 : 1,
          opacity: 0.9,
          fillOpacity: 0.85,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; padding: 2px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${fillColor};">
              ${isLatest ? '🚨 GEMPA BUMI TERBARU' : 'KATALOG SEISMIK'}
            </div>
            <div style="font-size: 14px; font-weight: 800; margin-top: 2px; color: #ffffff;">
              M ${mag.toFixed(1)} SR
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #cbd5e1; margin-top: 4px;">
              ${eq.region}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; line-height: 1.4;">
              <div>Kedalaman: <strong>${eq.depthKm} km</strong></div>
              <div>Waktu: ${eq.dateStr} ${eq.timeStr}</div>
              <div>Koordinat: ${eq.coordinates}</div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; font-weight: 700; color: ${
              eq.potency.includes('TSUNAMI') ? '#f87171' : '#34d399'
            };">
              ${eq.potency}
            </div>
          </div>
        `;

        circleMarker.bindPopup(popupContent);

        if (isLatest) {
          circleMarker.openPopup();
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [earthquakes, latestEarthquake]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-sky-400" />
            Peta Seismik Indonesia (Leaflet GIS)
          </h2>
          <p className="text-xs text-slate-400">
            Titik episentrum gempa bumi aktif berdasarkan data telemetri BMKG
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm" />
            <span>M ≥ 7.0 (Kuat)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm" />
            <span>M 6.0 - 6.9</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shadow-sm" />
            <span>M 5.0 - 5.9</span>
          </div>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <div className="absolute bottom-3 left-3 z-20 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <Layers className="w-3 h-3 text-sky-400" />
          <span>Wilayah NKRI (6° LU - 11° LS & 95° BT - 141° BT)</span>
        </div>
      </div>
    </div>
  );
};
