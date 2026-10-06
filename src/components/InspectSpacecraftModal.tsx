import React, { useState } from 'react';
import { X, ShieldAlert, Zap, Radio, Compass, Thermometer, Cpu, CheckCircle2, AlertTriangle, Eye, Layers } from 'lucide-react';
import { SubsystemKey, SubsystemStatus } from './RealisticSpacecraftCanvas';
import { TelemetryPoint } from '../types';

interface InspectSpacecraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  satelliteId: string;
  telemetry: TelemetryPoint;
  subsystems: Record<SubsystemKey, SubsystemStatus>;
  healthPercent: number;
  initialSubsystem?: SubsystemKey;
  onSelectSubsystem?: (key: SubsystemKey) => void;
}

export const InspectSpacecraftModal: React.FC<InspectSpacecraftModalProps> = ({
  isOpen,
  onClose,
  satelliteId,
  telemetry,
  subsystems,
  healthPercent,
  initialSubsystem,
  onSelectSubsystem,
}) => {
  const [activeTab, setActiveTab] = useState<SubsystemKey>(initialSubsystem || 'POWER');

  React.useEffect(() => {
    if (initialSubsystem && isOpen) {
      setActiveTab(initialSubsystem);
    }
  }, [initialSubsystem, isOpen]);

  if (!isOpen) return null;

  const currentSub = subsystems[activeTab];

  const subIcons: Record<SubsystemKey, React.ComponentType<{ className?: string }>> = {
    POWER: Zap,
    COMMUNICATION: Radio,
    ATTITUDE: Compass,
    THERMAL: Thermometer,
    COMPUTE: Cpu,
  };

  const SubIcon = subIcons[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-sky-300 bg-white shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-sky-200 bg-sky-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-700">SPACECRAFT PHYSICAL INSPECTOR</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-500">LEO ORBITAL PLATFORM</span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 tracking-wide">
                {satelliteId} Engineering & Subsystem Diagnostics
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-sky-200 font-mono text-xs shadow-xs">
              <span className="text-slate-500">OVERALL HEALTH:</span>
              <strong
                className={
                  healthPercent < 75
                    ? 'text-rose-600'
                    : healthPercent < 90
                    ? 'text-amber-600'
                    : 'text-sky-700'
                }
              >
                {healthPercent}% {healthPercent < 75 ? '(ATTENTION REQUIRED)' : '(NOMINAL)'}
              </strong>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 hover:bg-sky-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Subsystem Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(Object.keys(subsystems) as SubsystemKey[]).map((key) => {
              const sub = subsystems[key];
              const Icon = subIcons[key];
              const isSelected = activeTab === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    if (onSelectSubsystem) onSelectSubsystem(key);
                  }}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500 shadow-md shadow-sky-500/20 text-white'
                      : 'border-sky-200 bg-sky-50/40 hover:bg-sky-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                    <span
                      className={`h-2 w-2 rounded-full ${
                        sub.status === 'CRITICAL'
                          ? 'bg-rose-500 animate-pulse'
                          : sub.status === 'WARNING'
                          ? 'bg-amber-500'
                          : isSelected ? 'bg-white' : 'bg-sky-500'
                      }`}
                    />
                  </div>
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{key}</span>
                  <span
                    className={`font-mono text-[10px] mt-0.5 ${
                      isSelected
                        ? 'text-sky-100'
                        : sub.status === 'CRITICAL'
                        ? 'text-rose-600'
                        : sub.status === 'WARNING'
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {sub.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Subsystem Detail Card */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
                  <SubIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{currentSub.name}</h3>
                  <p className="font-mono text-xs text-slate-600">{currentSub.description}</p>
                </div>
              </div>

              <span
                className={`rounded-lg px-3 py-1 font-mono text-xs font-bold border self-start sm:self-auto ${
                  currentSub.status === 'CRITICAL'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : currentSub.status === 'WARNING'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-sky-300 bg-sky-50 text-sky-700'
                }`}
              >
                STATUS: {currentSub.status}
              </span>
            </div>

            {/* Subsystem Real-Time Telemetry Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
                <div className="text-[11px] text-slate-500">{currentSub.metric1Label}</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{currentSub.metric1Val}</div>
                <div className="mt-1 text-[10px] text-sky-600">Real-Time Telemetry Stream</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
                <div className="text-[11px] text-slate-500">{currentSub.metric2Label}</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{currentSub.metric2Val}</div>
                <div className="mt-1 text-[10px] text-slate-500">Calibrated Sensor Telemetry</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
                <div className="text-[11px] text-slate-500">PHYSICAL LOCATION</div>
                <div className="mt-1 text-base font-bold text-sky-700">
                  {activeTab === 'POWER'
                    ? 'Dual Articulated Array (+/- X Wings)'
                    : activeTab === 'COMMUNICATION'
                    ? 'Zenith Parabolic Dish (+Z Deck)'
                    : activeTab === 'ATTITUDE'
                    ? 'Star Trackers & 3-Axis Reaction Wheels'
                    : activeTab === 'THERMAL'
                    ? 'Nadir Louver Face (-Y Deck)'
                    : 'Central Avionics Bay (Core Bus)'}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">3D CAD Model Hotspot Mapped</div>
              </div>
            </div>

            {/* Additional Subsystem Schematics info */}
            <div className="mt-6 rounded-lg border border-sky-200 bg-white p-4 text-xs text-slate-700 font-mono space-y-2 shadow-xs">
              <div className="text-sky-800 font-bold">SPACECRAFT HEALTH DIAGNOSTIC VERDICT:</div>
              {activeTab === 'POWER' && currentSub.status === 'CRITICAL' ? (
                <div className="text-rose-700 font-semibold">
                  CRITICAL: Battery bus voltage has sagged below the 25.50 V safety limit to 24.80 V. Active incident INC-024 is open for this anomaly. Emergency load shedding recommended.
                </div>
              ) : activeTab === 'COMMUNICATION' && currentSub.status === 'WARNING' ? (
                <div className="text-amber-700 font-semibold">
                  WARNING: Carrier downlink attenuation detected (-57 dBm). Forward error correction active; telemetry frames remain integrity verified under CCSDS SDLS.
                </div>
              ) : (
                <div className="text-emerald-700 font-semibold">
                  NOMINAL: All operational telemetry parameters for this subsystem are within nominal engineering margins. Zero fault codes reported.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-sky-200 bg-sky-50/70 px-6 py-3 font-mono text-xs">
          <span className="text-slate-500">
            SIMULATION MODE · PUBLIC / HISTORICAL DATA · DECISION SUPPORT ONLY
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25"
          >
            RETURN TO MISSION CONSOLE
          </button>
        </div>
      </div>
    </div>
  );
};
