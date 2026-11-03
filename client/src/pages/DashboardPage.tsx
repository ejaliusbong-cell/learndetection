import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserStatistics, AnalysisSessionRecord } from '../types';
import {
  Camera,
  ArrowUpRight,
  Search,
  Bell,
  Clock,
  ChevronRight,
  Smile,
  Activity,
  Layers,
  Pause,
  Square,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [recentSessions, setRecentSessions] = useState<AnalysisSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        api.getStatistics(),
        api.getSessions(5, 0),
      ]);

      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (sessionsRes?.data) {
        setRecentSessions(sessionsRes.data);
      }
    } catch (e: any) {
      console.warn('Could not load dashboard data:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const topExpression = () => {
    if (!stats?.dominantDistribution) return 'Happy';
    let maxK = 'Happy';
    let maxV = -1;
    Object.entries(stats.dominantDistribution).forEach(([k, v]) => {
      if (v > maxV) {
        maxV = v;
        maxK = k;
      }
    });
    return maxK;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Toolbar - Donezo style */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-clean">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            value="Search session notes, expressions..."
            className="w-full bg-[#f4f5f7] rounded-full pl-9 pr-12 py-2 text-xs text-slate-700 outline-none font-medium border border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            ⌘F
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadDashboardData}
            title="Refresh Data"
            className="w-9 h-9 rounded-full bg-[#f4f5f7] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="w-9 h-9 rounded-full bg-[#f4f5f7] text-slate-600 flex items-center justify-center text-xs">
            <Bell className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#f4f5f7] border border-slate-200">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#114232] text-white flex items-center justify-center text-xs font-bold">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400 leading-none">{user?.email || 'user@facescan.ai'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Plan, prioritize, and accomplish your facial expression tasks with ease.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/analyze"
            className="px-5 py-2.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs shadow-pine flex items-center gap-1.5 transition"
          >
            <span>+</span> Mulai Analisis Kamera
          </Link>
          <Link
            to="/history"
            className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200/80 shadow-clean"
          >
            Lihat Semua Riwayat
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row (Donezo Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Signature Forest Green Card */}
        <div className="bg-[#114232] text-white rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between shadow-pine">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200">Total Sessions</span>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {stats?.totalSessions || 0}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-emerald-200 w-fit">
            <span>↗</span> Increased from last month
          </div>
        </div>

        {/* Card 2: White Card */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Dominant Expression</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {topExpression()}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 w-fit">
            <span>↗</span> Most frequent mood
          </div>
        </div>

        {/* Card 3: White Card */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Avg Confidence</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {stats?.averageConfidence ? `${stats.averageConfidence}%` : '92.4%'}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 w-fit">
            <span>↗</span> MediaPipe Landmarker
          </div>
        </div>

        {/* Card 4: White Card */}
        <div className="bg-white border border-slate-200/80 rounded-[24px] p-5 flex flex-col justify-between shadow-clean">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Frames</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {stats?.totalFrames || 1240}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#114232] text-[10px] font-bold w-fit">
            <span>On Memory</span>
          </div>
        </div>
      </div>

      {/* Middle Row (Analytics Chart + Reminder Card + Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column Left (5 cols): Project Analytics Bar Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Expression Analytics</h3>
            <p className="text-[11px] text-slate-400">Weekly landmark density and intensity distribution</p>
          </div>

          {/* Vertical Pill Bars (Exact recreation from Donezo image) */}
          <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-44 px-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 sm:w-9 h-20 rounded-full bg-striped-pattern border border-slate-300/40" />
              <span className="text-[10px] font-bold text-slate-400">S</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 sm:w-9 h-28 rounded-full bg-[#114232]" />
              <span className="text-[10px] font-bold text-slate-400">M</span>
            </div>
            <div className="flex flex-col items-center gap-2 relative">
              <div className="absolute -top-6 px-1.5 py-0.5 rounded-full bg-[#eaf4f0] text-[9px] font-bold text-[#114232] border border-[#114232]/20">
                34%
              </div>
              <div className="w-8 sm:w-9 h-24 rounded-full bg-[#52b788]" />
              <span className="text-[10px] font-bold text-slate-400">T</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 sm:w-9 h-32 rounded-full bg-[#114232]" />
              <span className="text-[10px] font-bold text-slate-400">W</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 sm:w-9 h-20 rounded-full bg-striped-pattern border border-slate-300/40" />
              <span className="text-[10px] font-bold text-slate-400">T</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 sm:w-9 h-24 rounded-full bg-striped-pattern border border-slate-300/40" />
              <span className="text-[10px] font-bold text-slate-400">F</span>
            </div>
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
              Session Calibration Check
            </h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Optimal light: 10.00 am - 05.00 pm</p>
          </div>

          <Link
            to="/analyze"
            className="w-full mt-6 py-3 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-pine transition"
          >
            <Camera className="w-4 h-4" />
            Buka Studio Kamera
          </Link>
        </div>

        {/* Column Right (4 cols): Projects/Modules List */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">Expression Categories</h3>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              FACS 52-AU
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-base">😊</span>
                <div>
                  <p className="font-bold text-slate-800">Happy (Cheek & Lip Corner)</p>
                  <p className="text-[10px] text-slate-400">AU6 Cheek Raiser + AU12</p>
                </div>
              </div>
              <span className="font-bold text-[#114232]">
                {stats?.dominantDistribution?.['Happy'] || 45}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-base">😐</span>
                <div>
                  <p className="font-bold text-slate-800">Neutral (Resting State)</p>
                  <p className="text-[10px] text-slate-400">Baseline muscular geometry</p>
                </div>
              </div>
              <span className="font-bold text-[#114232]">
                {stats?.dominantDistribution?.['Neutral'] || 30}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-base">😲</span>
                <div>
                  <p className="font-bold text-slate-800">Surprised (Brow & Jaw)</p>
                  <p className="text-[10px] text-slate-400">AU1 + AU2 + AU26</p>
                </div>
              </div>
              <span className="font-bold text-[#114232]">
                {stats?.dominantDistribution?.['Surprised'] || 15}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row (Recent Sessions + Donut Arc + Time Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Sessions List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">Recent Saved Sessions</h3>
            <Link
              to="/history"
              className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full border border-slate-200"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-full bg-[#eaf4f0] text-[#114232] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {s.dominant_expression.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800 leading-tight truncate">
                        {s.notes || `${s.dominant_expression} Session`}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(s.session_started_at).toLocaleDateString()} • {s.average_confidence}% conf
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                    Synced
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada riwayat sesi tersimpan di cloud. Buka Studio Kamera untuk merekam!
              </div>
            )}
          </div>
        </div>

        {/* Donut Progress Arc (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[24px] p-5 shadow-clean flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Session Target</h3>
            <p className="text-[10px] text-slate-400">Weekly session goal</p>
          </div>

          {/* Donut Arc SVG */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="relative w-32 h-20 flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 100 50" className="w-32 h-16">
                <path
                  d="M 10,50 A 40,40 0 0,1 90,50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  strokeDasharray="4,2"
                />
                <path
                  d="M 10,50 A 40,40 0 0,1 68,18"
                  fill="none"
                  stroke="#114232"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 text-center">
                <span className="text-2xl font-extrabold text-[#111827]">68%</span>
                <p className="text-[9px] font-bold text-slate-400 leading-none">Goal Achieved</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#114232]" />
              Recorded
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

        {/* Time Tracker / Camera Stream Widget (4 cols) */}
        <div className="lg:col-span-4 bg-forest-texture text-white rounded-[24px] p-5 shadow-pine flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200">Active Camera Feed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="my-4 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-wider font-mono">
              30+ FPS
            </span>
            <p className="text-[10px] text-emerald-200/90 mt-1">GPU WebGL/WASM Face Landmarker</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/analyze"
              className="px-6 py-2 rounded-full bg-white text-[#114232] font-bold text-xs shadow-md hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              Open Camera Viewport
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
