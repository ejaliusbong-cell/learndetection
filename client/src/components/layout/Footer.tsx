import React from 'react';
import { ScanFace, Shield, Heart, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <ScanFace className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">FaceScan AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time on-device facial expression analysis powered by MediaPipe WebAssembly and Supabase.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/#features" className="hover:text-white transition">Real-time Vision</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition">How it Works</a></li>
              <li><a href="/#technology" className="hover:text-white transition">Tech Stack</a></li>
              <li><a href="/analyze" className="hover:text-white transition">Live Studio</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Privacy & Ethics</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-teal-400 font-medium">Zero Video Uploads</span></li>
              <li><a href="/#privacy" className="hover:text-white transition">Ethical AI Charter</a></li>
              <li><span>FACS Blendshapes</span></li>
              <li><span>GDPR Right to be Forgotten</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed flex items-start gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                All camera frames are processed strictly inside browser memory using WebAssembly. No video is ever recorded or transmitted to any server.
              </span>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FaceScan AI Platform. Engineered for safety and accuracy.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for ethical AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
