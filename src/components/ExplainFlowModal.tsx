import React from 'react';
import { X, CheckCircle2, Radio, Globe, Shield, WifiOff, ArrowRight } from 'lucide-react';

interface ExplainFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainFlowModal: React.FC<ExplainFlowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-sky-300 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-200 bg-sky-50/70 px-6 py-4">
          <div>
            <div className="font-mono text-xs text-sky-700 font-bold">SYSTEM FLOW & PRESENTATION GUIDE</div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              How to Understand & Explain OrbitPulse Analytics (4 Simple Steps)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-sky-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-sm text-slate-700">
          {/* 30-Second Elevator Pitch Box */}
          <div className="rounded-xl border border-sky-300 bg-sky-50/60 p-5 shadow-xs">
            <div className="font-mono text-xs font-bold text-sky-800">
              THE 30-SECOND ELEVATOR PITCH (HOW TO EXPLAIN TO A JUDGE):
            </div>
            <p className="mt-2 text-slate-900 leading-relaxed text-sm">
              &ldquo;<strong>OrbitPulse Analytics</strong> is a mission control dashboard that solves satellite monitoring in four real-time steps: First, it streams live moving telemetry from orbiting spacecraft with a realistic 3D digital twin. Second, it lets operators track two satellites simultaneously on a synchronized world map. Third, if a communication blackout occurs, it captures the satellite&apos;s <em>Last Known Message</em> to immediately verify whether the craft is SAFE or CRITICAL before restoring contact. Fourth, it provides a diagnostic security shield to prove the satellite is cryptographically protected and not hacked.&rdquo;
            </p>
          </div>

          {/* 4 Clear Steps */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Step 1 */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700">
                <Radio className="h-4 w-4" />
                <span>STEP 1: LIVE MOVING TELEMETRY & 3D TWIN</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Live Sensor Streams & Spacecraft Inspection
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                The satellite acts as a real operating device in orbit. Every 1.5 seconds, live sensors send Battery Voltage (V), Solar Array Generation (W), Operating Temperature (°C), and S-Band Signal (dBm). The 3D aerospace satellite floats above a real NASA Earth while the live graph scrolls continuously.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700">
                <Globe className="h-4 w-4" />
                <span>STEP 2: DUAL SATELLITE TRACKING</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Two Satellites in One Operations Deck
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Instead of jumping between different tools, operators can view Satellite 1 (<strong>ORBIT-X1</strong>), Satellite 2 (<strong>SENTINEL-B2</strong>), or <strong>BOTH simultaneously</strong>. The world map shows their exact live Latitude, Longitude, Altitude, and Ground Station footprints over real NASA Earth imagery.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-700">
                <WifiOff className="h-4 w-4" />
                <span>STEP 3: COMMS LOSS & RECONNECT</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Blackout &quot;Last Message&quot; Blackbox
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                What happens if communication cuts? When you press <strong>&quot;Simulate Comms Cut&quot;</strong>, the system freezes the <em>Last Known Message</em> sent before blackout. It shows exact coordinates and gives an immediate autonomous safety verdict (SAFE vs. NOT SAFE). Clicking <strong>&quot;Reconnect&quot;</strong> verifies recovered frames and confirms <strong>&quot;VERIFIED SAFE AFTER RECONNECT&quot;</strong>.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700">
                <Shield className="h-4 w-4" />
                <span>STEP 4: CYBERSECURITY & HACK CHECK</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Verified Cryptographic Defense
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Operators can check if the satellite has been compromised or spoofed. The dashboard shows <strong>HACK STATUS: FALSE (VERIFIED SECURE)</strong> under CCSDS SDLS AES-256-GCM encryption. An interactive button lets you test a simulated unauthorized uplink attempt, which the firewall immediately blocks and logs.
              </p>
            </div>
          </div>

          {/* Interactive Demo Suggestion */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 shadow-xs">
            <div className="font-mono text-xs text-sky-800 font-bold">DEMO INSTRUCTIONS:</div>
            <ol className="mt-2 list-decimal list-inside space-y-1.5 text-xs text-slate-700">
              <li>Inspect the 3D Satellite above real NASA Earth and click subsystem hotspots or &quot;INSPECT SPACECRAFT&quot;.</li>
              <li>Toggle between <strong>ORBIT-X1</strong>, <strong>SENTINEL-B2</strong>, or <strong>BOTH SATELLITES</strong> to show dual tracking.</li>
              <li>Point out the live moving graph and changing GPS/Orbital coordinates updating in real time.</li>
              <li>Click <strong>&quot;REPLAY CRITICAL INCIDENT (INC-024)&quot;</strong> to watch the spacecraft EPS degrade and trigger the investigation.</li>
              <li>Click <strong>&quot;SIMULATE COMMS LOSS&quot;</strong> to demonstrate the Last Message Blackbox freeze and Safe/Not Safe verdict.</li>
              <li>Click <strong>&quot;TEST UNAUTHORIZED ATTEMPT&quot;</strong> in the Security Diagnostic box to demonstrate anti-hack blocking.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-sky-200 bg-sky-50/70 px-6 py-3">
          <span className="font-mono text-xs text-slate-500">Ready to present? You can reopen this guide anytime.</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-sky-500 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/25"
          >
            GOT IT — RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};
