import React from 'react';
import {
  Satellite,
  Activity,
  Search,
  BookOpen,
  Brain,
  FileText,
  Layers,
  ArrowRight,
  Shield,
  Eye,
} from 'lucide-react';
import { GuidedDemoController } from './GuidedDemoController';
import { ActiveInvestigationCard } from './ActiveInvestigationCard';
import { MissionIntelligencePipeline } from './MissionIntelligencePipeline';
import { RealisticSpacecraftCanvas, SubsystemStatus } from './RealisticSpacecraftCanvas';
import { TelemetryPoint } from '../types';
import { TabKey } from '../App';
import { PipelineStageKey } from '../types/intelligence';

interface HomeViewProps {
  currentTelX1: TelemetryPoint;
  incidentId: string;
  isIncidentActive: boolean;
  anomalyScore: number;
  calculatedHealthPercent: number;
  currentSubsystems: Record<string, SubsystemStatus>;
  activePipelineStage: PipelineStageKey;
  onSelectTab: (tab: TabKey) => void;
  onSelectPipelineStage: (stage: PipelineStageKey) => void;
  onDemoStepChange: (stepIdx: number, stepLabel: string) => void;
  onTriggerInvestigation: () => void;
  onTriggerAbstention: () => void;
  onOpenInspect: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentTelX1,
  incidentId,
  isIncidentActive,
  anomalyScore,
  calculatedHealthPercent,
  currentSubsystems,
  activePipelineStage,
  onSelectTab,
  onSelectPipelineStage,
  onDemoStepChange,
  onTriggerInvestigation,
  onTriggerAbstention,
  onOpenInspect,
}) => {
  const workflowCards: Array<{
    tab: TabKey;
    step: string;
    title: string;
    desc: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      tab: 'spacecraft',
      step: 'TAB 2',
      title: '3D Spacecraft Health',
      desc: 'Physical digital twin, 5 subsystem loops, and 5-stage critical incident replay.',
      badge: `${calculatedHealthPercent}% HEALTH`,
      icon: Satellite,
    },
    {
      tab: 'investigation',
      step: 'TAB 3',
      title: 'Investigation Console',
      desc: 'Evidence-grounded hypothesis testing, procedure citations, and safety boundaries.',
      badge: 'DECISION SUPPORT',
      icon: Brain,
    },
    {
      tab: 'anomaly',
      step: 'TAB 4',
      title: 'ML Anomaly & Events',
      desc: 'Isolation Forest scoring, baseline delta, and multi-stream timeline correlation.',
      badge: '0.91 PROBABILITY',
      icon: Activity,
    },
    {
      tab: 'evidence',
      step: 'TAB 5',
      title: 'Evidence & RAG',
      desc: 'Hybrid BM25 + semantic retrieval grounded against flight SOPs with claim validation.',
      badge: '4 VERIFIED CLAIMS',
      icon: Search,
    },
    {
      tab: 'history',
      step: 'TAB 6',
      title: 'Similar Incidents',
      desc: 'Historical incident intelligence (INC-008 91%, INC-013 76%) with precedents.',
      badge: '2 MATCHES FOUND',
      icon: BookOpen,
    },
    {
      tab: 'audit',
      step: 'TAB 7',
      title: 'Lineage & Audit Trail',
      desc: 'Traceable data-to-decision lineage and SHA-256 tamper-evident operator logs.',
      badge: 'CRYPTOGRAPHIC AUDIT',
      icon: FileText,
    },
    {
      tab: 'telemetry',
      step: 'TAB 8',
      title: 'Telemetry & Fleet',
      desc: 'Raw sensor waveforms, oscilloscope, orbit ground tracks, and anti-hack diagnostics.',
      badge: 'FOUNDATIONAL FEEDS',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Product Positioning Banner */}
      <div className="rounded-2xl border-2 border-sky-300 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-6 shadow-sm shadow-sky-100/60 font-sans">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-700 uppercase tracking-widest">
                MISSION OPERATIONS COPILOT
              </span>
              <span className="text-slate-300">·</span>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-800 border border-rose-200 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping inline-block" />
                ACTIVE INVESTIGATION
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
              Evidence-Grounded Spacecraft Health Investigation
            </h1>
            <div className="mt-1.5 font-mono text-xs font-bold text-sky-800 tracking-wider">
              FROM TELEMETRY TO EVIDENCE-GROUNDED DECISIONS
            </div>
            <p className="mt-1.5 text-xs text-slate-600 max-w-3xl leading-relaxed">
              Detect anomalies, correlate mission events, retrieve relevant procedures and historical incidents, validate AI claims, and guide human operators through safe investigation.
            </p>
          </div>

          <div className="rounded-xl border border-sky-300 bg-white p-3.5 shadow-xs font-mono text-xs">
            <div className="text-[10px] text-slate-400 font-bold">SPACECRAFT CONTEXT</div>
            <div className="mt-0.5 font-bold text-slate-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>ORBIT-X1 · SYSTEM ONLINE</span>
            </div>
            <div className="text-[10px] text-sky-700 font-semibold">SIMULATION MODE ACTIVE</div>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5 text-sky-800 font-semibold">
            <Shield className="h-3.5 w-3.5 text-sky-600" />
            <span>ZERO AUTONOMOUS COMMANDING: Decision support only. All flight actions require human signoff.</span>
          </div>
          <span className="text-slate-400 text-[11px]">CCSDS SDLS Telemetry Stream</span>
        </div>
      </div>

      {/* 2. Hackathon 1-Click Guided Demo Controller */}
      <GuidedDemoController
        onStepChange={onDemoStepChange}
        onTriggerAbstention={onTriggerAbstention}
        onTriggerInvestigation={onTriggerInvestigation}
      />

      {/* 3. Active Investigation Hero Card */}
      <ActiveInvestigationCard
        incidentId={incidentId}
        title="Battery Voltage Degradation Following Power Configuration Event"
        anomalyScore={anomalyScore}
        evidenceSufficiency="PARTIAL"
        whyFlagged="Battery voltage deviated significantly from baseline (-0.42 V/min) and was temporally correlated with power configuration event EV-204."
        onInvestigate={() => onSelectTab('investigation')}
        onViewEvidence={() => onSelectTab('evidence')}
        onStartDemo={() => onDemoStepChange(0, 'reset')}
      />

      {/* 4. Mission Intelligence Pipeline */}
      <MissionIntelligencePipeline
        activeStage={activePipelineStage}
        onSelectStage={onSelectPipelineStage}
      />

      {/* 5. Spacecraft Health At-A-Glance Preview */}
      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm shadow-sky-100/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-700 font-semibold">
              <Satellite className="h-3.5 w-3.5 text-sky-600" />
              <span>ORBITAL ASSET PHYSICAL HEALTH SNAPSHOT</span>
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-slate-900">
              ORBIT-X1 Subsystem Health Overview
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('spacecraft')}
            className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3.5 py-2 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
          >
            <span>OPEN 3D SPACECRAFT STUDIO (TAB 2)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 h-[260px] rounded-xl overflow-hidden border border-sky-200">
            <RealisticSpacecraftCanvas
              telemetry={currentTelX1}
              satelliteId="ORBIT-X1"
              isIncidentActive={isIncidentActive}
              incidentId={incidentId}
              incidentSeverity="CRITICAL"
              onOpenIncident={() => onSelectTab('investigation')}
              onInspectSpacecraft={onOpenInspect}
              anomalyScore={anomalyScore}
            />
          </div>

          <div className="lg:col-span-5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <span className="font-bold text-slate-800">5 SUBSYSTEMS STATUS</span>
              <span className="font-bold text-rose-600">{calculatedHealthPercent}% HEALTH</span>
            </div>
            {Object.values(currentSubsystems).map((sub) => (
              <div
                key={sub.key}
                className="flex items-center justify-between p-2 rounded-lg border border-sky-100 bg-sky-50/30"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      sub.status === 'CRITICAL'
                        ? 'bg-rose-500'
                        : sub.status === 'WARNING'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-semibold text-slate-900">{sub.name.split(' (')[0]}</span>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    sub.status === 'CRITICAL'
                      ? 'text-rose-700'
                      : sub.status === 'WARNING'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {sub.metric1Val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Investigation Workflow Sections Hub */}
      <div>
        <div className="flex items-center justify-between mb-3 font-mono text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            DEDICATED INVESTIGATION SECTIONS (CLICK TO OPEN INDIVIDUAL TAB)
          </span>
          <span className="text-slate-400">7 SPECIALIZED MODULES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.tab}
                onClick={() => onSelectTab(card.tab)}
                className="group rounded-xl border border-sky-200 bg-white p-4.5 hover:border-sky-400 hover:shadow-md hover:shadow-sky-100/70 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                      {card.step}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-500">
                      {card.badge}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between font-mono text-xs text-sky-600 font-bold group-hover:text-sky-700">
                  <span>VIEW SECTION</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
