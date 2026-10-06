import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  Zap,
  Sun,
  Signal,
  Thermometer,
  Shield,
  Lock,
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { WorldOrbitMap } from './WorldOrbitMap';
import { SatelliteId, TelemetryPoint, CommsStatus, LastKnownPacket, SecurityDiagnostics, SecurityAlert } from '../types';
import { TabKey } from '../App';

interface TelemetryViewProps {
  selectedSat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH';
  setSelectedSat: (sat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH') => void;
  metricKey: 'battery_voltage' | 'solar_power' | 'signal_strength' | 'temperature';
  setMetricKey: (key: 'battery_voltage' | 'solar_power' | 'signal_strength' | 'temperature') => void;
  currentTelX1: TelemetryPoint;
  currentTelB2: TelemetryPoint;
  telemetryX1: TelemetryPoint[];
  telemetryB2: TelemetryPoint[];
  commsX1: CommsStatus;
  commsB2: CommsStatus;
  packetX1: LastKnownPacket;
  packetB2: LastKnownPacket;
  securityX1: SecurityDiagnostics;
  securityB2: SecurityDiagnostics;
  securityAlerts: SecurityAlert[];
  handleCutComms: (satId: SatelliteId) => void;
  handleReconnectComms: (satId: SatelliteId) => void;
  handleSimulateIntrusion: () => void;
  onNavigate: (tab: TabKey) => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  selectedSat,
  setSelectedSat,
  metricKey,
  setMetricKey,
  currentTelX1,
  currentTelB2,
  telemetryX1,
  telemetryB2,
  commsX1,
  commsB2,
  packetX1,
  packetB2,
  securityX1,
  securityAlerts,
  handleCutComms,
  handleReconnectComms,
  handleSimulateIntrusion,
  onNavigate,
}) => {
  const mergedChartData = telemetryX1.map((ptX1, idx) => {
    const ptB2 = telemetryB2[idx] || telemetryB2[telemetryB2.length - 1];
    return {
      time: ptX1.time,
      'ORBIT-X1': ptX1[metricKey],
      'SENTINEL-B2': ptB2 ? ptB2[metricKey] : null,
    };
  });

  const metricMeta = {
    battery_voltage: {
      name: 'Primary Battery Voltage',
      unit: 'V',
      domain: [24.0, 30.0],
      nominalRange: '27.5V – 29.0V',
      nominalLow: 27.5,
      nominalHigh: 29.0,
      warnThreshold: 27.0,
      critThreshold: 25.5,
    },
    solar_power: {
      name: 'Solar Array Generation',
      unit: 'W',
      domain: [280, 620],
      nominalRange: '450W – 600W',
      nominalLow: 450,
      nominalHigh: 600,
      warnThreshold: 450,
      critThreshold: 420,
    },
    signal_strength: {
      name: 'S-Band Carrier Signal Strength',
      unit: 'dBm',
      domain: [-68, -45],
      nominalRange: '-60 dBm to -45 dBm',
      nominalLow: -60,
      nominalHigh: -45,
      warnThreshold: -58,
      critThreshold: -62,
    },
    temperature: {
      name: 'Battery Pack Core Temperature',
      unit: '°C',
      domain: [30, 55],
      nominalRange: '35°C – 50°C',
      nominalLow: 35,
      nominalHigh: 50,
      warnThreshold: 48,
      critThreshold: 52,
    },
  }[metricKey];

  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 8 · FOUNDATIONAL TELEMETRY"
        title="Sensor Telemetry, Orbital Tracking & Fleet Command Deck"
        subtitle="Raw telemetry streams serve as the inputs to the intelligence system: dual-satellite deck, moving waveform graph, ground track, blackout buffer, and cybersecurity."
        prevTab="audit"
        nextTab="home"
        onNavigate={onNavigate}
      />

      {/* Foundational Telemetry Header */}
      <div className="rounded-xl border border-sky-300 bg-sky-50/50 p-4 font-mono text-xs text-sky-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-600" />
          <span className="font-bold">INPUT LAYER: CONTINUOUS TIME-SERIES SAMPLING (1.5s CYCLE)</span>
        </div>
        <span className="text-slate-600">Verifiable basis for all ML and RAG conclusions</span>
      </div>

      {/* 1. Dual-Satellite Command Deck */}
      <section className="rounded-xl border border-sky-200 bg-white p-5 shadow-sm shadow-sky-100/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-700 font-semibold">
              <Activity className="h-3.5 w-3.5 text-sky-600" />
              <span>DUAL-SATELLITE STATUS AT A GLANCE</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-slate-900 tracking-wide">
              Orbital Asset Fleet Overview
            </h2>
          </div>

          <div className="font-mono text-xs text-slate-500">
            CLICK ANY CARD TO SWITCH ACTIVE TELEMETRY
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Card 1: ORBIT-X1 */}
          <div
            onClick={() => setSelectedSat('ORBIT-X1')}
            className={`cursor-pointer rounded-xl border p-5 transition-all ${
              selectedSat === 'ORBIT-X1' || selectedSat === 'BOTH'
                ? 'border-sky-400 bg-sky-50/50 shadow-md shadow-sky-100 ring-2 ring-sky-400/40'
                : 'border-sky-200 bg-white opacity-85 hover:opacity-100 hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white font-mono font-bold text-xs shadow-xs">
                  X1
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 tracking-wide">
                    ORBIT-X1 (Primary Earth Observation)
                  </h3>
                  <p className="font-mono text-xs text-slate-500">
                    542.4 km Sun-Sync LEO · Inclination 97.4°
                  </p>
                </div>
              </div>

              <span
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-bold ${
                  commsX1 === 'BLACKOUT'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-sky-100 text-sky-800 border border-sky-300'
                }`}
              >
                {commsX1 === 'BLACKOUT' ? '▲ LOS BLACKOUT' : '● NOMINAL STREAM'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs tabular-nums">
              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>BATTERY</span>
                  <Zap className="h-3 w-3 text-amber-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelX1.battery_voltage} V</div>
                <div className="text-[10px] text-sky-700">Nominal 27.5–29.0V</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>SOLAR</span>
                  <Sun className="h-3 w-3 text-amber-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelX1.solar_power} W</div>
                <div className="text-[10px] text-slate-500">522W Baseline</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>DOWNLINK</span>
                  <Signal className="h-3 w-3 text-sky-600" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelX1.signal_strength} dBm</div>
                <div className="text-[10px] text-sky-700">S-Band Locked</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>THERMAL</span>
                  <Thermometer className="h-3 w-3 text-rose-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelX1.temperature} °C</div>
                <div className="text-[10px] text-slate-500">Normal 35–50°C</div>
              </div>
            </div>
          </div>

          {/* Card 2: SENTINEL-B2 */}
          <div
            onClick={() => setSelectedSat('SENTINEL-B2')}
            className={`cursor-pointer rounded-xl border p-5 transition-all ${
              selectedSat === 'SENTINEL-B2' || selectedSat === 'BOTH'
                ? 'border-sky-400 bg-sky-50/50 shadow-md shadow-sky-100 ring-2 ring-sky-400/40'
                : 'border-sky-200 bg-white opacity-85 hover:opacity-100 hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white font-mono font-bold text-xs shadow-xs">
                  B2
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 tracking-wide">
                    SENTINEL-B2 (Deep-Space & Polar Relay)
                  </h3>
                  <p className="font-mono text-xs text-slate-500">
                    685.1 km Polar LEO · Inclination 82.5°
                  </p>
                </div>
              </div>

              <span
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-bold ${
                  commsB2 === 'BLACKOUT'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-sky-100 text-sky-800 border border-sky-300'
                }`}
              >
                {commsB2 === 'BLACKOUT' ? '▲ LOS BLACKOUT' : '● NOMINAL STREAM'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs tabular-nums">
              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>BATTERY</span>
                  <Zap className="h-3 w-3 text-amber-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelB2.battery_voltage} V</div>
                <div className="text-[10px] text-sky-700">Nominal 27.5–29.0V</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>SOLAR</span>
                  <Sun className="h-3 w-3 text-amber-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelB2.solar_power} W</div>
                <div className="text-[10px] text-slate-500">528W Baseline</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>DOWNLINK</span>
                  <Signal className="h-3 w-3 text-sky-600" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelB2.signal_strength} dBm</div>
                <div className="text-[10px] text-sky-700">Relay Locked</div>
              </div>

              <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>THERMAL</span>
                  <Thermometer className="h-3 w-3 text-rose-500" />
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">{currentTelB2.temperature} °C</div>
                <div className="text-[10px] text-slate-500">Normal 35–50°C</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Moving Telemetry Waveform Oscilloscope */}
      <section className="rounded-xl border border-sky-200 bg-white p-5 shadow-sm shadow-sky-100/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-700 font-semibold">
              <Activity className="h-3.5 w-3.5 text-sky-600" />
              <span>MOVING TIME-SERIES TELEMETRY STREAM</span>
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">
              Live Sensor Waveform: {metricMeta.name} ({metricMeta.unit})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-sky-50/70 p-1 border border-sky-200 shadow-xs">
            {(
              [
                { key: 'battery_voltage', label: 'Battery (V)', icon: Zap },
                { key: 'solar_power', label: 'Solar (W)', icon: Sun },
                { key: 'signal_strength', label: 'Carrier (dBm)', icon: Signal },
                { key: 'temperature', label: 'Thermal (°C)', icon: Thermometer },
              ] as const
            ).map((m) => {
              const IconComponent = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => setMetricKey(m.key)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    metricKey === m.key
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600">
          <div>
            NOMINAL OPERATING BAND: <strong className="text-sky-700">{metricMeta.nominalRange}</strong>
          </div>
          <div className="flex items-center gap-4">
            <span>WARNING THRESHOLD: <strong className="text-amber-600">{metricMeta.warnThreshold} {metricMeta.unit}</strong></span>
            <span>CRITICAL FLOOR: <strong className="text-rose-600">{metricMeta.critThreshold} {metricMeta.unit}</strong></span>
          </div>
        </div>

        <div className="mt-4 h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedChartData} margin={{ top: 12, right: 24, left: -4, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <YAxis domain={metricMeta.domain} stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#0284C7',
                  borderRadius: '8px',
                  color: '#0F172A',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }} />
              <ReferenceArea y1={metricMeta.nominalLow} y2={metricMeta.nominalHigh} fill="#38BDF8" fillOpacity={0.12} />
              <ReferenceLine y={metricMeta.warnThreshold} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: `WARN`, fill: '#D97706', fontSize: 10, position: 'insideTopRight' }} />

              {(selectedSat === 'ORBIT-X1' || selectedSat === 'BOTH') && (
                <Line
                  type="monotone"
                  dataKey="ORBIT-X1"
                  name={`ORBIT-X1 (${metricMeta.unit})`}
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {(selectedSat === 'SENTINEL-B2' || selectedSat === 'BOTH') && (
                <Line
                  type="monotone"
                  dataKey="SENTINEL-B2"
                  name={`SENTINEL-B2 (${metricMeta.unit})`}
                  stroke="#0EA5E9"
                  strokeWidth={2.2}
                  strokeDasharray={selectedSat === 'BOTH' ? '5 3' : undefined}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. Orbital Map & Location Tracker */}
      <WorldOrbitMap
        telemetryX1={currentTelX1}
        telemetryB2={currentTelB2}
        commsX1={commsX1}
        commsB2={commsB2}
        packetX1={packetX1}
        packetB2={packetB2}
        selectedSat={selectedSat}
        onSelectSat={setSelectedSat}
      />

      {/* 4. Comms Loss Blackbox Recovery */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`rounded-xl border p-5 shadow-sm transition-all ${commsX1 === 'BLACKOUT' ? 'border-amber-300 bg-amber-50/50' : 'border-sky-200 bg-white'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
            <div>
              <div className="font-mono text-xs text-sky-700 font-semibold">BLACKBOX TELEMETRY BUFFER</div>
              <h4 className="font-display text-base font-bold text-slate-900">ORBIT-X1 Link Station</h4>
            </div>
            {commsX1 !== 'BLACKOUT' ? (
              <button
                onClick={() => handleCutComms('ORBIT-X1')}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-mono text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                SIMULATE COMMS LOSS (CUT)
              </button>
            ) : (
              <button
                onClick={() => handleReconnectComms('ORBIT-X1')}
                className="rounded-lg bg-sky-500 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all cursor-pointer shadow-md shadow-sky-500/25"
              >
                RECONNECT & VERIFY SAFE
              </button>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className={`font-bold flex items-center gap-2 ${commsX1 === 'BLACKOUT' ? 'text-amber-700' : 'text-sky-800'}`}>
                <span className={`h-2 w-2 rounded-full ${commsX1 === 'BLACKOUT' ? 'bg-amber-500 animate-ping' : 'bg-sky-500'}`} />
                {commsX1 === 'BLACKOUT' ? 'SIGNAL CUT — LAST MESSAGE LOCKED' : 'DOWNLINK ACTIVE — CONTINUOUS PACKET STREAM'}
              </span>
              <span className="text-slate-400">{packetX1.packetId}</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">{packetX1.safetyReason}</p>
          </div>
        </div>

        <div className={`rounded-xl border p-5 shadow-sm transition-all ${commsB2 === 'BLACKOUT' ? 'border-amber-300 bg-amber-50/50' : 'border-sky-200 bg-white'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
            <div>
              <div className="font-mono text-xs text-sky-700 font-semibold">BLACKBOX TELEMETRY BUFFER</div>
              <h4 className="font-display text-base font-bold text-slate-900">SENTINEL-B2 Link Station</h4>
            </div>
            {commsB2 !== 'BLACKOUT' ? (
              <button
                onClick={() => handleCutComms('SENTINEL-B2')}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-mono text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                SIMULATE COMMS LOSS (CUT)
              </button>
            ) : (
              <button
                onClick={() => handleReconnectComms('SENTINEL-B2')}
                className="rounded-lg bg-sky-500 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all cursor-pointer shadow-md shadow-sky-500/25"
              >
                RECONNECT & VERIFY SAFE
              </button>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className={`font-bold flex items-center gap-2 ${commsB2 === 'BLACKOUT' ? 'text-amber-700' : 'text-sky-800'}`}>
                <span className={`h-2 w-2 rounded-full ${commsB2 === 'BLACKOUT' ? 'bg-amber-500 animate-ping' : 'bg-sky-500'}`} />
                {commsB2 === 'BLACKOUT' ? 'SIGNAL CUT — LAST MESSAGE LOCKED' : 'DOWNLINK ACTIVE — CONTINUOUS PACKET STREAM'}
              </span>
              <span className="text-slate-400">{packetB2.packetId}</span>
            </div>
            <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">{packetB2.safetyReason}</p>
          </div>
        </div>
      </div>

      {/* 5. Spacecraft Anti-Hack Diagnostics */}
      <section className="rounded-xl border border-sky-200 bg-white p-5 shadow-sm shadow-sky-100/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
          <div>
            <div className="font-mono text-xs text-sky-700 font-semibold flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-sky-600" />
              <span>HARDWARE-ISOLATED CYBERSECURITY & LINK INTEGRITY</span>
            </div>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900 tracking-wide">
              Spacecraft Anti-Hack Diagnostics & Unauthorized Access Protection
            </h3>
          </div>

          <button
            onClick={handleSimulateIntrusion}
            className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 font-mono text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs cursor-pointer"
          >
            TEST UNAUTHORIZED ATTEMPT (SIMULATE HACK ATTEMPT)
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-sky-300 bg-sky-50/60 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-sky-800 tracking-wide">
                ✓ SATELLITE HACK CHECK: FALSE (100% CRYPTOGRAPHICALLY VERIFIED & SECURE)
              </div>
              <p className="mt-0.5 text-xs text-slate-700">
                Uplink protected via <strong>CCSDS SDLS AES-256-GCM</strong> with hardware-isolated <strong>ECDSA-P384</strong> frame signing. Zero rogue commands executed.
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-700 rounded-md bg-white px-3 py-1.5 border border-sky-200 shadow-xs">
            ANTI-REPLAY TOKEN: <strong className="text-slate-900">#{securityX1.authKeyCounter}</strong>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-sky-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 mb-2.5">
            <span>UNAUTHORIZED ACCESS ATTEMPTS LOG (ALL AUTOMATICALLY BLOCKED)</span>
            <span className="text-rose-600 font-bold">{securityAlerts.length} ATTEMPTS QUARANTINED</span>
          </div>
          <div className="space-y-2">
            {securityAlerts.map((alt) => (
              <div
                key={alt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-sky-200 bg-sky-50/30 p-3 text-xs font-mono shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 font-bold">{alt.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-900 font-semibold">{alt.satellite}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-sky-800">{alt.type}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">{alt.origin} — {alt.details}</div>
                </div>
                <span className="rounded-md bg-sky-100 px-2.5 py-1 text-sky-800 font-bold text-[11px] border border-sky-300 whitespace-nowrap self-start sm:self-auto">
                  BLOCKED BY FPGA FIREWALL
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
