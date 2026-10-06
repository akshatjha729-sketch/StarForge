import { SatelliteId, TelemetryPoint, LastKnownPacket, SecurityDiagnostics, SecurityAlert } from './types';

// Calculate realistic orbital position based on tick/angle
export function calculateOrbit(satId: SatelliteId, step: number) {
  const isX1 = satId === 'ORBIT-X1';
  const basePhase = isX1 ? 30 : 180;
  const speed = isX1 ? 0.6 : 0.55;
  const phase = (basePhase + step * speed) % 360;
  const rad = (phase * Math.PI) / 180;

  const inclination = isX1 ? 97.4 : 82.5;
  const amp = inclination > 90 ? 180 - inclination : inclination;

  const lat = Number((Math.sin(rad) * amp).toFixed(2));
  const lon = Number((((phase * 1.5 - step * 0.12 + (isX1 ? -90 : 60) + 540) % 360) - 180).toFixed(2));
  const alt = Number(((isX1 ? 542.0 : 685.0) + Math.sin(rad * 2) * 2.5).toFixed(1));
  const speed_kms = Number(((isX1 ? 7.59 : 7.51) + Math.cos(rad) * 0.02).toFixed(2));

  return { lat, lon, alt, speed_kms };
}

// Generate seeded initial telemetry records
export function generateInitialTelemetry(satId: SatelliteId, pointsCount = 30): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = Date.now();

  for (let i = 0; i < pointsCount; i++) {
    const step = i;
    const timeStr = new Date(now - (pointsCount - i) * 1500).toISOString().substring(11, 19);
    const orbit = calculateOrbit(satId, step);
    const isX1 = satId === 'ORBIT-X1';

    const p = i * 0.15 + (isX1 ? 0 : 2);
    const bat = Number((28.4 + Math.sin(p) * 0.2 + (Math.random() - 0.5) * 0.05).toFixed(2));
    const sol = Math.round(520 + Math.cos(p * 0.8) * 18 + (Math.random() - 0.5) * 5);
    const temp = Number((42.5 + Math.sin(p * 0.4) * 1.1 + (Math.random() - 0.5) * 0.2).toFixed(1));
    const sig = Number((-52.0 + Math.cos(p * 0.5) * 1.5 + (Math.random() - 0.5) * 0.4).toFixed(1));

    points.push({
      time: timeStr,
      battery_voltage: bat,
      solar_power: sol,
      temperature: temp,
      signal_strength: sig,
      speed_kms: orbit.speed_kms,
      altitude_km: orbit.alt,
      latitude: orbit.lat,
      longitude: orbit.lon,
    });
  }

  return points;
}

export function createInitialPacket(satId: SatelliteId): LastKnownPacket {
  const orbit = calculateOrbit(satId, 30);
  return {
    packetId: satId === 'ORBIT-X1' ? 'PKT-X1-8849' : 'PKT-B2-3312',
    timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
    latitude: orbit.lat,
    longitude: orbit.lon,
    altitude_km: orbit.alt,
    speed_kms: orbit.speed_kms,
    battery_voltage: 28.5,
    solar_power: 524,
    signal_strength: -51.2,
    temperature: 42.1,
    safetyStatus: 'SAFE',
    safetyReason: 'All systems within optimal margins. Autonomous stabilization active.',
    bufferedFramesCount: 0,
  };
}

export function createInitialSecurity(satId: SatelliteId): SecurityDiagnostics {
  return {
    isHacked: false,
    statusText: '100% CRYPTOGRAPHICALLY VERIFIED SECURE',
    encryption: 'CCSDS SDLS AES-256-GCM',
    signatureVerified: true,
    snr_db: satId === 'ORBIT-X1' ? 19.4 : 20.8,
    bitErrorRate: '0.9 x 10⁻⁷',
    dopplerShiftKhz: -3.8,
    jammingRisk: 'LOW / NOMINAL (0.02)',
    authKeyCounter: satId === 'ORBIT-X1' ? 14892 : 9820,
    lastSecurityCheck: 'VERIFIED 1.2s AGO',
  };
}

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'SEC-092',
    time: '20:44:12 UTC',
    satellite: 'ORBIT-X1',
    type: 'Unauthorized Uplink Ping',
    origin: 'RF Ground 2042.18 MHz (Unsigned)',
    status: 'BLOCKED',
    details: 'Dropped by Hardware FPGA Decryptor. Zero commands executed.',
  },
  {
    id: 'SEC-091',
    time: '20:18:05 UTC',
    satellite: 'SENTINEL-B2',
    type: 'Replay Frame Injection Attempt',
    origin: 'Unknown Relay Port 443',
    status: 'BLOCKED',
    details: 'Anti-replay token mismatch. Frame quarantined.',
  },
];
