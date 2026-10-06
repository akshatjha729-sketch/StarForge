import React, { useState, useEffect } from 'react';
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
  Radio,
  WifiOff,
  Shield,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  Zap,
  Sun,
  Thermometer,
  Cpu,
  Globe2,
  Signal,
  Layers,
  Compass,
  Satellite,
  Clock,
  ChevronRight,
  Image as ImageIcon,
  Search,
  BookOpen,
  Brain,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { SatelliteId, TelemetryPoint, CommsStatus, LastKnownPacket, SecurityDiagnostics, SecurityAlert } from './types';
import {
  generateInitialTelemetry,
  calculateOrbit,
  createInitialPacket,
  createInitialSecurity,
  INITIAL_SECURITY_ALERTS,
} from './utils';
import { WorldOrbitMap } from './components/WorldOrbitMap';
import { ExplainFlowModal } from './components/ExplainFlowModal';
import { RealisticSpacecraftCanvas, SubsystemKey, SubsystemStatus } from './components/RealisticSpacecraftCanvas';
import { InspectSpacecraftModal } from './components/InspectSpacecraftModal';
import { IncidentInvestigationModal } from './components/IncidentInvestigationModal';
import { Play, RotateCcw as ResetIcon, Eye, AlertOctagon, ArrowLeft, ArrowRight, Sparkles, Home as HomeIcon, Bell, Volume2, VolumeX } from 'lucide-react';
import { ToastNotificationSystem, SubsystemAlertToast, playSubsystemAlertTone } from './components/ToastNotificationSystem';
import { AlertCenterDrawer } from './components/AlertCenterDrawer';
import { HomeLandingView } from './components/HomeLandingView';
import { OverviewView } from './components/OverviewView';
import { InvestigationPageView } from './components/InvestigationPageView';
import { EvidencePageView } from './components/EvidencePageView';
import { AuditPageView } from './components/AuditPageView';
import { SafetyPageView } from './components/SafetyPageView';
import { TelemetryPageView } from './components/TelemetryPageView';
import { IncidentsPageView } from './components/IncidentsPageView';
import { CopilotPageView } from './components/CopilotPageView';
import { SimulationPageView } from './components/SimulationPageView';
import { ArchitecturePageView } from './components/ArchitecturePageView';
import {
  computeRealMLAnomaly,
  DEFAULT_CORRELATION_EVENTS,
  DEFAULT_CLAIM_VALIDATIONS,
  PREBUILT_INVESTIGATIONS,
} from './services/intelligenceEngine';
import { PipelineStageKey } from './types/intelligence';

export type TabKey =
  | 'overview'
  | 'telemetry'
  | 'incidents'
  | 'investigation'
  | 'copilot'
  | 'evidence'
  | 'audit'
  | 'safety'
  | 'simulation'
  | 'architecture'
  | 'home'
  | 'spacecraft'
  | 'anomaly'
  | 'history';

