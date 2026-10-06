import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Radio,
  Compass,
  Thermometer,
  Cpu,
  Layers,
  ChevronRight,
  Globe2,
  Clock,
  Wifi,
  Shield,
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
import { TelemetryPoint } from '../types';

interface TelemetryPageViewProps {
  telemetryX1: TelemetryPoint[];
  telemetryB2: TelemetryPoint[];
  currentTelX1: TelemetryPoint;
  currentTelB2: TelemetryPoint;
  selectedSat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH';
  onSelectSat: (sat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH') => void;
}

export const TelemetryPageView: React.FC<TelemetryPageViewProps> = ({
  telemetryX1,
  telemetryB2,
  currentTelX1,
  currentTelB2,
  selectedSat,
  onSelectSat,
}) => {
  // Tabs: [ OVERVIEW ] [ POWER ] [ COMMUNICATION ] [ ATTITUDE ] [ THERMAL ] [ COMPUTE ]
  const [activeSubsystemTab, setActiveSubsystemTab] = useState<
    'OVERVIEW' | 'POWER' | 'COMMUNICATION' | 'ATTITUDE' | 'THERMAL' | 'COMPUTE'
  >('OVERVIEW');

  // Active satellite data source
  const currentTel = selectedSat === 'SENTINEL-B2' ? currentTelB2 : currentTelX1;
  const historyData = selectedSat === 'SENTINEL-B2' ? telemetryB2 : telemetryX1;

  // Format chart data
  const chartData = historyData.map((pt, i) => {
    const ptB2 = telemetryB2[i] || telemetryB2[telemetryB2.length - 1];
    return {
      time: pt.time,
      battery_voltage: pt.battery_voltage,
      solar_power: pt.solar_power,
      signal_strength: pt.signal_strength,
      temperature: pt.temperature,
      speed_kms: pt.speed_kms,
      // Synthetic attitude and compute metrics
      pointing_error_deg: Number((0.18 + Math.sin(i * 0.3) * 0.04).toFixed(3)),
      wheel_rpm: Math.round(4200 + Math.cos(i * 0.4) * 85),
      cpu_load_pct: Math.round(34 + Math.sin(i * 0.2) * 8),
      memory_used_mb: Math.round(512 + Math.cos(i * 0.1) * 24),
    };
  });

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header with Satellite Selector */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Activity className="h-4 w-4" />
            <span>FOUNDATIONAL TELEMETRY EXPLORER</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Detailed Subsystem Telemetry Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Real-time calibrated sensor streams providing foundational signal inputs to the ML anomaly and correlation pipeline.
          </p>
        </div>

        {/* Satellite Selection Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sky-50 border border-sky-200 font-mono text-xs font-bold">
          <button
            onClick={() => onSelectSat('ORBIT-X1')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedSat === 'ORBIT-X1' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            ORBIT-X1 (542 km)
          </button>
          <button
            onClick={() => onSelectSat('SENTINEL-B2')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedSat === 'SENTINEL-B2' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            SENTINEL-B2 (685 km)
          </button>
        </div>
      </div>

      {/* Subsystem Tabs (Section 11) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-200 pb-3 font-mono text-xs">
        <span className="text-slate-400 font-bold mr-2">SUBSYSTEM:</span>
        {(['OVERVIEW', 'POWER', 'COMMUNICATION', 'ATTITUDE', 'THERMAL', 'COMPUTE'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubsystemTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSubsystemTab === tab
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================================
          TAB CONTENT: ONLY SHOW CHARTS FOR SELECTED SUBSYSTEM!
          (Section 11: Do NOT display 8 large graphs simultaneously)
      ======================================================== */}

      {/* 1. OVERVIEW TAB: Compact Summary of All 5 with 1 Unified Trend Chart */}
      {activeSubsystemTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <div className="text-slate-500">POWER BUS</div>
              <div className="text-lg font-bold text-rose-700 mt-1">{currentTel.battery_voltage.toFixed(2)} V</div>
              <div className="text-[10px] text-rose-600">🔴 Critical Dip</div>
            </div>

            <div className="p-3 rounded-xl border border-sky-200 bg-white">
              <div className="text-slate-500">SOLAR ARRAY</div>
              <div className="text-lg font-bold text-sky-800 mt-1">{currentTel.solar_power} W</div>
              <div className="text-[10px] text-emerald-600">🟢 310–520 W Transit</div>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="text-slate-500">COMMUNICATION</div>
              <div className="text-lg font-bold text-amber-800 mt-1">{currentTel.signal_strength.toFixed(1)} dBm</div>
              <div className="text-[10px] text-amber-700">🟠 Throttled PA</div>
            </div>

            <div className="p-3 rounded-xl border border-sky-200 bg-white">
              <div className="text-slate-500">THERMAL TCS</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{currentTel.temperature.toFixed(1)} °C</div>
              <div className="text-[10px] text-emerald-600">🟢 Louvers Active</div>
            </div>

            <div className="p-3 rounded-xl border border-sky-200 bg-white">
              <div className="text-slate-500">ADCS POINTING</div>
              <div className="text-lg font-bold text-slate-900 mt-1">0.18° Err</div>
              <div className="text-[10px] text-emerald-600">🟢 4,200 RPM Wheels</div>
            </div>
          </div>

          {/* Unified Primary Trend Chart */}
          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Power & Generation Cross-Correlation</h3>
                <p className="text-xs font-mono text-slate-500">Battery voltage vs Solar generation over sample window</p>
              </div>
              <span className="font-mono text-xs text-sky-700 font-semibold">{selectedSat} DUAL-AXIS</span>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis yAxisId="left" domain={[24, 30]} stroke="#0284c7" unit="V" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[250, 600]} stroke="#10b981" unit="W" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                  <Line yAxisId="left" type="monotone" dataKey="battery_voltage" name="Battery Voltage (V)" stroke="#0284c7" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="solar_power" name="Solar Power (W)" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. POWER TAB */}
      {activeSubsystemTab === 'POWER' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800">
            <strong>ELECTRICAL POWER SUBSYSTEM (EPS):</strong> Monitoring 28V Primary Bus, Battery String B cell balancing, and solar array shunt limiter circuits. Anomaly active on Bus 1.
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Primary Bus 1 Battery Voltage (High-Resolution)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis domain={[24, 30]} stroke="#64748b" unit="V" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <ReferenceArea y1={27.5} y2={29.0} fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeDasharray="3 3" />
                  <ReferenceLine y={25.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'CRIT 25.5V', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="battery_voltage" name="Bus 1 Voltage (V)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. COMMUNICATION TAB */}
      {activeSubsystemTab === 'COMMUNICATION' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800">
            <strong>TELECOMMUNICATIONS SUBSYSTEM (TTC):</strong> S-band 2.2 GHz QPSK downlink. RF amplifier power throttled to 7W following undervoltage protection latch.
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">S-Band Carrier Signal Strength (dBm)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis domain={[-65, -45]} stroke="#64748b" unit="dBm" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <ReferenceLine y={-58.0} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'WARN -58 dBm', fill: '#f59e0b', fontSize: 10 }} />
                  <Line type="monotone" dataKey="signal_strength" name="Signal Strength (dBm)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. ATTITUDE TAB */}
      {activeSubsystemTab === 'ATTITUDE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <strong>ATTITUDE DETERMINATION & CONTROL (ADCS):</strong> 3-axis stabilized via dual star trackers and 4 reaction wheels in pyramid configuration. Pointing error steady at 0.18°.
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Boresight Pointing Error (Degrees)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis domain={[0.1, 0.3]} stroke="#64748b" unit="°" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="pointing_error_deg" name="Pointing Error (°)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 5. THERMAL TAB */}
      {activeSubsystemTab === 'THERMAL' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <strong>THERMAL CONTROL SUBSYSTEM (TCS):</strong> Battery core temperature 43.2°C (nominal envelope 35–50°C). Active louvers currently deployed at 65%.
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Battery Pack Core Temperature (°C)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis domain={[30, 55]} stroke="#64748b" unit="°C" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <ReferenceArea y1={35} y2={50} fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="temperature" name="Battery Core Temp (°C)" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPUTE TAB */}
      {activeSubsystemTab === 'COMPUTE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <strong>ON-BOARD COMPUTER (OBC):</strong> Dual radiation-hardened LEON4 processors operating lockstep. FPGA hardware cryptographic module armed. Memory utilization 512 MB.
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">LEON4 On-Board Processor Load (%)</h3>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" unit="%" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="cpu_load_pct" name="CPU Load (%)" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
