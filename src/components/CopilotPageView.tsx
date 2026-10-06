import React, { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send,
  Eye,
  Layers,
  FileText,
  Shield,
  Zap,
} from 'lucide-react';
import { DetailDrawer } from './DetailDrawer';
import { PREBUILT_INVESTIGATIONS } from '../services/intelligenceEngine';

interface CopilotPageViewProps {
  onViewEvidence: () => void;
  onOpenAudit: () => void;
}

interface CustomResponseData {
  inquiry: string;
  status: 'GROUNDED' | 'PARTIAL' | 'ABSTAINED';
  verdictTitle: string;
  summary: string;
  facts: string[];
  missingEvidence?: string[];
  citations: string[];
  recommendedAction?: string;
}

export const CopilotPageView: React.FC<CopilotPageViewProps> = ({
  onViewEvidence,
  onOpenAudit,
}) => {
  const [selectedInquiry, setSelectedInquiry] = useState<string>('did-solar-array-break');
  const [customQuery, setCustomQuery] = useState('');
  const [dynamicResponse, setDynamicResponse] = useState<CustomResponseData | null>(null);

  const evaluateInquiry = (query: string): CustomResponseData => {
    const q = query.toLowerCase();

    if (q.includes('break') || q.includes('broken') || q.includes('crack') || q.includes('fracture') || q.includes('damage') || q.includes('debris')) {
      return {
        inquiry: query,
        status: 'ABSTAINED',
        verdictTitle: '⚠ INSUFFICIENT EVIDENCE (EXPLICIT REFUSAL TO SPECULATE)',
        summary: 'The copilot explicitly refuses to hypothesize physical mechanical breakage of the solar array or bus structure because no optical visual telemetry, strain gauge telemetry, or acoustic vibration signatures exist in the downlink packet stream.',
        facts: [
          'Battery voltage degraded from 28.5V to 24.8V following EV-204.',
          'Solar generation dropped from 520W to 310W coincident with array off-pointing angle of 14.2°.',
          'Attitude Determination and Control System (ADCS) reports 3-axis pointing error nominal at 0.18°.',
        ],
        missingEvidence: [
          'No strain gauge or structural deflection sensors on solar array yoke.',
          'No deployment latch release or mechanical hinge displacement flags.',
          'No external optical inspection camera frame downlinked.',
        ],
        citations: ['TEL-1030', 'EV-204', 'ADCS-001'],
        recommendedAction: 'Do not trigger emergency mechanical safe-hold. Perform SADA solar tracking recalibration per SOP P-017.',
      };
    }

    if (q.includes('battery') || q.includes('volt') || q.includes('drop') || q.includes('decrease') || q.includes('power')) {
      return {
        inquiry: query,
        status: 'PARTIAL',
        verdictTitle: 'GROUNDED EXPLANATION · ELECTRICAL POWER SUBSYSTEM (EPS)',
        summary: 'Primary power bus discharge was initiated 2 seconds following automated execution of switch matrix command EV-204, which energized auxiliary optical sensor payloads and thermal heaters during terminator transit.',
        facts: [
          'Bus 1 ADC sensor recorded 24.80V at 14:32:05 UTC (TEL-1032).',
          'Switch matrix command EV-204 was executed at 14:31:58 UTC (Spacecraft Command Log LogEntry #204).',
          'S-Band transmitter throttled RF power amplifier from 22W to 7W to preserve DC bus balance.',
          'Historical precedent INC-008 recorded an identical 24.6V bus sag resolved nominally by shedding heater bank.',
        ],
        citations: ['TEL-1032', 'EV-204', 'COM-401', 'P-017', 'INC-008'],
        recommendedAction: 'Execute Flight Procedure P-017 Step 2 to isolate secondary payload switch matrix relays.',
      };
    }

    if (q.includes('command') || q.includes('uplink') || q.includes('send') || q.includes('control') || q.includes('execute')) {
      return {
        inquiry: query,
        status: 'ABSTAINED',
        verdictTitle: 'AIR-GAP SAFETY RESTRICTION · READ-ONLY ADVISORY ENGINE',
        summary: 'The Mission Operations Copilot operates strictly in read-only decision support mode. It contains zero uplink sockets, zero cryptographic signing keys, and zero autonomous command path to ORBIT-X1 or SENTINEL-B2.',
        facts: [
          'CCSDS Telecommand formatters are physically and logically air-gapped from this interface.',
          'All mitigation recommendations require certified Human-in-the-Loop Flight Director authentication.',
          'Every reasoning step is cryptographically audited to SHA-256 ledger.',
        ],
        citations: ['GOV-SAFE-01', 'CCSDS-SDLS-TC', 'AUD-8841'],
        recommendedAction: 'Direct operational command actions must be authenticated through ground station mission console.',
      };
    }

    if (q.includes('procedure') || q.includes('p-017') || q.includes('recover') || q.includes('mitigat')) {
      return {
        inquiry: query,
        status: 'GROUNDED',
        verdictTitle: 'VERIFIED FLIGHT PROCEDURE RECOMMENDATION (P-017)',
        summary: 'Flight Procedure P-017 (Electrical Power Subsystem Emergency Recovery, Rev 4.2) specifies an immediate 4-step contingency protocol to recover nominal bus potential within 18 minutes.',
        facts: [
          'Step 1: Inhibit automated autonomous payload heaters on Bus 1.',
          'Step 2: Re-open switch matrix relay EV-204 to shed non-essential load.',
          'Step 3: Commanded SADA drive to sun-vector lock mode.',
          'Step 4: Verify carrier downlink returns to -51.8 dBm.',
        ],
        citations: ['P-017', 'TEL-1032', 'INC-008'],
        recommendedAction: 'Present P-017 checklist to certified operator for formal sign-off.',
      };
    }

    // Default dynamic answer
    return {
      inquiry: query,
      status: 'GROUNDED',
      verdictTitle: 'MULTI-SENSOR TELEMETRY CORRELATION',
      summary: `Inquiry assessed against live calibrated sensor downlinks for ORBIT-X1. Telemetry confirms EPS Bus 1 voltage at 24.80V, RF carrier at -57.2 dBm, TCS core temperature at 43.2°C, and ADCS pointing error at 0.18°.`,
      facts: [
        'Calibrated sensor packet PKT-X1-8830 validated over 2.2 GHz S-band.',
        'Zero unauthorized RF command injections detected by FPGA crypto engine.',
        'Similar historical precedent INC-008 shares 91% vector cosine similarity with current profile.',
      ],
      citations: ['TEL-1032', 'COM-401', 'EV-204', 'INC-008'],
      recommendedAction: 'Review full evidence chain in Evidence Explorer or inspect audit ledger.',
    };
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    const resp = evaluateInquiry(customQuery.trim());
    setDynamicResponse(resp);
    setSelectedInquiry('custom');
  };

  const handleSelectPreset = (key: string) => {
    setSelectedInquiry(key);
    setDynamicResponse(null);
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Brain className="h-4 w-4" />
            <span>AI COPILOT INVESTIGATION WORKBENCH</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Grounded Reasoning & Explicit Abstention
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Submit mission-control inquiries to test multi-turn evidence grounding, claim verification, and explicit refusal to speculate without mechanical telemetry.
          </p>
        </div>

        <button
          onClick={onOpenAudit}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-mono text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5 text-sky-600" />
          <span>VIEW AUDIT LOG</span>
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleCustomSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask copilot: e.g. 'Did the solar array break?' or 'What is procedure P-017?' or 'Can AI uplink commands?'"
            className="w-full px-4 py-3 pl-11 rounded-xl border border-sky-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all font-sans shadow-xs"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-4 top-3.5" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold tracking-wider transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-2 shrink-0"
        >
          <span>EVALUATE</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Preset Inquiries Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
        <span className="text-slate-400 font-bold mr-1">PRESET INQUIRIES:</span>
        <button
          onClick={() => handleSelectPreset('did-solar-array-break')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            selectedInquiry === 'did-solar-array-break'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-sky-200 text-slate-700 hover:bg-purple-50'
          }`}
        >
          "Did the solar array physically break?" (Abstention)
        </button>
        <button
          onClick={() => handleSelectPreset('why-battery-decrease')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            selectedInquiry === 'why-battery-decrease'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-sky-200 text-slate-700 hover:bg-purple-50'
          }`}
        >
          "Why did battery voltage decrease?" (Partial Evidence)
        </button>
        <button
          onClick={() => handleSelectPreset('flight-recovery-p017')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            selectedInquiry === 'flight-recovery-p017'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-sky-200 text-slate-700 hover:bg-purple-50'
          }`}
        >
          "What is flight procedure P-017?" (SOP Guide)
        </button>
        <button
          onClick={() => handleSelectPreset('zero-command-path')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            selectedInquiry === 'zero-command-path'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-sky-200 text-slate-700 hover:bg-purple-50'
          }`}
        >
          "Can copilot uplink commands directly?" (Air-Gap)
        </button>
      </div>

      {/* ========================================================
          RESULT VIEWPORT: Dynamic response or Selected Preset
      ======================================================== */}
      {(() => {
        const activeData =
          selectedInquiry === 'custom' && dynamicResponse
            ? dynamicResponse
            : evaluateInquiry(
                selectedInquiry === 'did-solar-array-break'
                  ? 'Did the solar array physically break?'
                  : selectedInquiry === 'why-battery-decrease'
                  ? 'Why did battery voltage decrease?'
                  : selectedInquiry === 'flight-recovery-p017'
                  ? 'What is recovery procedure P-017?'
                  : 'Can AI uplink commands directly?'
              );

        const isAbstain = activeData.status === 'ABSTAINED';

        return (
          <div
            className={`rounded-2xl border-2 p-8 shadow-sm space-y-6 ${
              isAbstain
                ? 'border-amber-300 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70'
                : 'border-sky-300 bg-gradient-to-r from-sky-50/70 via-white to-sky-50/70'
            }`}
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl text-white shadow-md shrink-0 ${
                  isAbstain ? 'bg-amber-500 shadow-amber-500/25' : 'bg-sky-600 shadow-sky-600/25'
                }`}
              >
                {isAbstain ? <AlertTriangle className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isAbstain ? 'text-amber-800' : 'text-sky-800'
                  }`}
                >
                  EVALUATION RESULT · {activeData.status}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  {activeData.verdictTitle}
                </h2>
                <p className="text-base text-slate-700 font-sans leading-relaxed pt-1 max-w-3xl">
                  {activeData.summary}
                </p>
              </div>
            </div>

            {/* Facts and Missing Evidence Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              {/* FACTS KNOWN */}
              <div className="p-5 rounded-xl bg-white border border-emerald-200 space-y-3 shadow-xs">
                <div className="text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>FACTS ESTABLISHED (VERIFIED TELEMETRY)</span>
                </div>
                <div className="space-y-2 text-slate-700">
                  {activeData.facts.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MISSING EVIDENCE OR RECOMMENDED ACTION */}
              {activeData.missingEvidence && activeData.missingEvidence.length > 0 ? (
                <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-3 shadow-xs">
                  <div className="text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    <span>EXPLICITLY MISSING EVIDENCE (REFUSAL BASIS)</span>
                  </div>
                  <div className="space-y-2 text-slate-700">
                    {activeData.missingEvidence.map((m, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">✗</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-white border border-sky-200 space-y-3 shadow-xs">
                  <div className="text-sky-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-sky-600" />
                    <span>RECOMMENDED OPERATIONAL GUIDANCE</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans text-xs">
                    {activeData.recommendedAction}
                  </p>
                  <div className="text-emerald-700 font-bold text-[11px]">
                    Zero Autonomous Command Uplink · Operator Sign-Off Required
                  </div>
                </div>
              )}
            </div>

            {/* Citations & Actions Strip */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-bold">GROUNDED CITATIONS:</span>
                {activeData.citations.map((c, i) => (
                  <span
                    key={i}
                    onClick={onViewEvidence}
                    className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 font-bold hover:bg-sky-200 cursor-pointer transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onViewEvidence}
                  className="px-4 py-2 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-bold transition-all cursor-pointer shadow-xs"
                >
                  Inspect Evidence in RAG →
                </button>
                <button
                  onClick={onOpenAudit}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer shadow-xs"
                >
                  Verify SHA-256 Audit Seal
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
