import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Activity,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import { PREBUILT_INVESTIGATIONS } from '../services/intelligenceEngine';

interface InvestigationPageViewProps {
  onViewEvidence: () => void;
  onViewSimilarIncidents: () => void;
  onOpenAudit: () => void;
  onSelectEvidenceItem?: (sourceId: string) => void;
}

export const InvestigationPageView: React.FC<InvestigationPageViewProps> = ({
  onViewEvidence,
  onViewSimilarIncidents,
  onOpenAudit,
  onSelectEvidenceItem,
}) => {
  // Query state: 'why-battery-decrease' (default) or 'did-solar-array-break' (abstention showcase)
  const [activeQueryKey, setActiveQueryKey] = useState<'why-battery-decrease' | 'did-solar-array-break'>('why-battery-decrease');

  // Progressive Disclosure: Collapsible sections
  // By default, only 'facts' is expanded to keep page clean!
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    facts: true,
    events: false,
    history: false,
    hypothesis: false,
    recommendations: false,
    missing: false,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const currentInvestigation = PREBUILT_INVESTIGATIONS[activeQueryKey];

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* ========================================================
          1. HEADER: INCIDENT BANNER & PRIMARY HEADLINE
      ======================================================== */}
      <div className="border-b border-sky-100 pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-md bg-rose-600 text-white font-mono text-xs font-bold tracking-wider">
            INC-024
          </span>
          <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-bold">
            HIGH PRIORITY
          </span>
          <span className="px-3 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-mono text-xs font-bold">
            ACTIVE INVESTIGATION
          </span>
          <span className="text-slate-400 font-mono text-xs">SPACECRAFT: ORBIT-X1</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          Battery Voltage Degradation Following Power Configuration Event
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Primary electrical bus voltage drop observed 2 seconds after automated execution of switch matrix command EV-204 during terminator transit.
        </p>
      </div>

      {/* ========================================================
          2. TWO-COLUMN LAYOUT: LEFT 65% TIMELINE, RIGHT 35% STATUS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 65%: Visual Incident Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Incident Timeline</h2>
              <p className="text-xs font-mono text-slate-500">Correlated flight events and telemetry changes in order of occurrence</p>
            </div>
            <span className="font-mono text-xs text-sky-700 font-semibold">T-WINDOW: 20 SECONDS</span>
          </div>

          <div className="space-y-3 font-mono text-sm pt-1">
            {/* 14:31:58 EV-204 */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-sky-200 bg-white hover:border-sky-300 transition-all shadow-xs">
              <div className="text-xs font-bold text-sky-800 shrink-0 w-20 pt-0.5">14:31:58 UTC</div>
              <div className="h-full border-r border-sky-200 pr-4 shrink-0">
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-xs">EV-204</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">Power configuration changed</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Autonomous ground script switched matrix to activate optical heater bank and auxiliary sensor payload.
                </div>
              </div>
              <button
                onClick={() => onSelectEvidenceItem?.('EV-204')}
                className="text-xs text-sky-600 hover:text-sky-800 underline font-semibold shrink-0 cursor-pointer"
              >
                Source: EV-204
              </button>
            </div>

            {/* 14:32:00 Battery voltage begins declining */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="text-xs font-bold text-slate-600 shrink-0 w-20 pt-0.5">14:32:00 UTC</div>
              <div className="h-full border-r border-slate-200 pr-4 shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-xs">TEL-1029</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-800">Battery voltage begins declining</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Bus 1 voltage inflection point observed: from steady 28.5 V trending downward at -0.42 V/min.
                </div>
              </div>
            </div>

            {/* 14:32:05 Battery 24.8 V ANOMALY */}
            <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-rose-400 bg-rose-50/60 shadow-xs">
              <div className="text-xs font-bold text-rose-700 shrink-0 w-20 pt-0.5">14:32:05 UTC</div>
              <div className="h-full border-r border-rose-200 pr-4 shrink-0">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-xs">ANOMALY</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-rose-950 flex items-center gap-2">
                  <span>Battery Voltage 24.8 V Flagged</span>
                  <span className="text-xs font-bold px-2 py-0.2 rounded bg-rose-200 text-rose-800">ML SCORE 0.91</span>
                </div>
                <div className="text-xs text-rose-800 mt-0.5">
                  Primary electrical bus drops below 25.5 V threshold. Isolation Forest raises priority alarm.
                </div>
              </div>
              <button
                onClick={() => onSelectEvidenceItem?.('TEL-1032')}
                className="text-xs text-rose-700 hover:text-rose-900 underline font-semibold shrink-0 cursor-pointer"
              >
                Source: TEL-1032
              </button>
            </div>

            {/* 14:32:08 Communication degraded */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-300 bg-amber-50/50">
              <div className="text-xs font-bold text-amber-800 shrink-0 w-20 pt-0.5">14:32:08 UTC</div>
              <div className="h-full border-r border-amber-200 pr-4 shrink-0">
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-xs">COMM-DEG</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-amber-950">Communication degraded to -57 dBm</div>
                <div className="text-xs text-amber-800 mt-0.5">
                  RF power amplifier throttles carrier output to prevent undervoltage latch under 24.8 V bus sag.
                </div>
              </div>
              <button
                onClick={() => onSelectEvidenceItem?.('COM-401')}
                className="text-xs text-amber-800 hover:text-amber-950 underline font-semibold shrink-0 cursor-pointer"
              >
                Source: COM-401
              </button>
            </div>

            {/* 14:32:18 INCIDENT CREATED */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-rose-300 bg-white">
              <div className="text-xs font-bold text-slate-700 shrink-0 w-20 pt-0.5">14:32:18 UTC</div>
              <div className="h-full border-r border-slate-200 pr-4 shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-xs">INC-024</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">INCIDENT DOCKET CREATED</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Correlated telemetry & event tokens compiled into docket INC-024 for operator evaluation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 35%: Investigation Status Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-sky-200 bg-sky-50/30 p-6 space-y-6">
          <div className="border-b border-sky-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Investigation Status</h2>
            <p className="text-xs font-mono text-slate-500">Pipeline verification checkpoints</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Anomaly detected</span>
              <span className="text-slate-400 text-[10px] ml-auto">0.91 score</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Events correlated</span>
              <span className="text-slate-400 text-[10px] ml-auto">EV-204 + TEL</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Evidence retrieved</span>
              <span className="text-slate-400 text-[10px] ml-auto">4 sources</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Claims validated</span>
              <span className="text-slate-400 text-[10px] ml-auto">3 verified</span>
            </div>
          </div>

          <div className="pt-4 border-t border-sky-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Hypothesis Confidence:</span>
              <strong className="text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                MEDIUM
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Evidence Sufficiency:</span>
              <strong className="text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                PARTIAL
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">ML Isolation Forest:</span>
              <strong className="text-rose-600 font-bold">
                0.91 (HIGH)
              </strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAudit}
              className="w-full py-2.5 px-3 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-mono text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-sky-600" />
              <span>OPEN AUDIT TRAIL</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM: AI INVESTIGATION (Concise Answer + Collapsible Details)
      ======================================================== */}
      <div className="pt-6 border-t border-sky-100 space-y-6">
        {/* Toggle between standard inquiry and abstention showcase */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Evidence-Grounded AI Investigation</span>
            </h2>
            <p className="text-xs font-mono text-slate-500">Grounded inference based strictly on retrieved telemetry and procedures</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">INQUIRY:</span>
            <button
              onClick={() => setActiveQueryKey('why-battery-decrease')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeQueryKey === 'why-battery-decrease'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              "What happened?"
            </button>
            <button
              onClick={() => setActiveQueryKey('did-solar-array-break')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeQueryKey === 'did-solar-array-break'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              "Did solar array break?" (Abstention)
            </button>
          </div>
        </div>

        {/* Clean Investigation Result Box */}
        <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/20 p-6 space-y-6">
          {/* Question & Concise Summary */}
          <div>
            <div className="text-xs font-mono font-bold text-purple-700 uppercase tracking-wider">
              QUESTION
            </div>
            <div className="mt-1 text-lg font-bold text-slate-900">
              "{currentInvestigation.question}"
            </div>

            {/* Concise Answer */}
            <div className="mt-3 p-4 rounded-xl bg-white border border-purple-100 shadow-xs">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                SUMMARY ASSESSMENT
              </div>
              <p className="text-base text-slate-800 leading-relaxed font-sans">
                {activeQueryKey === 'why-battery-decrease'
                  ? 'Battery bus voltage dropped sharply to 24.8 V immediately following power configuration switch EV-204, which activated payload optical heaters while solar arrays experienced a 14.2° pointing drift during orbital terminator transition.'
                  : 'The available telemetry does NOT establish mechanical fracture or physical detachment of the solar arrays. Power output declined and pointing drifted, but structural acceleration and strain gauges remain within nominal limits. The system explicitly abstains from hypothesizing physical failure.'}
              </p>
            </div>
          </div>

          {/* Collapsible Sections (Progressive Disclosure) */}
          <div className="space-y-3 font-mono text-sm">
            {/* 1. OBSERVED FACTS (Expanded by default) */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('facts')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">01</span>
                  <span>OBSERVED FACTS</span>
                  <span className="text-xs font-normal text-slate-400">({currentInvestigation.observedFacts?.length || 0} telemetry points)</span>
                </span>
                {expandedSections.facts ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.facts && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs">
                  {currentInvestigation.observedFacts?.map((fact, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 rounded bg-slate-50 border border-slate-200 gap-2">
                      <span className="text-slate-800">✓ {fact.text}</span>
                      <button
                        onClick={() => onSelectEvidenceItem?.(fact.source)}
                        className="text-sky-700 hover:text-sky-900 underline font-bold shrink-0 cursor-pointer"
                      >
                        [{fact.source}]
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. CORRELATED EVENTS */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('events')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">02</span>
                  <span>CORRELATED EVENTS</span>
                  <span className="text-xs font-normal text-slate-400">({currentInvestigation.correlatedEvents?.length || 0} events)</span>
                </span>
                {expandedSections.events ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.events && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs">
                  {currentInvestigation.correlatedEvents?.map((evt, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 rounded bg-slate-50 border border-slate-200 gap-2">
                      <span className="text-slate-800">✓ {evt.text}</span>
                      <button
                        onClick={() => onSelectEvidenceItem?.(evt.source)}
                        className="text-sky-700 hover:text-sky-900 underline font-bold shrink-0 cursor-pointer"
                      >
                        [{evt.source}]
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. HISTORICAL CONTEXT */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('history')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">03</span>
                  <span>HISTORICAL CONTEXT</span>
                  <span className="text-xs font-normal text-slate-400">(INC-008 91% similarity)</span>
                </span>
                {expandedSections.history ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.history && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs">
                  {currentInvestigation.historicalContext?.map((hist, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2 rounded bg-slate-50 border border-slate-200 gap-2">
                      <span className="text-slate-800">{hist.text}</span>
                      <button
                        onClick={onViewSimilarIncidents}
                        className="text-purple-700 hover:text-purple-900 underline font-bold shrink-0 cursor-pointer"
                      >
                        [{hist.source} · {hist.similarity}]
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. HYPOTHESIS */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('hypothesis')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">04</span>
                  <span>HYPOTHESIS</span>
                  <span className="text-xs font-normal text-slate-400">(Confidence: {currentInvestigation.hypothesisConfidence || 'MEDIUM'})</span>
                </span>
                {expandedSections.hypothesis ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.hypothesis && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs text-slate-700">
                  <p className="p-3 bg-purple-50/40 rounded border border-purple-100">
                    {currentInvestigation.hypothesis}
                  </p>
                </div>
              )}
            </div>

            {/* 5. RECOMMENDATIONS */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('recommendations')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">05</span>
                  <span>SAFE RECOMMENDATIONS</span>
                  <span className="text-xs font-normal text-slate-400">(Flight procedure citations)</span>
                </span>
                {expandedSections.recommendations ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.recommendations && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs">
                  {currentInvestigation.recommendations?.map((rec) => (
                    <div key={rec.id} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{rec.stepNumber}. {rec.recommendation}</span>
                        <span className="text-sky-700 font-mono">[{rec.sourceTitle}]</span>
                      </div>
                      <div className="text-slate-500">{rec.rationale}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. MISSING EVIDENCE (What remains uncertain) */}
            <div className="border border-purple-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => toggleSection('missing')}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 hover:bg-purple-50/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-mono">06</span>
                  <span>MISSING EVIDENCE & UNCERTAINTIES</span>
                  <span className="text-xs font-normal text-amber-700">({currentInvestigation.missingEvidence?.length || 0} required sources)</span>
                </span>
                {expandedSections.missing ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
              </button>

              {expandedSections.missing && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100 space-y-2 text-xs text-slate-700">
                  <div className="p-3 bg-amber-50/50 rounded border border-amber-200 space-y-1.5">
                    <div className="font-bold text-amber-900">PENDING FLIGHT VERIFICATION:</div>
                    {currentInvestigation.missingEvidence?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-amber-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={onViewEvidence}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>VIEW EVIDENCE EXPLORER</span>
            </button>

            <button
              onClick={onViewSimilarIncidents}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-bold transition-all shadow-xs cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>VIEW SIMILAR INCIDENTS (INC-008)</span>
            </button>

            <button
              onClick={() => {
                setActiveQueryKey(
                  activeQueryKey === 'why-battery-decrease' ? 'did-solar-array-break' : 'why-battery-decrease'
                );
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold transition-all cursor-pointer ml-auto"
            >
              <HelpCircle className="h-4 w-4" />
              <span>
                {activeQueryKey === 'why-battery-decrease' ? 'TEST ABSTENTION: "Did Solar Array Break?"' : 'RETURN TO PRIMARY QUESTION'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
