import React from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export const PrivacyDisclaimer: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Privacy & Ethical AI Assurance</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Zero Raw Video Stored
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Your camera stream is computed entirely client-side inside WebAssembly memory. No video or biometric frames are transmitted to our servers. Only mathematical summary metrics are saved upon explicit recording.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-[11px] self-end sm:self-center">
        <Lock className="w-3.5 h-3.5 text-teal-400" />
        <span>End-to-End Private</span>
      </div>
    </div>
  );
};
