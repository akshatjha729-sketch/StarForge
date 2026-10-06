import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw, Maximize2, ShieldAlert, Zap, Radio, Compass, Thermometer, Cpu, AlertTriangle, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { buildRealisticSatellite, SubsystemAnchor } from '../utils/spacecraftModel';
import { createSpaceEnvironment } from '../utils/spaceEnvironment';
import { TelemetryPoint } from '../types';

export type SubsystemKey = 'POWER' | 'COMMUNICATION' | 'ATTITUDE' | 'THERMAL' | 'COMPUTE';

export interface SubsystemStatus {
  key: SubsystemKey;
  name: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  description: string;
}

interface RealisticSpacecraftCanvasProps {
  telemetry: TelemetryPoint;
  satelliteId: string;
  isIncidentActive: boolean;
  incidentId?: string;
  incidentSeverity?: 'WARNING' | 'CRITICAL';
  onOpenIncident?: (id: string) => void;
  onInspectSpacecraft?: () => void;
  subsystemOverrides?: Partial<Record<SubsystemKey, 'NORMAL' | 'WARNING' | 'CRITICAL'>>;
  anomalyScore?: number;
}

export const RealisticSpacecraftCanvas: React.FC<RealisticSpacecraftCanvasProps> = ({
  telemetry,
  satelliteId,
  isIncidentActive,
  incidentId = 'INC-024',
  incidentSeverity = 'CRITICAL',
  onOpenIncident,
  onInspectSpacecraft,
  subsystemOverrides = {},
  anomalyScore = 0.0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemKey | null>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [screenAnchors, setScreenAnchors] = useState<Record<SubsystemKey, { x: number; y: number; visible: boolean }>>({
    POWER: { x: 0, y: 0, visible: false },
    COMMUNICATION: { x: 0, y: 0, visible: false },
    ATTITUDE: { x: 0, y: 0, visible: false },
    THERMAL: { x: 0, y: 0, visible: false },
    COMPUTE: { x: 0, y: 0, visible: false },
  });

  // Camera reset trigger ref
  const resetCameraRef = useRef<() => void>(() => {});

  // Compute overall health percentage dynamically
  const isBatCritical = telemetry.battery_voltage < 26.0 || isIncidentActive;
  const isBatWarn = telemetry.battery_voltage < 27.2 && !isBatCritical;
  const isSigWarn = telemetry.signal_strength < -55.0;

  // Subsystem statuses
  const subsystems: Record<SubsystemKey, SubsystemStatus> = {
    POWER: {
      key: 'POWER',
      name: 'Electrical Power System (EPS)',
      status: subsystemOverrides.POWER || (isBatCritical ? 'CRITICAL' : isBatWarn ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Battery Voltage',
      metric1Val: `${telemetry.battery_voltage.toFixed(2)} V`,
      metric2Label: 'Solar Generation',
      metric2Val: `${telemetry.solar_power} W`,
      description: 'LiFePO4 battery pack & dual articulated photovoltaic array wings.',
    },
    COMMUNICATION: {
      key: 'COMMUNICATION',
      name: 'Telemetry, Tracking & Command (TT&C)',
      status: subsystemOverrides.COMMUNICATION || (isSigWarn ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Carrier Downlink',
      metric1Val: `${telemetry.signal_strength.toFixed(1)} dBm`,
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
      status: subsystemOverrides.THERMAL || (telemetry.temperature > 48.0 ? 'WARNING' : 'NORMAL'),
      metric1Label: 'Bus Temperature',
      metric1Val: `${telemetry.temperature.toFixed(1)} °C`,
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

  // Dynamic Spacecraft Health calculation
  const healthPercent = Math.max(
    28,
    Math.round(
      100 -
        (subsystems.POWER.status === 'CRITICAL' ? 24 : subsystems.POWER.status === 'WARNING' ? 10 : 0) -
        (subsystems.COMMUNICATION.status === 'CRITICAL' ? 20 : subsystems.COMMUNICATION.status === 'WARNING' ? 8 : 0) -
        (subsystems.THERMAL.status === 'CRITICAL' ? 16 : subsystems.THERMAL.status === 'WARNING' ? 6 : 0) -
        (subsystems.ATTITUDE.status === 'CRITICAL' ? 16 : subsystems.ATTITUDE.status === 'WARNING' ? 6 : 0) -
        (subsystems.COMPUTE.status === 'CRITICAL' ? 20 : subsystems.COMPUTE.status === 'WARNING' ? 6 : 0) -
        Math.round(anomalyScore * 15)
    )
  );

  const overallState: 'NORMAL' | 'WARNING' | 'CRITICAL' =
    healthPercent < 75 || isIncidentActive
      ? 'CRITICAL'
      : healthPercent < 90
      ? 'WARNING'
      : 'NORMAL';

  // Three.js Mount Effect
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let isMounted = true;
    let animationFrameId: number;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#03050d', 0.008);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const aspect = width / height;
    const initialCamDist = aspect < 1.35 ? 9.8 : 8.5;
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(0, 0.75, initialCamDist);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // Build Environment & Satellite
    const env = createSpaceEnvironment();
    scene.add(env.environmentGroup);

    const sat = buildRealisticSatellite();
    sat.rootGroup.scale.set(0.72, 0.72, 0.72);
    scene.add(sat.rootGroup);

    // Initial position: Floating gracefully in LEO orbit
    sat.rootGroup.position.set(0, 0.1, 0);
    sat.satelliteGroup.rotation.set(0.15, -0.35, 0.05);

    // Interactive mouse drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetRotation = { x: 0.15, y: -0.35 };
    let currentRotation = { x: 0.15, y: -0.35 };
    let cameraDistance = initialCamDist;
    let targetCameraDistance = initialCamDist;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.006;
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x + deltaY * 0.006));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraDistance = Math.max(4.5, Math.min(11.0, targetCameraDistance + e.deltaY * 0.0035));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Reset camera function
    resetCameraRef.current = () => {
      targetRotation.x = 0.15;
      targetRotation.y = -0.35;
      targetCameraDistance = 8.2;
    };

    // Responsive resize handler
    const handleResize = () => {
      if (!container || !isMounted) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Reusable vectors for 2D screen projection
    const tempVec = new THREE.Vector3();

    let clock = 0;
    let lastTime = performance.now();

    // Render loop
    const animate = (currentTime: number) => {
      if (!isMounted) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      clock += delta;

      // Update Earth & orbit animation
      env.updateAnimation(clock);

      // Subtle continuous spacecraft motion (very slow aerospace orbital attitude drift)
      if (!isDragging) {
        targetRotation.y += delta * 0.035; // Gentle yaw drift
      }

      // Smooth interpolation for rotations and zoom (lerp)
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
      sat.satelliteGroup.rotation.x = currentRotation.x;
      sat.satelliteGroup.rotation.y = currentRotation.y;

      cameraDistance += (targetCameraDistance - cameraDistance) * 0.1;
      camera.position.z = cameraDistance;

      // Slight solar-panel orientation adjustment tracking sun
      sat.solarWingsGroup.rotation.y = Math.sin(clock * 0.25) * 0.06;

      // Subtle orbital vertical floating oscillation
      sat.rootGroup.position.y = 0.2 + Math.sin(clock * 0.4) * 0.05;
      sat.rootGroup.position.x = Math.sin(clock * 0.15) * 0.08;

      // Pulse subsystem indicator meshes if warning/critical
      const pColor =
        subsystems.POWER.status === 'CRITICAL'
          ? 0xef4444
          : subsystems.POWER.status === 'WARNING'
          ? 0xf59e0b
          : 0x10b981;

      // Render 3D Scene
      renderer.render(scene, camera);

      // Project 3D Subsystem Anchors to 2D Container Screen Coordinates
      const newAnchors: Record<SubsystemKey, { x: number; y: number; visible: boolean }> = {
        POWER: { x: 0, y: 0, visible: false },
        COMMUNICATION: { x: 0, y: 0, visible: false },
        ATTITUDE: { x: 0, y: 0, visible: false },
        THERMAL: { x: 0, y: 0, visible: false },
        COMPUTE: { x: 0, y: 0, visible: false },
      };

      const cWidth = container.clientWidth;
      const cHeight = container.clientHeight;

      sat.anchors.forEach((anc: SubsystemAnchor) => {
        tempVec.copy(anc.position);
        tempVec.applyEuler(sat.satelliteGroup.rotation);
        tempVec.add(sat.rootGroup.position);
        tempVec.project(camera);

        const x = (tempVec.x * 0.5 + 0.5) * cWidth;
        const y = (-tempVec.y * 0.5 + 0.5) * cHeight;
        const isFacingCamera = tempVec.z < 1.0;

        newAnchors[anc.name] = {
          x: Math.round(x),
          y: Math.round(y),
          visible: isFacingCamera && x > 20 && x < cWidth - 20 && y > 20 && y < cHeight - 20,
        };
      });

      setScreenAnchors(newAnchors);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();

      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[530px] rounded-2xl border border-sky-300 bg-slate-950 overflow-hidden select-none shadow-md shadow-sky-100/70">
      {/* 1. Main Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* WebGL Fallback if hardware acceleration unavailable */}
      {!webGlSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white text-slate-800">
          <div className="rounded-full bg-sky-100 p-4 text-sky-600 mb-3">
            <Radio className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900">ORBIT-X1 Telemetry Telemetry Deck</h3>
          <p className="mt-1 max-w-sm text-xs font-mono text-slate-600">
            WebGL acceleration is unavailable. Displaying high-precision telemetry stream and schematic subsystems.
          </p>
        </div>
      )}

      {/* 2. Top-Left: Spacecraft Identity & Health Status Ring */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          {/* Circular Status Indicator Ring */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur-md border border-sky-200 shadow-lg">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke={
                  overallState === 'CRITICAL'
                    ? '#EF4444'
                    : overallState === 'WARNING'
                    ? '#F59E0B'
                    : '#0284C7'
                }
                strokeWidth="2.5"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * healthPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span
              className={`font-mono text-[11px] font-bold ${
                overallState === 'CRITICAL'
                  ? 'text-rose-600'
                  : overallState === 'WARNING'
                  ? 'text-amber-600'
                  : 'text-sky-700'
              }`}
            >
              {healthPercent}%
            </span>
          </div>

          <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 border border-sky-200 shadow-md">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-slate-900 tracking-wider">
                {satelliteId}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide border ${
                  overallState === 'CRITICAL'
                    ? 'border-rose-300 bg-rose-50 text-rose-700 animate-pulse'
                    : overallState === 'WARNING'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-sky-300 bg-sky-50 text-sky-700'
                }`}
              >
                {overallState === 'CRITICAL'
                  ? '● ATTENTION REQUIRED'
                  : overallState === 'WARNING'
                  ? '▲ SUBSYSTEM DEGRADED'
                  : '● HEALTH NOMINAL'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-600 flex items-center gap-1.5">
              <span>Low Earth Orbit</span>
              <span className="text-slate-400">·</span>
              <span className="text-sky-600 font-semibold">NASA Blue Marble Real Earth</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Top-Right: Camera Actions (Reset & Inspect Spacecraft) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => resetCameraRef.current()}
          className="flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white/95 backdrop-blur-md px-2.5 py-1.5 font-mono text-xs text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all shadow-md"
          title="Reset Camera to Operational Angle"
        >
          <RotateCcw className="h-3.5 w-3.5 text-sky-600" />
          <span className="hidden sm:inline">RESET VIEW</span>
        </button>

        {onInspectSpacecraft && (
          <button
            onClick={onInspectSpacecraft}
            className="flex items-center gap-1.5 rounded-lg border border-sky-400 bg-sky-500 backdrop-blur-md px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-500/25"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>INSPECT SPACECRAFT</span>
          </button>
        )}
      </div>

      {/* 4. Live Technical Telemetry Overlay Chips (Sections 11 & 13) */}
      <div className="absolute bottom-11 left-4 z-20 pointer-events-none hidden sm:flex flex-col gap-1.5 font-mono text-[11px] text-slate-700">
        <div className="flex items-center gap-2 rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 border border-sky-200 shadow-md">
          <span className="text-slate-500">ALTITUDE</span>
          <strong className="text-slate-900">{telemetry.altitude_km.toFixed(1)} km</strong>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">VELOCITY</span>
          <strong className="text-sky-700">{telemetry.speed_kms.toFixed(2)} km/s</strong>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">ATTITUDE ERROR</span>
          <strong className="text-sky-700">0.18°</strong>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 border border-sky-200 shadow-md">
          <span className="text-slate-500">POWER</span>
          <strong className={telemetry.solar_power < 450 ? 'text-amber-600' : 'text-slate-900'}>
            {telemetry.solar_power} W
          </strong>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">CARRIER SNR</span>
          <strong className="text-sky-700">{telemetry.signal_strength.toFixed(1)} dBm</strong>
        </div>
      </div>

      {/* 5. Subsystem Hotspots Placed Around Spacecraft (Section 6 & 7) */}
      {(Object.keys(subsystems) as SubsystemKey[]).map((key) => {
        const sub = subsystems[key];
        const anchor = screenAnchors[key];
        const isSelected = selectedSubsystem === key;
        const isPowerCritical = key === 'POWER' && sub.status === 'CRITICAL';

        if (!anchor || !anchor.visible) return null;

        return (
          <div
            key={key}
            style={{
              left: `${anchor.x}px`,
              top: `${anchor.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-20 pointer-events-auto"
          >
            {/* Hotspot Target Pip */}
            <button
              onClick={() => setSelectedSubsystem(isSelected ? null : key)}
              className={`group relative flex items-center justify-center h-6 w-6 rounded-full transition-all ${
                sub.status === 'CRITICAL'
                  ? 'bg-rose-500/25 ring-2 ring-rose-500 text-rose-300'
                  : sub.status === 'WARNING'
                  ? 'bg-amber-500/25 ring-2 ring-amber-500 text-amber-300'
                  : 'bg-emerald-500/25 ring-2 ring-emerald-500/80 text-emerald-300 hover:ring-emerald-400'
              } ${isPowerCritical ? 'animate-bounce' : ''}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  sub.status === 'CRITICAL'
                    ? 'bg-rose-500'
                    : sub.status === 'WARNING'
                    ? 'bg-amber-500'
                    : 'bg-emerald-400'
                }`}
              />

              {/* Floating Subsystem Badge Label */}
              <span
                className={`absolute whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider pointer-events-none transition-all shadow-md ${
                  key === 'POWER'
                    ? '-top-6 -right-2'
                    : key === 'COMMUNICATION'
                    ? '-top-6 left-1/2 -translate-x-1/2'
                    : '-bottom-6 left-1/2 -translate-x-1/2'
                } ${
                  sub.status === 'CRITICAL'
                    ? 'bg-rose-950/95 text-rose-300 border border-rose-500/80'
                    : sub.status === 'WARNING'
                    ? 'bg-amber-950/95 text-amber-300 border border-amber-500/80'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-700/80'
                }`}
              >
                {key}
              </span>
            </button>

            {/* Active Incident Floating Callout (Section 7) */}
            {isPowerCritical && isIncidentActive && (
              <div
                onClick={() => onOpenIncident && onOpenIncident(incidentId)}
                className="absolute top-8 left-1/2 -translate-x-1/2 w-48 rounded-xl border border-rose-500/90 bg-[#160608]/95 p-2.5 backdrop-blur-md shadow-2xl shadow-rose-900/50 cursor-pointer hover:border-rose-400 transition-all animate-pulse"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-rose-400 font-bold">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    POWER CRITICAL
                  </span>
                  <span>{incidentId}</span>
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  Battery Voltage: <span className="text-rose-400">{telemetry.battery_voltage.toFixed(2)} V</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-rose-300 border-t border-rose-900/60 pt-1">
                  <span>INVESTIGATE ROOT CAUSE</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            )}

            {/* Subsystem Telemetry Popover when clicked */}
            {isSelected && !isPowerCritical && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-52 rounded-xl border border-sky-300 bg-white/95 p-3 backdrop-blur-md shadow-2xl z-30 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-sky-200 pb-1.5 mb-2">
                  <span className="font-bold text-slate-900">{sub.key}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      sub.status === 'CRITICAL'
                        ? 'text-rose-600'
                        : sub.status === 'WARNING'
                        ? 'text-amber-600'
                        : 'text-sky-700'
                    }`}
                  >
                    ● {sub.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{sub.metric1Label}:</span>
                    <strong className="text-slate-900">{sub.metric1Val}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{sub.metric2Label}:</span>
                    <strong className="text-slate-900">{sub.metric2Val}</strong>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-slate-500 leading-snug">{sub.description}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* 6. Important Safety Label (Section 17 - REQUIRED) */}
      <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center pointer-events-none px-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 rounded-full border border-sky-200 bg-white/95 backdrop-blur-md px-3.5 py-1 text-[9px] sm:text-[10px] font-mono text-slate-700 text-center tracking-wider shadow-md">
          <span className="text-sky-600 font-semibold">SIMULATION MODE</span>
          <span className="text-slate-300">·</span>
          <span>PUBLIC / HISTORICAL DATA</span>
          <span className="text-slate-300">·</span>
          <span className="text-amber-600 font-semibold">DECISION SUPPORT ONLY</span>
          <span className="text-slate-300">·</span>
          <span className="text-rose-600 font-semibold">NO SPACECRAFT COMMAND EXECUTION</span>
        </div>
      </div>
    </div>
  );
};
