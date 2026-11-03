import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CameraViewport } from '../components/analyze/CameraViewport';
import { ExpressionMetrics } from '../components/analyze/ExpressionMetrics';
import { SessionRecorder } from '../components/analyze/SessionRecorder';
import { PrivacyDisclaimer } from '../components/analyze/PrivacyDisclaimer';
import { useAuth } from '../context/AuthContext';
import { AnalysisFrameResult } from '../types';
import { Sparkles, Activity, ShieldCheck, LogIn } from 'lucide-react';

export const AnalyzePage: React.FC = () => {
  const { user } = useAuth();
  const [currentFrameResult, setCurrentFrameResult] = useState<AnalysisFrameResult | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedFrames, setRecordedFrames] = useState<AnalysisFrameResult[]>([]);

  // Throttled frame state callback to avoid excessive re-renders
  const handleFrameResult = useCallback((res: AnalysisFrameResult) => {
    setCurrentFrameResult(res);
  }, []);

  const handleFrameRecord = useCallback((res: AnalysisFrameResult) => {
    setRecordedFrames(prev => [...prev, res]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Guest Mode Notice Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Mode Akses Langsung (Tanpa Login) Aktif
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Kamera dan pemrosesan AI 478-landmark MediaPipe berjalan 100% lokal di browser Anda. Ingin menyimpan riwayat sesi ke Cloud SQL?
              </p>
            </div>
          </div>
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs whitespace-nowrap self-start sm:self-auto transition shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In Akun
          </Link>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            MediaPipe Face Landmarker V2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real-Time Facial Expression Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            High-precision 478-node facial landmark geometry and blendshape classification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Activity className="w-4 h-4 text-teal-400" />
          <span>Inference: Client WebAssembly</span>
        </div>
      </div>

      {/* Main Studio Grid: Camera Viewport (Left 2 cols) & Metrics (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CameraViewport
            onFrameResult={handleFrameResult}
            isRecording={isRecording}
            onFrameRecord={handleFrameRecord}
          />
        </div>

        <div>
          <ExpressionMetrics frameResult={currentFrameResult} />
        </div>
      </div>

      {/* Session Recorder Controller */}
      <SessionRecorder
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(prev => !prev)}
        recordedFrames={recordedFrames}
        onResetRecording={() => setRecordedFrames([])}
      />

      {/* Privacy & Ethical AI Banner */}
      <PrivacyDisclaimer />
    </div>
  );
};
