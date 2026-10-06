import React, { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send,
  Eye,
  Layers,
} from 'lucide-react';
import { StructuredInvestigationCard, EvidenceSufficiencyLevel } from '../types/intelligence';
import { PREBUILT_INVESTIGATIONS } from '../services/intelligenceEngine';

interface AIInvestigationConsoleProps {
  onInvestigateIncident?: () => void;
  onOpenAuditTrail?: () => void;
}

export const AIInvestigationConsole: React.FC<AIInvestigationConsoleProps> = ({
  onInvestigateIncident,
  onOpenAuditTrail,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('why-battery-decrease');
  const [customInput, setCustomInput] = useState<string>('');
  const [isViewingMissingEvidence, setIsViewingMissingEvidence] = useState(false);

  const activeCard: StructuredInvestigationCard =
    PREBUILT_INVESTIGATIONS[selectedPreset] || PREBUILT_INVESTIGATIONS['why-battery-decrease'];

  const handleSelectQuery = (key: string) => {
    setSelectedPreset(key);
    setIsViewingMissingEvidence(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    if (customInput.toLowerCase().includes('break') || customInput.toLowerCase().includes('solar')) {
      setSelectedPreset('did-solar-array-break');
    } else {
      setSelectedPreset('why-battery-decrease');
    }
  };

  return (
    <div id="sec-investigation-console" className="rounded-2xl border-2 border-sky-300 bg-white p-6 shadow-md shadow-sky-100/60 font-sans">
      {/* Top Header: Distinct from a chatbot */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-purple-700">
            <Brain className="h-4 w-4" />
            <span>STAGE 05 · STRUCTURED AI INVESTIGATION CONSOLE</span>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide mt-0.5">
            AI INVESTIGATION CONSOLE
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Analytic evidence reasoning workspace — structured proposition verification with strict refusal to speculate.
          </p>
        </div>

        {/* Evidence Sufficiency Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold flex items-center gap-2 shadow-xs ${
              activeCard.evidenceSufficiency === 'HIGH'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : activeCard.evidenceSufficiency === 'PARTIAL'
                ? 'border-amber-300 bg-amber-50 text-amber-800'
                : 'border-rose-300 bg-rose-50 text-rose-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>EVIDENCE SUFFICIENCY: {activeCard.evidenceSufficiency}</span>
          </div>
        </div>
      </div>

      {/* Query Selector Tabs / Prebuilt Questions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-bold text-slate-500 mr-1">
          OPERATOR QUESTIONS:
        </span>
        <button
          onClick={() => handleSelectQuery('why-battery-decrease')}
          className={`rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
            selectedPreset === 'why-battery-decrease'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300'
              : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
          }`}
        >
          "Why did the battery voltage decrease?"
        </button>
        <button
          onClick={() => handleSelectQuery('did-solar-array-break')}
          className={`rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedPreset === 'did-solar-array-break'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
              : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>"Did the solar array physically break?" (Abstention Demo)</span>
        </button>
      </div>

      {/* Query Input Bar */}
      <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter operator question (e.g., 'What evidence supports this?')..."
            className="w-full rounded-xl border border-sky-300 bg-slate-50/50 px-4 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-sky-500 px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span>ANALYZE</span>
        </button>
      </form>

      {/* =========================================================================
          FIRST-CLASS ABSTENTION DEMO VIEW: "Did the solar array physically break?"
         ========================================================================= */}
      {activeCard.isAbstention ? (
        <div className="mt-5 rounded-2xl border-2 border-amber-400 bg-amber-50/60 p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3 border-b border-amber-200 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/25 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-amber-800">
                {activeCard.abstentionTitle}
              </div>
              <h4 className="mt-1 font-display text-base font-bold text-slate-900">
                The available evidence does not establish physical damage to the solar array.
              </h4>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed font-sans">
                {activeCard.abstentionSummary}
              </p>
            </div>
          </div>

          {/* 3-Column Split: KNOWN vs UNKNOWN vs MISSING EVIDENCE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {/* Known Facts */}
            <div className="rounded-xl border border-emerald-300 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>WHAT WE KNOW</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-slate-800 font-sans text-xs">
                {activeCard.knownFacts.map((k, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unknown Factors */}
            <div className="rounded-xl border border-amber-300 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-amber-800 flex items-center gap-1.5 border-b border-amber-100 pb-2">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>WHAT WE DON'T KNOW</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-slate-800 font-sans text-xs">
                {activeCard.unknownFactors.map((u, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">?</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Evidence */}
            <div className="rounded-xl border border-rose-300 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-rose-800 flex items-center gap-1.5 border-b border-rose-100 pb-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>MISSING EVIDENCE</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-slate-800 font-sans text-xs">
                {activeCard.missingEvidence.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between border-t border-amber-200 pt-3">
            <span className="font-mono text-[11px] text-amber-800">
              Responsible AI Grounding: System refuses to hallucinate physical structural failure.
            </span>
            <button
              onClick={() => setIsViewingMissingEvidence(!isViewingMissingEvidence)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>{isViewingMissingEvidence ? 'HIDE MISSING ARTIFACTS' : 'VIEW MISSING EVIDENCE'}</span>
            </button>
          </div>

          {isViewingMissingEvidence && (
            <div className="rounded-xl border border-rose-200 bg-white p-4 font-mono text-xs space-y-2">
              <div className="font-bold text-rose-700">DOWNLINK BUFFER INSPECTION:</div>
              <div className="text-slate-600">
                - SADA Gimbal High-Rate Encoder: <span className="text-amber-600 font-bold">QUEUED IN BLACKBOX BUFFER</span>
              </div>
              <div className="text-slate-600">
                - Structural Strain Gauge Log: <span className="text-slate-400">UNSCHEDULED UNTIL GROUND PASS 14:48 UTC</span>
              </div>
              <div className="text-slate-600">
                - Solar Panel Diagnostic Volt-Ampere Curve: <span className="text-sky-700 font-bold">NOMINAL IMPEDANCE RATIO</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            STANDARD STRUCTURED INVESTIGATION CARD (Why did battery voltage decrease?)
           ========================================================================= */
        <div className="mt-5 space-y-4">
          {/* Question & Sufficiency Banner */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4">
            <div className="font-mono text-xs text-sky-800 font-bold">QUESTION:</div>
            <h4 className="mt-1 font-display text-base font-bold text-slate-900">
              {activeCard.question}
            </h4>
            <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-600">
              <span>EVIDENCE REASONING:</span>
              <span className="font-semibold text-slate-800">{activeCard.sufficiencyReason}</span>
            </div>
          </div>

          {/* Section 6: Observed Facts + Correlated Events + Historical Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {/* 1. OBSERVED FACTS */}
            <div className="rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-slate-900 border-b border-sky-100 pb-2">
                OBSERVED FACTS
              </div>
              <div className="mt-2.5 space-y-2 text-slate-700 font-sans text-xs">
                {activeCard.observedFacts.map((fact, idx) => (
                  <div key={idx} className="rounded-md border border-slate-100 bg-slate-50/50 p-2">
                    <div>{fact.text}</div>
                    <div className="mt-1 font-mono text-[10px] text-sky-800 font-bold">
                      [{fact.source}] · {fact.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CORRELATED EVENTS */}
            <div className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-amber-900 border-b border-amber-100 pb-2">
                CORRELATED EVENTS
              </div>
              <div className="mt-2.5 space-y-2 text-slate-700 font-sans text-xs">
                {activeCard.correlatedEvents.map((evt, idx) => (
                  <div key={idx} className="rounded-md border border-amber-100 bg-amber-50/40 p-2">
                    <div>{evt.text}</div>
                    <div className="mt-1 font-mono text-[10px] text-amber-800 font-bold">
                      [{evt.source}] · {evt.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HISTORICAL CONTEXT */}
            <div className="rounded-xl border border-indigo-200 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-indigo-900 border-b border-indigo-100 pb-2">
                HISTORICAL CONTEXT
              </div>
              <div className="mt-2.5 space-y-2 text-slate-700 font-sans text-xs">
                {activeCard.historicalContext.map((hist, idx) => (
                  <div key={idx} className="rounded-md border border-indigo-100 bg-indigo-50/40 p-2">
                    <div>{hist.text}</div>
                    <div className="mt-1 font-mono text-[10px] text-indigo-800 font-bold">
                      [{hist.source}] · {hist.similarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HYPOTHESIS & RESPONSIBLE AI NOTICE */}
          <div className="rounded-xl border border-sky-300 bg-sky-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="font-bold text-sky-900">GROUNDED HYPOTHESIS:</span>
              <span className="rounded bg-sky-200 px-2 py-0.5 font-bold text-sky-800 text-[11px]">
                CONFIDENCE: {activeCard.hypothesisConfidence}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-800 font-sans leading-relaxed">
              {activeCard.hypothesis}
            </p>

            {/* Core Responsible-AI Mandate */}
            <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2.5 font-mono text-xs text-amber-900 font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>TEMPORAL CORRELATION ≠ PROVEN CAUSATION</span>
              </div>
              <span className="text-[11px] font-normal text-amber-800">
                Awaiting electrical cross-bus telemetry
              </span>
            </div>
          </div>

          {/* Section 12: WHAT WE KNOW / WHAT WE DON'T KNOW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-emerald-800 border-b border-emerald-100 pb-2">
                WHAT WE KNOW (EVIDENCE-BACKED FACTS)
              </div>
              <div className="mt-2 space-y-1.5 text-slate-700 font-sans text-xs">
                {activeCard.knownFacts.map((k, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-xs">
              <div className="font-bold text-amber-800 border-b border-amber-100 pb-2">
                WHAT WE DON'T KNOW (UNPROVEN ASSUMPTIONS)
              </div>
              <div className="mt-2 space-y-1.5 text-slate-700 font-sans text-xs">
                {activeCard.unknownFactors.map((u, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">?</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
