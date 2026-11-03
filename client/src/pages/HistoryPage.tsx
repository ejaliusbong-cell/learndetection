import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AnalysisSessionRecord } from '../types';
import {
  History,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<AnalysisSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<AnalysisSessionRecord | null>(null);
  const [filterExpression, setFilterExpression] = useState<string>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.getSessions(50, 0);
      if (res?.data) {
        setSessions(res.data);
      }
    } catch (e: any) {
      console.warn('Failed to load sessions:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis session?')) return;
    try {
      setDeleteId(id);
      await api.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (selectedSession?.id === id) setSelectedSession(null);
    } catch (e: any) {
      alert(`Delete failed: ${e.message}`);
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = sessions.filter(s => {
    if (filterExpression !== 'ALL' && s.dominant_expression !== filterExpression) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-teal-400" />
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View, audit, and inspect your saved facial expression observation sessions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={filterExpression}
              onChange={e => setFilterExpression(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white"
            >
              <option value="ALL" className="bg-slate-900">All Expressions</option>
              <option value="Happy" className="bg-slate-900">Happy</option>
              <option value="Neutral" className="bg-slate-900">Neutral</option>
              <option value="Surprised" className="bg-slate-900">Surprised</option>
              <option value="Sad" className="bg-slate-900">Sad</option>
              <option value="Angry" className="bg-slate-900">Angry</option>
              <option value="Fearful" className="bg-slate-900">Fearful</option>
              <option value="Disgusted" className="bg-slate-900">Disgusted</option>
            </select>
          </div>

          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Session Timestamp</th>
                <th className="py-4 px-6">Dominant Expression</th>
                <th className="py-4 px-6">Average Confidence</th>
                <th className="py-4 px-6">Frames Analyzed</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map(s => {
                const start = new Date(s.session_started_at).getTime();
                const end = new Date(s.session_ended_at).getTime();
                const durationSec = Math.max(1, Math.round((end - start) / 1000));

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-white">
                        {new Date(s.session_started_at).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(s.session_started_at).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/25">
                        {s.dominant_expression}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-white">
                      {s.average_confidence}%
                    </td>

                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {s.total_frames_analyzed} frames
                    </td>

                    <td className="py-4 px-6 text-slate-400">
                      {durationSec}s
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedSession(s)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 font-semibold transition"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleteId === s.id}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No sessions match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  Session Inspector
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Recorded {new Date(selectedSession.session_started_at).toLocaleString()}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Session ID: {selectedSession.id}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Dominant</span>
                <p className="text-base font-extrabold text-teal-400 mt-0.5">
                  {selectedSession.dominant_expression}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</span>
                <p className="text-base font-extrabold text-white font-mono mt-0.5">
                  {selectedSession.average_confidence}%
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Frames</span>
                <p className="text-base font-extrabold text-white font-mono mt-0.5">
                  {selectedSession.total_frames_analyzed}
                </p>
              </div>
            </div>

            {/* Expression Distribution Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Temporal Distribution Breakdown
              </h4>

              <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                {Object.entries(selectedSession.expression_distribution || {}).map(([expr, val]) => (
                  <div key={expr} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{expr}</span>
                      <span className="text-slate-400 font-mono">{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.max(2, Number(val))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSession.notes && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block mb-1">Session Notes:</span>
                {selectedSession.notes}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
