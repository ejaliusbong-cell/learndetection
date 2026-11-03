import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanFace,
  Sparkles,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  Camera,
  Layers,
  Lock,
  Cpu,
  HelpCircle,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Camera,
      title: 'Real-Time Facial Detection',
      desc: 'High-speed 478-point landmark mesh detection operating at 30+ FPS right in your browser via WebAssembly.',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
    {
      icon: ScanFace,
      title: 'Facial Expression Classification',
      desc: 'Scientific Action Unit (FACS) mapping across 7 standardized expression categories with exponential smoothing.',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      icon: Activity,
      title: 'Interactive Real-Time Studio',
      desc: 'Live confidence scoring, dominant expression badge, and instant visual distribution indicators.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Layers,
      title: 'Session History & Metrics',
      desc: 'Capture temporal sessions to analyze trends, frame counts, and aggregate expression distributions.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: Shield,
      title: 'Zero Video Upload Privacy',
      desc: 'Camera frames are processed strictly in local browser memory. Zero video or raw biometric images are sent to any server.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Cpu,
      title: 'Enterprise Cloud Architecture',
      desc: 'Secured with Supabase Google OAuth and backed by Google Cloud SQL PostgreSQL infrastructure.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Sign In with Google',
      desc: 'Authenticate securely using Supabase Auth with standard Google OAuth 2.0 flow.',
    },
    {
      step: '02',
      title: 'Grant Camera Access',
      desc: 'Explicitly allow local camera access via the standard browser MediaDevices API.',
    },
    {
      step: '03',
      title: 'AI Mesh Tracking',
      desc: 'MediaPipe FaceLandmarker runs in browser WebAssembly, tracking 478 landmarks in real-time.',
    },
    {
      step: '04',
      title: 'Expression Extraction',
      desc: 'Facial blendshapes are computed and mapped into 7 expression categories with temporal smoothing.',
    },
    {
      step: '05',
      title: 'Explore & Store Insights',
      desc: 'Save session summaries, view historical breakdowns, and export session analytics on your personal dashboard.',
    },
  ];

  const faqs = [
    {
      q: 'Does FaceScan store or record my camera video?',
      a: 'No. Never. Video frames are streamed directly into client-side browser memory where MediaPipe WebAssembly extracts geometric landmarks and blendshapes. No video bytes or raw photos are ever transmitted or saved to our servers.',
    },
    {
      q: 'Does this AI definitively detect what I am feeling emotionally?',
      a: 'No. FaceScan strictly measures physical facial muscle movements (Action Units) based on the Facial Action Coding System (FACS). In accordance with ethical AI guidelines, facial muscle movement does not necessarily correlate with complex internal emotional or psychological states.',
    },
    {
      q: 'How is user data protected?',
      a: 'All authentication is handled via Google OAuth through Supabase. Backend endpoints verify cryptographic JWT signatures, and all database interactions are isolated by user ownership with GDPR deletion rights.',
    },
    {
      q: 'Can I use this on mobile devices?',
      a: 'Yes! FaceScan is fully responsive and supports mobile phone cameras (front-facing selfie and rear cameras) with hardware-accelerated WebAssembly execution.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Next-Generation Computer Vision in Browser WebAssembly
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Real-Time AI Facial Expression Analysis
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Extract 478 facial landmarks and classify facial expressions instantly using on-device computer vision. Private, ethical, and built for modern digital products.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              Buka Kamera & Mulai Analisis
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition"
            >
              Learn How It Works
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <p className="text-xs text-teal-400/90 font-medium">
            ✨ Bebas Akses: Coba AI deteksi wajah langsung di browser tanpa harus registrasi atau login!
          </p>

          {/* Interactive Illustration Preview Card */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-2 sm:p-4 shadow-2xl overflow-hidden">
              <div className="aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
                  alt="AI Facial Analysis Demo"
                  className="w-full h-full object-cover opacity-60"
                />

                {/* Simulated Landmark Overlays */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 sm:w-64 sm:h-80 border-2 border-teal-400/70 rounded-3xl relative flex items-center justify-center animate-pulse-subtle">
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-teal-300 bg-slate-900/90 px-2 py-0.5 rounded border border-teal-500/30">
                      478 Landmark Nodes
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-bold text-emerald-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Happy (94.2%)
                    </div>
                  </div>
                </div>

                {/* Scan line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#14b8a6] animate-scan pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Core Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision, Privacy, and Speed
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Everything you need for cutting-edge facial landmark analysis without external video streaming infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg hover:border-slate-700 transition space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">{f.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FaceScan Operates
          </h3>
          <p className="text-sm text-slate-400">
            A seamless five-step pipeline from browser camera permission to verified analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <span className="text-2xl font-black text-slate-700 font-mono block">{st.step}</span>
              <h4 className="text-sm font-bold text-white">{st.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Under the Hood</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built with Modern Engineering Standards
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We leverage Google MediaPipe WebAssembly models running directly inside the client GPU/CPU runtime. The backend utilizes Node.js Express deployed to Google Cloud Run, backed by Google Cloud SQL PostgreSQL and authenticated by Supabase OAuth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Client AI</span>
              <h5 className="font-bold text-sm text-white">MediaPipe WASM</h5>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Frontend UI</span>
              <h5 className="font-bold text-sm text-white">React 18 + Vite</h5>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Authentication</span>
              <h5 className="font-bold text-sm text-white">Supabase Google OAuth</h5>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Cloud Database</span>
              <h5 className="font-bold text-sm text-white">PostgreSQL (Cloud SQL)</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Ethics Section */}
      <section id="privacy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-800 bg-slate-900/70 rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Privacy & Ethical AI Commitment</h3>
              <p className="text-xs text-slate-400">Designed with strict adherence to ethical computer vision standards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 pt-2">
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Zero Video Recording
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Raw camera video is decoded purely inside volatile browser memory and never stored on disk or transferred across the network.
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                No Deterministic Emotion Claims
              </h4>
              <p className="text-slate-400 leading-relaxed">
                We clearly separate model confidence in muscle movement from internal human emotions or psychological diagnostics.
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                GDPR Right to Be Forgotten
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Users can permanently delete all their historical session summaries and profile data at any time from the Profile page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">FAQ</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-teal-400' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-slate-900 border border-teal-500/30 p-8 sm:p-12 text-center space-y-5 relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to experience on-device facial expression analysis?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Get started in seconds with Google OAuth. No credit card required.
          </p>
          <div className="pt-2">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-teal-500/25 transition"
            >
              Get Started with Google
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
