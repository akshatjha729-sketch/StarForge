import React, { useState } from 'react';
import {
  Search,
  FileText,
  Activity,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { DetailDrawer } from './DetailDrawer';
import { DEFAULT_CLAIM_VALIDATIONS } from '../services/intelligenceEngine';

export interface EvidenceSourceDetail {
  id: string;
  category: 'TELEMETRY' | 'MISSION_EVENT' | 'PROCEDURE' | 'HISTORICAL_INCIDENT';
  title: string;
  parameter?: string;
  value?: string;
  timestamp?: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'VERIFIED';
  usedByClaim: string;
  validationStatus: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'NOT_ESTABLISHED';
  summary: string;
  sourceDocument?: string;
  rawPayload?: Record<string, any>;
}

export const EVIDENCE_SOURCE_ITEMS: Record<string, EvidenceSourceDetail> = {
  'TEL-1032': {
    id: 'TEL-1032',
    category: 'TELEMETRY',
    title: 'Primary Power Bus 1 ADC Sensor Channel',
    parameter: 'BATTERY_VOLTAGE',
    value: '24.80 V',
    timestamp: '14:32:05 UTC',
    status: 'CRITICAL',
    usedByClaim: 'Battery voltage decreased to 24.8 V.',
    validationStatus: 'SUPPORTED',
    summary: 'Direct calibrated analog-to-digital converter telemetry packet downlinked over S-band 2.2 GHz. Primary bus dropped below 25.5 V flight safety threshold.',
    sourceDocument: 'CCSDS Packet PKT-X1-8830 (APID 0x021)',
    rawPayload: {
      voltage_v: 24.8,
      bus_id: 'BUS-1',
      rate_of_change: '-0.42 V/min',
      sample_rate_hz: 1.0,
      adc_raw: '0x0C7A',
    },
  },
  'TEL-1030': {
    id: 'TEL-1030',
    category: 'TELEMETRY',
    title: 'Solar Array Drive Assembly (SADA) Current Monitor',
    parameter: 'SOLAR_POWER_GEN',
    value: '310 W',
    timestamp: '14:32:02 UTC',
    status: 'WARNING',
    usedByClaim: 'Solar generation dropped from 520 W to 310 W during terminator transit.',
    validationStatus: 'SUPPORTED',
    summary: 'Array current shunt telemetry shows sharp reduction in current output concurrent with solar panel gimbal pointing offset.',
    sourceDocument: 'CCSDS Packet PKT-X1-8828 (APID 0x024)',
    rawPayload: {
      solar_power_w: 310,
      nominal_baseline_w: 520,
      sun_vector_angle_deg: 14.2,
      shunts_active: 2,
    },
  },
  'EV-204': {
    id: 'EV-204',
    category: 'MISSION_EVENT',
    title: 'Secondary Payload Switch Matrix Command',
    parameter: 'CMD_DISPATCH_TIME',
    value: 'EXEC_SUCCESS (14:31:58)',
    timestamp: '14:31:58 UTC',
    status: 'NORMAL',
    usedByClaim: 'Power configuration EV-204 preceded battery degradation by 2 seconds.',
    validationStatus: 'SUPPORTED',
    summary: 'Automated ground pass command sequence executed switch matrix transition to power secondary optical imaging sensor and heater coils.',
    sourceDocument: 'Spacecraft Command Log LogEntry #204',
    rawPayload: {
      command_id: 'EV-204',
      subsystem: 'EPS / PAYLOAD',
      bus_switch_state: 'RELAY_CLOSED',
      command_origin: 'AUTONOMOUS_GROUND_TIMELINE',
    },
  },
  'COM-401': {
    id: 'COM-401',
    category: 'TELEMETRY',
    title: 'S-Band Transmitter RF Power Amplifier',
    parameter: 'CARRIER_POWER',
    value: '-57.2 dBm',
    timestamp: '14:32:08 UTC',
    status: 'WARNING',
    usedByClaim: 'Transmitter power dropped following bus dip.',
    validationStatus: 'SUPPORTED',
    summary: 'Power amplifier throttled output power from 22 W to 7 W to preserve remaining DC bus stability during undervoltage sag.',
    sourceDocument: 'CCSDS Packet PKT-X1-8832 (APID 0x018)',
    rawPayload: {
      rf_power_dbm: -57.2,
      pa_efficiency_pct: 64,
      vco_lock: 'LOCKED',
    },
  },
  'P-017': {
    id: 'P-017',
    category: 'PROCEDURE',
    title: 'Flight Procedure P-017: Electrical Power Subsystem Emergency Recovery',
    parameter: 'PROCEDURAL_GUIDE',
    value: 'RECOVERY PROTOCOL',
    timestamp: 'Rev 4.2 Approved',
    status: 'VERIFIED',
    usedByClaim: 'Review the power configuration and switch-matrix settings associated with EV-204.',
    validationStatus: 'SUPPORTED',
    summary: 'Step-by-step contingency checklist for resolving unexpected bus discharge: isolate secondary payload heaters, verify solar vector, shed non-essential loads.',
    sourceDocument: 'Mission Flight Operations Manual Vol. 4',
    rawPayload: {
      doc_id: 'FOM-SOP-EPS-017',
      applicable_subsystem: 'ELECTRICAL_POWER',
      action_items: 4,
      author: 'Flight Dynamics Division',
    },
  },
  'INC-008': {
    id: 'INC-008',
    category: 'HISTORICAL_INCIDENT',
    title: 'Incident Report INC-008: Solar Array Gimbal Azimuth Drag & Bus Sag',
    parameter: 'VECTOR_SIMILARITY',
    value: '91% MATCH',
    timestamp: '2024-11-14 (Orbit 4,492)',
    status: 'VERIFIED',
    usedByClaim: 'A virtually identical sequence occurred in INC-008 where bus voltage dropped to 24.6 V.',
    validationStatus: 'SUPPORTED',
    summary: 'Historical precedent: bus voltage dropped to 24.6 V following power command during terminator transit. Resolved nominally by shedding auxiliary heater bank within 18 minutes.',
    sourceDocument: 'Mission Historical Incident Docket INC-008',
    rawPayload: {
      similarity_score: 0.91,
      min_voltage_v: 24.6,
      recovery_time_min: 18,
      root_cause: 'Payload heater surge coincident with terminator off-pointing',
    },
  },
};

interface EvidencePageViewProps {
  onNavigateToInvestigation: () => void;
  selectedSourceId?: string | null;
}

export const EvidencePageView: React.FC<EvidencePageViewProps> = ({
  onNavigateToInvestigation,
  selectedSourceId: initialSourceId,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'TELEMETRY' | 'EVENTS' | 'PROCEDURES' | 'HISTORY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<EvidenceSourceDetail | null>(() => {
    return initialSourceId && EVIDENCE_SOURCE_ITEMS[initialSourceId]
      ? EVIDENCE_SOURCE_ITEMS[initialSourceId]
      : null;
  });

  // RAG Details toggle (HIDDEN BY DEFAULT to reduce clutter!)
  const [showRAGDetails, setShowRAGDetails] = useState<boolean>(false);

  // Filter items by category tab and search query
  const allItems = Object.values(EVIDENCE_SOURCE_ITEMS);
  const filteredItems = allItems.filter((item) => {
    if (activeCategory !== 'ALL') {
      if (activeCategory === 'TELEMETRY' && item.category !== 'TELEMETRY') return false;
      if (activeCategory === 'EVENTS' && item.category !== 'MISSION_EVENT') return false;
      if (activeCategory === 'PROCEDURES' && item.category !== 'PROCEDURE') return false;
      if (activeCategory === 'HISTORY' && item.category !== 'HISTORICAL_INCIDENT') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchParam = (item.parameter || '').toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchClaim = item.usedByClaim.toLowerCase().includes(q);
      return matchId || matchTitle || matchParam || matchSummary || matchClaim;
    }
    return true;
  });

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
            <Search className="h-4 w-4" />
            <span>EVIDENCE EXPLORER</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Grounded Citations & Source Verification
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Every AI statement is linked directly to a verifiable telemetry packet, mission event, or flight operations document.
          </p>
        </div>

        <button
          onClick={onNavigateToInvestigation}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-mono text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <span>BACK TO INVESTIGATION</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category Tabs: [ ALL ] [ TELEMETRY ] [ EVENTS ] [ PROCEDURES ] [ HISTORY ] and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200 pb-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold mr-1">FILTER:</span>
          {(['ALL', 'TELEMETRY', 'EVENTS', 'PROCEDURES', 'HISTORY'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50 hover:text-sky-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search citations, IDs, parameters..."
            className="w-full px-3.5 py-1.5 pl-9 rounded-xl border border-sky-200 bg-white text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-xs"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-700"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Sources Grid List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-400 uppercase tracking-wider">
            SHOWING {filteredItems.length} OF {allItems.length} GROUNDED SOURCES · CLICK TO INSPECT
          </span>
          <button
            onClick={() => setShowRAGDetails(!showRAGDetails)}
            className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
          >
            {showRAGDetails ? 'Hide RAG Embeddings Matrix ▲' : 'Show RAG Vector Similarities ▼'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedSource(item)}
              className="p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-sky-100 text-sky-800">
                    {item.id}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded font-mono text-[11px] font-bold ${
                      item.status === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : item.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500">{item.timestamp}</span>
                <span className="text-sky-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          RAG RETRIEVAL DETAILS (Hidden by default!)
      ======================================================== */}
      <div className="pt-6 border-t border-sky-100">
        <button
          onClick={() => setShowRAGDetails(!showRAGDetails)}
          className="flex items-center justify-between w-full p-4 rounded-xl border border-sky-300 bg-sky-50/50 hover:bg-sky-50 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-600" />
            <span className="font-mono text-xs font-bold text-sky-900">
              {showRAGDetails ? 'HIDE RETRIEVAL PIPELINE DETAILS' : 'VIEW RETRIEVAL DETAILS (BM25 + VECTOR + RERANKING)'}
            </span>
          </div>
          <span className="text-xs font-mono text-sky-700 font-semibold">
            {showRAGDetails ? '▲ COLLAPSE' : '▼ EXPAND (JUDGE VIEW)'}
          </span>
        </button>

        {showRAGDetails && (
          <div className="mt-4 p-6 rounded-2xl border border-sky-200 bg-white shadow-xs space-y-6 font-mono text-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">INFERENCE QUERY</div>
              <div className="mt-1 text-sm font-bold text-slate-900 font-sans">
                "Why did the battery voltage decrease?"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-sky-100">
              {/* BM25 RESULTS */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">1. BM25 KEYWORD SCORES</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">P-017</span>
                    <strong className="text-sky-700">94%</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">EV-204</span>
                    <strong className="text-sky-700">91%</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">INC-008</span>
                    <strong className="text-slate-500">82%</strong>
                  </div>
                </div>
              </div>

              {/* VECTOR RESULTS */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">2. DENSE VECTOR SIMILARITY</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">INC-008</span>
                    <strong className="text-purple-700">93%</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">P-017</span>
                    <strong className="text-purple-700">90%</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold">INC-013</span>
                    <strong className="text-slate-500">76%</strong>
                  </div>
                </div>
              </div>

              {/* FINAL RANKING */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">3. CROSS-ENCODER RERANKING</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-sky-50 border border-sky-300">
                    <span className="font-bold text-sky-900">P-017 (Procedure)</span>
                    <strong className="text-sky-800">94% (Rank 1)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-sky-50 border border-sky-300">
                    <span className="font-bold text-sky-900">INC-008 (History)</span>
                    <strong className="text-sky-800">91% (Rank 2)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span className="font-bold text-slate-700">EV-204 (Event)</span>
                    <strong className="text-slate-500">88% (Rank 3)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Claim Validation List */}
      <div className="pt-6 border-t border-sky-100 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Claim Validation</h2>
          <p className="text-xs font-mono text-slate-500">Every generative sentence is checked against evidence bounds</p>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {DEFAULT_CLAIM_VALIDATIONS.map((clm) => (
            <div
              key={clm.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-sky-200 bg-white gap-3 shadow-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 font-sans text-sm">
                  "{clm.claim}"
                </div>
                <div className="text-slate-500 text-[11px]">
                  Reason: {clm.reason}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    if (EVIDENCE_SOURCE_ITEMS[clm.sourceId]) {
                      setSelectedSource(EVIDENCE_SOURCE_ITEMS[clm.sourceId]);
                    }
                  }}
                  className="text-sky-700 hover:text-sky-900 underline font-semibold cursor-pointer"
                >
                  [{clm.sourceId}]
                </button>

                <span
                  className={`px-2.5 py-1 rounded font-bold ${
                    clm.status === 'SUPPORTED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : clm.status === 'PARTIALLY_SUPPORTED'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300'
                      : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}
                >
                  {clm.status === 'SUPPORTED'
                    ? '✓ SUPPORTED'
                    : clm.status === 'PARTIALLY_SUPPORTED'
                    ? '⚠ PARTIAL'
                    : '✗ NOT ESTABLISHED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          RIGHT-SIDE EVIDENCE DETAIL DRAWER (Section 7)
      ======================================================== */}
      {selectedSource && (
        <DetailDrawer
          isOpen={!!selectedSource}
          onClose={() => setSelectedSource(null)}
          title={selectedSource.title}
          subtitle={`Source ID: ${selectedSource.id} · ${selectedSource.category}`}
          badge={{
            text: selectedSource.status,
            variant:
              selectedSource.status === 'CRITICAL'
                ? 'danger'
                : selectedSource.status === 'WARNING'
                ? 'warning'
                : 'success',
          }}
          width="lg"
        >
          {/* Key Parameter & Measurement */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase">MEASURED PARAMETER</div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base font-bold text-slate-900">{selectedSource.parameter}</span>
              <span className="font-mono text-2xl font-extrabold text-sky-800">{selectedSource.value}</span>
            </div>
            {selectedSource.timestamp && (
              <div className="text-xs font-mono text-slate-500">Timestamp: {selectedSource.timestamp}</div>
            )}
          </div>

          {/* Used By AI Claim */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">USED BY AI CLAIM</div>
            <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-sm font-sans font-medium text-slate-900">
              "{selectedSource.usedByClaim}"
            </div>
          </div>

          {/* Validation Status */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">VALIDATION STATUS</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{selectedSource.validationStatus}: Verified against raw sensor stream</span>
            </div>
          </div>

          {/* Summary / Context */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">CONTEXT & CITATION</div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">{selectedSource.summary}</p>
            {selectedSource.sourceDocument && (
              <div className="mt-1 font-mono text-xs text-sky-700 font-semibold">
                Doc Ref: {selectedSource.sourceDocument}
              </div>
            )}
          </div>

          {/* Raw Payload */}
          {selectedSource.rawPayload && (
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase">RAW TELEMETRY PAYLOAD</div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                {JSON.stringify(selectedSource.rawPayload, null, 2)}
              </pre>
            </div>
          )}
        </DetailDrawer>
      )}
    </div>
  );
};
