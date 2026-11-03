import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanFace,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Camera,
  Layers,
  Lock,
  Cpu,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Pause,
  Square,
  Search,
  Bell,
  Sliders,
  Smile,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Camera,
      title: 'Real-Time Facial Detection',
      desc: 'Deteksi mesh 478 titik koordinat wajah dengan kecepatan 30+ FPS langsung di browser menggunakan WebAssembly tanpa lag.',
      tag: 'On-Device WASM',
    },
    {
      icon: ScanFace,
      title: 'Klasifikasi Ekspresi FACS',
      desc: 'Pemetaan 52 Facial Action Coding System (FACS) blendshapes ke 7 kategori ekspresi universal dengan EMA smoothing.',
      tag: 'Scientific FACS',
    },
    {
      icon: Activity,
      title: 'Clean Analytics Dashboard',
      desc: 'Pantau riwayat sesi, distribusi persentase ekspresi, dan rata-rata confidence score dalam antarmuka visual yang teratur.',
      tag: 'Interactive Studio',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Video Upload Privacy',
      desc: 'Frame video diproses murni di memori RAM browser Anda. Tidak ada video atau rekaman wajah yang dikirim ke server.',
      tag: '100% Private',
    },
    {
      icon: Layers,
      title: 'Session History & Sync',
      desc: 'Simpan ringkasan sesi ke Google Cloud SQL saat login, atau simpan ke memori lokal browser saat menggunakan mode tamu.',
      tag: 'Cloud & Local',
    },
    {
      icon: Cpu,
      title: 'Enterprise Architecture',
      desc: 'Diperkuat oleh Supabase Auth (Google OAuth), REST API Express TypeScript, dan database terisolasi aman.',
      tag: 'Production-Ready',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Buka Kamera Langsung',
      desc: 'Akses studio secara instan tanpa harus login. Cukup izinkan akses kamera lokal di browsermu.',
    },
    {
      num: '02',
      title: 'Pelacakan 478 Landmark',
      desc: 'MediaPipe FaceLandmarker mendeteksi geometri wajah, mata, alis, bibir, dan kontur secara real-time.',
    },
    {
      num: '03',
      title: 'Ekstraksi Ekspresi AI',
      desc: 'Koefisien blendshape dihitung seketika untuk mengukur intensitas senyum, kejutan, netral, dan lainnya.',
    },
    {
      num: '04',
      title: 'Simpan & Analisis Sesi',
      desc: 'Rekam sesi analisis untuk mendapatkan grafik distribusi temporal dan simpan ke akun pribadi Anda.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah FaceScan merekam atau menyimpan video kamera saya?',
      a: 'Tidak. Sama sekali tidak. Pemrosesan video dilakukan sepenuhnya di sisi klien (browser) menggunakan WebAssembly MediaPipe. Tidak ada frame video mentah atau gambar wajah yang pernah dikirimkan atau disimpan di server kami.',
    },
    {
      q: 'Apakah aplikasi ini bisa digunakan tanpa perlu login?',
      a: 'Ya! Anda dapat langsung membuka menu Live Camera dan menjalankan deteksi wajah secara bebas. Login dengan Google hanya diperlukan jika Anda ingin menyimpan riwayat sesi ke database Cloud SQL secara permanen.',
    },
    {
      q: 'Apakah deteksi ekspresi ini membaca emosi batin saya secara pasti?',
      a: 'Tidak. Secara etis, FaceScan mengukur pergerakan fisik otot wajah berdasarkan Facial Action Coding System (FACS). Pergerakan otot wajah tidak selalu mencerminkan kondisi emosional atau psikologis internal yang kompleks.',
    },
    {
      q: 'Perangkat apa saja yang didukung?',
      a: 'Aplikasi berjalan optimal di laptop, PC, dan smartphone (Android & iOS) melalui browser modern (Google Chrome, Microsoft Edge, Safari, Firefox) dengan dukungan kamera depan maupun belakang.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Donezo-style Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaf4f0] text-[#114232] text-xs font-bold border border-[#114232]/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#114232]" />
            AI Facial Expression Studio • MediaPipe V2
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.12]">
            Analisis Ekspresi Wajah Real-Time{' '}
            <span className="text-[#114232]">Bersih & Presisi</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Deteksi 478 titik landmark geometri wajah dan klasifikasikan ekspresi emosi secara real-time dengan computer vision on-device. Privat, etis, dan tanpa unggah video.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-sm shadow-pine flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              Buka Kamera & Mulai Analisis
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-clean flex items-center justify-center gap-2 transition"
            >
              Pelajari Cara Kerja
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <p className="text-xs text-[#114232] font-semibold flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Akses Langsung: Coba AI di browser tanpa harus mendaftar atau login!
          </p>
        </div>

        {/* ============================================================== */}
        {/* HERO SHOWCASE: EXACT RECREATION OF THE DONEZO DASHBOARD DESIGN */}
        {/* ============================================================== */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="bg-white rounded-[32px] sm:rounded-[36px] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 sm:p-6 overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                {/* Search bar with ⌘F */}
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value="Search expression metrics, sessions..."
                    className="w-full bg-[#f4f5f7] rounded-full pl-9 pr-14 py-2 text-xs text-slate-600 outline-none border border-transparent font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    ⌘F
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f4f5f7] text-slate-600 flex items-center justify-center text-xs">
                  <Bell className="w-4 h-4" />
                </div>
                {/* User Profile Pill */}
                <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#f4f5f7] border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-[#114232] text-white flex items-center justify-center text-xs font-bold">
                    TM
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Totok Michael</p>
                    <p className="text-[10px] text-slate-400 leading-none">tmichael20@mail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 pb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Dashboard
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Plan, prioritize, and accomplish your facial expression tasks with ease.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/analyze"
                  className="px-5 py-2.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs shadow-pine flex items-center gap-1.5 transition"
                >
                  <span>+</span> Add Project
                </Link>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-full bg-[#f4f5f7] hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200/80"
                >
                  Import Data
                </button>
              </div>
            </div>

            {/* 4 Stat Cards Row (Donezo Style) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-6">
              {/* Card 1: Signature Forest Green Card */}
              <div className="bg-[#114232] text-white rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between shadow-pine">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-200/90">Total Sessions</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">24</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-emerald-200 w-fit">
                  <span>↗</span> Increased from last month
                </div>
              </div>

              {/* Card 2: White Card */}
              <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Happy Dominant</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                    10
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 w-fit">
                  <span>↗</span> Increased from last month
                </div>
              </div>

              {/* Card 3: White Card */}
              <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Running Stream</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                    12
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 w-fit">
                  <span>↗</span> Increased from last month
                </div>
              </div>

              {/* Card 4: White Card */}
              <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Pending Review</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                    2
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold w-fit">
                  <span>On Discuss</span>
                </div>
              </div>
            </div>

            {/* Middle Row (Analytics Chart + Reminder Card + Project List) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-6">
              {/* Column Left (5 cols): Project Analytics Bar Chart */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Expression Analytics</h3>
                  <p className="text-[11px] text-slate-400">Weekly expression density distribution</p>
                </div>

                {/* Vertical Pill Bars (Exact recreation from Donezo image) */}
                <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-44 px-2">
                  {/* Sunday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-20 rounded-full bg-striped-pattern border border-slate-300/40" />
                    <span className="text-[10px] font-bold text-slate-400">S</span>
                  </div>
                  {/* Monday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-28 rounded-full bg-[#114232]" />
                    <span className="text-[10px] font-bold text-slate-400">M</span>
                  </div>
                  {/* Tuesday - Active with pill badge */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="absolute -top-6 px-1.5 py-0.5 rounded-full bg-[#eaf4f0] text-[9px] font-bold text-[#114232] border border-[#114232]/20">
                      34%
                    </div>
                    <div className="w-8 sm:w-9 h-24 rounded-full bg-[#52b788]" />
                    <span className="text-[10px] font-bold text-slate-400">T</span>
                  </div>
                  {/* Wednesday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-32 rounded-full bg-[#114232]" />
                    <span className="text-[10px] font-bold text-slate-400">W</span>
                  </div>
                  {/* Thursday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-20 rounded-full bg-striped-pattern border border-slate-300/40" />
                    <span className="text-[10px] font-bold text-slate-400">T</span>
                  </div>
                  {/* Friday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-24 rounded-full bg-striped-pattern border border-slate-300/40" />
                    <span className="text-[10px] font-bold text-slate-400">F</span>
                  </div>
                  {/* Saturday */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 sm:w-9 h-26 rounded-full bg-striped-pattern border border-slate-300/40" />
                    <span className="text-[10px] font-bold text-slate-400">S</span>
                  </div>
                </div>
              </div>

              {/* Column Center (3 cols): Reminders Card */}
              <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Reminders
                  </span>
                  <h4 className="text-base font-bold text-[#111827] mt-2 leading-snug">
                    Real-Time Face Session Check
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Time: 02.00 pm - 04.00 pm</p>
                </div>

                <Link
                  to="/analyze"
                  className="w-full mt-6 py-3 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-pine transition"
                >
                  <Camera className="w-4 h-4" />
                  Start Camera Scan
                </Link>
              </div>

              {/* Column Right (4 cols): Projects List */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111827]">Active Modules</h3>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    + New
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      //
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-800 truncate">478 Landmark Geometry</p>
                      <p className="text-[10px] text-slate-400">Client WebAssembly engine</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#114232] flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-800 truncate">52 FACS Blendshapes</p>
                      <p className="text-[10px] text-slate-400">Action Unit classification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      🛡️
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-800 truncate">Zero Video Transmission</p>
                      <p className="text-[10px] text-slate-400">Browser memory isolation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row (Team Collaboration + Donut Arc + Time Tracker) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Team Collaboration List (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111827]">Recent Session Participants</h3>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200"
                  >
                    + Add Session
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                        AD
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">Alexandra Deff</p>
                        <p className="text-[10px] text-slate-400">Happy Dominant (98.2%)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        EA
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">Edwin Adenike</p>
                        <p className="text-[10px] text-slate-400">Neutral Focus (89.4%)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      In-Progress
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        IO
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">Isaac Oluwatemilorun</p>
                        <p className="text-[10px] text-slate-400">Surprised Gesture (94.1%)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Donut Progress Arc (3 cols) */}
              <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Expression Progress</h3>
                  <p className="text-[10px] text-slate-400">Real-time target metric</p>
                </div>

                {/* Donut Arc SVG */}
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="relative w-32 h-20 flex items-end justify-center overflow-hidden">
                    <svg viewBox="0 0 100 50" className="w-32 h-16">
                      {/* Background Arc */}
                      <path
                        d="M 10,50 A 40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                        strokeDasharray="4,2"
                      />
                      {/* Active Forest Green Arc */}
                      <path
                        d="M 10,50 A 40,40 0 0,1 55,12"
                        fill="none"
                        stroke="#114232"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute bottom-0 text-center">
                      <span className="text-2xl font-extrabold text-[#111827]">41%</span>
                      <p className="text-[9px] font-bold text-slate-400 leading-none">Target Done</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#114232]" />
                    Completed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                    Active
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    Pending
                  </span>
                </div>
              </div>

              {/* Time Tracker Widget (4 cols - Exact recreation from Donezo) */}
              <div className="lg:col-span-4 bg-forest-texture text-white rounded-[24px] p-5 shadow-pine flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-200">Time Tracker</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="my-4 text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-mono">
                    01:24:08
                  </span>
                  <p className="text-[10px] text-emerald-300/80 mt-1">Live Camera Stream Session</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-white text-[#114232] flex items-center justify-center font-bold shadow-md hover:bg-slate-100 transition"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-md hover:bg-rose-500 transition"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#114232] bg-[#eaf4f0] px-3 py-1 rounded-full border border-[#114232]/10">
            Fitur Utama
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Semua yang Anda Butuhkan untuk Analisis Wajah
          </h2>
          <p className="text-sm text-slate-500">
            Didesain dengan pendekatan clean engineering, keandalan performa, dan privasi tanpa kompromi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-clean hover:shadow-clean-hover transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#eaf4f0] text-[#114232] flex items-center justify-center font-bold">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#114232] bg-[#eaf4f0] px-2.5 py-1 rounded-full border border-[#114232]/15">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#111827]">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#114232]">
                <span>Pelajari Lebih Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-slate-200/80 p-8 sm:p-12 shadow-clean">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#114232] bg-[#eaf4f0] px-3 py-1 rounded-full border border-[#114232]/10">
              Alur Kerja
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Sederhana, Cepat, dan Seketika
            </h2>
            <p className="text-sm text-slate-500">
              Hanya butuh beberapa detik untuk mulai menganalisis ekspresi wajah Anda secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-[#f4f5f7] rounded-[24px] p-6 relative flex flex-col justify-between space-y-4 border border-slate-200/60"
              >
                <div className="w-10 h-10 rounded-full bg-[#114232] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  {s.num}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-[#111827]">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs shadow-pine transition"
            >
              <Camera className="w-4 h-4" />
              Mulai Sesi Analisis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy & Ethical AI Charter */}
      <section id="privacy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#114232] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 shadow-pine relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              Komitmen Privasi & Etika AI
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              Data Wajah Anda Tetap Menjadi Milik Anda Sepenuhnya.
            </h2>

            <p className="text-sm text-emerald-100/90 leading-relaxed">
              FaceScan dirancang sejak awal dengan prinsip Zero Video Transmission. Semua komputasi visi komputer (deteksi landmark dan FACS blendshapes) dieksekusi 100% di memori browser lokal perangkat Anda melalui WebAssembly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-xl font-extrabold text-white">0 Byte</p>
                <p className="text-xs text-emerald-200 mt-1">Video yang diunggah ke server</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-xl font-extrabold text-white">478 Titik</p>
                <p className="text-xs text-emerald-200 mt-1">Geometri diproses lokal di RAM</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-xl font-extrabold text-white">100% Hak</p>
                <p className="text-xs text-emerald-200 mt-1">Penghapusan data mandiri (GDPR)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs text-slate-500">
            Segala informasi seputar keamanan, teknologi, dan penggunaan FaceScan AI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-clean transition"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#111827]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-[#114232]' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
