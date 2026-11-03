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
    color: 'text-emerald-700',
    barColor: 'bg-[#114232]',
    bg: 'bg-emerald-50 border-emerald-200/80',
  },
  Neutral: {
    icon: Meh,
    color: 'text-slate-700',
    barColor: 'bg-[#52b788]',
    bg: 'bg-slate-50 border-slate-200/80',
  },
  Surprised: {
    icon: Sparkles,
    color: 'text-sky-700',
    barColor: 'bg-sky-600',
    bg: 'bg-sky-50 border-sky-200/80',
  },
  Sad: {
    icon: Frown,
    color: 'text-indigo-700',
    barColor: 'bg-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200/80',
  },
  Angry: {
    icon: Flame,
    color: 'text-rose-700',
    barColor: 'bg-rose-600',
    bg: 'bg-rose-50 border-rose-200/80',
  },
  Fearful: {
    icon: Ghost,
    color: 'text-purple-700',
    barColor: 'bg-purple-600',
    bg: 'bg-purple-50 border-purple-200/80',
  },
  Disgusted: {
    icon: ShieldAlert,
    color: 'text-amber-700',
    barColor: 'bg-amber-600',
    bg: 'bg-amber-50 border-amber-200/80',
  },
};

export const ExpressionMetrics: React.FC<ExpressionMetricsProps> = ({ frameResult }) => {
  const dominant = frameResult?.dominantExpression || 'Neutral';
  const confidence = frameResult?.dominantConfidence || 0;
  const scores = frameResult?.scores || {
    Neutral: 35,
    Happy: 11,
    Surprised: 11,
    Sad: 11,
    Angry: 11,
    Fearful: 10,
    Disgusted: 11,
  };

  const meta = CATEGORY_META[dominant];
  const Icon = meta.icon;

  return (
    <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-clean flex flex-col justify-between space-y-6">
      {/* Dominant Expression Card */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Dominant Expression
        </h3>

        <div className={`p-5 rounded-[22px] border ${meta.bg} flex items-center justify-between gap-4 transition-all duration-300`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm">
              <Icon className={`w-6 h-6 ${meta.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-[#111827] tracking-tight">
                  {dominant}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  {frameResult?.faceDetected ? 'Live' : 'Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Model Confidence: <strong className={meta.color}>{confidence.toFixed(1)}%</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-[#111827] font-mono">
              {confidence.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-100 pb-2">
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
                <span className={`font-semibold ${isDom ? 'text-[#114232]' : 'text-slate-600'}`}>
                  {cat}
                </span>
                <span className="text-slate-500 font-mono text-[11px] font-medium">
                  {itemScore.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#f4f5f7] rounded-full overflow-hidden border border-slate-200/60">
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
      <div className="p-3 bg-[#f4f5f7] border border-slate-200/70 rounded-2xl text-[11px] text-slate-500 leading-relaxed font-medium">
        <strong className="text-slate-700">FACS Notice:</strong> Activations reflect physical facial muscle movements (Action Units) classified via MediaPipe blendshapes. They do not claim absolute psychological emotion.
      </div>
    </div>
  );
};
