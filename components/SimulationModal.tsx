'use client';

import React, { useState } from 'react';
import { X, Zap, ShieldAlert, Waves, CheckCircle2, RotateCcw } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulationActive: boolean;
  onActivate: (scenario: 'MEGATHRUST_SUNDA' | 'TSUNAMI_MALUKU' | 'CUSTOM', custom?: any) => Promise<void>;
  onDeactivate: () => Promise<void>;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  isSimulationActive,
  onActivate,
  onDeactivate,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  // Custom scenario state
  const [customRegion, setCustomRegion] = useState('Pesisir Selatan Jawa Timur');
  const [customMag, setCustomMag] = useState('7.6');
  const [customDepth, setCustomDepth] = useState('15');
  const [customPotency, setCustomPotency] = useState('PERINGATAN DINI: Berpotensi Tsunami');

  if (!isOpen) return null;

  const handleSelectPreset = async (scenario: 'MEGATHRUST_SUNDA' | 'TSUNAMI_MALUKU') => {
    setLoading(true);
    try {
      await onActivate(scenario);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onActivate('CUSTOM', {
        region: customRegion,
        magnitude: parseFloat(customMag),
        depthKm: parseFloat(customDepth),
        potency: customPotency,
        latitude: -8.5,
        longitude: 112.5,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await onDeactivate();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">
              Kontrol Simulasi Bencana BMKG
            </h3>
            <p className="text-xs text-slate-400">
              Uji respons sistem InaTEWS terhadap skenario gempa megathrust & tsunami
            </p>
          </div>
        </div>

        {isSimulationActive && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Simulasi sedang aktif pada sistem.</span>
            </div>
            <button
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kembali ke Real-Time
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'preset'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Skenario Preset Berbahaya
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'custom'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Skenario Kustom
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="space-y-3">
            {/* Preset 1 */}
            <div
              onClick={() => handleSelectPreset('MEGATHRUST_SUNDA')}
              className="cursor-pointer bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/50 p-4 rounded-2xl transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white group-hover:text-red-400 transition">
                      Megathrust Selat Sunda (M 8.7)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      TSUNAMI
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Kedalaman 10 km • Potensi gelombang tsunami menyapu pesisir Banten dan Lampung
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                  8.7
                </div>
              </div>
            </div>

            {/* Preset 2 */}
            <div
              onClick={() => handleSelectPreset('TSUNAMI_MALUKU')}
              className="cursor-pointer bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white group-hover:text-amber-400 transition">
                      Gempa Laut Maluku (M 7.8)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      WASPADA
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Kedalaman 12 km • Tsunami lokal di kepulauan Ambon & Maluku Tengah
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                  7.8
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wilayah Episentrum
              </label>
              <input
                type="text"
                value={customRegion}
                onChange={e => setCustomRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Magnitudo (SR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="9.9"
                  value={customMag}
                  onChange={e => setCustomMag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kedalaman (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="700"
                  value={customDepth}
                  onChange={e => setCustomDepth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Peringatan Potensi Tsunami
              </label>
              <select
                value={customPotency}
                onChange={e => setCustomPotency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              >
                <option value="PERINGATAN DINI: Berpotensi Tsunami">
                  Berpotensi TSUNAMI
                </option>
                <option value="Tidak berpotensi tsunami">Tidak berpotensi tsunami</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Mengaktifkan...' : 'Aktifkan Skenario Kustom'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
