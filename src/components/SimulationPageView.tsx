import React from 'react';
import {
  Play,
  RotateCcw as ResetIcon,
  WifiOff,
  Wifi,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';
import { CommsStatus, SecurityDiagnostics } from '../types';
import { SubsystemKey } from './RealisticSpacecraftCanvas';

interface SimulationPageViewProps {
  isIncidentActive: boolean;
  replayStep: string;
  commsX1: CommsStatus;
  securityX1: SecurityDiagnostics;
  onStartReplay: () => void;
  onResetNominal: () => void;
  onCutComms: () => void;
  onReconnectComms: () => void;
  onSimulateIntrusion: () => void;
  onTriggerTestAlert?: (subsystem: SubsystemKey, severity: 'WARNING' | 'CRITICAL') => void;
}

export const SimulationPageView: React.FC<SimulationPageViewProps> = ({
  isIncidentActive,
  replayStep,
  commsX1,
  securityX1,
  onStartReplay,
  onResetNominal,
  onCutComms,
  onReconnectComms,
  onSimulateIntrusion,
  onTriggerTestAlert,
}) => {
  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>MISSION SIMULATION CONTROLS</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Orbital Event & Fault Injection Matrix
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Inject spacecraft failure modes, replay multi-stage anomalies, or simulate RF blackout and cybersecurity defense.
          </p>
        </div>

        <button
          onClick={onResetNominal}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-mono text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <ResetIcon className="h-3.5 w-3.5 text-sky-600" />
          <span>RESET ALL TO NOMINAL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Incident Replay Storyline Controller */}
        <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">ANOMALY REPLAY</span>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
              replayStep !== 'IDLE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {replayStep !== 'IDLE' ? replayStep.replace('STEP_', 'STEP ') : 'IDLE'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">INC-024 5-Stage Storyline Replay</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Automatically steps the spacecraft through nominal operations, SADA slip, 24.8V battery dip, RF power throttling, and docket creation.
          </p>

          <div className="pt-2 flex items-center gap-3 font-mono text-xs">
            <button
              onClick={onStartReplay}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>RUN REPLAY (5 STAGES)</span>
            </button>
            <button
              onClick={onResetNominal}
              className="py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer"
            >
              RESET
            </button>
          </div>
        </div>

        {/* 2. Communications Blackout & Blackbox */}
        <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">TELEMETRY LINK</span>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
              commsX1 === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {commsX1}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">RF LOS Ground Station Blackout</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Cuts the live 2.2 GHz S-band carrier to verify autonomous on-board blackbox mass-memory packet preservation and recovery upon re-acquisition.
          </p>

          <div className="pt-2 flex items-center gap-3 font-mono text-xs">
            {commsX1 === 'ONLINE' ? (
              <button
                onClick={onCutComms}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <WifiOff className="h-3.5 w-3.5" />
                <span>SIMULATE COMMS BLACKOUT</span>
              </button>
            ) : (
              <button
                onClick={onReconnectComms}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Wifi className="h-3.5 w-3.5" />
                <span>RESTORE DOWNLINK (AOS)</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Anti-Intrusion Cybersecurity Layer */}
        <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">CYBERSECURITY</span>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
              securityX1.isHacked ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {securityX1.isHacked ? 'INTRUSION FLAGGED' : 'ARMED & SECURE'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">TC Intrusion Defense Simulation</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Simulates unauthorized CCSDS telecommand injection to demonstrate FPGA cryptographic key drop and automatic command rejection.
          </p>

          <div className="pt-2">
            <button
              onClick={onSimulateIntrusion}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
              <span>TEST UNAUTHORIZED COMMAND INJECTION</span>
            </button>
          </div>
        </div>

        {/* 4. Instant Fault Injection */}
        <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">BATTERY SENSOR FAULT</span>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
              isIncidentActive ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isIncidentActive ? 'FAULT ACTIVE' : 'NOMINAL (28.5V)'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">Bus 1 Voltage Sag Toggle</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Instantly injects or resolves the primary bus drop to test live telemetry chart update and copilot response.
          </p>

          <div className="pt-2 flex items-center gap-3 font-mono text-xs">
            <button
              onClick={onResetNominal}
              className="flex-1 py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all cursor-pointer"
            >
              SET NOMINAL (28.5V)
            </button>
          </div>
        </div>

        {/* 5. Subsystem Warning & Critical State Transition Matrix */}
        {onTriggerTestAlert && (
          <div className="p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-700 uppercase">REAL-TIME SUBSYSTEM DISPATCH</span>
              <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-100 text-sky-800">
                TOAST NOTIFICATION ENGINE
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">Subsystem State Transition Injector</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Inject real-time WARNING or CRITICAL state changes on any spacecraft subsystem to observe the floating toast alert banners, audible chime, and automated notification log.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => onTriggerTestAlert('POWER', 'CRITICAL')}
                className="p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-rose-900 font-bold transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-rose-600 font-black">EPS · CRITICAL</span>
                <span>Battery 24.8V</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('COMMUNICATION', 'WARNING')}
                className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-amber-600 font-black">TT&C · WARNING</span>
                <span>Carrier -57dBm</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('THERMAL', 'WARNING')}
                className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-amber-600 font-black">TCS · WARNING</span>
                <span>Bus Temp 49.2°C</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('ATTITUDE', 'WARNING')}
                className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-amber-600 font-black">ADCS · WARNING</span>
                <span>Pointing Error 0.65°</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('COMPUTE', 'CRITICAL')}
                className="p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-rose-900 font-bold transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-rose-600 font-black">OBC · CRITICAL</span>
                <span>ECC Fault Burst</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
