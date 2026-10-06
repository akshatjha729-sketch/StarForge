import React from 'react';
import {
  AlertTriangle,
  GitBranch,
  Search,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { PipelineStageKey } from '../types/intelligence';

interface MissionIntelligencePipelineProps {
  activeStage?: PipelineStageKey;
  onSelectStage?: (stage: PipelineStageKey) => void;
}

export const MissionIntelligencePipeline: React.FC<MissionIntelligencePipelineProps> = ({
  activeStage = 'DETECT',
  onSelectStage,
}) => {
  const stages: Array<{
    key: PipelineStageKey;
    step: string;
    label: string;
    statusText: string;
    icon: React.ReactNode;
    color: string;
    sectionId: string;
  }> = [
    {
      key: 'DETECT',
      step: '01',
      label: 'DETECT',
      statusText: '✓ ANOMALY DETECTED',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'text-rose-600 border-rose-300 bg-rose-50',
      sectionId: 'sec-anomaly-ml',
    },
    {
      key: 'CORRELATE',
      step: '02',
      label: 'CORRELATE',
      statusText: '✓ EVENTS CORRELATED',
      icon: <GitBranch className="h-4 w-4" />,
      color: 'text-amber-600 border-amber-300 bg-amber-50',
      sectionId: 'sec-event-correlation',
    },
    {
      key: 'RETRIEVE',
      step: '03',
      label: 'RETRIEVE',
      statusText: '✓ PROCEDURES RETRIEVED',
      icon: <Search className="h-4 w-4" />,
      color: 'text-sky-700 border-sky-300 bg-sky-50',
      sectionId: 'sec-rag-retrieval',
    },
    {
      key: 'COMPARE',
      step: '04',
      label: 'COMPARE',
      statusText: '✓ HISTORY SEARCHED',
      icon: <BookOpen className="h-4 w-4" />,
      color: 'text-indigo-600 border-indigo-300 bg-indigo-50',
      sectionId: 'sec-historical-incidents',
    },
    {
      key: 'EXPLAIN',
      step: '05',
      label: 'EXPLAIN',
      statusText: '✓ EVIDENCE RANKED',
      icon: <Brain className="h-4 w-4" />,
      color: 'text-purple-600 border-purple-300 bg-purple-50',
      sectionId: 'sec-investigation-console',
    },
    {
      key: 'VALIDATE',
      step: '06',
      label: 'VALIDATE',
      statusText: '✓ CLAIMS VALIDATED',
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: 'text-emerald-600 border-emerald-300 bg-emerald-50',
      sectionId: 'sec-claim-validation',
    },
    {
      key: 'RECOMMEND',
      step: '07',
      label: 'RECOMMEND',
      statusText: '✓ SAFE GUIDANCE',
      icon: <ShieldCheck className="h-4 w-4" />,
      color: 'text-cyan-600 border-cyan-300 bg-cyan-50',
      sectionId: 'sec-recommendations',
    },
    {
      key: 'AUDIT',
      step: '08',
      label: 'AUDIT',
      statusText: '✓ AUDIT TRAIL LOCKED',
      icon: <FileText className="h-4 w-4" />,
      color: 'text-slate-600 border-slate-300 bg-slate-100',
      sectionId: 'sec-audit-trail',
    },
  ];

  const handleStageClick = (stageKey: PipelineStageKey, sectionId: string) => {
    if (onSelectStage) onSelectStage(stageKey);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
              PIPELINE INTELLIGENCE ARCHITECTURE
            </span>
            <span className="rounded-full bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800">
              8-STAGE EVIDENCE VERIFICATION
            </span>
          </div>
          <h2 className="mt-1 font-display text-lg font-bold text-slate-900 tracking-wide">
            MISSION INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Turning spacecraft signals into evidence-grounded investigations.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-500">
          STATUS: <span className="text-emerald-600 font-bold">ALL STAGES OPERATIONAL</span>
        </div>
      </div>

      {/* Visual Pipeline Progression (Horizontal on desktop, responsive wrap) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {stages.map((stage, idx) => {
          const isSelected = activeStage === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => handleStageClick(stage.key, stage.sectionId)}
              className={`group relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all hover:scale-[1.02] cursor-pointer ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/80 shadow-md ring-2 ring-sky-400/50'
                  : 'border-sky-200 bg-white hover:border-sky-300 hover:bg-slate-50/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-600">
                  <span>{stage.step}</span>
                  <span className={`p-1 rounded-md ${stage.color}`}>{stage.icon}</span>
                </div>
                <div className="mt-2 font-display text-xs font-bold text-slate-900 tracking-wide">
                  {stage.label}
                </div>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-1.5 font-mono text-[9px] font-bold text-emerald-700">
                {stage.statusText}
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-sky-300 pointer-events-none">
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
