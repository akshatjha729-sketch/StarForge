import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, FileText, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { HistoricalIncident } from '../types/intelligence';
import { HISTORICAL_INCIDENTS_LIST } from '../services/intelligenceEngine';

interface HistoricalIncidentComparisonProps {
  onSelectProcedure?: (procedureCode: string) => void;
}

export const HistoricalIncidentComparison: React.FC<HistoricalIncidentComparisonProps> = ({
  onSelectProcedure,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<HistoricalIncident | null>(null);

  return (
    <div id="sec-historical-incidents" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-indigo-700">
            <BookOpen className="h-4 w-4" />
            <span>STAGE 04 · HISTORICAL INCIDENT VECTOR RECALL</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            SIMILAR HISTORICAL INCIDENTS
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Cross-references INC-024 with 8,400+ hours of orbital flight anomaly logs to surface proven recoveries.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-600">
          CURRENT INCIDENT: <strong className="text-rose-600">INC-024</strong>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {HISTORICAL_INCIDENTS_LIST.map((inc) => (
          <div
            key={inc.id}
            className="rounded-xl border border-sky-200 bg-sky-50/20 p-4 shadow-xs hover:border-sky-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-800 font-bold border border-indigo-200">
                  {inc.id}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
                  {inc.similarity}% SIMILARITY
                </span>
              </div>

              <h4 className="mt-2 font-display text-base font-bold text-slate-900">
                {inc.title}
              </h4>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                {inc.date} · {inc.subsystem}
              </div>

              {/* WHY MATCHED */}
              <div className="mt-3 border-t border-sky-100 pt-2.5">
                <div className="font-mono text-[11px] font-bold text-slate-700 mb-1.5">
                  WHY MATCHED WITH INC-024:
                </div>
                <div className="space-y-1.5">
                  {inc.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-sans">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions & Resolution */}
            <div className="mt-4 border-t border-sky-100 pt-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-emerald-700 font-bold">
                ✓ {inc.outcome}
              </span>
              <button
                onClick={() => setSelectedIncident(inc)}
                className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-xs cursor-pointer"
              >
                <span>OPEN DOSSIER</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-sky-300 bg-white p-6 shadow-2xl overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-800">
                  {selectedIncident.id}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {selectedIncident.similarity}% MATCH
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {selectedIncident.title}
              </h3>

              <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 space-y-2">
                <div className="font-mono font-bold text-slate-900">LESSONS LEARNED & FLIGHT RESOLUTION:</div>
                <p className="leading-relaxed text-slate-800">{selectedIncident.lessonsLearned}</p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="font-mono font-bold text-emerald-900">APPROVED PROCEDURE APPLIED:</div>
                <p className="mt-1 font-mono text-slate-800 font-semibold">{selectedIncident.procedureUsed}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-sky-100 pt-3">
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-lg border border-sky-300 bg-white px-4 py-2 font-mono text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                CLOSE
              </button>
              {onSelectProcedure && (
                <button
                  onClick={() => {
                    onSelectProcedure(selectedIncident.procedureUsed);
                    setSelectedIncident(null);
                  }}
                  className="rounded-lg bg-sky-500 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-xs cursor-pointer"
                >
                  VIEW PROCEDURE GUIDELINES
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
