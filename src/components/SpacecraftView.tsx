import React from 'react';
import { Play, RotateCcw as ResetIcon, Eye, AlertOctagon, AlertTriangle, Cpu, Zap, Signal, Thermometer, Radio } from 'lucide-react';
import { RealisticSpacecraftCanvas, SubsystemKey, SubsystemStatus } from './RealisticSpacecraftCanvas';
import { SectionHeader } from './SectionHeader';
import { TelemetryPoint } from '../types';
import { TabKey } from '../App';

interface SpacecraftViewProps {
  currentTelX1: TelemetryPoint;
  incidentId: string;
  isIncidentActive: boolean;
  anomalyScore: number;
  replayStep: string;
  subsystemOverrides: Partial<Record<SubsystemKey, 'NORMAL' | 'WARNING' | 'CRITICAL'>>;
  currentSubsystems: Record<SubsystemKey, SubsystemStatus>;
  calculatedHealthPercent: number;
  onStartReplay: () => void;
  onResetNominal: () => void;
  onOpenInspect: () => void;
  onOpenInvestigation: () => void;
  onNavigate: (tab: TabKey) => void;
}

export const SpacecraftView: React.FC<SpacecraftViewProps> = ({
  currentTelX1,
  incidentId,
  isIncidentActive,
  anomalyScore,
  replayStep,
  subsystemOverrides,
  currentSubsystems,
  calculatedHealthPercent,
  onStartReplay,
  onResetNominal,
  onOpenInspect,
  onOpenInvestigation,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 2 · 3D DIGITAL TWIN"
        title="Orbital Spacecraft Physical Health & Subsystems"
        subtitle="High-precision 3D physical model, subsystem telemetry loops, and 5-stage critical incident replay storyline."
        prevTab="home"
        nextTab="investigation"
        onNavigate={onNavigate}
      />

      <section className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm shadow-sky-100/60">
        {/* Replay Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-100 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-700 font-semibold">
              <Radio className="h-3.5 w-3.5 text-sky-600" />
              <span>542.4 KM SUN-SYNCHRONOUS ORBIT · ORBIT-X1</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-slate-900 tracking-wide">
              Physical Health Telemetry Loops & Actuators
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {replayStep === 'IDLE' ? (
              <button
                onClick={onStartReplay}
                className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current text-rose-600" />
                <span>REPLAY CRITICAL INCIDENT (INC-024)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-bold text-amber-700 animate-pulse">
                  <AlertOctagon className="h-3.5 w-3.5 text-amber-600" />
                  <span>REPLAY ACTIVE: {replayStep.replace('STEP_', 'STEP ')}</span>
                </span>
                <button
                  onClick={onResetNominal}
                  className="flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-700 hover:text-sky-900 hover:bg-sky-100 transition-all shadow-xs cursor-pointer"
                >
                  <ResetIcon className="h-3.5 w-3.5 text-sky-600" />
                  <span>RESET TO NOMINAL</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Replay Timeline Bar */}
        {replayStep !== 'IDLE' && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/50 p-3 font-mono text-xs">
            <div className="text-[11px] text-amber-800 font-bold mb-2 flex items-center justify-between">
              <span>INCIDENT REPLAY STORYLINE (5 STAGES):</span>
              <span>ANOMALY PROBABILITY: {(anomalyScore * 100).toFixed(0)}%</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-[10px] text-center">
              <div className={`p-1.5 rounded border ${replayStep === 'STEP_1_NORMAL' ? 'border-sky-400 bg-sky-100 text-sky-900 font-bold' : 'border-sky-200 bg-white text-slate-500'}`}>
                1. Normal
              </div>
              <div className={`p-1.5 rounded border ${replayStep === 'STEP_2_POWER_CONFIG' ? 'border-amber-400 bg-amber-100 text-amber-900 font-bold' : 'border-sky-200 bg-white text-slate-500'}`}>
                2. Power Config
              </div>
              <div className={`p-1.5 rounded border ${replayStep === 'STEP_3_BATTERY_DEGRADE' ? 'border-rose-400 bg-rose-100 text-rose-900 font-bold' : 'border-sky-200 bg-white text-slate-500'}`}>
                3. Battery 24.8V
              </div>
              <div className={`p-1.5 rounded border ${replayStep === 'STEP_4_COMMS_DEGRADE' ? 'border-amber-400 bg-amber-100 text-amber-900 font-bold' : 'border-sky-200 bg-white text-slate-500'}`}>
                4. Comm Degrade
              </div>
              <div className={`p-1.5 rounded border ${replayStep === 'STEP_5_INCIDENT_CREATED' ? 'border-rose-400 bg-rose-200 text-rose-900 font-bold animate-pulse' : 'border-sky-200 bg-white text-slate-500'}`}>
                5. INC-024 Raised
              </div>
            </div>
          </div>
        )}

        {/* Main 3D Canvas + Subsystems Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <RealisticSpacecraftCanvas
              telemetry={currentTelX1}
              satelliteId="ORBIT-X1"
              isIncidentActive={isIncidentActive || replayStep === 'STEP_5_INCIDENT_CREATED' || replayStep === 'STEP_3_BATTERY_DEGRADE'}
              incidentId={incidentId}
              incidentSeverity="CRITICAL"
              onOpenIncident={onOpenInvestigation}
              onInspectSpacecraft={onOpenInspect}
              subsystemOverrides={subsystemOverrides}
              anomalyScore={anomalyScore}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-sky-200 bg-sky-50/30 p-5 shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-sky-200 pb-3">
                <span className="font-mono text-xs font-bold text-slate-900">SPACECRAFT HEALTH</span>
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    calculatedHealthPercent < 75
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : calculatedHealthPercent < 90
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-sky-300 bg-sky-100 text-sky-800'
                  }`}
                >
                  {calculatedHealthPercent}% {calculatedHealthPercent < 75 ? 'ATTENTION REQUIRED' : 'NOMINAL'}
                </span>
              </div>

              <div className="mt-4 space-y-2.5 font-mono text-xs">
                {/* POWER */}
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <div className="font-bold text-slate-900">POWER (EPS)</div>
                      <div className="text-[10px] text-slate-500">{currentSubsystems.POWER.metric1Val} · {currentSubsystems.POWER.metric2Val}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold ${currentSubsystems.POWER.status === 'CRITICAL' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {currentSubsystems.POWER.status === 'CRITICAL' ? '🔴 CRITICAL' : '🟢 NOMINAL'}
                  </span>
                </div>

                {/* COMM */}
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Signal className="h-4 w-4 text-sky-600" />
                    <div>
                      <div className="font-bold text-slate-900">COMM (TT&C)</div>
                      <div className="text-[10px] text-slate-500">{currentSubsystems.COMMUNICATION.metric1Val}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold ${currentSubsystems.COMMUNICATION.status === 'WARNING' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {currentSubsystems.COMMUNICATION.status === 'WARNING' ? '🟠 WARNING' : '🟢 NOMINAL'}
                  </span>
                </div>

                {/* ATTITUDE */}
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">ATTITUDE (ADCS)</div>
                      <div className="text-[10px] text-slate-500">3-Axis Wheels Nom</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">🟢 NOMINAL</span>
                </div>

                {/* THERMAL */}
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-rose-500" />
                    <div>
                      <div className="font-bold text-slate-900">THERMAL (TCS)</div>
                      <div className="text-[10px] text-slate-500">{currentSubsystems.THERMAL.metric1Val}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">🟢 NOMINAL</span>
                </div>

                {/* COMPUTE */}
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-sky-600" />
                    <div>
                      <div className="font-bold text-slate-900">COMPUTE (OBC)</div>
                      <div className="text-[10px] text-slate-500">Dual LEON4 Armed</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">🟢 NOMINAL</span>
                </div>
              </div>

              {/* ML Anomaly Score Bar */}
              <div className="mt-4 rounded-lg border border-sky-200 bg-white p-3 font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-slate-500">ML ANOMALY PROBABILITY</span>
                  <strong className={anomalyScore > 0.7 ? 'text-rose-600' : 'text-sky-700'}>
                    {anomalyScore.toFixed(2)} / 1.00
                  </strong>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${anomalyScore > 0.7 ? 'bg-rose-500' : 'bg-sky-500'}`}
                    style={{ width: `${Math.max(5, anomalyScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onOpenInspect}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400 bg-sky-500 py-2.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>INSPECT SPACECRAFT (FULL 3D CAD)</span>
            </button>
          </div>
        </div>

        {/* Active Incident Alert */}
        {(isIncidentActive || replayStep === 'STEP_5_INCIDENT_CREATED') && (
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-rose-300 bg-rose-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-rose-700">
                  ACTIVE INCIDENT DETECTED · {incidentId}
                </div>
                <p className="font-mono text-xs text-slate-800 mt-0.5">
                  Primary Bus Voltage Drop & Thermal Drift (Battery 24.80 V · ML Anomaly Score 0.91)
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('investigation')}
              className="rounded-lg bg-rose-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-rose-700 transition-all shadow-sm shadow-rose-600/30 shrink-0 cursor-pointer"
            >
              INVESTIGATE ANOMALY WITH EVIDENCE (TAB 3) →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
