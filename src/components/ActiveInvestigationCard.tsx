import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';
import { EvidenceSufficiencyLevel } from '../types/intelligence';

interface ActiveInvestigationCardProps {
  incidentId: string;
  title: string;
  anomalyScore: number;
  evidenceSufficiency: EvidenceSufficiencyLevel;
  whyFlagged: string;
  onInvestigate: () => void;
  onViewEvidence: () => void;
  onStartDemo?: () => void;
}

export const ActiveInvestigationCard: React.FC<ActiveInvestigationCardProps> = ({
  incidentId = 'INC-024',
  title = 'Battery Voltage Degradation Following Power Configuration Event',
  anomalyScore = 0.91,
  evidenceSufficiency = 'PARTIAL',
  whyFlagged = 'Battery voltage deviated significantly from baseline and was temporally correlated with a power configuration event.',
  onInvestigate,
  onViewEvidence,
  onStartDemo,
}) => {
  return (
    <div className="rounded-2xl border-2 border-rose-300 bg-linear-to-br from-white via-rose-50/20 to-sky-50/30 p-6 shadow-lg shadow-rose-100/50 relative overflow-hidden">
      {/* Top Banner & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/25 animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="rounded-md bg-rose-100 px-2.5 py-0.5 font-bold text-rose-800 border border-rose-200">
                ACTIVE INVESTIGATION
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-rose-700">{incidentId}</span>
              <span className="text-slate-300">·</span>
              <span className="rounded bg-rose-600 px-2 py-0.5 text-white font-bold text-[10px]">
                HIGH PRIORITY
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-wide">
              {title}
            </h2>
          </div>
        </div>

        {onStartDemo && (
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 rounded-xl border border-sky-400 bg-sky-50 px-4 py-2 font-mono text-xs font-bold text-sky-800 hover:bg-sky-100 transition-all shadow-xs cursor-pointer"
          >
            <Play className="h-4 w-4 fill-sky-600 text-sky-600" />
            <span>START DEMO (PIPELINE WALKTHROUGH)</span>
          </button>
        )}
      </div>

      {/* Primary Intelligence Metrics & Status */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        {/* Metric 1: ML Anomaly Score */}
        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>ANOMALY SCORE</span>
            <Activity className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-rose-600 tabular-nums">
            {anomalyScore.toFixed(2)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-rose-700 font-semibold">
            <span>Isolation Forest Flagged</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">p &lt; 0.001</span>
          </div>
        </div>

        {/* Metric 2: Evidence Sufficiency */}
        <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>EVIDENCE SUFFICIENCY</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-amber-600">
            {evidenceSufficiency}
          </div>
          <div className="mt-1 text-[11px] text-slate-600 leading-tight">
            Telemetry & events correlated; causal proof pending
          </div>
        </div>

        {/* Metric 3: System Copilot Verdict */}
        <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>COPILOT STANCE</span>
            <Sparkles className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-sky-800">
            EVIDENCE-GROUNDED
          </div>
          <div className="mt-1 text-[11px] text-slate-600">
            Strict refusal to speculate · Grounded in P-017 & INC-008
          </div>
        </div>
      </div>

      {/* Why This Incident Was Flagged Banner */}
      <div className="mt-4 rounded-xl border border-sky-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-bold text-sky-800 uppercase tracking-wide">
              WHY THIS INCIDENT WAS FLAGGED:
            </div>
            <p className="mt-1 text-xs text-slate-700 leading-relaxed max-w-3xl">
              {whyFlagged}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onViewEvidence}
              className="rounded-lg border border-sky-300 bg-sky-50 px-3.5 py-2 font-mono text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors shadow-xs cursor-pointer"
            >
              VIEW EVIDENCE
            </button>
            <button
              onClick={onInvestigate}
              className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <span>INVESTIGATE INCIDENT</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
