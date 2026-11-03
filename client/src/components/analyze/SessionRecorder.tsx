import React, { useState, useEffect } from 'react';
import { Play, Square, CheckCircle2, Clock, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ExpressionCategory, AnalysisFrameResult } from '../../types';

interface SessionRecorderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  recordedFrames: AnalysisFrameResult[];
  onResetRecording: () => void;
}

export const SessionRecorder: React.FC<SessionRecorderProps> = ({
  isRecording,
  onToggleRecording,
  recordedFrames,
  onResetRecording,
}) => {
  const { user } = useAuth();
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Track elapsed timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      if (!sessionStartTime) setSessionStartTime(Date.now());
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, sessionStartTime]);

  const handleStopAndSave = async () => {
    if (isRecording) {
      onToggleRecording(); // stop
    }

    if (recordedFrames.length === 0) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const counts: Record<ExpressionCategory, number> = {
        Happy: 0,
        Neutral: 0,
        Surprised: 0,
        Sad: 0,
        Angry: 0,
        Fearful: 0,
        Disgusted: 0,
      };

      let confSum = 0;

      recordedFrames.forEach(f => {
        counts[f.dominantExpression] = (counts[f.dominantExpression] || 0) + 1;
        confSum += f.dominantConfidence;
      });

      const total = recordedFrames.length;
      let dominant: ExpressionCategory = 'Neutral';
      let maxCount = -1;

      (Object.keys(counts) as ExpressionCategory[]).forEach(k => {
        if (counts[k] > maxCount) {
          maxCount = counts[k];
          dominant = k;
        }
      });

      const distributionPercentages: Record<string, number> = {};
      (Object.keys(counts) as ExpressionCategory[]).forEach(k => {
        distributionPercentages[k] = total > 0 ? Math.round((counts[k] / total) * 1000) / 10 : 0;
      });

      const startedAt = new Date(sessionStartTime || Date.now() - elapsedSeconds * 1000).toISOString();
      const endedAt = new Date().toISOString();
      const avgConfidence = total > 0 ? Math.round((confSum / total) * 10) / 10 : 85.0;

      if (user) {
        await api.saveAnalysisSession({
          sessionStartedAt: startedAt,
          sessionEndedAt: endedAt,
          dominantExpression: dominant,
          averageConfidence: avgConfidence,
          totalFramesAnalyzed: total,
          expressionDistribution: distributionPercentages,
          notes: sessionNotes || undefined,
        });
        setSavedLocally(false);
      } else {
        const guestSession = {
          id: `guest-${Date.now()}`,
          created_at: new Date().toISOString(),
          session_started_at: startedAt,
          session_ended_at: endedAt,
          dominant_expression: dominant,
          average_confidence: avgConfidence,
          total_frames_analyzed: total,
          expression_distribution: distributionPercentages,
          notes: sessionNotes ? `${sessionNotes} (Guest Local)` : 'Guest Session (Lokal)',
        };
        const prev = JSON.parse(localStorage.getItem('facescan_guest_sessions') || '[]');
        localStorage.setItem('facescan_guest_sessions', JSON.stringify([guestSession, ...prev]));
        setSavedLocally(true);
      }

      setSaveSuccess(true);
      onResetRecording();
      setElapsedSeconds(0);
      setSessionStartTime(null);
      setSessionNotes('');
    } catch (e: any) {
      alert(`Failed to save session: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-clean space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#114232]" />
            Session Analysis Controller
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Record a temporal observation window to store aggregated distribution metrics to your database
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display - Donezo Style */}
          <div className="flex items-center gap-2 bg-[#f4f5f7] px-4 py-2 rounded-full border border-slate-200 font-mono text-sm">
            <Clock className="w-4 h-4 text-[#114232]" />
            <span className={isRecording ? 'text-rose-600 font-bold animate-pulse' : 'text-slate-700 font-semibold'}>
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-slate-400 text-xs">({recordedFrames.length} frames)</span>
          </div>

          {/* Record / Stop Button */}
          {!isRecording ? (
            <button
              onClick={() => {
                setSaveSuccess(false);
                onToggleRecording();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs shadow-pine transition"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Start Recording Session
            </button>
          ) : (
            <button
              onClick={handleStopAndSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              Stop & Save Summary
            </button>
          )}
        </div>
      </div>

      {/* Save status notification */}
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#114232]" />
          <span>
            {savedLocally
              ? 'Sesi berhasil disimpan di penyimpanan lokal browser Anda! (Masuk akun jika ingin sinkronisasi cloud permanen).'
              : 'Session summary successfully synchronized to your Google Cloud SQL database! View it in the History tab.'}
          </span>
        </div>
      )}

      {/* Session Notes Input */}
      {isRecording && (
        <div className="pt-2">
          <input
            type="text"
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
            placeholder="Add optional session notes (e.g. Usability test participant #4, Interview prompt 2)..."
            className="w-full bg-[#f4f5f7] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 outline-none font-medium focus:border-[#114232]"
          />
        </div>
      )}
    </div>
  );
};
