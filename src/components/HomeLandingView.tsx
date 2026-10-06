import React, { useEffect, useRef, useState } from 'react';
import {
  Satellite,
  Shield,
  ArrowRight,
  Brain,
  Activity,
  Search,
  BookOpen,
  FileText,
  Lock,
  Compass,
  Layers,
  Sparkles,
  Zap,
  Globe2,
  Clock,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw as ResetIcon,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { TabKey } from '../App';
import { SubsystemKey, SubsystemStatus } from './RealisticSpacecraftCanvas';
import { CompleteSatelliteImage } from './CompleteSatelliteImage';
import { RealisticEarthOrbitBackground } from './RealisticEarthOrbitBackground';
import { TelemetryPoint } from '../types';

interface HomeLandingViewProps {
  onNavigate: (tab: TabKey) => void;
  onOpenInspect: (subsystemKey?: SubsystemKey) => void;
  calculatedHealthPercent: number;
  currentSubsystems?: Record<SubsystemKey, SubsystemStatus>;
  currentTelX1?: TelemetryPoint;
  onStartReplay?: () => void;
  onResetNominal?: () => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onNavigate,
  onOpenInspect,
  calculatedHealthPercent,
  currentSubsystems,
  currentTelX1,
  onStartReplay,
  onResetNominal,
}) => {
  const [selectedSatellite, setSelectedSatellite] = useState<'ORBIT-X1' | 'SENTINEL-B2'>('ORBIT-X1');
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  const batVal = currentTelX1?.battery_voltage ?? 24.8;
  const sigVal = currentTelX1?.signal_strength ?? -57.2;
  const solVal = currentTelX1?.solar_power ?? 310;
  const tempVal = currentTelX1?.temperature ?? 43.2;

  return (
    <div className="space-y-10 font-sans pb-12">
      {/* ========================================================
          HERO BANNER: REALISTIC HALF EARTH & REVOLVING SATELLITE
      ======================================================== */}
      <div className={`relative rounded-3xl overflow-hidden border border-sky-400/40 shadow-2xl bg-gradient-to-b from-[#030712] via-[#050f22] to-[#030816] text-white transition-all duration-500 ${
        isCinemaMode ? 'min-h-[720px]' : 'min-h-[580px]'
      }`}>
        {/* Realistic 3D Half Earth & Revolving Spacecraft Background */}
        <RealisticEarthOrbitBackground
          isPaused={isOrbitPaused}
          className="opacity-95"
        />

        {/* Subtle Dark Aerospace Vignettes for Maximum Card Readability */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isCinemaMode
            ? 'bg-gradient-to-t from-[#030816]/70 via-transparent to-transparent'
            : 'bg-gradient-to-t from-[#030816] via-[#030816]/75 to-transparent'
        }`} />
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isCinemaMode
            ? 'bg-gradient-to-r from-[#030816]/65 via-transparent to-transparent'
            : 'bg-gradient-to-r from-[#030816]/95 via-[#030816]/65 to-transparent'
        }`} />

        {/* Content Inside Hero */}
        <div className={`relative z-10 p-6 sm:p-10 lg:p-12 space-y-8 transition-opacity duration-300 ${
          isCinemaMode ? 'opacity-90' : 'opacity-100'
        }`}>
          {/* Top Live Mission Ticker Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-900/60 pb-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 backdrop-blur-md font-mono text-xs text-sky-300">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">ORBITAL OPERATIONS COPILOT</span>
              <span className="text-sky-500">·</span>
              <span className="text-slate-300">LEO ORBIT PROPAGATION</span>
            </div>

            {/* Orbit Controls & Satellite Switcher Pill */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              {/* 3D Orbit View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <button
                  onClick={() => setIsCinemaMode((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCinemaMode ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Panorama Orbit View to view half Earth and revolving satellite"
                >
                  <Globe2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>{isCinemaMode ? 'COMPACT VIEW' : 'FULL ORBIT VIEW'}</span>
                </button>

                <button
                  onClick={() => setIsOrbitPaused((prev) => !prev)}
                  className="px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isOrbitPaused ? 'Resume Orbit Animation' : 'Pause Orbit Animation'}
                >
                  {isOrbitPaused ? '▶ PLAY' : '⏸ PAUSE'}
                </button>
              </div>

              {/* Satellite Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <button
                  onClick={() => setSelectedSatellite('ORBIT-X1')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedSatellite === 'ORBIT-X1'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ORBIT-X1 (542 km)
                </button>
                <button
                  onClick={() => setSelectedSatellite('SENTINEL-B2')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedSatellite === 'SENTINEL-B2'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SENTINEL-B2 (685 km)
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Balanced Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT COLUMN: Mission Copilot Vision & Incident Dispatch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="font-mono text-xs font-bold text-sky-400 tracking-widest uppercase flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>EVIDENCE-GROUNDED FLIGHT INTELLIGENCE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                  Autonomous Anomaly Correlation & Flight Governance
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-xl">
                  Real-time monitoring of calibrated sensor telemetry, rapid incident correlation, validated flight procedure retrieval, and verifiable SHA-256 decision governance.
                </p>
              </div>

              {/* Active Flight Incident Spotlight Card (INC-024) */}
              <div className="p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/50 via-slate-900/70 to-slate-950/90 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-mono text-xs font-bold text-rose-300 uppercase tracking-wider">
                      ACTIVE FLIGHT ANOMALY · INC-024
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    CRITICAL PRIORITY
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    Battery Voltage Degradation Following EV-204 Power Configuration Event
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
                    Primary bus voltage dropped to 24.80V within 7 seconds of array reconfiguration. RF signal carrier simultaneously attenuated by 5.4 dBm.
                  </p>
                </div>

                {/* Live Real-Time Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/40">
                    <div className="text-[10px] text-slate-400">BATTERY BUS</div>
                    <div className="text-sm font-bold text-rose-400">{batVal.toFixed(2)} V 🔴</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/40">
                    <div className="text-[10px] text-slate-400">RF DOWNLINK</div>
                    <div className="text-sm font-bold text-amber-400">{sigVal.toFixed(1)} dBm 🟠</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/40">
                    <div className="text-[10px] text-slate-400">SOLAR ARRAY</div>
                    <div className="text-sm font-bold text-sky-400">{solVal} W 🟢</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/40">
                    <div className="text-[10px] text-slate-400">ML SCORE</div>
                    <div className="text-sm font-bold text-purple-400">0.91 (91%)</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                  <button
                    onClick={() => onNavigate('investigation')}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-900/40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>LAUNCH INVESTIGATION</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('overview')}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white font-bold border border-sky-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>SPACECRAFT OVERVIEW</span>
                  </button>

                  {onStartReplay && (
                    <button
                      onClick={onStartReplay}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Run 5-stage simulation replay"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>REPLAY</span>
                    </button>
                  )}

                  {onResetNominal && (
                    <button
                      onClick={onResetNominal}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Reset all systems to nominal baseline"
                    >
                      <ResetIcon className="h-3.5 w-3.5" />
                      <span>RESET</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Zero Autonomous Commanding Guarantee */}
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-400/20 px-3.5 py-2.5 rounded-xl backdrop-blur-md">
                <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                <span>ZERO AUTONOMOUS COMMANDING: Decision support only. Spacecraft telecommand uplink requires certified human sign-off.</span>
              </div>
            </div>

            {/* RIGHT COLUMN: COMPLETE SATELLITE DIGITAL TWIN SHOWCASE */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full rounded-2xl border border-sky-400/40 bg-slate-950/90 backdrop-blur-md p-4 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Satellite className="h-4 w-4 text-sky-400" />
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {selectedSatellite} COMPLETE SATELLITE TWIN
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenInspect('POWER')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-mono text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>3D CAD</span>
                  </button>
                </div>

                {/* Complete Satellite View Box (Entire Satellite visible from tip to tip) */}
                <div className="relative h-[320px] sm:h-[350px] w-full rounded-xl overflow-hidden border border-slate-800 bg-[#02050f]">
                  <CompleteSatelliteImage
                    subsystems={currentSubsystems}
                    onSelectSubsystem={(key) => onOpenInspect(key)}
                    showLabels={true}
                  />
                </div>

                {/* Spacecraft Metadata Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ALTITUDE</div>
                    <div className="font-bold text-slate-200">542 km</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">INCLINATION</div>
                    <div className="font-bold text-slate-200">97.5°</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ORBIT PERIOD</div>
                    <div className="font-bold text-slate-200">95.4 min</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">DRY MASS</div>
                    <div className="font-bold text-slate-200">1,420 kg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MISSION MODULES GRID: 1-CLICK NAVIGATION TO EVERY TAB
      ======================================================== */}
      <div className="space-y-4">
        <div className="border-b border-sky-200 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
              Mission Operations Modules
            </h2>
            <p className="text-xs font-mono text-slate-500">Direct 1-click access to all flight intelligence systems</p>
          </div>
          <span className="font-mono text-xs text-sky-700 font-bold">10 INTEGRATED SUITES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Spacecraft Overview */}
          <div
            onClick={() => onNavigate('overview')}
            className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Compass className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  HEALTH {calculatedHealthPercent}%
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mt-3">
                Spacecraft Overview & 3D Twin
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Complete satellite view, interactive 3D digital twin, real-time subsystem indicators, and trend graphs.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-sky-700">
              <span>EXPLORE SPACECRAFT</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Telemetry Explorer */}
          <div
            onClick={() => onNavigate('telemetry')}
            className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  1.5s SAMPLING
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mt-3">
                Foundational Telemetry Explorer
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Calibrated ADC sensor streams across Power, Comms, ADCS, Thermal, and Compute subsystems.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-sky-700">
              <span>EXPLORE TELEMETRY</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Investigation Console */}
          <div
            onClick={() => onNavigate('investigation')}
            className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/40 hover:border-rose-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-rose-600 text-white">
                  <Brain className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                  INC-024 ACTIVE
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors mt-3">
                Investigation Console
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Step-by-step incident timeline, correlated flight events, verified hypotheses, and recovery checklists.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-rose-700">
              <span>OPEN CONSOLE</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Evidence Explorer (RAG) */}
          <div
            onClick={() => onNavigate('evidence')}
            className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Search className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  100% GROUNDED
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mt-3">
                Evidence Explorer (RAG)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Grounded citations, raw CCSDS packet payloads, flight manual procedures, and vector similarity ranks.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-sky-700">
              <span>BROWSE EVIDENCE</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. AI Copilot & Abstention */}
          <div
            onClick={() => onNavigate('copilot')}
            className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  ABSTENTION ACTIVE
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-3">
                AI Copilot Workbench
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Submit operational flight inquiries, test multi-turn evidence grounding, and verify anti-hallucination refusals.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-purple-700">
              <span>LAUNCH COPILOT</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Cryptographic Audit Trail */}
          <div
            onClick={() => onNavigate('audit')}
            className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  SHA-256 SEALED
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-3">
                Immutable Audit Trail
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Time-stamped SHA-256 ledger recording every operator query, retrieved source document, and validation verdict.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-mono font-bold text-emerald-700">
              <span>INSPECT AUDIT LOGS</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FOUR PILLARS OF AEROSPACE INTEGRITY
      ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans text-xs">
        <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-2 hover:border-sky-400 transition-colors">
          <div className="text-sky-700 font-bold font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>EVIDENCE GROUNDED</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Every inference links directly to a calibrated telemetry packet, event dispatch timestamp, or flight manual checklist.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-2 hover:border-purple-400 transition-colors">
          <div className="text-purple-700 font-bold font-mono text-xs flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>EXPLICIT ABSTENTION</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            When mechanical telemetry is missing, the AI explicitly states insufficient evidence rather than guessing mechanical breakage.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200 bg-rose-50/30 shadow-xs space-y-2 hover:border-rose-400 transition-colors">
          <div className="text-rose-700 font-bold font-mono text-xs flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>ZERO COMMAND PATH</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Read-only telemetry interface. Zero autonomous execution of spacecraft telecommands without certified human sign-off.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-2 hover:border-emerald-400 transition-colors">
          <div className="text-emerald-700 font-bold font-mono text-xs flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>CRYPTOGRAPHIC AUDIT</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Time-stamped SHA-256 logs recording every question, evidence retrieval set, and operator review decision.
          </p>
        </div>
      </div>
    </div>
  );
};
