import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#114232] text-white flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6a6 6 0 1 0 6 6" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-[#111827] text-base">FaceScan AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time on-device facial expression analysis powered by MediaPipe WebAssembly and Google Cloud SQL.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="/#features" className="hover:text-slate-900 transition">Real-time Vision</a></li>
              <li><a href="/#how-it-works" className="hover:text-slate-900 transition">How it Works</a></li>
              <li><a href="/#technology" className="hover:text-slate-900 transition">Tech Stack</a></li>
              <li><a href="/analyze" className="hover:text-[#114232] font-semibold transition">Live Camera Studio</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Privacy & Ethics</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="text-[#114232] font-semibold">Zero Video Uploads</span></li>
              <li><a href="/#privacy" className="hover:text-slate-900 transition">Ethical AI Charter</a></li>
              <li><span>FACS Blendshapes 52-AU</span></li>
              <li><span>GDPR Deletion Rights</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Security</h4>
            <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#114232] flex-shrink-0 mt-0.5" />
              <span>
                All camera frames are processed strictly inside browser memory using WebAssembly. No biometric video is ever recorded or transmitted to any server.
              </span>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FaceScan AI Platform. Clean, private, and ethical intelligence.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
