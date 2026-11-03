import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyDisclaimer: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-clean">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#eaf4f0] text-[#114232] flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111827]">Privacy & Ethical AI Assurance</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#114232] border border-[#114232]/10">
              Zero Raw Video Stored
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
            Your camera stream is computed entirely client-side inside WebAssembly memory. No video or biometric frames are transmitted to our servers. Only mathematical summary metrics are saved upon explicit recording.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold self-end sm:self-center flex-shrink-0">
        <Lock className="w-3.5 h-3.5 text-[#114232]" />
        <span>End-to-End Client Isolation</span>
      </div>
    </div>
  );
};
