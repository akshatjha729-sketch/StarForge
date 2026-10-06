import React from 'react';
import { SatelliteId, TelemetryPoint, CommsStatus, LastKnownPacket } from '../types';

interface WorldOrbitMapProps {
  telemetryX1: TelemetryPoint;
  telemetryB2: TelemetryPoint;
  commsX1: CommsStatus;
  commsB2: CommsStatus;
  packetX1: LastKnownPacket;
  packetB2: LastKnownPacket;
  selectedSat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH';
  onSelectSat: (sat: 'ORBIT-X1' | 'SENTINEL-B2' | 'BOTH') => void;
}

export const WorldOrbitMap: React.FC<WorldOrbitMapProps> = ({
  telemetryX1,
  telemetryB2,
  commsX1,
  commsB2,
  packetX1,
  packetB2,
  selectedSat,
  onSelectSat,
}) => {
  // Convert lat (-90 to 90) and lon (-180 to 180) to SVG coordinates [840 x 380]
  const toSvgCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 840;
    const y = ((90 - lat) / 180) * 380;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  };

  const posLatX1 = commsX1 === 'BLACKOUT' ? packetX1.latitude : telemetryX1.latitude;
  const posLonX1 = commsX1 === 'BLACKOUT' ? packetX1.longitude : telemetryX1.longitude;

  const posLatB2 = commsB2 === 'BLACKOUT' ? packetB2.latitude : telemetryB2.latitude;
  const posLonB2 = commsB2 === 'BLACKOUT' ? packetB2.longitude : telemetryB2.longitude;

  const coordX1 = toSvgCoords(posLatX1, posLonX1);
  const coordB2 = toSvgCoords(posLatB2, posLonB2);

  const groundStations = [
    { name: 'Svalbard SvalSat', lat: 78.2, lon: 15.4, code: 'SVB' },
    { name: 'Goldstone DSS-14', lat: 35.4, lon: -116.8, code: 'GDS' },
    { name: 'Canberra DSS-43', lat: -35.4, lon: 148.9, code: 'CBR' },
    { name: 'Kourou Diane', lat: 5.2, lon: -52.8, code: 'KRU' },
  ];

  // Draw ground track curves
  const makeTrack = (phaseOffset: number, amplitude: number) => {
    const pts: string[] = [];
    for (let lon = -180; lon <= 180; lon += 4) {
      const rad = ((lon + phaseOffset) * Math.PI) / 180;
      const lat = Math.sin(rad * 1.35) * amplitude;
      const { x, y } = toSvgCoords(lat, lon);
      pts.push(`${lon === -180 ? 'M' : 'L'} ${x} ${y}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="border border-sky-200 bg-white rounded-xl overflow-hidden shadow-sm shadow-sky-100/60 transition-all">
      {/* Map Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200 bg-sky-50/70 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-bold text-slate-900 tracking-wide">
                ORBITAL POSITION & GROUND STATION COVERAGE
              </h3>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Synchronized 2D Mercator Ground Track with Active Downlink Footprints
            </p>
          </div>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 rounded-lg bg-white p-1 border border-sky-200 shadow-xs">
          {(['ORBIT-X1', 'SENTINEL-B2', 'BOTH'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectSat(mode)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                selectedSat === mode
                  ? mode === 'ORBIT-X1'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : mode === 'SENTINEL-B2'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              {mode === 'BOTH' ? 'DUAL TRACKING' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative bg-[#030E1D] overflow-hidden select-none">
        <svg viewBox="0 0 840 380" className="h-[310px] w-full object-cover">
          <defs>
            {/* Gradients */}
            <linearGradient id="nightTerminator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020812" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#030E1D" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#071D38" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#09203A" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="satGlowX1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="satGlowB2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Genuine NASA Earth Satellite Map Underlay */}
          <image
            href="/earth_daymap.jpg"
            x="0"
            y="0"
            width="840"
            height="380"
            preserveAspectRatio="none"
            opacity="0.32"
          />

          {/* Sky-Blue Atmospheric Filter Overlay */}
          <rect
            x="0"
            y="0"
            width="840"
            height="380"
            fill="#030E1D"
            opacity="0.45"
            style={{ mixBlendMode: 'color' }}
          />

          {/* Graticule Grid Lines */}
          {[60, 120, 190, 260, 320].map((y) => (
            <line
              key={`lat-${y}`}
              x1="0"
              y1={y}
              x2="840"
              y2={y}
              stroke="#0E2847"
              strokeWidth={y === 190 ? '1' : '0.5'}
              strokeDasharray={y === 190 ? undefined : '3 3'}
            />
          ))}
          {[140, 280, 420, 560, 700].map((x) => (
            <line
              key={`lon-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="380"
              stroke="#0E2847"
              strokeWidth={x === 420 ? '1' : '0.5'}
              strokeDasharray={x === 420 ? undefined : '3 3'}
            />
          ))}

          {/* Simplified Continental Polygons in deep sky blue */}
          <g fill="#09203A" stroke="#123B69" strokeWidth="0.8">
            {/* North America */}
            <polygon points="90,60 220,50 260,115 200,170 140,155 95,110" />
            {/* South America */}
            <polygon points="220,185 285,200 270,305 230,325 205,245" />
            {/* Europe */}
            <polygon points="380,60 485,55 495,115 405,125 375,100" />
            {/* Africa */}
            <polygon points="380,135 485,140 505,230 455,295 410,280 375,195" />
            {/* Asia */}
            <polygon points="495,55 720,60 745,150 650,180 535,160 500,115" />
            {/* Australia */}
            <polygon points="645,240 740,235 750,295 665,302" />
          </g>

          {/* Solar Night Shading */}
          <rect x="0" y="0" width="420" height="380" fill="url(#nightTerminator)" />

          {/* Ground Station Radar Coverage Cones */}
          {groundStations.map((gs) => {
            const { x, y } = toSvgCoords(gs.lat, gs.lon);
            return (
              <g key={gs.name} transform={`translate(${x}, ${y})`}>
                <circle r="34" fill="#0284C7" fillOpacity="0.08" stroke="#38BDF8" strokeOpacity="0.3" strokeDasharray="3 3" />
                <circle r="3" fill="#38BDF8" />
                <rect x="7" y="-7" width="34" height="14" rx="2" fill="#051426" stroke="#123B69" strokeWidth="0.8" />
                <text x="11" y="3" fill="#7DD3FC" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">
                  {gs.code}
                </text>
              </g>
            );
          })}

          {/* ORBIT-X1 Trajectory Path */}
          {(selectedSat === 'ORBIT-X1' || selectedSat === 'BOTH') && (
            <path
              d={makeTrack(posLonX1 * -0.65, 78)}
              fill="none"
              stroke={commsX1 === 'BLACKOUT' ? '#F59E0B' : '#38BDF8'}
              strokeWidth="1.8"
              strokeOpacity="0.85"
            />
          )}

          {/* SENTINEL-B2 Trajectory Path */}
          {(selectedSat === 'SENTINEL-B2' || selectedSat === 'BOTH') && (
            <path
              d={makeTrack(posLonB2 * -0.65 + 85, 70)}
              fill="none"
              stroke={commsB2 === 'BLACKOUT' ? '#F59E0B' : '#7DD3FC'}
              strokeWidth="1.6"
              strokeDasharray="5 4"
              strokeOpacity="0.8"
            />
          )}

          {/* SATELLITE 1: ORBIT-X1 MARKER */}
          {(selectedSat === 'ORBIT-X1' || selectedSat === 'BOTH') && (
            <g transform={`translate(${coordX1.x}, ${coordX1.y})`}>
              {/* Outer pulsing ring */}
              <circle r="18" fill="url(#satGlowX1)" />
              <circle
                r="6"
                fill={commsX1 === 'BLACKOUT' ? '#F59E0B' : '#38BDF8'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              {/* Direction Indicator */}
              <line x1="0" y1="0" x2="12" y2="-6" stroke="#38BDF8" strokeWidth="1.5" />

              {/* HUD Flag */}
              <rect
                x="14"
                y="-13"
                width="142"
                height="22"
                rx="3"
                fill="rgba(5, 20, 38, 0.95)"
                stroke={commsX1 === 'BLACKOUT' ? '#F59E0B' : '#38BDF8'}
                strokeWidth="1"
              />
              <text x="18" y="2" fill="#FFFFFF" fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="600">
                ORBIT-X1 {commsX1 === 'BLACKOUT' ? '[LAST POS]' : `[${posLatX1}°, ${posLonX1}°]`}
              </text>
            </g>
          )}

          {/* SATELLITE 2: SENTINEL-B2 MARKER */}
          {(selectedSat === 'SENTINEL-B2' || selectedSat === 'BOTH') && (
            <g transform={`translate(${coordB2.x}, ${coordB2.y})`}>
              <circle r="18" fill="url(#satGlowB2)" />
              <circle
                r="6"
                fill={commsB2 === 'BLACKOUT' ? '#F59E0B' : '#7DD3FC'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <line x1="0" y1="0" x2="-10" y2="-8" stroke="#7DD3FC" strokeWidth="1.5" />

              <rect
                x="14"
                y="-13"
                width="150"
                height="22"
                rx="3"
                fill="rgba(5, 20, 38, 0.95)"
                stroke={commsB2 === 'BLACKOUT' ? '#F59E0B' : '#7DD3FC'}
                strokeWidth="1"
              />
              <text x="18" y="2" fill="#FFFFFF" fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="600">
                SENTINEL-B2 {commsB2 === 'BLACKOUT' ? '[LAST POS]' : `[${posLatB2}°, ${posLonB2}°]`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Synchronized Telemetry Telemetry Status Footprint */}
      <div className="grid grid-cols-1 gap-px bg-sky-200 md:grid-cols-2 font-mono text-xs tabular-nums">
        {/* Satellite 1 Telemetry Strip */}
        <div className={`p-4 ${commsX1 === 'BLACKOUT' ? 'bg-amber-50' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${commsX1 === 'BLACKOUT' ? 'bg-amber-500' : 'bg-sky-500'}`} />
              <strong className="text-sky-800">ORBIT-X1 (PRIMARY CLIMATE & EO BUS)</strong>
            </div>
            <span className={`font-semibold ${commsX1 === 'BLACKOUT' ? 'text-amber-700' : 'text-sky-700'}`}>
              {commsX1 === 'BLACKOUT' ? '● LOS BLACKOUT (LAST MESSAGE)' : '● LIVE DOWNLINK'}
            </span>
          </div>
          <div className="mt-2 text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>LAT: <strong className="text-slate-900">{posLatX1}°</strong></span>
            <span>LON: <strong className="text-slate-900">{posLonX1}°</strong></span>
            <span>ALT: <strong className="text-slate-900">{telemetryX1.altitude_km} km</strong></span>
            <span>VEL: <strong className="text-sky-700">{telemetryX1.speed_kms} km/s</strong></span>
            <span>INC: <strong className="text-slate-900">97.4° SSO</strong></span>
          </div>
        </div>

        {/* Satellite 2 Telemetry Strip */}
        <div className={`p-4 ${commsB2 === 'BLACKOUT' ? 'bg-amber-50' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${commsB2 === 'BLACKOUT' ? 'bg-amber-500' : 'bg-sky-600'}`} />
              <strong className="text-sky-800">SENTINEL-B2 (POLAR RELAY BUS)</strong>
            </div>
            <span className={`font-semibold ${commsB2 === 'BLACKOUT' ? 'text-amber-700' : 'text-sky-700'}`}>
              {commsB2 === 'BLACKOUT' ? '● LOS BLACKOUT (LAST MESSAGE)' : '● LIVE DOWNLINK'}
            </span>
          </div>
          <div className="mt-2 text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>LAT: <strong className="text-slate-900">{posLatB2}°</strong></span>
            <span>LON: <strong className="text-slate-900">{posLonB2}°</strong></span>
            <span>ALT: <strong className="text-slate-900">{telemetryB2.altitude_km} km</strong></span>
            <span>VEL: <strong className="text-sky-700">{telemetryB2.speed_kms} km/s</strong></span>
            <span>INC: <strong className="text-slate-900">82.5° Polar</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
