'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { NormalizedEarthquake } from '@/lib/bmkg';

interface SimulationAlertBannerProps {
  isSimulationActive: boolean;
  scenarioName: string;
  earthquake: NormalizedEarthquake | null;
  onDeactivate: () => void;
}

export const SimulationAlertBanner: React.FC<SimulationAlertBannerProps> = ({
  isSimulationActive,
  scenarioName,
  earthquake,
  onDeactivate,
}) => {
  const isTsunamiPotency = earthquake?.potency?.toUpperCase().includes('TSUNAMI') ||
    earthquake?.potency?.toUpperCase().includes('PERINGATAN DINI');

  if (!isSimulationActive && !isTsunamiPotency) {
    return null;
  }

  const isSim = isSimulationActive;

  return (
    <div
      className={`relative overflow-hidden border-b py-3 px-4 sm:px-6 transition-all ${
        isTsunamiPotency
          ? 'bg-red-950/90 border-red-500/60 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse-glow'
          : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl flex-shrink-0 ${
              isTsunamiPotency
                ? 'bg-red-600 text-white shadow-lg animate-ping'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isSim ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                {isSim ? 'SISTEM DALAM MODE SIMULASI & UJI SKENARIO' : 'PERINGATAN SEISMIK / TSUNAMI'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/20">
                {isSim ? 'DEMO' : 'LIVE ALERT'}
              </span>
            </div>
            <p className="text-xs text-red-200/90 mt-0.5">
              {isSim
                ? scenarioName
                : earthquake?.potency || 'Perhatikan instruksi evakuasi resmi dari BPBD/BMKG setempat.'}
            </p>
          </div>
        </div>

        {isSim && (
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onDeactivate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition"
            >
              <X className="w-3.5 h-3.5" />
              Akhiri Simulasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
