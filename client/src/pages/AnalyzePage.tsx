import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CameraViewport } from '../components/analyze/CameraViewport';
import { ExpressionMetrics } from '../components/analyze/ExpressionMetrics';
import { SessionRecorder } from '../components/analyze/SessionRecorder';
import { PrivacyDisclaimer } from '../components/analyze/PrivacyDisclaimer';
import { useAuth } from '../context/AuthContext';
import { AnalysisFrameResult } from '../types';
import { Sparkles, Activity, ShieldCheck, LogIn, Camera } from 'lucide-react';

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
      {/* Guest Mode Notice Banner - Donezo Clean Style */}
      {!user && (
        <div className="bg-white rounded-[24px] border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-clean">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eaf4f0] text-[#114232] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#111827]">
                Mode Akses Langsung Bebas Aktif (Tanpa Login)
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Kamera dan pemrosesan AI 478-landmark MediaPipe berjalan 100% lokal di browser Anda. Ingin menyimpan riwayat sesi ke Cloud SQL?
              </p>
            </div>
          </div>
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs whitespace-nowrap self-start sm:self-auto transition shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In Akun
          </Link>
        </div>
      )}

      {/* Page Title & Status Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf4f0] text-[#114232] text-xs font-bold border border-[#114232]/10 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            MediaPipe Face Landmarker V2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Real-Time Facial Expression Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            High-precision 478-node facial landmark geometry and scientific FACS blendshape classification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full shadow-clean self-start sm:self-auto">
          <Activity className="w-4 h-4 text-[#114232]" />
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

      {/* Session Recorder Controller - Styled like Time Tracker */}
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
