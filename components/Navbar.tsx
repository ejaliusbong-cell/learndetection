'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Volume2, VolumeX, RefreshCw, Zap, ShieldAlert, Radio } from 'lucide-react';
import { siren } from '@/lib/audio';

interface NavbarProps {
  onOpenSimulation: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isSimulationActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulation,
  onRefresh,
  isRefreshing,
  isSimulationActive,
}) => {
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Jakarta',
        }) + ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSiren = () => {
    const playing = siren.toggle();
    setIsSirenPlaying(playing);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & BMKG Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-sky-500/20 border border-sky-400/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                BMKG
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Seismik 24/7
              </span>
              {isSimulationActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                  MODE SIMULASI
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-0.5" />
              InaTEWS • Indonesia Tsunami Early Warning System
            </p>
          </div>
        </div>

        {/* Live Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-sky-300">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>{timeStr || 'Memuat...'}</span>
          </div>

          {/* Siren Audio Toggle */}
          <button
            onClick={handleToggleSiren}
            title={isSirenPlaying ? 'Matikan Sirine Peringatan' : 'Uji / Nyalakan Sirine Peringatan'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isSirenPlaying
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-bounce'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isSirenPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">Matikan Sirine</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Sirine Suara</span>
              </>
            )}
          </button>

          {/* Refresh Ingestion */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sinkronkan data BMKG"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Simulation Control Trigger */}
          <button
            onClick={onOpenSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              isSimulationActive
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-red-500/20'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-500/20'
            }`}
          >
            {isSimulationActive ? (
              <>
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Kontrol Simulasi</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Uji Simulasi Gempa</span>
                <span className="sm:hidden">Simulasi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
