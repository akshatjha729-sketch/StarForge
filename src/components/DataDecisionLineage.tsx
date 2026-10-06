import React from 'react';
import { ArrowRight, Database, Activity, AlertTriangle, Search, CheckCircle2, ShieldCheck, FileText, Sparkles } from 'lucide-react';

interface DataDecisionLineageProps {
  onNodeClick?: (nodeKey: string) => void;
}

export const DataDecisionLineage: React.FC<DataDecisionLineageProps> = ({ onNodeClick }) => {
  const lineageSteps = [
    { key: 'telemetry', label: 'Telemetry', sub: 'TEL-1032 (24.8V)', icon: <Database className="h-3.5 w-3.5" />, sectionId: 'sec-telemetry' },
    { key: 'ml', label: 'ML Detection', sub: 'Isolation Forest (0.91)', icon: <Activity className="h-3.5 w-3.5" />, sectionId: 'sec-anomaly-ml' },
    { key: 'incident', label: 'Incident', sub: 'INC-024 Synthesized', icon: <AlertTriangle className="h-3.5 w-3.5" />, sectionId: 'sec-active-incident' },
    { key: 'retrieved', label: 'Retrieved Evidence', sub: 'RAG Hybrid (P-017)', icon: <Search className="h-3.5 w-3.5" />, sectionId: 'sec-rag-retrieval' },
    { key: 'claim', label: 'AI Claim', sub: 'Decomposed Propositions', icon: <Sparkles className="h-3.5 w-3.5" />, sectionId: 'sec-claim-validation' },
    { key: 'validation', label: 'Validation', sub: 'Telemetry Grounding', icon: <CheckCircle2 className="h-3.5 w-3.5" />, sectionId: 'sec-claim-validation' },
    { key: 'recommendation', label: 'Recommendation', sub: 'Decision Support Only', icon: <ShieldCheck className="h-3.5 w-3.5" />, sectionId: 'sec-recommendations' },
    { key: 'audit', label: 'Audit', sub: 'Cryptographic Hash Log', icon: <FileText className="h-3.5 w-3.5" />, sectionId: 'sec-audit-trail' },
  ];

  const handleClick = (key: string, sectionId: string) => {
    if (onNodeClick) onNodeClick(key);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rounded-xl border border-sky-300 bg-white p-4 shadow-sm shadow-sky-100/60 font-sans">
      <div className="flex items-center justify-between border-b border-sky-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-sky-800">
            DATA → DECISION LINEAGE
          </span>
          <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] text-sky-800 font-bold">
            CLICKABLE TRACEABILITY FLOW
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          End-to-End Cryptographically Bound
        </span>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {lineageSteps.map((step, idx) => (
          <React.Fragment key={step.key}>
            <button
              onClick={() => handleClick(step.key, step.sectionId)}
              className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-1.5 font-mono text-xs text-left hover:border-sky-400 hover:bg-sky-100/60 transition-all cursor-pointer shadow-2xs"
            >
              <span className="text-sky-700">{step.icon}</span>
              <div>
                <div className="font-bold text-slate-900 text-[11px] leading-tight">{step.label}</div>
                <div className="text-[9px] text-slate-500">{step.sub}</div>
              </div>
            </button>

            {idx < lineageSteps.length - 1 && (
              <ArrowRight className="h-3.5 w-3.5 text-sky-400 shrink-0 hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
