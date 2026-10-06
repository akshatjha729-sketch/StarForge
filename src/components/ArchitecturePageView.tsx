import React from 'react';
import {
  Layers,
  Activity,
  Search,
  Brain,
  UserCheck,
  FileText,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { DataDecisionLineage } from './DataDecisionLineage';

interface ArchitecturePageViewProps {
  onNavigateToTab: (tabKey: any) => void;
}

export const ArchitecturePageView: React.FC<ArchitecturePageViewProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>ADVANCED ARCHITECTURE</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          End-to-End Decision Lineage & Directed Acyclic Graph (DAG)
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Complete data flow from telemetry ingestion through unsupervised isolation forest, event correlation, dense retrieval, and human sign-off.
        </p>
      </div>

      {/* DAG Lineage Visualization */}
      <DataDecisionLineage
        onNodeClick={(nodeKey) => {
          if (nodeKey === 'telemetry') onNavigateToTab('telemetry');
          else if (nodeKey === 'ml' || nodeKey === 'incident') onNavigateToTab('investigation');
          else if (nodeKey === 'rag') onNavigateToTab('evidence');
          else if (nodeKey === 'ai' || nodeKey === 'operator') onNavigateToTab('audit');
        }}
      />

      {/* Flow Summary */}
      <div className="p-6 rounded-2xl border border-sky-200 bg-sky-50/30 space-y-3 font-mono text-xs">
        <div className="font-bold text-slate-900 uppercase">SYSTEM ARCHITECTURE GUARANTEES:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-slate-700">
          <div className="p-3 bg-white rounded-xl border border-sky-200">
            <strong className="text-sky-800">1. Signal Ingestion:</strong>
            <p className="text-slate-500 mt-1">Calibrated ADC sensors and telemetry decoders operating at 1.5s cadence.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-sky-200">
            <strong className="text-purple-800">2. RAG & Grounding:</strong>
            <p className="text-slate-500 mt-1">Hybrid BM25 keyword matching + dense vector similarity with cross-encoder rerank.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-sky-200">
            <strong className="text-emerald-800">3. Human Sign-Off:</strong>
            <p className="text-slate-500 mt-1">Advisory outputs strictly air-gapped from spacecraft command uplink queues.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