export default function App() {
  // Active satellite selection: 'ORBIT-X1', 'SENTINEL-B2', or 'BOTH'
  const [selectedSat, setSelectedSat] = useState<'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH'>('ORBIT-X1');

  // Active tab selection (default is the animated Home tab)
  const [activeNav, setActiveNav] = useState<TabKey>('home');

  // Evidence source ID if navigated with detail drawer intent
  const [selectedEvidenceSourceId, setSelectedEvidenceSourceId] = useState<string | null>(null);

  // Metric to graph: 'battery_voltage' | 'solar_power' | 'signal_strength' | 'temperature'
  const [metricKey, setMetricKey] = useState<'battery_voltage' | 'solar_power' | 'signal_strength' | 'temperature'>('battery_voltage');

  // Telemetry streams
  const [telemetryX1, setTelemetryX1] = useState<TelemetryPoint[]>(() => {
    const pts = generateInitialTelemetry('ORBIT-X1', 28);
    // Seed tail with the active INC-024 battery drop
    if (pts.length > 5) {
      pts[pts.length - 3].battery_voltage = 26.8;
      pts[pts.length - 2].battery_voltage = 25.4;
      pts[pts.length - 1].battery_voltage = 24.8;
      pts[pts.length - 1].solar_power = 310;
      pts[pts.length - 1].signal_strength = -57.2;
    }
    return pts;
  });
  const [telemetryB2, setTelemetryB2] = useState<TelemetryPoint[]>(() => generateInitialTelemetry('SENTINEL-B2', 28));

  // Incident & Replay state (Landing Experience: INC-024 active by default)
  const [isIncidentActive, setIsIncidentActive] = useState<boolean>(true);
  const [incidentId, setIncidentId] = useState<string>('INC-024');
  const [anomalyScore, setAnomalyScore] = useState<number>(0.91);
  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStageKey>('DETECT');
  const [replayStep, setReplayStep] = useState<
    'IDLE' | 'STEP_1_NORMAL' | 'STEP_2_POWER_CONFIG' | 'STEP_3_BATTERY_DEGRADE' | 'STEP_4_COMMS_DEGRADE' | 'STEP_5_INCIDENT_CREATED'
  >('STEP_5_INCIDENT_CREATED');
  const [subsystemOverrides, setSubsystemOverrides] = useState<Partial<Record<SubsystemKey, 'NORMAL' | 'WARNING' | 'CRITICAL'>>>({
    POWER: 'CRITICAL',
    COMMUNICATION: 'WARNING',
  });

  // Real-time Subsystem Toasts & Alert History
  const [toasts, setToasts] = useState<SubsystemAlertToast[]>([]);
  const [alertsHistory, setAlertsHistory] = useState<SubsystemAlertToast[]>([]);
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inspectInitialSubsystem, setInspectInitialSubsystem] = useState<SubsystemKey | undefined>(undefined);

  // Subsystem state transition tracking ref
  const prevSubsystemsRef = React.useRef<Record<SubsystemKey, 'NORMAL' | 'WARNING' | 'CRITICAL'>>({
    POWER: 'NORMAL',
    COMMUNICATION: 'NORMAL',
    ATTITUDE: 'NORMAL',
    THERMAL: 'NORMAL',
    COMPUTE: 'NORMAL',
  });
  const isInitialAlertFiredRef = React.useRef(false);

  // Modals state
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [isInvestigationOpen, setIsInvestigationOpen] = useState(false);

  // Communication states
  const [commsX1, setCommsX1] = useState<CommsStatus>('ONLINE');
  const [commsB2, setCommsB2] = useState<CommsStatus>('ONLINE');

  // Last known packets (Blackbox data when comms cut)
  const [packetX1, setPacketX1] = useState<LastKnownPacket>(() => createInitialPacket('ORBIT-X1'));
  const [packetB2, setPacketB2] = useState<LastKnownPacket>(() => createInitialPacket('SENTINEL-B2'));

  // Security diagnostics
  const [securityX1, setSecurityX1] = useState<SecurityDiagnostics>(() => createInitialSecurity('ORBIT-X1'));
  const [securityB2, setSecurityB2] = useState<SecurityDiagnostics>(() => createInitialSecurity('SENTINEL-B2'));
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(INITIAL_SECURITY_ALERTS);

  // Real Space Background Image selector: 'night_lights' | 'sunrise_limb'
  const [bgImage, setBgImage] = useState<'night_lights' | 'sunrise_limb'>('night_lights');
  const [bgDim, setBgDim] = useState<number>(75); // Dimming percentage for optimal text contrast

  // Simulation tick counter & mission clocks
  const [tick, setTick] = useState(30);
  const [currentTimeUTC, setCurrentTimeUTC] = useState<string>('00:00:00 UTC');
  const [missionElapsed, setMissionElapsed] = useState<string>('T+142:18:40');

  // Live timer interval: ticks every 1.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => {
        const nextTick = prev + 1;
        const now = new Date();
        const nowStr = now.toISOString().substring(11, 19);
        setCurrentTimeUTC(nowStr + ' UTC');

        const totalSeconds = 142 * 3600 + 18 * 60 + 40 + nextTick * 2;
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        setMissionElapsed(`T+${String(hrs).padStart(3, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);

        // Update ORBIT-X1 if online
        if (commsX1 !== 'BLACKOUT') {
          const orbX1 = calculateOrbit('ORBIT-X1', nextTick);
          const p = nextTick * 0.15;
          const newPtX1: TelemetryPoint = {
            time: nowStr,
            battery_voltage: Number((28.45 + Math.sin(p) * 0.18 + (Math.random() - 0.5) * 0.04).toFixed(2)),
            solar_power: Math.round(522 + Math.cos(p * 0.8) * 16 + (Math.random() - 0.5) * 4),
            temperature: Number((42.5 + Math.sin(p * 0.4) * 0.9 + (Math.random() - 0.5) * 0.2).toFixed(1)),
            signal_strength: Number((-51.8 + Math.cos(p * 0.5) * 1.4 + (Math.random() - 0.5) * 0.3).toFixed(1)),
            speed_kms: orbX1.speed_kms,
            altitude_km: orbX1.alt,
            latitude: orbX1.lat,
            longitude: orbX1.lon,
          };

          setTelemetryX1((history) => [...history.slice(1), newPtX1]);

          setPacketX1({
            packetId: `PKT-X1-${8800 + nextTick}`,
            timestamp: nowStr + ' UTC',
            latitude: orbX1.lat,
            longitude: orbX1.lon,
            altitude_km: orbX1.alt,
            speed_kms: orbX1.speed_kms,
            battery_voltage: newPtX1.battery_voltage,
            solar_power: newPtX1.solar_power,
            signal_strength: newPtX1.signal_strength,
            temperature: newPtX1.temperature,
            safetyStatus: 'SAFE',
            safetyReason: 'All primary power, thermal, and attitude loops nominal at last contact.',
            bufferedFramesCount: 0,
          });
        } else {
          setPacketX1((prev) => ({
            ...prev,
            bufferedFramesCount: prev.bufferedFramesCount + 1,
          }));
        }

        // Update SENTINEL-B2 if online
        if (commsB2 !== 'BLACKOUT') {
          const orbB2 = calculateOrbit('SENTINEL-B2', nextTick);
          const p = nextTick * 0.15 + 2.2;
          const newPtB2: TelemetryPoint = {
            time: nowStr,
            battery_voltage: Number((28.52 + Math.sin(p) * 0.16 + (Math.random() - 0.5) * 0.04).toFixed(2)),
            solar_power: Math.round(528 + Math.cos(p * 0.7) * 14 + (Math.random() - 0.5) * 4),
            temperature: Number((41.8 + Math.sin(p * 0.3) * 0.8 + (Math.random() - 0.5) * 0.2).toFixed(1)),
            signal_strength: Number((-50.8 + Math.cos(p * 0.6) * 1.2 + (Math.random() - 0.5) * 0.3).toFixed(1)),
            speed_kms: orbB2.speed_kms,
            altitude_km: orbB2.alt,
            latitude: orbB2.lat,
            longitude: orbB2.lon,
          };

          setTelemetryB2((history) => [...history.slice(1), newPtB2]);

          setPacketB2({
            packetId: `PKT-B2-${3300 + nextTick}`,
            timestamp: nowStr + ' UTC',
            latitude: orbB2.lat,
            longitude: orbB2.lon,
            altitude_km: orbB2.alt,
            speed_kms: orbB2.speed_kms,
            battery_voltage: newPtB2.battery_voltage,
            solar_power: newPtB2.solar_power,
            signal_strength: newPtB2.signal_strength,
            temperature: newPtB2.temperature,
            safetyStatus: 'SAFE',
            safetyReason: 'All primary power, thermal, and attitude loops nominal at last contact.',
            bufferedFramesCount: 0,
          });
        } else {
          setPacketB2((prev) => ({
            ...prev,
            bufferedFramesCount: prev.bufferedFramesCount + 1,
          }));
        }

        // Increment security sequence keys smoothly
        setSecurityX1((sec) => ({ ...sec, authKeyCounter: sec.authKeyCounter + 1 }));
        setSecurityB2((sec) => ({ ...sec, authKeyCounter: sec.authKeyCounter + 1 }));

        return nextTick;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [commsX1, commsB2]);

  // Handler: Cut Communication
  const handleCutComms = (satId: SatelliteId) => {
    const nowStr = new Date().toISOString().substring(11, 19) + ' UTC';
    if (satId === 'ORBIT-X1') {
      setCommsX1('BLACKOUT');
      const latest = telemetryX1[telemetryX1.length - 1];
      const isSafe = latest.battery_voltage >= 27.2;
      setPacketX1({
        packetId: `PKT-X1-LOCK-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowStr,
        latitude: latest.latitude,
        longitude: latest.longitude,
        altitude_km: latest.altitude_km,
        speed_kms: latest.speed_kms,
        battery_voltage: latest.battery_voltage,
        solar_power: latest.solar_power,
        signal_strength: latest.signal_strength,
        temperature: latest.temperature,
        safetyStatus: isSafe ? 'SAFE' : 'CAUTION_LOW_BATTERY',
        safetyReason: isSafe
          ? `COMMUNICATION BLACKOUT AT ${nowStr}: Satellite ORBIT-X1 was verified SAFE at (${latest.latitude}°, ${latest.longitude}°) before loss of signal. Autonomous safe-hold reaction wheels & sun-pointing armed.`
          : `COMMUNICATION BLACKOUT AT ${nowStr}: Satellite ORBIT-X1 bus showed reduced battery potential (26.9 V) at (${latest.latitude}°, ${latest.longitude}°). Autonomous monitoring active.`,
        bufferedFramesCount: 1,
      });
    } else {
      setCommsB2('BLACKOUT');
      const latest = telemetryB2[telemetryB2.length - 1];
      setPacketB2({
        packetId: `PKT-B2-LOCK-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowStr,
        latitude: latest.latitude,
        longitude: latest.longitude,
        altitude_km: latest.altitude_km,
        speed_kms: latest.speed_kms,
        battery_voltage: latest.battery_voltage,
        solar_power: latest.solar_power,
        signal_strength: latest.signal_strength,
        temperature: latest.temperature,
        safetyStatus: 'SAFE',
        safetyReason: `COMMUNICATION BLACKOUT AT ${nowStr}: Satellite SENTINEL-B2 was verified SAFE at (${latest.latitude}°, ${latest.longitude}°). Autonomous safe-hold active.`,
        bufferedFramesCount: 1,
      });
    }
  };

  // Handler: Reconnect Communication
  const handleReconnectComms = (satId: SatelliteId) => {
    const nowStr = new Date().toISOString().substring(11, 19) + ' UTC';
    if (satId === 'ORBIT-X1') {
      const recoveredCount = Math.max(3, packetX1.bufferedFramesCount);
      setCommsX1('RECONNECTED_VERIFIED');
      setPacketX1((prev) => ({
        ...prev,
        safetyStatus: 'VERIFIED_SAFE_POST_RECONNECT',
        safetyReason: `RECONNECTED & VERIFIED SAFE (${nowStr}): S-Band downlink restored with ORBIT-X1. ${recoveredCount} blackout telemetry frames downlinked & verified via CCSDS SDLS MAC. Spacecraft is verified SAFE and uncompromised.`,
        bufferedFramesCount: recoveredCount,
      }));
    } else {
      const recoveredCount = Math.max(3, packetB2.bufferedFramesCount);
      setCommsB2('RECONNECTED_VERIFIED');
      setPacketB2((prev) => ({
        ...prev,
        safetyStatus: 'VERIFIED_SAFE_POST_RECONNECT',
        safetyReason: `RECONNECTED & VERIFIED SAFE (${nowStr}): Polar relay downlink restored with SENTINEL-B2. ${recoveredCount} blackout telemetry frames downlinked & verified. Spacecraft is verified SAFE and uncompromised.`,
        bufferedFramesCount: recoveredCount,
      }));
    }
  };

  // Handler: Simulate Unauthorized Access Attempt
  const handleSimulateIntrusion = () => {
    const nowStr = new Date().toISOString().substring(11, 19) + ' UTC';
    const targetSat = selectedSat === 'SENTINEL-B2' ? 'SENTINEL-B2' : 'ORBIT-X1';
    const newAlert: SecurityAlert = {
      id: `SEC-${Math.floor(100 + Math.random() * 899)}`,
      time: nowStr,
      satellite: targetSat,
      type: 'Unauthorized RF Command Injection / Spoofed TC Frame',
      origin: 'Unregistered Ground Emitter 2042.19 MHz (Azimuth 114°)',
      status: 'BLOCKED',
      details: 'Onboard FPGA Hardware Decryptor dropped spoofed packet in 0.4ms. ECDSA signature mismatch. Satellite NOT hacked.',
    };

    setSecurityAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
  };

  // Handler: Replay Critical Incident (Section 14 & 18)
  const handleStartReplay = () => {
    setReplayStep('STEP_1_NORMAL');
    setAnomalyScore(0.0);
    setIsIncidentActive(false);
    setSubsystemOverrides({});

    setTimeout(() => {
      setReplayStep('STEP_2_POWER_CONFIG');
      setAnomalyScore(0.32);
      setTelemetryX1((history) => {
        const last = history[history.length - 1];
        return [...history.slice(1), { ...last, solar_power: 380 }];
      });
    }, 1600);

    setTimeout(() => {
      setReplayStep('STEP_3_BATTERY_DEGRADE');
      setAnomalyScore(0.74);
      setSubsystemOverrides({ POWER: 'CRITICAL' });
      setTelemetryX1((history) => {
        const last = history[history.length - 1];
        return [...history.slice(1), { ...last, battery_voltage: 24.8, solar_power: 320 }];
      });
    }, 3200);

    setTimeout(() => {
      setReplayStep('STEP_4_COMMS_DEGRADE');
      setAnomalyScore(0.88);
      setSubsystemOverrides({ POWER: 'CRITICAL', COMMUNICATION: 'WARNING' });
      setTelemetryX1((history) => {
        const last = history[history.length - 1];
        return [...history.slice(1), { ...last, signal_strength: -57.2 }];
      });
    }, 4800);

    setTimeout(() => {
      setReplayStep('STEP_5_INCIDENT_CREATED');
      setAnomalyScore(0.91);
      setIsIncidentActive(true);
      setSubsystemOverrides({ POWER: 'CRITICAL', COMMUNICATION: 'WARNING' });
    }, 6400);
  };

  const handleResetNominal = () => {
    setReplayStep('IDLE');
    setAnomalyScore(0.0);
    setIsIncidentActive(false);
    setSubsystemOverrides({});
    setTelemetryX1((history) => {
      const last = history[history.length - 1];
      return [...history.slice(1), { ...last, battery_voltage: 28.45, solar_power: 522, signal_strength: -51.8 }];
    });
  };

  const currentTelX1 = telemetryX1[telemetryX1.length - 1];
  const currentTelB2 = telemetryB2[telemetryB2.length - 1];

  const currentSubsystems: Record<SubsystemKey, SubsystemStatus> = {
    POWER: {
      key: 'POWER',
      name: 'Electrical Power System (EPS)',
      status: subsystemOverrides.POWER || (currentTelX1.battery_voltage < 26.0 || isIncidentActive ? 'CRITICAL' : currentTelX1.battery_voltage < 27.2 ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Battery Voltage',
      metric1Val: `${currentTelX1.battery_voltage.toFixed(2)} V`,
      metric2Label: 'Solar Generation',
      metric2Val: `${currentTelX1.solar_power} W`,
      description: 'LiFePO4 battery pack & dual articulated photovoltaic array wings.',
    },
    COMMUNICATION: {
      key: 'COMMUNICATION',
      name: 'Telemetry, Tracking & Command (TT&C)',
      status: subsystemOverrides.COMMUNICATION || (currentTelX1.signal_strength < -55.0 ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Carrier Downlink',
      metric1Val: `${currentTelX1.signal_strength.toFixed(1)} dBm`,
      metric2Label: 'Modulation',
      metric2Val: 'S-Band QPSK',
      description: 'Gimbaled parabolic reflector & CCSDS SDLS encrypted transponder.',
    },
    ATTITUDE: {
      key: 'ATTITUDE',
      name: 'Attitude Determination & Control (ADCS)',
      status: subsystemOverrides.ATTITUDE || 'NORMAL',
      metric1Label: 'Pointing Error',
      metric1Val: '0.18° (Nominal)',
      metric2Label: 'Wheel Speed',
      metric2Val: '4,210 RPM',
      description: '3-axis reaction wheels, dual star trackers, and hydrazine RCS quads.',
    },
    THERMAL: {
      key: 'THERMAL',
      name: 'Thermal Control System (TCS)',
      status: subsystemOverrides.THERMAL || (currentTelX1.temperature > 48.0 ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Bus Temperature',
      metric1Val: `${currentTelX1.temperature.toFixed(1)} °C`,
      metric2Label: 'Louver Aperture',
      metric2Val: '65% Open',
      description: 'Kapton MLI blanket insulation and passive radiator louvers.',
    },
    COMPUTE: {
      key: 'COMPUTE',
      name: 'On-Board Computer & Avionics (OBC)',
      status: subsystemOverrides.COMPUTE || 'NORMAL',
      metric1Label: 'CPU Utilization',
      metric1Val: '34.2%',
      metric2Label: 'ECC Memory Faults',
      metric2Val: '0 (Clean)',
      description: 'Radiation-hardened dual-redundant LEON4 processor & FPGA crypto engine.',
    },
  };

  const calculatedHealthPercent = Math.max(
    28,
    Math.round(
      100 -
        (currentSubsystems.POWER.status === 'CRITICAL' ? 24 : currentSubsystems.POWER.status === 'WARNING' ? 10 : 0) -
        (currentSubsystems.COMMUNICATION.status === 'CRITICAL' ? 20 : currentSubsystems.COMMUNICATION.status === 'WARNING' ? 8 : 0) -
        (currentSubsystems.THERMAL.status === 'CRITICAL' ? 16 : currentSubsystems.THERMAL.status === 'WARNING' ? 6 : 0) -
        (currentSubsystems.ATTITUDE.status === 'CRITICAL' ? 16 : currentSubsystems.ATTITUDE.status === 'WARNING' ? 6 : 0) -
        (currentSubsystems.COMPUTE.status === 'CRITICAL' ? 20 : currentSubsystems.COMPUTE.status === 'WARNING' ? 6 : 0) -
        Math.round(anomalyScore * 15)
    )
  );

  // Real ML Anomaly Analysis using live telemetry series
  const realAnomalyAnalysis = computeRealMLAnomaly(
    telemetryX1,
    isIncidentActive ? { ...currentTelX1, battery_voltage: Math.min(24.8, currentTelX1.battery_voltage) } : currentTelX1
  );

  // Helper to trigger a subsystem alert toast and history entry
  const triggerSubsystemAlert = React.useCallback(
    (subKey: SubsystemKey, status: 'WARNING' | 'CRITICAL', customMsg?: string) => {
      const sub = currentSubsystems[subKey];
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 19) + ' UTC';

      const newToast: SubsystemAlertToast = {
        id: `${subKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subsystemKey: subKey,
        subsystemName: sub.name,
        status,
        metricLabel: sub.metric1Label,
        metricValue: sub.metric1Val,
        secondaryMetric: `${sub.metric2Label}: ${sub.metric2Val}`,
        message:
          customMsg ||
          (status === 'CRITICAL'
            ? 'Subsystem transitioned to CRITICAL. Telemetry breached critical envelope.'
            : 'Subsystem transitioned to WARNING. Real-time telemetry monitoring advised.'),
        timestamp: timeStr,
        timestampMs: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]);
      setAlertsHistory((prev) => [newToast, ...prev.slice(0, 49)]);

      if (soundEnabled) {
        playSubsystemAlertTone(status);
      }
    },
    [currentSubsystems, soundEnabled]
  );

  // Monitor real-time subsystem status transitions to WARNING or CRITICAL
  useEffect(() => {
    const keys: SubsystemKey[] = ['POWER', 'COMMUNICATION', 'ATTITUDE', 'THERMAL', 'COMPUTE'];

    if (!isInitialAlertFiredRef.current) {
      isInitialAlertFiredRef.current = true;
      keys.forEach((k) => {
        prevSubsystemsRef.current[k] = currentSubsystems[k].status;
      });

      // Fire initial real-time alerts if active incident starts with WARNING or CRITICAL
      const timer = setTimeout(() => {
        keys.forEach((k) => {
          const currentStatus = currentSubsystems[k].status;
          if (currentStatus === 'CRITICAL' || currentStatus === 'WARNING') {
            triggerSubsystemAlert(k, currentStatus);
          }
        });
      }, 700);

      return () => clearTimeout(timer);
    }

    // Check on every update if any subsystem changed to WARNING or CRITICAL
    keys.forEach((k) => {
      const prevStatus = prevSubsystemsRef.current[k];
      const currStatus = currentSubsystems[k].status;

      if (currStatus !== prevStatus) {
        prevSubsystemsRef.current[k] = currStatus;
        if (currStatus === 'WARNING' || currStatus === 'CRITICAL') {
          triggerSubsystemAlert(k, currStatus);
        }
      }
    });
  }, [currentSubsystems, triggerSubsystemAlert]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleInvestigateFromToast = (toast: SubsystemAlertToast) => {
    handleDismissToast(toast.id);
    handleSelectTab('investigation');
  };

  const handleInspectSubsystemFromToast = (subsystemKey: SubsystemKey) => {
    setInspectInitialSubsystem(subsystemKey);
    setIsInspectOpen(true);
  };

  const handleTriggerTestAlert = (subsystem: SubsystemKey, severity: 'WARNING' | 'CRITICAL') => {
    setSubsystemOverrides((prev) => ({
      ...prev,
      [subsystem]: severity,
    }));
  };

  // Demo step handler for 1-click end-to-end hackathon demonstration
  const handleDemoStepChange = (stepIdx: number, stepLabel: string) => {
    switch (stepIdx) {
      case 0: // 00:00 Telemetry normal
        handleResetNominal();
        break;
      case 1: // 00:05 Power config event
        setReplayStep('STEP_2_POWER_CONFIG');
        setIsIncidentActive(false);
        setSubsystemOverrides({});
        break;
      case 2: // 00:08 Battery begins degrading
        setReplayStep('STEP_3_BATTERY_DEGRADE');
        setTelemetryX1((history) => {
          const last = history[history.length - 1];
          return [...history.slice(1), { ...last, battery_voltage: 26.8, solar_power: 420 }];
        });
        setSubsystemOverrides({ POWER: 'WARNING' });
        break;
      case 3: // 00:11 Critical battery voltage
      case 4: // 00:13 Communication degradation
      case 5: // 00:17 ML anomaly detection
      case 6: // 00:18 Incident correlation
      case 7: // 00:20 INC-024 created
      case 8: // 00:22 Evidence retrieval
      case 9: // 00:25 AI investigation ready
        setAnomalyScore(0.91);
        setIsIncidentActive(true);
        setReplayStep('STEP_5_INCIDENT_CREATED');
        setSubsystemOverrides({ POWER: 'CRITICAL', COMMUNICATION: 'WARNING' });
        setTelemetryX1((history) => {
          const last = history[history.length - 1];
          return [...history.slice(1), { ...last, battery_voltage: 24.8, solar_power: 310, signal_strength: -57.2 }];
        });
        break;
    }
  };

  const handleSelectTab = (tabKey: TabKey) => {
    setActiveNav(tabKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePipelineStageSelect = (stage: PipelineStageKey) => {
    setActivePipelineStage(stage);
    if (stage === 'DETECT' || stage === 'CORRELATE') {
      handleSelectTab('anomaly');
    } else if (stage === 'RETRIEVE' || stage === 'VALIDATE') {
      handleSelectTab('evidence');
    } else if (stage === 'COMPARE') {
      handleSelectTab('history');
    } else if (stage === 'EXPLAIN' || stage === 'RECOMMEND') {
      handleSelectTab('investigation');
    } else if (stage === 'AUDIT') {
      handleSelectTab('audit');
    }
  };

  const handleTriggerInvestigation = () => {
    handleSelectTab('investigation');
  };

  const handleTriggerAbstention = () => {
    handleSelectTab('investigation');
  };

  const NAV_GROUPS: Array<{
    groupTitle?: string;
    items: Array<{
      id: string;
      label: string;
      key: TabKey;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }>;
  }> = [
    {
      groupTitle: 'PORTAL',
      items: [
        { id: 'home', label: 'Home (Mission Portal)', key: 'home', icon: HomeIcon },
        { id: 'overview', label: 'Spacecraft Overview', key: 'overview', icon: Compass },
      ],
    },
    {
      groupTitle: 'MISSION',
      items: [
        { id: 'telemetry', label: 'Telemetry Explorer', key: 'telemetry', icon: Activity },
        { id: 'incidents', label: 'Incidents Registry', key: 'incidents', icon: BookOpen },
        { id: 'investigation', label: 'Investigation Console', key: 'investigation', icon: Brain, badge: 'INC-024' },
      ],
    },
    {
      groupTitle: 'INTELLIGENCE',
      items: [
        { id: 'copilot', label: 'AI Copilot & Abstention', key: 'copilot', icon: Sparkles },
        { id: 'evidence', label: 'Evidence Explorer (RAG)', key: 'evidence', icon: Search },
      ],
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        { id: 'audit', label: 'Audit Trail (SHA-256)', key: 'audit', icon: FileText },
        { id: 'safety', label: 'Safety & Governance', key: 'safety', icon: ShieldCheck },
        { id: 'simulation', label: 'Simulation & Faults', key: 'simulation', icon: Layers },
      ],
    },
    {
      groupTitle: 'ADVANCED',
      items: [
        { id: 'architecture', label: 'Decision Lineage DAG', key: 'architecture', icon: Layers },
      ],
    },
  ];

  const NAV_TABS = NAV_GROUPS.flatMap((g) => g.items);

  // Merge series for chart
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
      domain: [25.0, 30.0],
      nominalRange: '27.5V – 29.0V',
      nominalLow: 27.5,
      nominalHigh: 29.0,
      warnThreshold: 27.0,
      critThreshold: 25.5,
    },
    solar_power: {
      name: 'Solar Array Generation',
      unit: 'W',
      domain: [400, 620],
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

  const scrollToSection = (_id: string, navKey: TabKey) => {
    handleSelectTab(navKey);
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-white text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
      {/* Clean Sky Blue Aerospace Subtle Technical Grid on White */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#F0F9FF_1px,transparent_1px),linear-gradient(to_bottom,#F0F9FF_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70"
        aria-hidden="true"
      />
      {/* Subtle Sky Blue Ambient Glow at top */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-64 z-0 bg-gradient-to-b from-sky-100/40 to-transparent"
        aria-hidden="true"
      />

      {/* ===================================================================
          1. LEFT-SIDE COMMAND NAVIGATION BAR (ONLY TABS VISIBLE)
      =================================================================== */}
      <aside className="relative z-10 w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-sky-200 bg-white flex flex-col shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto select-none shadow-sm">
        {/* Brand & Logo Header */}
        <div className="p-4 border-b border-sky-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-md shadow-sky-500/25 font-bold font-display text-white text-base">
              MC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold text-slate-900 tracking-wide">
                  MISSION COPILOT
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Evidence-Grounded Flight AI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Only Tabs Visible) */}
        <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.groupTitle && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {group.groupTitle}
                </div>
              )}
              {group.items.map((item) => {
                const IconCmp = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 font-bold ring-2 ring-sky-300'
                        : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconCmp className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          isActive ? 'bg-sky-700 text-white' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ===================================================================
          2. MAIN MISSION CONTROL VIEWPORT
      =================================================================== */}
      <div className="relative z-10 flex-1 min-w-0 overflow-y-auto">
        {/* Top Minimal Telemetry Status Strip with Interactive Satellite & Sim Controls */}
        <div className="border-b border-sky-200 bg-white/95 backdrop-blur-md px-6 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold hidden sm:inline">ASSET:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-sky-50 border border-sky-200">
              <button
                onClick={() => setSelectedSat('ORBIT-X1')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSat === 'ORBIT-X1'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-800'
                }`}
              >
                ORBIT-X1
              </button>
              <button
                onClick={() => setSelectedSat('SENTINEL-B2')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSat === 'SENTINEL-B2'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-800'
                }`}
              >
                SENTINEL-B2
              </button>
            </div>
            <span className="text-slate-300">·</span>
            <span>
              STATUS:{' '}
              <strong className={(selectedSat === 'SENTINEL-B2' ? commsB2 : commsX1) === 'BLACKOUT' ? 'text-amber-600' : 'text-sky-600'}>
                {(selectedSat === 'SENTINEL-B2' ? commsB2 : commsX1) === 'BLACKOUT' ? '▲ LOS BLACKOUT (LOCKED)' : '● NOMINAL STREAM'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Globe2 className="h-3 w-3 text-sky-600" />
              <span>ORBIT:</span> <strong className="text-slate-900">{selectedSat === 'SENTINEL-B2' ? '685 km Polar' : '542 km SSO'}</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>VELOCITY: <strong className="text-sky-700">{selectedSat === 'SENTINEL-B2' ? currentTelB2.speed_kms : currentTelX1.speed_kms} km/s</strong></span>
          </div>

          {/* Quick Simulation Actions & Real-time Subsystem Alert Center Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartReplay}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono text-xs font-bold transition-all cursor-pointer"
              title="Run INC-024 5-Stage Storyline Replay"
            >
              <Play className="h-3 w-3 fill-current" />
              <span className="hidden sm:inline">REPLAY</span>
            </button>

            <button
              onClick={handleResetNominal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-mono text-xs font-bold transition-all cursor-pointer"
              title="Reset all telemetry to nominal baseline"
            >
              <ResetIcon className="h-3 w-3 text-slate-500" />
              <span className="hidden sm:inline">RESET</span>
            </button>

            <button
              onClick={() => setIsAlertCenterOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                toasts.length > 0 || alertsHistory.some((a) => a.status === 'CRITICAL')
                  ? 'border-rose-300 bg-rose-50 text-rose-800 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Open Real-Time Operator Alert Center"
            >
              <Bell className={`h-3.5 w-3.5 ${alertsHistory.length > 0 ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`} />
              <span>ALERTS</span>
              {alertsHistory.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono">
                  {alertsHistory.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Alert Sound Chime' : 'Enable Alert Sound Chime'}
              aria-label="Toggle alert sound"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-sky-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="px-6 py-6 min-h-[calc(100vh-140px)]">
          {/* 0. HOME MISSION PORTAL (Website Info with Animated Satellite & Earth Night Lights Background) */}
          {activeNav === 'home' && (
            <HomeLandingView
              onNavigate={handleSelectTab}
              onOpenInspect={(sub) => {
                setInspectInitialSubsystem(sub);
                setIsInspectOpen(true);
              }}
              calculatedHealthPercent={calculatedHealthPercent}
              currentSubsystems={currentSubsystems}
              currentTelX1={currentTelX1}
              onStartReplay={handleStartReplay}
              onResetNominal={handleResetNominal}
            />
          )}

          {/* 1. OVERVIEW PAGE (Clean, Calm, Aerospace, Progressive Disclosure) */}
          {activeNav === 'overview' && (
            <OverviewView
              currentTelX1={currentTelX1}
              telemetryHistory={telemetryX1}
              incidentId={incidentId}
              isIncidentActive={isIncidentActive}
              anomalyScore={anomalyScore}
              calculatedHealthPercent={calculatedHealthPercent}
              currentSubsystems={currentSubsystems}
              onInvestigate={() => handleSelectTab('investigation')}
              onOpenInspect={(sub) => {
                setInspectInitialSubsystem(sub);
                setIsInspectOpen(true);
              }}
              onResetNominal={handleResetNominal}
              onStartReplay={handleStartReplay}
            />
          )}

          {/* 2. INVESTIGATION PAGE (Focused Incident Analysis & Collapsible Details) */}
          {(activeNav === 'investigation' || activeNav === 'anomaly') && (
            <InvestigationPageView
              onViewEvidence={() => handleSelectTab('evidence')}
              onViewSimilarIncidents={() => handleSelectTab('incidents')}
              onOpenAudit={() => handleSelectTab('audit')}
              onSelectEvidenceItem={(sourceId) => {
                setSelectedEvidenceSourceId(sourceId);
                handleSelectTab('evidence');
              }}
            />
          )}

          {/* 3. EVIDENCE PAGE (Category Tabs, Detail Drawer, Hidden RAG Rankings) */}
          {activeNav === 'evidence' && (
            <EvidencePageView
              onNavigateToInvestigation={() => handleSelectTab('investigation')}
              selectedSourceId={selectedEvidenceSourceId}
            />
          )}

          {/* 4. AUDIT PAGE (Clean Chronological Ledger & Detail Drawer) */}
          {activeNav === 'audit' && (
            <AuditPageView />
          )}

          {/* 5. TELEMETRY PAGE (Subsystem Tabs: Overview, Power, Comm, ADCS, Thermal, Compute) */}
          {(activeNav === 'telemetry' || activeNav === 'spacecraft') && (
            <TelemetryPageView
              telemetryX1={telemetryX1}
              telemetryB2={telemetryB2}
              currentTelX1={currentTelX1}
              currentTelB2={currentTelB2}
              selectedSat={selectedSat}
              onSelectSat={setSelectedSat}
            />
          )}

          {/* 6. INCIDENTS DIRECTORY (INC-024, INC-008, INC-013) */}
          {(activeNav === 'incidents' || activeNav === 'history') && (
            <IncidentsPageView
              onInvestigateActiveIncident={() => handleSelectTab('investigation')}
            />
          )}

          {/* 7. AI COPILOT WORKBENCH (Inquiries & Clean Abstention Showcase) */}
          {activeNav === 'copilot' && (
            <CopilotPageView
              onViewEvidence={() => handleSelectTab('evidence')}
              onOpenAudit={() => handleSelectTab('audit')}
            />
          )}

          {/* 8. SAFETY & GOVERNANCE (Decision Support Only, No Command Execution) */}
          {activeNav === 'safety' && (
            <SafetyPageView />
          )}

          {/* 9. MISSION SIMULATION CONTROLS */}
          {activeNav === 'simulation' && (
            <SimulationPageView
              isIncidentActive={isIncidentActive}
              replayStep={replayStep}
              commsX1={commsX1}
              securityX1={securityX1}
              onStartReplay={handleStartReplay}
              onResetNominal={handleResetNominal}
              onCutComms={() => handleCutComms('ORBIT-X1')}
              onReconnectComms={() => handleReconnectComms('ORBIT-X1')}
              onSimulateIntrusion={handleSimulateIntrusion}
              onTriggerTestAlert={handleTriggerTestAlert}
            />
          )}

          {/* 10. ADVANCED ARCHITECTURE DAG */}
          {activeNav === 'architecture' && (
            <ArchitecturePageView
              onNavigateToTab={handleSelectTab}
            />
          )}

          {/* Clean Mission Operations Footer */}
          <footer className="mt-12 border-t border-sky-100 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div>
              MISSION OPERATIONS COPILOT · EVIDENCE-GROUNDED SPACECRAFT HEALTH INVESTIGATION
            </div>
            <div>
              PORT 3000 · ZERO AUTONOMOUS COMMAND EXECUTION · READ-ONLY TELEMETRY
            </div>
          </footer>
        </div>
      </div>

      {/* Real-Time Subsystem State Transition Toast Notification System */}
      <ToastNotificationSystem
        toasts={toasts}
        onDismiss={handleDismissToast}
        onInvestigate={handleInvestigateFromToast}
        onInspectSubsystem={handleInspectSubsystemFromToast}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Operator Real-Time Alert Center Drawer */}
      <AlertCenterDrawer
        isOpen={isAlertCenterOpen}
        onClose={() => setIsAlertCenterOpen(false)}
        alertsHistory={alertsHistory}
        onClearHistory={() => setAlertsHistory([])}
        onInvestigate={handleInvestigateFromToast}
        onInspectSubsystem={handleInspectSubsystemFromToast}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onTriggerTestAlert={handleTriggerTestAlert}
      />

      {/* Guided Explanation Modal */}
      <ExplainFlowModal isOpen={isExplainOpen} onClose={() => setIsExplainOpen(false)} />

      {/* 3D Spacecraft Physical Inspection Modal (Section 15) */}
      <InspectSpacecraftModal
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        satelliteId="ORBIT-X1"
        telemetry={currentTelX1}
        subsystems={currentSubsystems}
        healthPercent={calculatedHealthPercent}
        initialSubsystem={inspectInitialSubsystem}
      />

      {/* Incident Investigation Panel (Section 7, 14, 18) */}
      <IncidentInvestigationModal
        isOpen={isInvestigationOpen}
        onClose={() => setIsInvestigationOpen(false)}
        incidentId={incidentId}
        onMitigate={handleResetNominal}
      />
    </div>
  );
}
