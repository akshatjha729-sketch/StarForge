import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, TrendingDown, Cpu, Gauge } from 'lucide-react';
import { AnomalyAnalysisData } from '../types/intelligence';

interface AnomalyAnalysisPanelProps {
  analysis: AnomalyAnalysisData;
}

export const AnomalyAnalysisPanel: React.FC<AnomalyAnalysisPanelProps> = ({ analysis }) => {
  return (
    <div id="sec-anomaly-ml" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-sky-700">
            <Activity className="h-4 w-4 text-rose-500" />
            <span>STAGE 01 · MACHINE LEARNING TELEMETRY INFERENCE</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            ANOMALY ANALYSIS
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Isolation Forest multidimensional outlier detection applied to real-time telemetry buffer.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">ISOLATION FOREST:</span>
          <span
            className={`rounded-md px-2.5 py-1 font-bold ${
              analysis.isolationForestVerdict === 'ANOMALY'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {analysis.isolationForestVerdict}
          </span>
        </div>
      </div>

      {/* Main Parameters Table / Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs tabular-nums">
        {/* Parameter */}
        <div className="rounded-lg border border-sky-200 bg-sky-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-slate-500">PARAMETER</div>
          <div className="mt-1 font-bold text-slate-900 text-sm">{analysis.parameter}</div>
          <div className="text-[10px] text-sky-700">Primary Bus 1 ADC</div>
        </div>

        {/* Current */}
        <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-rose-700 font-semibold">CURRENT VALUE</div>
          <div className="mt-1 font-bold text-rose-600 text-base">{analysis.currentValue}</div>
          <div className="text-[10px] text-rose-600">Threshold: &lt; 25.5 V</div>
        </div>

        {/* Baseline */}
        <div className="rounded-lg border border-sky-200 bg-sky-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-slate-500">BASELINE ENVELOPE</div>
          <div className="mt-1 font-bold text-slate-900">{analysis.baselineRange}</div>
          <div className="text-[10px] text-slate-500">Nominal 3σ Window</div>
        </div>

        {/* Rate of Change */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-slate-500">RATE OF CHANGE</div>
          <div className="mt-1 font-bold text-amber-700 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
            <span>{analysis.rateOfChange}</span>
          </div>
          <div className="text-[10px] text-slate-500">Expected: ±0.03 V/m</div>
        </div>

        {/* Deviation */}
        <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-slate-500">DEVIATION LEVEL</div>
          <div className="mt-1 font-bold text-rose-700">{analysis.deviationLevel}</div>
          <div className="text-[10px] text-slate-500">Z-Score: -3.84</div>
        </div>

        {/* Anomaly Score */}
        <div className="rounded-lg border border-sky-200 bg-sky-50/30 p-3 shadow-xs">
          <div className="text-[10px] text-slate-500">MODEL SCORE</div>
          <div className="mt-1 text-base font-bold text-rose-600">{analysis.modelScore.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">Range [0.00 – 1.00]</div>
        </div>
      </div>

      {/* WHY FLAGGED? Section */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-white p-4 shadow-xs">
        <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Gauge className="h-4 w-4 text-sky-600" />
          <span>WHY FLAGGED BY THE MACHINE LEARNING INFERENCE ENGINE:</span>
        </div>

        <div className="mt-2.5 space-y-2">
          {analysis.whyFlagged.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg border border-sky-100 bg-sky-50/40 p-2.5 text-xs text-slate-800 font-sans"
            >
              <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
