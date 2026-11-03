'use client';

import React, { useState } from 'react';
import { NormalizedEarthquake } from '@/lib/bmkg';
import { ListFilter, Clock, MapPin, Gauge, Waves, AlertTriangle } from 'lucide-react';

interface EarthquakeListProps {
  earthquakes: NormalizedEarthquake[];
}

export const EarthquakeList: React.FC<EarthquakeListProps> = ({ earthquakes }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'M5+' | 'FELT'>('ALL');
  const [minMagnitude, setMinMagnitude] = useState<number>(0);

  const filtered = earthquakes.filter(eq => {
    if (activeTab === 'M5+' && eq.magnitude < 5.0) return false;
    if (activeTab === 'FELT' && !eq.feltMmi) return false;
    if (minMagnitude > 0 && eq.magnitude < minMagnitude) return false;
    return true;
  });

  const getBadgeColor = (mag: number) => {
    if (mag >= 7.0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (mag >= 6.0) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (mag >= 5.0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-sky-400" />
            Katalog Riwayat Gempa Bumi BMKG
          </h2>
          <p className="text-xs text-slate-400">
            Daftar peristiwa gempa tektonik terkini di wilayah Indonesia
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'ALL'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({earthquakes.length})
          </button>
          <button
            onClick={() => setActiveTab('M5+')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'M5+'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gempa M 5.0+
          </button>
          <button
            onClick={() => setActiveTab('FELT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'FELT'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gempa Dirasakan
          </button>
        </div>
      </div>

      {/* Magnitude filter pill */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs text-slate-400">
        <span>Menampilkan {filtered.length} kejadian gempa</span>
        <div className="flex items-center gap-2">
          <span>Filter Magnitudo:</span>
          <select
            value={minMagnitude}
            onChange={e => setMinMagnitude(parseFloat(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-sky-500"
          >
            <option value="0">Semua Skala</option>
            <option value="5.0">≥ M 5.0</option>
            <option value="6.0">≥ M 6.0</option>
            <option value="7.0">≥ M 7.0</option>
          </select>
        </div>
      </div>

      {/* List items */}
      <div className="space-y-3">
        {filtered.map(eq => (
          <div
            key={eq.id}
            className="bg-slate-950/60 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 p-4 rounded-2xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 font-extrabold ${getBadgeColor(
                  eq.magnitude
                )}`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">Mag</span>
                <span className="text-xl font-black">{eq.magnitude.toFixed(1)}</span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{eq.region}</h3>
                  {eq.isSimulation && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      SIMULASI
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {eq.dateStr} {eq.timeStr}
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                    Kedalaman: <strong>{eq.depthKm} km</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {eq.coordinates}
                  </span>
                </div>

                {eq.feltMmi && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium pt-1">
                    <Waves className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>Dirasakan: {eq.feltMmi}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right self-end sm:self-center">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full inline-block border ${
                  eq.potency.includes('TSUNAMI')
                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}
              >
                {eq.potency}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            Tidak ada peristiwa gempa bumi yang memenuhi kriteria filter.
          </div>
        )}
      </div>
    </div>
  );
};
