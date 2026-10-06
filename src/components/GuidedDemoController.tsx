import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface GuidedDemoControllerProps {
  onStepChange?: (stepIndex: number, stepLabel: string) => void;
  onTriggerAbstention?: () => void;
  onTriggerInvestigation?: () => void;
}

export const DEMO_STEPS = [
  { time: '00:00', label: 'Telemetry Normal', detail: 'Primary bus at 28.5V, solar 520W. All nominal envelopes satisfied.' },
  { time: '00:05', label: 'Power Config Event', detail: 'Command EV-204 executed: Secondary payload heaters switched online.' },
  { time: '00:08', label: 'Battery Begins Degrading', detail: 'Bus voltage begins declining at rate -0.42 V/min as orbital night approaches.' },
  { time: '00:11', label: 'Critical Battery Voltage', detail: 'Voltage breaches 25.5V flight safety envelope, declining to 24.8V.' },
  { time: '00:13', label: 'Communication Degradation', detail: 'RF power amplifier throttles back output; comms link latency increases.' },
  { time: '00:17', label: 'ML Anomaly Detection', detail: 'Isolation Forest flags outlier score 0.91 (significant envelope deviation).' },
  { time: '00:18', label: 'Incident Correlation', detail: 'Copilot correlates EV-204 command timestamp with voltage inflection.' },
  { time: '00:20', label: 'INC-024 Created', detail: 'High-priority incident synthesized with temporal correlation flags.' },
  { time: '00:22', label: 'Evidence Retrieval', detail: 'Hybrid BM25 + Semantic search retrieves P-017 (94%) and INC-008 (91%).' },
  { time: '00:25', label: 'AI Investigation Ready', detail: 'Structured hypotheses generated; claim validator rejects unproven causation.' },
];

export const GuidedDemoController: React.FC<GuidedDemoControllerProps> = ({
  onStepChange,
  onTriggerAbstention,
  onTriggerInvestigation,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (onStepChange) onStepChange(next, DEMO_STEPS[next].label);
          return next;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, onStepChange]);

  const handleSelectStep = (idx: number) => {
    setCurrentStep(idx);
    setIsPlaying(false);
    if (onStepChange) onStepChange(idx, DEMO_STEPS[idx].label);
  };

  const handleStartPlay = () => {
    if (currentStep >= DEMO_STEPS.length - 1) {
      setCurrentStep(0);
      if (onStepChange) onStepChange(0, DEMO_STEPS[0].label);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (onStepChange) onStepChange(0, DEMO_STEPS[0].label);
  };

  return (
    <div className="rounded-xl border-2 border-sky-400 bg-linear-to-r from-sky-50 via-white to-sky-50 p-4 shadow-md shadow-sky-100/70 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-sky-800 flex items-center gap-2">
              <span>HACKATHON JUDGE DEMO MODE</span>
              <span className="rounded-full bg-sky-200 px-2 py-0.2 text-[10px] text-sky-900 font-bold">
                1-CLICK PIPELINE SIMULATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Auto-advances through the full end-to-end intelligence sequence from nominal telemetry to safe grounded abstention.
            </p>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handleStartPlay}
              className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>START DEMO WALKTHROUGH</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
            >
              <Pause className="h-3.5 w-3.5 fill-white" />
              <span>PAUSE DEMO</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="rounded-lg border border-sky-300 bg-white p-1.5 text-slate-600 hover:text-slate-900 hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
            title="Reset to 00:00"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="mt-3.5 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-[700px]">
          {DEMO_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStep;
            const isPast = idx < currentStep;
            return (
              <button
                key={step.time}
                onClick={() => handleSelectStep(idx)}
                className={`flex-1 rounded-lg p-2 text-left transition-all border font-mono text-xs cursor-pointer ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300'
                    : isPast
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'
                }`}
              >
                <div className="text-[10px] font-bold opacity-80">{step.time}</div>
                <div className="text-[11px] font-bold truncate">{step.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Details & Quick Question Triggers */}
      <div className="mt-3 rounded-lg border border-sky-200 bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
        <div>
          <div className="font-mono text-xs font-bold text-sky-800">
            CURRENT STEP [{DEMO_STEPS[currentStep].time}]: {DEMO_STEPS[currentStep].label}
          </div>
          <p className="text-slate-600 text-xs mt-0.5">
            {DEMO_STEPS[currentStep].detail}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          {onTriggerInvestigation && (
            <button
              onClick={onTriggerInvestigation}
              className="rounded-md border border-sky-300 bg-sky-50 px-2.5 py-1.5 font-bold text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
            >
              Ask "What happened?"
            </button>
          )}
          {onTriggerAbstention && (
            <button
              onClick={onTriggerAbstention}
              className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 font-bold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Trigger Abstention Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
