'use client';

import React, { useState } from 'react';
import { NormalizedEarthquake } from '@/lib/bmkg';
import { Radio, MapPin, Gauge, Clock, Waves, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

interface EarthquakeHeroProps {
  earthquake: NormalizedEarthquake | null;
}

export const EarthquakeHero: React.FC<EarthquakeHeroProps> = ({ earthquake }) => {
  const [showShakemapModal, setShowShakemapModal] = useState(false);

  if (!earthquake) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 animate-pulse">
        Memuat data gempa bumi terkini dari server BMKG...
      </div>
    );
  }

  const mag = earthquake.magnitude;
  const isHighDanger = mag >= 7.0;
  const isModerate = mag >= 5.0;

  const getMagColor = () => {
    if (isHighDanger) return 'from-red-600 to-rose-700 text-white border-red-500 shadow-red-600/30';
    if (isModerate) return 'from-amber-500 to-orange-600 text-white border-amber-400 shadow-amber-500/30';
    return 'from-sky-500 to-blue-600 text-white border-sky-400 shadow-sky-500/30';
  };

  const isTsunamiThreat = earthquake.potency.toUpperCase().includes('TSUNAMI') &&
    !earthquake.potency.toUpperCase().includes('TIDAK');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
      {/* Background radial highlight */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isTsunamiThreat ? 'bg-red-500' : 'bg-sky-500'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Headline & Badge */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Radio className="w-3.5 h-3.5 animate-ping text-sky-400" />
              Gempa Bumi Terkini (Real-Time BMKG)
            </span>

            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {earthquake.dateStr} • {earthquake.timeStr}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {earthquake.region}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>Koordinat Seismik: <strong>{earthquake.coordinates}</strong></span>
            </p>
          </div>

          {/* Metric badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Kedalaman
              </span>
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-400" />
                <span className="text-base font-bold text-white">{earthquake.depthKm} km</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Potensi Dampak
              </span>
              <div className="flex items-center gap-1.5">
                {isTsunamiThreat ? (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-bold leading-tight ${
                    isTsunamiThreat ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {earthquake.potency}
                </span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Skala MMI Dirasakan
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Waves className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{earthquake.feltMmi || 'Informasi MMI segera diperbarui'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Giant Magnitude Box & Shakemap preview */}
        <div className="flex flex-row lg:flex-col items-center sm:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br ${getMagColor()} border shadow-xl flex flex-col items-center justify-center p-3 relative group`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              Magnitudo
            </span>
            <span className="text-4xl sm:text-5xl font-black tracking-tighter">
              {earthquake.magnitude.toFixed(1)}
            </span>
            <span className="text-[10px] font-medium text-white/70 mt-1">
              Skala Richter (SR)
            </span>
          </div>

          {earthquake.shakemapUrl && (
            <button
              onClick={() => setShowShakemapModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700 transition"
            >
              <Eye className="w-4 h-4" />
              Lihat Shakemap BMKG
            </button>
          )}
        </div>
      </div>

      {/* Shakemap Modal */}
      {showShakemapModal && earthquake.shakemapUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 overflow-hidden relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Peta Guncangan Seismik (Shakemap) BMKG
              </h3>
              <button
                onClick={() => setShowShakemapModal(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Tutup
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center bg-black rounded-xl overflow-hidden">
              <img
                src={earthquake.shakemapUrl}
                alt="BMKG Shakemap"
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={e => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Peta perkiraan intensitas guncangan gempa bumi oleh BMKG
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
