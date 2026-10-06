import React from 'react';
import { GitBranch, AlertCircle, ArrowDown, Info, ShieldAlert, Zap } from 'lucide-react';
import { CorrelationEventNode } from '../types/intelligence';

interface EventCorrelationTimelineProps {
  events: CorrelationEventNode[];
  onSelectEvent?: (event: CorrelationEventNode) => void;
}

export const EventCorrelationTimeline: React.FC<EventCorrelationTimelineProps> = ({
  events,
  onSelectEvent,
}) => {
  return (
    <div id="sec-event-correlation" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-700">
            <GitBranch className="h-4 w-4" />
            <span>STAGE 02 · MULTI-STREAM TEMPORAL CORRELATION</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            EVENT CORRELATION
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Synchronizes command events, continuous telemetry series, and subsystem degradation logs into a single coherent incident timeline.
          </p>
        </div>

        {/* Responsible AI Notice Badge */}
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-mono text-xs text-amber-800 font-bold flex items-center gap-1.5 shadow-xs">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>TEMPORAL CORRELATION ≠ PROVEN CAUSATION</span>
        </div>
      </div>

      {/* Primary Category Banner: Label this CORRELATED EVIDENCE */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-sky-50 border border-sky-200 px-4 py-2 font-mono text-xs">
        <span className="font-bold text-sky-800">
          CLASSIFICATION: CORRELATED EVIDENCE
        </span>
        <span className="text-slate-500 text-[11px]">
          Status: Observed chronological alignment (Not established root cause)
        </span>
      </div>

      {/* Visual Timeline Sequence */}
      <div className="mt-5 space-y-3">
        {events.map((evt, idx) => {
          const isAnomaly = evt.type === 'ANOMALY' || evt.type === 'INCIDENT';
          const isEvent = evt.type === 'EVENT';
          return (
            <React.Fragment key={evt.id}>
              <div
                onClick={() => onSelectEvent && onSelectEvent(evt)}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                  evt.highlight
                    ? 'border-sky-400 bg-sky-50/50 shadow-sm ring-1 ring-sky-300/60'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Timestamp & Code Badge */}
                  <div className="font-mono text-xs shrink-0">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 font-bold border border-slate-200">
                      {evt.time}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-800 border border-sky-200">
                        {evt.id}
                      </span>
                      <h4 className="font-display text-sm font-bold text-slate-900 tracking-wide">
                        {evt.label}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-sans">
                      {evt.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs self-start sm:self-auto shrink-0">
                  <span className="text-[11px] text-slate-500">{evt.sourceCode}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      isAnomaly
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : isEvent
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}
                  >
                    {evt.type}
                  </span>
                </div>
              </div>

              {idx < events.length - 1 && (
                <div className="flex items-center justify-center -my-1 text-sky-400">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-sky-200" />
                    <ArrowDown className="h-3.5 w-3.5 text-sky-500" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
