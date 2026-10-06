import React from 'react';
import { ShieldCheck, FileCheck, ArrowRight, AlertCircle, Info, BookOpen } from 'lucide-react';
import { RecommendedActionItem } from '../types/intelligence';

interface EvidenceGroundedRecommendationsProps {
  recommendations: RecommendedActionItem[];
  onExecuteSimulation?: (recId: string) => void;
}

export const EvidenceGroundedRecommendations: React.FC<EvidenceGroundedRecommendationsProps> = ({
  recommendations,
  onExecuteSimulation,
}) => {
  return (
    <div id="sec-recommendations" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-700">
            <ShieldCheck className="h-4 w-4" />
            <span>STAGE 07 · EVIDENCE-GROUNDED DECISION SUPPORT</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            WHAT SHOULD THE OPERATOR INVESTIGATE?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            AI-generated recommendations with authoritative source citations and verifiable rationale.
          </p>
        </div>

        {/* DECISION SUPPORT ONLY Prominent Warning */}
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-mono text-xs text-amber-800 font-bold flex items-center gap-1.5 shadow-xs">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>DECISION SUPPORT ONLY — NOT SPACECRAFT COMMANDS</span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="mt-4 space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl border border-sky-200 bg-sky-50/20 p-4 shadow-xs hover:border-sky-400 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white font-mono text-xs font-bold shrink-0">
                  {rec.stepNumber}
                </div>

                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900 leading-snug">
                    {rec.recommendation}
                  </h4>

                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-800 font-bold border border-sky-200">
                      SOURCE: {rec.source}
                    </span>
                    <span className="text-slate-500 font-sans">{rec.sourceTitle}</span>
                  </div>

                  {/* RATIONALE */}
                  <div className="mt-2 text-xs text-slate-700 bg-white rounded-lg border border-sky-100 p-2.5 font-sans leading-relaxed">
                    <strong className="font-mono text-slate-900">RATIONALE: </strong>
                    {rec.rationale}
                  </div>
                </div>
              </div>

              {onExecuteSimulation && (
                <button
                  onClick={() => onExecuteSimulation(rec.id)}
                  className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-sky-800 hover:bg-sky-50 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  SIMULATE REVIEW
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice Footer */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/50 p-3 text-xs text-slate-600 flex items-center justify-between font-mono">
        <span className="text-[11px]">
          All procedures require manual telemetry cross-check before flight director approval.
        </span>
        <span className="text-sky-800 font-bold text-[11px]">
          SAFETY AUDIT VERIFIED
        </span>
      </div>
    </div>
  );
};
