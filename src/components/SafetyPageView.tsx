import React from 'react';
import {
  Shield,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Lock,
  UserCheck,
  FileText,
  Search,
  HelpCircle,
  Cpu,
} from 'lucide-react';

export const SafetyPageView: React.FC = () => {
  return (
    <div className="space-y-10 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
          <Shield className="h-4 w-4" />
          <span>SAFETY & GOVERNANCE ARCHITECTURE</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          System Guardrails & Flight Boundaries
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Architectural boundaries guaranteeing human-in-the-loop authority and zero unsupervised execution on flight hardware.
        </p>
      </div>

      {/* Large Prominent Banner (Section 13) */}
      <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-white to-rose-50 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30 shrink-0">
            <AlertOctagon className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-widest">
              HARDWARE SAFETY PROTOCOL · AIR-GAPPED COMMAND INTERFACE
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              DECISION SUPPORT ONLY
            </h2>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-rose-600 tracking-tight">
              NO SPACECRAFT COMMAND EXECUTION
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-sans max-w-3xl pt-1">
              The Mission Operations Copilot operates exclusively over read-only downlink telemetry streams. It possesses zero network sockets, cryptographic keys, or CCSDS telecommand formatters to generate, sign, or dispatch radio frequency uplinks to ORBIT-X1 or SENTINEL-B2.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars (Section 13) */}
      <div className="space-y-4">
        <div className="border-b border-sky-100 pb-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Five Pillars of Operational Flight Safety</h3>
          <p className="text-xs font-mono text-slate-500">Rigorous principles safeguarding orbital assets from hallucinations and errors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 font-sans">
          {/* 1. Evidence Grounding */}
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-sky-100 text-sky-700 font-bold">
                <Search className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                ACTIVE
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">1. Evidence Grounding</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every inference must link back to a verified telemetry packet (e.g. TEL-1032), mission event (EV-204), or approved flight procedure (P-017). Unsubstantiated speculation is prohibited.
            </p>
          </div>

          {/* 2. Human in the Loop */}
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-sky-100 text-sky-700 font-bold">
                <UserCheck className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                ENFORCED
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">2. Human in the Loop</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All incident assessments and procedure recommendations are presented as advisory guidance. A certified flight operations engineer must review, authenticate, and execute any operational action.
            </p>
          </div>

          {/* 3. Claim Validation */}
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-sky-100 text-sky-700 font-bold">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                AUTOMATED
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">3. Claim Validation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generative outputs undergo post-processing claim extraction and verification. Statements without direct sensor support are flagged as <em>NOT ESTABLISHED</em> or downgraded in confidence.
            </p>
          </div>

          {/* 4. Abstention */}
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-700 font-bold">
                <HelpCircle className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                CALIBRATED
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">4. Explicit Abstention</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When required telemetry is absent (such as physical structural strain gauges during an inquiry about array damage), the copilot explicitly abstains rather than making probabilistic guesses.
            </p>
          </div>

          {/* 5. Audit Trail */}
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-sky-100 text-sky-700 font-bold">
                <FileText className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                SEALED
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">5. Audit Trail</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every inference query, retrieved document chunk, and operator response is recorded in an immutable chronological ledger with SHA-256 cryptographic digests for post-flight incident reviews.
            </p>
          </div>

          {/* Read-Only Boundary Architecture */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-slate-200 text-slate-700 font-bold">
                <Lock className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs font-bold text-slate-600">AIR-GAPPED</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">Read-Only Telemetry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero telecommand transmission pipeline. Uplink cryptographic hardware modules remain strictly physically isolated from the analytics network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
