import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, FileText, CheckCircle2, ArrowRight, Activity, Search, ShieldAlert } from 'lucide-react';

interface IncidentInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
  onMitigate?: () => void;
}

export const IncidentInvestigationModal: React.FC<IncidentInvestigationModalProps> = ({
  isOpen,
  onClose,
  incidentId = 'INC-024',
  onMitigate,
}) => {
  const [mitigated, setMitigated] = useState(false);

  if (!isOpen) return null;

  const handleApplyMitigation = () => {
    setMitigated(true);
    if (onMitigate) onMitigate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-rose-300 bg-white shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-200 bg-rose-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-rose-700 font-bold">
                <span>ACTIVE ANOMALY INVESTIGATION</span>
                <span className="text-slate-300">·</span>
                <span className="rounded bg-rose-100 px-1.5 py-0.5 border border-rose-300 text-rose-800">
                  CRITICAL · SEVERITY 1
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 tracking-wide">
                {incidentId}: Primary Bus Voltage Drop & Solar Drive Azimuth Drift
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 hover:bg-rose-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
          {/* Anomaly Score & Subsystem Impact Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3.5 shadow-xs">
              <div className="text-slate-500">TARGET SPACECRAFT</div>
              <div className="mt-1 text-base font-bold text-slate-900">ORBIT-X1 (LEO SSO)</div>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 shadow-xs">
              <div className="text-rose-700 font-bold">ML ANOMALY SCORE</div>
              <div className="mt-1 text-2xl font-bold text-rose-600">0.91 / 1.00</div>
              <div className="text-[10px] text-rose-600">LSTM & Isolation Forest Flag</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs">
              <div className="text-slate-500">AFFECTED SUBSYSTEM</div>
              <div className="mt-1 text-base font-bold text-amber-700">POWER (EPS) · CRITICAL</div>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3.5 shadow-xs">
              <div className="text-slate-500">INVESTIGATION STATUS</div>
              <div className="mt-1 text-base font-bold text-sky-700">EVIDENCE GROUNDED</div>
            </div>
          </div>

          {/* Root Cause AI Diagnosis */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-800">
              <Search className="h-4 w-4" />
              <span>DIAGNOSTIC ROOT CAUSE SUMMARY</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              At <strong>14:18:22 UTC</strong>, Solar Array Drive Assembly gimbal slip occurred during day/night terminator transition. The array was positioned at +14.2° off-nominal sun vector, reducing solar generation from 520 W to 310 W. Concurrently, secondary payload optical heater banks remained active, causing primary battery voltage to drain rapidly to <strong>24.80 V</strong> (threshold is 25.50 V).
            </p>
          </div>

          {/* Traceable Evidence Chain (Audit-Grounded Decision Support) */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-5 space-y-4 shadow-xs">
            <div className="font-mono text-xs font-bold text-sky-800">
              EVIDENCE TRACE CHAIN (VERIFIED ARTIFACTS):
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Evidence 1 */}
              <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-800 font-bold shrink-0">
                  [TEL-1032]
                </span>
                <div>
                  <div className="font-bold text-slate-900">Telemetry Waveform Drop</div>
                  <div className="text-slate-600 mt-0.5 text-[11px]">
                    Battery Bus 1 dropped from 28.45 V to 24.80 V at rate -0.18 V/min. Low voltage warning threshold breached.
                  </div>
                </div>
              </div>

              {/* Evidence 2 */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-3 shadow-xs">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800 font-bold shrink-0">
                  [EVT-894]
                </span>
                <div>
                  <div className="font-bold text-slate-900">Attitude SADA-1 Slip Event Log</div>
                  <div className="text-slate-600 mt-0.5 text-[11px]">
                    Stepper motor count deviation (+14.2°) logged by ADCS star tracker during terminator crossing.
                  </div>
                </div>
              </div>

              {/* Evidence 3 */}
              <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <span className="rounded bg-sky-100 px-2 py-0.5 text-sky-800 font-bold shrink-0">
                  [PRC-04]
                </span>
                <div>
                  <div className="font-bold text-slate-900">Approved Flight Procedure Section 3.2.1</div>
                  <div className="text-slate-600 mt-0.5 text-[11px]">
                    Emergency Load Shedding Checklist: Command deactivation of secondary payload optical heaters & re-sync SADA gimbal angle.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Support Mitigation Action */}
          <div className="rounded-xl border border-sky-300 bg-sky-50/60 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-800">
                  <ShieldCheck className="h-4 w-4" />
                  <span>RECOMMENDED DECISION SUPPORT MITIGATION</span>
                </div>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                  Execute flight procedure <strong>[PRC-04]</strong>: Inhibit secondary payload optical heater bank 2 (saves 140 W) and trigger SADA-1 sun-vector re-acquisition. Battery voltage will recover to nominal within 18 minutes.
                </p>
              </div>

              {!mitigated ? (
                <button
                  onClick={handleApplyMitigation}
                  className="rounded-xl bg-sky-500 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 shrink-0 self-start sm:self-auto"
                >
                  SIMULATE MITIGATION (EXECUTE PRC-04)
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-sky-100 px-4 py-2 border border-sky-400 font-mono text-xs text-sky-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-sky-600" />
                  <span>MITIGATION ACTIVE · RECOVERING</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-sky-200 bg-sky-50/70 px-6 py-3 font-mono text-xs text-slate-500">
          <span>HUMAN-IN-THE-LOOP · NO AUTONOMOUS SPACECRAFT ACTIONS EXECUTED</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-600 transition-colors shadow-xs"
          >
            CLOSE INVESTIGATION
          </button>
        </div>
      </div>
    </div>
  );
};
