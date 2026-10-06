import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  X,
  Search,
  Eye,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Radio,
  Compass,
  Thermometer,
  Cpu,
} from 'lucide-react';
import { SubsystemKey } from './RealisticSpacecraftCanvas';

export interface SubsystemAlertToast {
  id: string;
  subsystemKey: SubsystemKey;
  subsystemName: string;
  status: 'WARNING' | 'CRITICAL';
  metricLabel: string;
  metricValue: string;
  secondaryMetric?: string;
  message: string;
  timestamp: string;
  timestampMs: number;
}

interface ToastNotificationSystemProps {
  toasts: SubsystemAlertToast[];
  onDismiss: (id: string) => void;
  onInvestigate: (toast: SubsystemAlertToast) => void;
  onInspectSubsystem: (key: SubsystemKey) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const SUBSYSTEM_ICONS: Record<SubsystemKey, React.ComponentType<{ className?: string }>> = {
  POWER: Zap,
  COMMUNICATION: Radio,
  ATTITUDE: Compass,
  THERMAL: Thermometer,
  COMPUTE: Cpu,
};

export const ToastNotificationSystem: React.FC<ToastNotificationSystemProps> = ({
  toasts,
  onDismiss,
  onInvestigate,
  onInspectSubsystem,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div
      className="fixed top-14 right-4 z-50 flex flex-col gap-3 w-full max-w-md pointer-events-none sm:max-w-lg"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <SingleToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onInvestigate={onInvestigate}
          onInspectSubsystem={onInspectSubsystem}
        />
      ))}
    </div>
  );
};

interface SingleToastItemProps {
  toast: SubsystemAlertToast;
  onDismiss: (id: string) => void;
  onInvestigate: (toast: SubsystemAlertToast) => void;
  onInspectSubsystem: (key: SubsystemKey) => void;
}

const SingleToastItem: React.FC<SingleToastItemProps> = ({
  toast,
  onDismiss,
  onInvestigate,
  onInspectSubsystem,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const durationMs = toast.status === 'CRITICAL' ? 9000 : 7000;
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;
    let lastTick = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTick;
      lastTick = now;

      if (!isHovered) {
        elapsedRef.current += delta;
        const remaining = Math.max(0, 100 - (elapsedRef.current / durationMs) * 100);
        setProgress(remaining);

        if (elapsedRef.current >= durationMs) {
          onDismiss(toast.id);
          return;
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, durationMs, onDismiss, toast.id]);

  const IconCmp = SUBSYSTEM_ICONS[toast.subsystemKey] || AlertTriangle;
  const isCritical = toast.status === 'CRITICAL';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 font-sans transform translate-y-0 opacity-100 ${
        isCritical
          ? 'bg-slate-950/95 border-rose-500/80 shadow-[0_12px_30px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/50'
          : 'bg-slate-950/95 border-amber-500/80 shadow-[0_12px_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40'
      }`}
    >
      {/* Top Accent Strip with Pulse */}
      <div
        className={`h-1.5 w-full ${
          isCritical ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-400' : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400'
        }`}
      />

      <div className="p-4 sm:p-4.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono font-bold shadow-xs ${
                isCritical
                  ? 'border-rose-400/50 bg-rose-950/80 text-rose-300'
                  : 'border-amber-400/50 bg-amber-950/80 text-amber-300'
              }`}
            >
              <IconCmp className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isCritical ? <AlertOctagon className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {toast.status} STATE TRANSITION
                </span>
                <span className="font-mono text-[11px] text-slate-400">{toast.timestamp}</span>
              </div>
              <h4 className="mt-0.5 text-sm font-bold text-white tracking-wide">
                {toast.subsystemName}
              </h4>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message and Metric Callout */}
        <div className="mt-2.5 space-y-1.5 text-xs">
          <p className="text-slate-300 leading-relaxed">{toast.message}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-300">
              <strong className="text-slate-400">{toast.metricLabel}:</strong>{' '}
              <span className={isCritical ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                {toast.metricValue}
              </span>
            </span>
            {toast.secondaryMetric && (
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-300">
                {toast.secondaryMetric}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onInvestigate(toast)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
                isCritical
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>INVESTIGATE</span>
              <ArrowRight className="h-3 w-3" />
            </button>

            <button
              onClick={() => onInspectSubsystem(toast.subsystemKey)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>INSPECT 3D</span>
            </button>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-1.5 py-1"
          >
            Acknowledge
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="h-1 w-full bg-slate-900/60 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ${
            isCritical ? 'bg-rose-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Web Audio alert synthesis
export function playSubsystemAlertTone(status: 'WARNING' | 'CRITICAL') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (status === 'CRITICAL') {
      // Crisp 2-tone klaxon chirp
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else {
      // Smooth amber advisory chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {
    // Graceful fallback if audio context not permitted by user interaction policy
  }
}
