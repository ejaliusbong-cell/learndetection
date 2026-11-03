import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserStatistics, AnalysisSessionRecord } from '../types';
import {
  Camera,
  Activity,
  Layers,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  Smile,
  RefreshCw,
  Sparkles,
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
    if (!stats?.dominantDistribution) return 'Neutral';
    let maxK = 'Neutral';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-emerald-950/40 border border-teal-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              Welcome back
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hello, {user?.fullName || 'Researcher'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your real-time biometric session records are securely stored in Google Cloud SQL. Ready to run your next facial expression observation?
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/analyze"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Camera className="w-4 h-4" />
            Launch Live Studio
          </Link>

          <button
            onClick={loadDashboardData}
            title="Refresh metrics"
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>

        <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Sessions</span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-mono">
              {stats?.totalSessions || 0}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Recorded historical analysis</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Frames Computed</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-mono">
              {stats?.totalFrames || 0}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">MediaPipe inference cycles</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Model Confidence</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-mono">
              {stats?.averageConfidence ? `${stats.averageConfidence}%` : 'N/A'}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">FACS blendshape certainty</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Frequent State</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-white truncate block">
              {topExpression()}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">Overall session mode</p>
          </div>
        </div>
      </div>

      {/* Grid: Expression Breakdown & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expression Distribution (Left 1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              Aggregate Expression Distribution
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.dominantDistribution ? (
              Object.entries(stats.dominantDistribution).map(([label, count]) => {
                const total = stats.totalSessions || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{label}</span>
                      <span className="text-slate-400 font-mono">
                        {count} sessions ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">No session metrics recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Sessions Table (Right 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                Recent Analysis Sessions
              </h3>
              <p className="text-xs text-slate-400">Your latest recorded webcam observation summaries</p>
            </div>
            <Link
              to="/history"
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
            >
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Dominant Expression</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Total Frames</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {recentSessions.map(session => (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {new Date(session.session_started_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {session.dominant_expression}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {session.average_confidence}%
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {session.total_frames_analyzed}
                    </td>
                  </tr>
                ))}

                {recentSessions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      No sessions recorded yet. Launch the studio to capture your first session!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
