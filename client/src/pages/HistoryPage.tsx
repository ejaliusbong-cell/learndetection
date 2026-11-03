import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AnalysisSessionRecord } from '../types';
import {
  Clock,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Filter,
  CheckCircle,
  RefreshCw,
  Search,
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
      if (res?.data && res.data.length > 0) {
        setSessions(res.data);
      } else {
        // Fallback: check localStorage guest sessions
        const local = JSON.parse(localStorage.getItem('facescan_guest_sessions') || '[]');
        setSessions(local);
      }
    } catch (e: any) {
      console.warn('Failed to load cloud sessions, reading local:', e.message);
      const local = JSON.parse(localStorage.getItem('facescan_guest_sessions') || '[]');
      setSessions(local);
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
      if (id.startsWith('guest-')) {
        const local = JSON.parse(localStorage.getItem('facescan_guest_sessions') || '[]');
        const updated = local.filter((s: any) => s.id !== id);
        localStorage.setItem('facescan_guest_sessions', JSON.stringify(updated));
        setSessions(prev => prev.filter(s => s.id !== id));
      } else {
        await api.deleteSession(id);
        setSessions(prev => prev.filter(s => s.id !== id));
      }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-[#114232]" />
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Audit, inspect, and export your saved facial expression observation sessions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full text-xs text-slate-600 shadow-clean">
            <Filter className="w-3.5 h-3.5 text-[#114232]" />
            <select
              value={filterExpression}
              onChange={e => setFilterExpression(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-800 font-semibold"
            >
              <option value="ALL">All Expressions</option>
              <option value="Happy">Happy</option>
              <option value="Neutral">Neutral</option>
              <option value="Surprised">Surprised</option>
              <option value="Sad">Sad</option>
              <option value="Angry">Angry</option>
              <option value="Fearful">Fearful</option>
              <option value="Disgusted">Disgusted</option>
            </select>
          </div>

          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 transition shadow-clean"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#114232]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sessions Table - Donezo Clean Style */}
      <div className="bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-clean">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#f4f5f7] text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-4 px-6">Session Timestamp</th>
                <th className="py-4 px-6">Dominant Expression</th>
                <th className="py-4 px-6">Avg Confidence</th>
                <th className="py-4 px-6">Frames Analyzed</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map(s => {
                const start = new Date(s.session_started_at).getTime();
                const end = new Date(s.session_ended_at).getTime();
                const durationSec = Math.max(1, Math.round((end - start) / 1000));

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-[#111827]">
                        {new Date(s.session_started_at).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(s.session_started_at).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eaf4f0] text-[#114232] border border-[#114232]/10">
                        {s.dominant_expression}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      {s.average_confidence}%
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-mono">
                      {s.total_frames_analyzed} frames
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {durationSec}s
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedSession(s)}
                        className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#114232] hover:text-white text-slate-700 font-bold text-xs transition"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleteId === s.id}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#114232] bg-[#eaf4f0] px-3 py-1 rounded-full border border-[#114232]/10">
                  Session Inspector
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#111827]">
                {selectedSession.dominant_expression} Session Overview
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Captured on {new Date(selectedSession.session_started_at).toLocaleString()}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f5f7] rounded-2xl p-4">
                <span className="text-xs text-slate-500">Average Confidence</span>
                <p className="text-2xl font-extrabold text-[#111827] mt-1 font-mono">
                  {selectedSession.average_confidence}%
                </p>
              </div>
              <div className="bg-[#f4f5f7] rounded-2xl p-4">
                <span className="text-xs text-slate-500">Total Frames</span>
                <p className="text-2xl font-extrabold text-[#111827] mt-1 font-mono">
                  {selectedSession.total_frames_analyzed}
                </p>
              </div>
            </div>

            {/* Expression Distribution Breakdown */}
            {selectedSession.expression_distribution && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Expression Percentage Breakdown
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(selectedSession.expression_distribution).map(([cat, pct]: any) => (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700">{cat}</span>
                        <span className="font-bold text-[#114232]">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#f4f5f7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#114232] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedSession.notes && (
              <div className="p-4 bg-[#f4f5f7] rounded-2xl text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Session Notes:</strong> {selectedSession.notes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-6 py-2 rounded-full bg-[#114232] text-white text-xs font-bold hover:bg-[#0d3528] transition shadow-pine"
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
