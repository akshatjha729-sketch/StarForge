export type SatelliteId = 'ORBIT-X1' | 'SENTINEL-B2';

export interface TelemetryPoint {
  time: string;
  battery_voltage: number; // e.g. 28.5 V
  solar_power: number;     // e.g. 520 W
  temperature: number;     // e.g. 42.5 °C
  signal_strength: number; // e.g. -52 dBm
  speed_kms: number;       // e.g. 7.58 km/s
  altitude_km: number;     // e.g. 542 km
  latitude: number;
  longitude: number;
}

export type CommsStatus = 'ONLINE' | 'BLACKOUT' | 'RECONNECTED_VERIFIED';

export interface LastKnownPacket {
  packetId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude_km: number;
  speed_kms: number;
  battery_voltage: number;
  solar_power: number;
  signal_strength: number;
  temperature: number;
  safetyStatus: 'SAFE' | 'CAUTION_LOW_BATTERY' | 'VERIFIED_SAFE_POST_RECONNECT';
  safetyReason: string;
  bufferedFramesCount: number;
}

export interface SecurityDiagnostics {
  isHacked: boolean;
  statusText: string;
  encryption: string;
  signatureVerified: boolean;
  snr_db: number;
  bitErrorRate: string;
  dopplerShiftKhz: number;
  jammingRisk: string;
  authKeyCounter: number;
  lastSecurityCheck: string;
}

export interface SecurityAlert {
  id: string;
  time: string;
  satellite: SatelliteId;
  type: string;
  origin: string;
  status: 'BLOCKED' | 'FLAGGED';
  details: string;
}
