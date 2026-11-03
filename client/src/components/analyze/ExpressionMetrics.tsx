import React from 'react';
import { ExpressionCategory, AnalysisFrameResult } from '../../types';
import { Smile, Meh, Sparkles, Frown, Flame, Ghost, ShieldAlert } from 'lucide-react';

interface ExpressionMetricsProps {
  frameResult: AnalysisFrameResult | null;
}

const CATEGORY_META: Record<
  ExpressionCategory,
  { icon: any; color: string; barColor: string; bg: string }
> = {
  Happy: {
    icon: Smile,
    color: 'text-amber-400',
    barColor: 'bg-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  Neutral: {
    icon: Meh,
    color: 'text-teal-400',
    barColor: 'bg-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
  },
  Surprised: {
    icon: Sparkles,
    color: 'text-sky-400',
    barColor: 'bg-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
  },
  Sad: {
    icon: Frown,
    color: 'text-blue-400',
    barColor: 'bg-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  Angry: {
    icon: Flame,
    color: 'text-red-400',
    barColor: 'bg-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  Fearful: {
    icon: Ghost,
    color: 'text-purple-400',
    barColor: 'bg-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  Disgusted: {
    icon: ShieldAlert,
    color: 'text-emerald-400',
    barColor: 'bg-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

export const ExpressionMetrics: React.FC<ExpressionMetricsProps> = ({ frameResult }) => {
  const dominant = frameResult?.dominantExpression || 'Neutral';
  const confidence = frameResult?.dominantConfidence || 0;
  const scores = frameResult?.scores || {
    Neutral: 100,
    Happy: 0,
    Surprised: 0,
    Sad: 0,
    Angry: 0,
    Fearful: 0,
    Disgusted: 0,
  };

  const meta = CATEGORY_META[dominant];
  const Icon = meta.icon;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
      {/* Dominant Expression Card */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Dominant Expression
        </h3>

        <div className={`p-5 rounded-2xl border ${meta.bg} flex items-center justify-between gap-4 transition-all duration-300`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center ${meta.color} shadow-lg`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {dominant}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-700 text-slate-300">
                  {frameResult?.faceDetected ? 'Active' : 'Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model Confidence: <strong className={meta.color}>{confidence.toFixed(1)}%</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-white font-mono">
              {confidence.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800/80 pb-2">
          <span>Expression Category</span>
          <span>Activation</span>
        </div>

        {(Object.keys(CATEGORY_META) as ExpressionCategory[]).map(cat => {
          const itemMeta = CATEGORY_META[cat];
          const itemScore = scores[cat] || 0;
          const isDom = cat === dominant;

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isDom ? 'text-white font-bold' : 'text-slate-400'}`}>
                  {cat}
                </span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {itemScore.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${itemMeta.barColor}`}
                  style={{ width: `${Math.max(2, itemScore)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific & Ethical Note */}
      <div className="p-3 bg-slate-950/70 border border-slate-800/70 rounded-xl text-[11px] text-slate-400 leading-relaxed">
        <strong>FACS Notice:</strong> Activations reflect facial muscle movements (Action Units) classified via blendshapes. They do not constitute deterministic diagnosis of internal emotional states.
      </div>
    </div>
  );
};
