import React, { useState, useEffect } from 'react';
import { Play, Square, Save, CheckCircle2, Loader2, Clock, Layers } from 'lucide-react';
import { api } from '../../services/api';
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
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
      // Calculate aggregate stats across recorded frames
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

      await api.saveAnalysisSession({
        sessionStartedAt: startedAt,
        sessionEndedAt: endedAt,
        dominantExpression: dominant,
        averageConfidence: avgConfidence,
        totalFramesAnalyzed: total,
        expressionDistribution: distributionPercentages,
        notes: sessionNotes || undefined,
      });

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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            Session Analysis Controller
          </h3>
          <p className="text-xs text-slate-400">
            Record a temporal window to store aggregated distribution metrics to your database
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm">
            <Clock className="w-4 h-4 text-teal-400" />
            <span className={isRecording ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300'}>
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-slate-500 text-xs">({recordedFrames.length} frames)</span>
          </div>

          {/* Record / Stop Button */}
          {!isRecording ? (
            <button
              onClick={() => {
                setSaveSuccess(false);
                onToggleRecording();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Recording Session
            </button>
          ) : (
            <button
              onClick={handleStopAndSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition"
            >
              <Square className="w-4 h-4 fill-white" />
              Stop & Save Summary
            </button>
          )}
        </div>
      </div>

      {/* Save status notification */}
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Session summary successfully synchronized to your Google Cloud SQL database! View it in the History tab.</span>
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
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-500"
          />
        </div>
      )}
    </div>
  );
};
