import React, { useState } from 'react';
import { SubsystemStatus, SubsystemKey } from './RealisticSpacecraftCanvas';

interface CompleteSatelliteImageProps {
  subsystems?: Record<string, SubsystemStatus>;
  onSelectSubsystem?: (subsystemKey: SubsystemKey) => void;
  className?: string;
  showLabels?: boolean;
}

export const CompleteSatelliteImage: React.FC<CompleteSatelliteImageProps> = ({
  subsystems,
  onSelectSubsystem,
  className = '',
  showLabels = true,
}) => {
  const [hoveredSubsystem, setHoveredSubsystem] = useState<SubsystemKey | null>(null);
  const [renderMode, setRenderMode] = useState<'SCHEMATIC' | 'CLEAN'>('SCHEMATIC');

  const powerStatus = subsystems?.POWER?.status || 'CRITICAL';
  const commsStatus = subsystems?.COMMUNICATION?.status || 'WARNING';
  const attStatus = subsystems?.ATTITUDE?.status || 'NORMAL';
  const thermStatus = subsystems?.THERMAL?.status || 'NORMAL';
  const compStatus = subsystems?.COMPUTE?.status || 'NORMAL';

  const handleClick = (key: SubsystemKey) => {
    if (onSelectSubsystem) {
      onSelectSubsystem(key);
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Background space environment with stars & subtle atmospheric glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030612] via-[#050c1f] to-[#02050e] overflow-hidden rounded-2xl">
        {/* Subtle star points */}
        <div
          className="absolute inset-0 opacity-60 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden="true"
        />
        {/* Curved blue Earth limb glow at the bottom */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[120%] h-48 bg-gradient-to-t from-sky-500/25 via-sky-600/10 to-transparent rounded-[100%] blur-xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Render Mode Switcher Pill (Top Right) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 backdrop-blur-md border border-slate-700/80 shadow-md text-[10px] font-mono">
        <button
          onClick={() => setRenderMode('SCHEMATIC')}
          className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
            renderMode === 'SCHEMATIC' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          ANNOTATED
        </button>
        <button
          onClick={() => setRenderMode('CLEAN')}
          className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
            renderMode === 'CLEAN' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          CLEAN SATELLITE
        </button>
      </div>

      {/* Active Subsystem Hover Tooltip */}
      {hoveredSubsystem && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-lg bg-slate-900/95 border border-sky-400 text-sky-300 font-mono text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <span>CLICK TO INSPECT: {hoveredSubsystem} SUBSYSTEM</span>
        </div>
      )}

      {/* Complete Satellite SVG Vector Illustration - Entire satellite visible from wingtip to wingtip */}
      <svg
        viewBox="0 0 1000 560"
        className="relative z-10 w-full h-full max-h-full p-2 filter drop-shadow-[0_12px_32px_rgba(14,165,233,0.3)] transition-all"
      >
        <defs>
          {/* Photovoltaic Silicon Cell Gradient */}
          <linearGradient id="satSolarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1329" />
            <stop offset="25%" stopColor="#1e3a8a" />
            <stop offset="55%" stopColor="#2563eb" />
            <stop offset="85%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Gold Kapton MLI Multi-Layer Insulation Foil */}
          <linearGradient id="satGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="25%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="80%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Spun Aluminum Parabolic High-Gain Dish */}
          <linearGradient id="satDishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="35%" stopColor="#64748b" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="90%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Structural Carbon Composite Frame */}
          <linearGradient id="satCarbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Plasma Thruster Plume */}
          <radialGradient id="satPlasmaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Optical Telescope Sapphire Lens Glow */}
          <radialGradient id="satLensGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Subtle Glow Filter */}
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ========================================================
            1. LEFT SOLAR ARRAY WING (Fully Extended Symmetrical Array)
        ======================================================== */}
        <g
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredSubsystem('POWER')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('POWER')}
          filter={hoveredSubsystem === 'POWER' ? 'url(#glowEffect)' : undefined}
        >
          {/* Main Yoke Mount to Bus */}
          <rect x="385" y="274" width="45" height="12" rx="2" fill="url(#satCarbonGrad)" stroke="#475569" strokeWidth="1" />
          <circle cx="385" cy="280" r="5" fill="#94a3b8" />
          <circle cx="430" cy="280" r="4" fill="#64748b" />

          {/* Panel 1 (Inboard) */}
          <rect x="295" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="298" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          {/* Grid lines */}
          <line x1="318" y1="225" x2="318" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="338" y1="225" x2="338" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="358" y1="225" x2="358" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="298" y1="262" x2="377" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="298" y1="298" x2="377" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="295" y1="222" x2="380" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="295" y1="338" x2="380" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Inter-panel hinges */}
          <rect x="289" y="248" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
          <rect x="289" y="300" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />

          {/* Panel 2 (Mid) */}
          <rect x="200" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="203" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          <line x1="223" y1="225" x2="223" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="243" y1="225" x2="243" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="263" y1="225" x2="263" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="203" y1="262" x2="282" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="203" y1="298" x2="282" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="200" y1="222" x2="285" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="200" y1="338" x2="285" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Inter-panel hinges */}
          <rect x="194" y="248" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
          <rect x="194" y="300" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />

          {/* Panel 3 (Outboard / Wingtip) */}
          <rect x="105" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="108" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          <line x1="128" y1="225" x2="128" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="148" y1="225" x2="148" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="168" y1="225" x2="168" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="108" y1="262" x2="187" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="108" y1="298" x2="187" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="105" y1="222" x2="190" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="105" y1="338" x2="190" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Left Wingtip electrostatic discharge wick */}
          <line x1="103" y1="222" x2="103" y2="338" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="103" cy="280" r="3" fill="#38bdf8" />
          <line x1="103" y1="280" x2="88" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="88" cy="280" r="2" fill="#ffffff" />
        </g>

        {/* ========================================================
            2. RIGHT SOLAR ARRAY WING (Fully Extended Symmetrical Array)
        ======================================================== */}
        <g
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredSubsystem('POWER')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('POWER')}
          filter={hoveredSubsystem === 'POWER' ? 'url(#glowEffect)' : undefined}
        >
          {/* Main Yoke Mount to Bus */}
          <rect x="570" y="274" width="45" height="12" rx="2" fill="url(#satCarbonGrad)" stroke="#475569" strokeWidth="1" />
          <circle cx="615" cy="280" r="5" fill="#94a3b8" />
          <circle cx="570" cy="280" r="4" fill="#64748b" />

          {/* Panel 1 (Inboard) */}
          <rect x="620" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="623" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          <line x1="643" y1="225" x2="643" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="663" y1="225" x2="663" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="683" y1="225" x2="683" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="623" y1="262" x2="702" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="623" y1="298" x2="702" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="620" y1="222" x2="705" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="620" y1="338" x2="705" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Inter-panel hinges */}
          <rect x="705" y="248" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
          <rect x="705" y="300" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />

          {/* Panel 2 (Mid) */}
          <rect x="715" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="718" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          <line x1="738" y1="225" x2="738" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="758" y1="225" x2="758" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="778" y1="225" x2="778" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="718" y1="262" x2="797" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="718" y1="298" x2="797" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="715" y1="222" x2="800" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="715" y1="338" x2="800" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Inter-panel hinges */}
          <rect x="800" y="248" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
          <rect x="800" y="300" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />

          {/* Panel 3 (Outboard / Wingtip) */}
          <rect x="810" y="222" width="85" height="116" rx="3" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
          <rect x="813" y="225" width="79" height="110" fill="url(#satSolarGrad)" />
          <line x1="833" y1="225" x2="833" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="853" y1="225" x2="853" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="873" y1="225" x2="873" y2="335" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="813" y1="262" x2="892" y2="262" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="813" y1="298" x2="892" y2="298" stroke="#93c5fd" strokeWidth="0.8" opacity="0.7" />
          <line x1="810" y1="222" x2="895" y2="222" stroke="#f59e0b" strokeWidth="2" />
          <line x1="810" y1="338" x2="895" y2="338" stroke="#f59e0b" strokeWidth="2" />

          {/* Right Wingtip electrostatic discharge wick */}
          <line x1="897" y1="222" x2="897" y2="338" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="897" cy="280" r="3" fill="#38bdf8" />
          <line x1="897" y1="280" x2="912" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="912" cy="280" r="2" fill="#ffffff" />
        </g>

        {/* ========================================================
            3. CENTRAL SPACECRAFT BUS (Center at X: 500, Y: 280)
        ======================================================== */}
        {/* Propulsion Skirt & Apogee Kick Motor Nozzle at Bottom */}
        <path d="M455,365 L545,365 L535,400 L465,400 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <ellipse cx="500" cy="400" rx="35" ry="9" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <path d="M482,400 L518,400 L526,432 L474,432 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="500" cy="434" rx="26" ry="12" fill="url(#satPlasmaGlow)" />

        {/* Left Radiator Panel Flank */}
        <polygon points="425,220 442,210 442,355 425,365" fill="#475569" stroke="#334155" strokeWidth="1" />

        {/* Right Radiator Panel Flank with Louvers (TCS) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredSubsystem('THERMAL')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('THERMAL')}
          filter={hoveredSubsystem === 'THERMAL' ? 'url(#glowEffect)' : undefined}
        >
          <polygon points="558,210 575,220 575,365 558,355" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <line x1="561" y1="240" x2="572" y2="246" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="561" y1="270" x2="572" y2="276" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="561" y1="300" x2="572" y2="306" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="561" y1="330" x2="572" y2="336" stroke="#94a3b8" strokeWidth="1.2" />
        </g>

        {/* Main Central Bus MLI Golden Facet (OBC / Avionics Deck) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredSubsystem('COMPUTE')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('COMPUTE')}
          filter={hoveredSubsystem === 'COMPUTE' ? 'url(#glowEffect)' : undefined}
        >
          <polygon points="442,210 558,210 558,355 442,355" fill="url(#satGoldFoil)" stroke="#78350f" strokeWidth="1.8" />
          {/* MLI blanket quilted quilting lines */}
          <line x1="442" y1="245" x2="558" y2="245" stroke="#92400e" strokeWidth="1" opacity="0.8" />
          <line x1="442" y1="282" x2="558" y2="282" stroke="#92400e" strokeWidth="1" opacity="0.8" />
          <line x1="442" y1="318" x2="558" y2="318" stroke="#92400e" strokeWidth="1" opacity="0.8" />
          <line x1="480" y1="210" x2="480" y2="355" stroke="#92400e" strokeWidth="1" opacity="0.8" />
          <line x1="520" y1="210" x2="520" y2="355" stroke="#92400e" strokeWidth="1" opacity="0.8" />
        </g>

        {/* Top Equipment Deck Plate */}
        <polygon points="425,220 442,210 558,210 575,220 500,226" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />

        {/* ========================================================
            4. NADIR EARTH OBSERVATION TELESCOPE BARREL
        ======================================================== */}
        <g>
          <rect x="478" y="350" width="44" height="26" rx="3" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="500" cy="374" rx="19" ry="7" fill="url(#satLensGlow)" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="500" cy="374" rx="9" ry="3.5" fill="#ffffff" opacity="0.8" />
        </g>

        {/* ========================================================
            5. STAR TRACKERS & ATTITUDE SENSORS (ADCS)
        ======================================================== */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredSubsystem('ATTITUDE')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('ATTITUDE')}
          filter={hoveredSubsystem === 'ATTITUDE' ? 'url(#glowEffect)' : undefined}
        >
          {/* Dual Star Tracker optical baffles */}
          <path d="M458,210 L448,182 L464,182 L468,210 Z" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.2" />
          <ellipse cx="456" cy="182" rx="8" ry="3.5" fill="#38bdf8" />

          <path d="M532,210 L536,182 L552,182 L542,210 Z" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.2" />
          <ellipse cx="544" cy="182" rx="8" ry="3.5" fill="#38bdf8" />

          {/* RCS Hydrazine Thruster blocks on corners */}
          <rect x="420" y="216" width="7" height="9" rx="1" fill="#94a3b8" />
          <polygon points="420,216 411,209 411,214" fill="#64748b" />
          <rect x="573" y="216" width="7" height="9" rx="1" fill="#94a3b8" />
          <polygon points="580,216 589,209 589,214" fill="#64748b" />
        </g>

        {/* ========================================================
            6. HIGH-GAIN PARABOLIC DISH ANTENNA (TT&C / COMMS)
        ======================================================== */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredSubsystem('COMMUNICATION')}
          onMouseLeave={() => setHoveredSubsystem(null)}
          onClick={() => handleClick('COMMUNICATION')}
          filter={hoveredSubsystem === 'COMMUNICATION' ? 'url(#glowEffect)' : undefined}
        >
          {/* Main Gimbaled Antenna Mast */}
          <line x1="500" y1="210" x2="500" y2="162" stroke="#cbd5e1" strokeWidth="4.5" />
          <circle cx="500" cy="162" r="6" fill="#f59e0b" />

          {/* Parabolic Reflector Dish */}
          <ellipse cx="500" cy="122" rx="78" ry="36" fill="url(#satDishGrad)" stroke="#475569" strokeWidth="2.5" />
          <ellipse cx="500" cy="122" rx="60" ry="26" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75" />
          <ellipse cx="500" cy="122" rx="32" ry="14" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.65" />
          <circle cx="500" cy="122" r="7" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Tripod Struts */}
          <line x1="500" y1="122" x2="500" y2="76" stroke="#334155" strokeWidth="2" />
          <line x1="446" y1="126" x2="500" y2="76" stroke="#475569" strokeWidth="1.8" />
          <line x1="554" y1="126" x2="500" y2="76" stroke="#475569" strokeWidth="1.8" />

          {/* Sub-Reflector Feed Horn */}
          <ellipse cx="500" cy="76" rx="11" ry="5.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="500" cy="76" r="4" fill="#38bdf8" />

          {/* S-band RF Carrier Wave Pulses (Animated) */}
          <ellipse cx="500" cy="62" rx="22" ry="9" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" className="animate-pulse" />
          <ellipse cx="500" cy="46" rx="40" ry="14" fill="none" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="4 4" opacity="0.45" />
        </g>

        {/* ========================================================
            7. MAGNETOMETER LATTICE BOOM
        ======================================================== */}
        <line x1="442" y1="210" x2="380" y2="122" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="434" y1="200" x2="394" y2="142" stroke="#64748b" strokeWidth="1.2" />
        <line x1="420" y1="180" x2="408" y2="160" stroke="#64748b" strokeWidth="1.2" />
        <circle cx="380" cy="122" r="7.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="380" cy="122" r="2.5" fill="#ffffff" />

        {/* ========================================================
            8. ACTIVE STATUS BEACONS & TELEMETRY INDICATORS
        ======================================================== */}
        <circle cx="500" cy="236" r="5" fill="#38bdf8" className="animate-ping" />
        <circle cx="500" cy="236" r="3.5" fill="#38bdf8" />
        <circle cx="500" cy="236" r="1.5" fill="#ffffff" />

        {/* ========================================================
            9. SUBSYSTEM TELEMETRY CALLOUT BADGES (OVERLAY)
        ======================================================== */}
        {showLabels && renderMode === 'SCHEMATIC' && (
          <g className="font-mono text-[11px] select-none">
            {/* POWER CALLOUT (Left Solar Wing) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('POWER')}
              onMouseEnter={() => setHoveredSubsystem('POWER')}
              onMouseLeave={() => setHoveredSubsystem(null)}
            >
              <line x1="240" y1="216" x2="240" y2="168" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <rect
                x="165"
                y="142"
                width="150"
                height="26"
                rx="6"
                fill="#0f172a"
                stroke={powerStatus === 'CRITICAL' ? '#f43f5e' : powerStatus === 'WARNING' ? '#f59e0b' : '#38bdf8'}
                strokeWidth="1.5"
              />
              <circle
                cx="180"
                cy="155"
                r="4.5"
                fill={powerStatus === 'CRITICAL' ? '#f43f5e' : powerStatus === 'WARNING' ? '#f59e0b' : '#22c55e'}
              />
              <text x="193" y="160" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                EPS: {powerStatus}
              </text>
            </g>

            {/* COMMS CALLOUT (Antenna Dish) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('COMMUNICATION')}
              onMouseEnter={() => setHoveredSubsystem('COMMUNICATION')}
              onMouseLeave={() => setHoveredSubsystem(null)}
            >
              <line x1="560" y1="98" x2="615" y2="68" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <rect
                x="620"
                y="54"
                width="160"
                height="26"
                rx="6"
                fill="#0f172a"
                stroke={commsStatus === 'CRITICAL' ? '#f43f5e' : commsStatus === 'WARNING' ? '#f59e0b' : '#38bdf8'}
                strokeWidth="1.5"
              />
              <circle
                cx="636"
                cy="67"
                r="4.5"
                fill={commsStatus === 'CRITICAL' ? '#f43f5e' : commsStatus === 'WARNING' ? '#f59e0b' : '#22c55e'}
              />
              <text x="649" y="72" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                TT&C: {commsStatus}
              </text>
            </g>

            {/* ADCS CALLOUT (Star Trackers) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('ATTITUDE')}
              onMouseEnter={() => setHoveredSubsystem('ATTITUDE')}
              onMouseLeave={() => setHoveredSubsystem(null)}
            >
              <line x1="550" y1="182" x2="600" y2="152" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <rect
                x="605"
                y="138"
                width="150"
                height="26"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <circle cx="620" cy="151" r="4.5" fill="#22c55e" />
              <text x="633" y="156" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                ADCS: {attStatus}
              </text>
            </g>

            {/* THERMAL CALLOUT (Louvers) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('THERMAL')}
              onMouseEnter={() => setHoveredSubsystem('THERMAL')}
              onMouseLeave={() => setHoveredSubsystem(null)}
            >
              <line x1="575" y1="340" x2="630" y2="370" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <rect
                x="635"
                y="358"
                width="150"
                height="26"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <circle cx="650" cy="371" r="4.5" fill="#22c55e" />
              <text x="663" y="376" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                TCS: {thermStatus}
              </text>
            </g>

            {/* OBC CALLOUT (Avionics Bus) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('COMPUTE')}
              onMouseEnter={() => setHoveredSubsystem('COMPUTE')}
              onMouseLeave={() => setHoveredSubsystem(null)}
            >
              <line x1="500" y1="355" x2="500" y2="455" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
              <rect
                x="425"
                y="458"
                width="150"
                height="26"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <circle cx="440" cy="471" r="4.5" fill="#22c55e" />
              <text x="453" y="476" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                OBC: {compStatus}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
