import React, { useState } from 'react';
import {
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { DetailDrawer } from './DetailDrawer';
import { HISTORICAL_INCIDENTS_LIST } from '../services/intelligenceEngine';

interface IncidentsPageViewProps {
  onInvestigateActiveIncident: () => void;
}

export const IncidentsPageView: React.FC<IncidentsPageViewProps> = ({
  onInvestigateActiveIncident,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>INCIDENT DIRECTORY & HISTORICAL COMPARISON</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Spacecraft Incident Registry
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Active flight anomalies cross-referenced with vector similarity against previous mission incident dockets.
          </p>
        </div>

        <button
          onClick={onInvestigateActiveIncident}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
        >
          <span>INVESTIGATE ACTIVE INC-024</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 1. Active Incident Spotlight Card */}
      <div className="p-6 rounded-2xl border-2 border-rose-300 bg-rose-50/40 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-xs font-bold">
              INC-024
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-mono text-xs font-bold">
              ACTIVE ANOMALY
            </span>
            <span className="font-mono text-xs text-slate-500">ORBIT-X1 · 14:32:05 UTC</span>
          </div>
          <span className="font-mono text-xs font-bold text-rose-700">ML SCORE 0.91</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Battery Voltage Degradation Following Power Configuration Event
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Primary bus voltage declined from 28.5 V to 24.8 V following EV-204 switch command. Telemetry correlated with ADCS star tracker off-sun drift.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-rose-200 font-mono text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <span>Evidence: <strong className="text-amber-700">PARTIAL</strong></span>
            <span>Matched Precedents: <strong className="text-sky-800">2 Found (INC-008, INC-013)</strong></span>
          </div>

          <button
            onClick={onInvestigateActiveIncident}
            className="text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
          >
            Open Investigation Console →
          </button>
        </div>
      </div>

      {/* 2. Historical Incidents Comparison (Section 9) */}
      <div className="space-y-4">
        <div className="border-b border-sky-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Similar Historical Incidents (Vector Retrieval)</h3>
          <p className="text-xs font-mono text-slate-500">Historical flight cases sharing mathematical and physical parameter correlation with INC-024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HISTORICAL_INCIDENTS_LIST.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className="p-6 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-sky-100 text-sky-800">
                    {inc.id}
                  </span>
                  <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {inc.similarity}% SIMILAR
                  </span>
                </div>

                <h4 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {inc.title}
                </h4>
                <div className="mt-1 font-mono text-xs text-slate-400">{inc.date}</div>

                <div className="mt-3 space-y-1 text-xs text-slate-600 font-mono">
                  {inc.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-700 font-bold">{inc.outcome}</span>
                <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Compare Delta</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Incident Detail Drawer */}
      {selectedIncident && (
        <DetailDrawer
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={selectedIncident.title}
          subtitle={`Docket ID: ${selectedIncident.id} · ${selectedIncident.date}`}
          badge={{
            text: `${selectedIncident.similarity}% SIMILARITY MATCH`,
            variant: 'purple',
          }}
          width="lg"
        >
          {/* Similarity & Subsystem */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
            <div className="text-xs font-mono font-bold text-purple-800 uppercase">AFFECTED SUBSYSTEM</div>
            <div className="text-lg font-bold text-slate-900 font-sans">{selectedIncident.subsystem}</div>
            <div className="text-xs font-mono text-emerald-700 font-bold">Outcome: {selectedIncident.outcome}</div>
          </div>

          {/* Match Reasons */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">CORRELATED PARAMETER SIGNATURES</div>
            <div className="space-y-1.5 font-mono text-xs">
              {selectedIncident.matchReasons.map((m: string, i: number) => (
                <div key={i} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lessons Learned */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">LESSONS LEARNED & RESOLUTION</div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">{selectedIncident.lessonsLearned}</p>
          </div>

          {/* Procedure Used */}
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
            <div className="text-xs font-mono font-bold text-sky-800 uppercase">RECOVERY PROCEDURE USED</div>
            <div className="mt-1 font-mono text-sm font-bold text-sky-950">{selectedIncident.procedureUsed}</div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
