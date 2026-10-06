import React, { useState } from 'react';
import {
  Zap,
  Radio,
  Compass,
  Thermometer,
  Cpu,
  ArrowRight,
  Eye,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Image as ImageIcon,
  RotateCcw as ResetIcon,
  Play,
  TrendingDown,
} from 'lucide-react';
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
import { RealisticSpacecraftCanvas, SubsystemKey, SubsystemStatus } from './RealisticSpacecraftCanvas';
import { CompleteSatelliteImage } from './CompleteSatelliteImage';
import { TelemetryPoint } from '../types';

interface OverviewViewProps {
  currentTelX1: TelemetryPoint;
  telemetryHistory: TelemetryPoint[];
  incidentId: string;
  isIncidentActive: boolean;
  anomalyScore: number;
  calculatedHealthPercent: number;
  currentSubsystems: Record<SubsystemKey, SubsystemStatus>;
  onInvestigate: () => void;
  onOpenInspect: (subsystemKey?: SubsystemKey) => void;
  onResetNominal?: () => void;
  onStartReplay?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentTelX1,
  telemetryHistory,
  incidentId,
  isIncidentActive,
  anomalyScore,
  calculatedHealthPercent,
  currentSubsystems,
  onInvestigate,
  onOpenInspect,
  onResetNominal,
  onStartReplay,
}) => {
  const [viewMode, setViewMode] = useState<'IMAGE' | '3D'>('IMAGE');
  const [selectedChartMetric, setSelectedChartMetric] = useState<'battery_voltage' | 'solar_power' | 'signal_strength' | 'temperature'>('battery_voltage');

  // Format chart data for all selectable metrics
  const chartData = telemetryHistory.map((pt) => ({
    time: pt.time,
    battery_voltage: pt.battery_voltage,
    solar_power: pt.solar_power,
    signal_strength: pt.signal_strength,
    temperature: pt.temperature,
    baseline_mid: 28.25,
  }));

  const metricConfigs = {
    battery_voltage: {
      name: 'Primary Bus 1 Battery Voltage',
      unit: 'V',
      domain: [24, 30] as [number, number],
      color: '#0284c7',
      nominalMin: 27.5,
      nominalMax: 29.0,
      warnThreshold: 27.0,
      critThreshold: 25.5,
      currentVal: `${currentTelX1.battery_voltage.toFixed(2)} V`,
      status: currentTelX1.battery_voltage < 25.5 ? 'CRITICAL' : currentTelX1.battery_voltage < 27.2 ? 'WARNING' : 'NORMAL',
    },
    solar_power: {
      name: 'Solar Array Generation',
      unit: 'W',
      domain: [250, 650] as [number, number],
      color: '#10b981',
      nominalMin: 450,
      nominalMax: 600,
      warnThreshold: 450,
      critThreshold: 380,
      currentVal: `${currentTelX1.solar_power} W`,
      status: currentTelX1.solar_power < 380 ? 'CRITICAL' : currentTelX1.solar_power < 450 ? 'WARNING' : 'NORMAL',
    },
    signal_strength: {
      name: 'S-Band Carrier Signal Strength',
      unit: 'dBm',
      domain: [-65, -45] as [number, number],
      color: '#f59e0b',
      nominalMin: -55,
      nominalMax: -48,
      warnThreshold: -56,
      critThreshold: -60,
      currentVal: `${currentTelX1.signal_strength.toFixed(1)} dBm`,
      status: currentTelX1.signal_strength < -60 ? 'CRITICAL' : currentTelX1.signal_strength < -55 ? 'WARNING' : 'NORMAL',
    },
    temperature: {
      name: 'Battery Core Temperature',
      unit: '°C',
      domain: [30, 55] as [number, number],
      color: '#ef4444',
      nominalMin: 35,
      nominalMax: 50,
      warnThreshold: 48,
      critThreshold: 52,
      currentVal: `${currentTelX1.temperature.toFixed(1)} °C`,
      status: currentTelX1.temperature > 52 ? 'CRITICAL' : currentTelX1.temperature > 48 ? 'WARNING' : 'NORMAL',
    },
  };

  const activeMetric = metricConfigs[selectedChartMetric];

  return (
    <div className="space-y-10 font-sans pb-10">
      {/* ========================================================
          1. SPACECRAFT STATUS & SATELLITE ASSET VIEWPORT
      ======================================================== */}
      <section className="border-b border-sky-100 pb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
          {/* Spacecraft Visual Viewport (Spacious Complete Satellite) */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="relative h-[360px] sm:h-[400px] w-full rounded-2xl overflow-hidden border border-sky-300 bg-slate-950 shadow-lg">
              {viewMode === 'IMAGE' ? (
                <CompleteSatelliteImage
                  subsystems={currentSubsystems}
                  onSelectSubsystem={(key) => onOpenInspect(key)}
                  showLabels={true}
                />
              ) : (
                <RealisticSpacecraftCanvas
                  telemetry={currentTelX1}
                  satelliteId="ORBIT-X1"
                  isIncidentActive={isIncidentActive}
                  incidentId={incidentId}
                  incidentSeverity="CRITICAL"
                  onOpenIncident={onInvestigate}
                  onInspectSpacecraft={() => onOpenInspect()}
                  anomalyScore={anomalyScore}
                />
              )}

              {/* View Mode Toggle Pill in Top-Left */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 backdrop-blur-md border border-slate-700 shadow-md">
                <button
                  onClick={() => setViewMode('IMAGE')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    viewMode === 'IMAGE'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>COMPLETE SATELLITE</span>
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    viewMode === '3D'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>3D CAD TWIN</span>
                </button>
              </div>

              {/* Quick Inspect Button in top-right */}
              <button
                onClick={() => onOpenInspect('POWER')}
                className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-mono text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>INSPECT 3D CAD</span>
              </button>
            </div>
            <div className="mt-2 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>
                {viewMode === 'IMAGE'
                  ? 'Complete Symmetrical LEO Spacecraft · Click any subsystem component on the satellite to inspect'
                  : 'Interactive 3D Digital Twin · Drag to rotate · Scroll to zoom'}
              </span>
            </div>
          </div>

          {/* Spacecraft Health & Subsystems Status */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-sky-700 tracking-wider">
                  SPACECRAFT ORBIT-X1
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-xs text-slate-500">542 KM SSO POLAR</span>
              </div>

              <div className="mt-2 flex flex-wrap items-baseline gap-4">
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                  Spacecraft Health Overview
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  HEALTH: {calculatedHealthPercent}% (ATTENTION)
                </span>
              </div>

              <p className="mt-2 text-base text-slate-600 leading-relaxed">
                Primary electrical bus experiencing anomalous voltage sag following solar array azimuth transit. Subsystem controllers active. Click any subsystem below to inspect physical components.
              </p>
            </div>

            {/* Subsystem Interactive Buttons */}
            <div className="pt-2 border-t border-sky-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  SUBSYSTEM OPERATIONAL STATUS (CLICK TO INSPECT)
                </span>
                <span className="text-[11px] font-mono text-sky-600">5 CHANNELS ONLINE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                {/* POWER */}
                <button
                  onClick={() => onOpenInspect('POWER')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <Zap className="h-3.5 w-3.5" />
                    <span>EPS</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1 text-[11px]">{currentTelX1.battery_voltage.toFixed(1)} V</div>
                  <div className="text-[10px] text-rose-600 font-bold mt-0.5">🔴 CRITICAL</div>
                </button>

                {/* COMMUNICATION */}
                <button
                  onClick={() => onOpenInspect('COMMUNICATION')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Radio className="h-3.5 w-3.5" />
                    <span>TT&C</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1 text-[11px]">{currentTelX1.signal_strength.toFixed(1)} dBm</div>
                  <div className="text-[10px] text-amber-700 font-bold mt-0.5">🟠 WARNING</div>
                </button>

                {/* ATTITUDE */}
                <button
                  onClick={() => onOpenInspect('ATTITUDE')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Compass className="h-3.5 w-3.5" />
                    <span>ADCS</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1 text-[11px]">0.18° Err</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">🟢 NOMINAL</div>
                </button>

                {/* THERMAL */}
                <button
                  onClick={() => onOpenInspect('THERMAL')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Thermometer className="h-3.5 w-3.5" />
                    <span>TCS</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1 text-[11px]">{currentTelX1.temperature.toFixed(1)} °C</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">🟢 NOMINAL</div>
                </button>

                {/* COMPUTE */}
                <button
                  onClick={() => onOpenInspect('COMPUTE')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>OBC</span>
                  </div>
                  <div className="text-slate-900 font-bold mt-1 text-[11px]">LEON4 Lock</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">🟢 NOMINAL</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ACTIVE INCIDENT (INC-024) ACTION CENTER
      ======================================================== */}
      <section className="rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-rose-600 text-white font-mono text-xs font-bold tracking-wider">
                {incidentId}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-mono text-xs font-bold">
                HIGH PRIORITY
              </span>
              <span className="text-slate-500 font-mono text-xs">EVENT DISPATCH: 14:31:58 UTC (EV-204)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Battery Voltage Degradation Following EV-204 Power Configuration
            </h2>

            <div className="flex flex-wrap items-center gap-6 pt-1 font-mono text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">ML Anomaly Score:</span>
                <span className="text-xl font-bold text-rose-600">
                  {anomalyScore.toFixed(2)} (91%)
                </span>
              </div>

              <div className="text-slate-300">|</div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Evidence Grounding:</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  PARTIAL (Abstention Active)
                </span>
              </div>

              <div className="text-slate-300">|</div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Recommended SOP:</span>
                <span className="font-bold text-sky-800 text-xs">P-017 (Bus Shedding)</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onInvestigate}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold tracking-wider transition-all shadow-md shadow-rose-600/30 cursor-pointer"
            >
              <span>LAUNCH INVESTIGATION CONSOLE</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onResetNominal && (
              <button
                onClick={onResetNominal}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer"
                title="Reset all telemetry and subsystems to nominal baseline"
              >
                <ResetIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>RESET NOMINAL</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. INTERACTIVE TELEMETRY TREND CHART WITH METRIC TABS
      ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Real-Time Telemetry Trend Explorer</h3>
            <p className="text-xs font-mono text-slate-500">Live 1.5s calibrated telemetry stream with envelope thresholds</p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-sky-50 border border-sky-200 font-mono text-xs">
            <button
              onClick={() => setSelectedChartMetric('battery_voltage')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedChartMetric === 'battery_voltage'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-800'
              }`}
            >
              Battery Voltage
            </button>
            <button
              onClick={() => setSelectedChartMetric('solar_power')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedChartMetric === 'solar_power'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-800'
              }`}
            >
              Solar Power
            </button>
            <button
              onClick={() => setSelectedChartMetric('signal_strength')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedChartMetric === 'signal_strength'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-800'
              }`}
            >
              RF Downlink
            </button>
            <button
              onClick={() => setSelectedChartMetric('temperature')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedChartMetric === 'temperature'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-800'
              }`}
            >
              Temperature
            </button>
          </div>
        </div>

        {/* Current Metric Stat Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-1">
          <div className="p-3 rounded-xl border border-sky-200 bg-white">
            <div className="text-slate-500">CURRENT VALUE</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{activeMetric.currentVal}</div>
          </div>
          <div className="p-3 rounded-xl border border-sky-200 bg-white">
            <div className="text-slate-500">NOMINAL ENVELOPE</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">{activeMetric.nominalMin} – {activeMetric.nominalMax} {activeMetric.unit}</div>
          </div>
          <div className="p-3 rounded-xl border border-sky-200 bg-white">
            <div className="text-slate-500">WARNING THRESHOLD</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">{activeMetric.warnThreshold} {activeMetric.unit}</div>
          </div>
          <div className="p-3 rounded-xl border border-sky-200 bg-white">
            <div className="text-slate-500">CRITICAL THRESHOLD</div>
            <div className="text-lg font-bold text-rose-700 mt-0.5">{activeMetric.critThreshold} {activeMetric.unit}</div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={activeMetric.domain}
                  stroke="#64748b"
                  unit={activeMetric.unit}
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                <ReferenceArea
                  y1={activeMetric.nominalMin}
                  y2={activeMetric.nominalMax}
                  fill="#10b981"
                  fillOpacity={0.08}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={activeMetric.critThreshold}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: `CRIT ${activeMetric.critThreshold}`, fill: '#ef4444', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedChartMetric}
                  name={activeMetric.name}
                  stroke={activeMetric.color}
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};
