import React, { useState } from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Volume2,
  VolumeX,
  Search,
  Eye,
  Trash2,
  Radio,
  Zap,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { SubsystemKey } from './RealisticSpacecraftCanvas';
import { SubsystemAlertToast } from './ToastNotificationSystem';

interface AlertCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alertsHistory: SubsystemAlertToast[];
  onClearHistory: () => void;
  onInvestigate: (toast: SubsystemAlertToast) => void;
  onInspectSubsystem: (key: SubsystemKey) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerTestAlert: (subsystem: SubsystemKey, severity: 'WARNING' | 'CRITICAL') => void;
}

export const AlertCenterDrawer: React.FC<AlertCenterDrawerProps> = ({
  isOpen,
  onClose,
  alertsHistory,
  onClearHistory,
  onInvestigate,
  onInspectSubsystem,
  soundEnabled,
  onToggleSound,
  onTriggerTestAlert,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  if (!isOpen) return null;

  const filteredAlerts = alertsHistory.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-sky-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700">REAL-TIME TELEMETRY</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-xs text-slate-500">MISSION DISPATCH</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Operator Alert Center</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls Bar: Audio toggle & Test Trigger */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs font-mono">
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'border-sky-300 bg-sky-50 text-sky-800'
                  : 'border-slate-300 bg-white text-slate-600'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-sky-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
              <span>Chime: {soundEnabled ? 'ENABLED' : 'MUTED'}</span>
            </button>

            {alertsHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            {(['ALL', 'CRITICAL', 'WARNING'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filter === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t} ({alertsHistory.filter((a) => (t === 'ALL' ? true : a.status === t)).length})
              </button>
            ))}
          </div>

          {/* Quick Simulation Trigger Section */}
          <div className="px-6 py-3.5 bg-sky-50/50 border-b border-sky-100">
            <div className="text-[11px] font-mono font-bold text-sky-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-sky-600" />
              <span>TEST SUBSYSTEM ALERT INJECTION:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => onTriggerTestAlert('POWER', 'CRITICAL')}
                className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <AlertOctagon className="h-3.5 w-3.5 text-rose-600" />
                <span>EPS Critical (24.8V)</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('COMMUNICATION', 'WARNING')}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>TT&C Warning (-57dBm)</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('THERMAL', 'WARNING')}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>TCS Warning (49.2°C)</span>
              </button>

              <button
                onClick={() => onTriggerTestAlert('ATTITUDE', 'WARNING')}
                className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors text-left flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>ADCS Warning (0.65°)</span>
              </button>
            </div>
          </div>

          {/* Alert Stream List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 px-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-slate-800">No Alerts In History</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  All subsystems are operating nominally, or previous session alerts have been cleared.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCrit = alert.status === 'CRITICAL';
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCrit
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-amber-50/70 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isCrit ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                        }`}
                      >
                        {alert.status}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{alert.timestamp}</span>
                    </div>

                    <h5 className="mt-2 text-sm font-bold text-slate-900">{alert.subsystemName}</h5>
                    <p className="mt-1 text-xs text-slate-600">{alert.message}</p>

                    <div className="mt-2 font-mono text-[11px] text-slate-700 bg-white/80 p-2 rounded border border-slate-200">
                      <strong>{alert.metricLabel}:</strong> {alert.metricValue}
                      {alert.secondaryMetric && ` · ${alert.secondaryMetric}`}
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-200/80 pt-2 font-mono text-xs">
                      <button
                        onClick={() => {
                          onInspectSubsystem(alert.subsystemKey);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => {
                          onInvestigate(alert);
                          onClose();
                        }}
                        className={`px-3 py-1 rounded text-white font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                          isCrit ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        <Search className="h-3 w-3" />
                        <span>Investigate</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
