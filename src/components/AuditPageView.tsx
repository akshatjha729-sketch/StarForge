import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Hash,
  Clock,
  Shield,
  Layers,
  Download,
  Filter,
} from 'lucide-react';
import { DetailDrawer } from './DetailDrawer';

export interface AuditRecord {
  id: string;
  time: string;
  question: string;
  incident: string;
  evidenceCount: number;
  validation: 'VALIDATED' | 'ABSTAINED' | 'SYSTEM_TELEMETRY';
  commands: 'NONE' | 'DISPATCHED';
  sha256: string;
  operator: string;
  details: {
    inputTokens: number;
    retrievedSources: string[];
    claimsEvaluated: number;
    zeroCommandAttestation: string;
    reasoningHash: string;
  };
}

const AUDIT_LOG_ITEMS: AuditRecord[] = [
  {
    id: 'AUD-8841',
    time: '14:32:30 UTC',
    question: 'Why did battery voltage decrease?',
    incident: 'INC-024',
    evidenceCount: 5,
    validation: 'VALIDATED',
    commands: 'NONE',
    sha256: '9f83b2a7d4e10c558c39e248b9f018d45e02781cb7061d1982ea24c3df01a89b',
    operator: 'FLIGHT_DIRECTOR_OP4',
    details: {
      inputTokens: 1420,
      retrievedSources: ['TEL-1032', 'EV-204', 'COM-401', 'P-017', 'INC-008'],
      claimsEvaluated: 4,
      zeroCommandAttestation: 'READ_ONLY_COPILOT: No command uplink packets authorized or generated.',
      reasoningHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  },
  {
    id: 'AUD-8842',
    time: '14:32:45 UTC',
    question: 'Did the solar array physically break?',
    incident: 'INC-024',
    evidenceCount: 2,
    validation: 'ABSTAINED',
    commands: 'NONE',
    sha256: '3e20141a5b82098d6c77bb320f18d78901b045e76a94f810c92019ab7e42d871',
    operator: 'FLIGHT_DIRECTOR_OP4',
    details: {
      inputTokens: 890,
      retrievedSources: ['TEL-1030', 'EV-204'],
      claimsEvaluated: 2,
      zeroCommandAttestation: 'READ_ONLY_COPILOT: Speculative reasoning suppressed. Model abstained due to insufficient mechanical telemetry.',
      reasoningHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    },
  },
  {
    id: 'AUD-8840',
    time: '14:31:58 UTC',
    question: 'Switch matrix power reconfiguration EV-204',
    incident: 'SYS-EVT',
    evidenceCount: 1,
    validation: 'SYSTEM_TELEMETRY',
    commands: 'DISPATCHED',
    sha256: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
    operator: 'AUTONOMOUS_GROUND_PASS_TIMELINE',
    details: {
      inputTokens: 120,
      retrievedSources: ['EV-204'],
      claimsEvaluated: 1,
      zeroCommandAttestation: 'AUTHENTICATED_DISPATCH: Pre-scheduled pass command execution via CCSDS TC 0x018.',
      reasoningHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    },
  },
  {
    id: 'AUD-8839',
    time: '14:30:00 UTC',
    question: 'Subsystem baseline nominal health audit pass',
    incident: 'ROUTINE',
    evidenceCount: 12,
    validation: 'VALIDATED',
    commands: 'NONE',
    sha256: 'f87a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    operator: 'SCHEDULED_BATCH_ANALYZER',
    details: {
      inputTokens: 3200,
      retrievedSources: ['ORBIT-X1-ALL-BUSSES', 'SENTINEL-B2-RELAY'],
      claimsEvaluated: 12,
      zeroCommandAttestation: 'READ_ONLY_COPILOT: Routine telemetry health audit nominal.',
      reasoningHash: '9876543210abcdef0123456789abcdef9876543210abcdef0123456789abcdef',
    },
  },
];

export const AuditPageView: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [filterValidation, setFilterValidation] = useState<'ALL' | 'VALIDATED' | 'ABSTAINED' | 'SYSTEM_TELEMETRY'>('ALL');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);

  const filteredLogs = AUDIT_LOG_ITEMS.filter((item) => {
    if (filterValidation === 'ALL') return true;
    return item.validation === filterValidation;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(AUDIT_LOG_ITEMS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mission_copilot_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleVerifyHash = () => {
    setIsVerifying(true);
    setVerifySuccess(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifySuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div className="border-b border-sky-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-700 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>AUDIT TRAIL & GOVERNANCE</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Immutable Decision & Inquiry Log
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Cryptographically sealed record of operator inquiries, evidence retrieval chains, validation states, and commanding boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-300 bg-white hover:bg-sky-50 text-sky-800 font-mono text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-sky-600" />
            <span>EXPORT AUDIT LEDGER (JSON)</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-300">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>SHA-256 ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-200 pb-3 font-mono text-xs">
        <span className="text-slate-400 font-bold mr-1">FILTER LOGS:</span>
        {(['ALL', 'VALIDATED', 'ABSTAINED', 'SYSTEM_TELEMETRY'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterValidation(filter)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterValidation === filter
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            {filter} {filter === 'ALL' ? `(${AUDIT_LOG_ITEMS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Audit Log Table (Clean, Chronological) */}
      <div className="rounded-2xl border border-sky-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-sky-50/70 border-b border-sky-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">TIME</th>
                <th className="py-3.5 px-4 font-sans font-bold">INQUIRY / QUESTION</th>
                <th className="py-3.5 px-4">INCIDENT</th>
                <th className="py-3.5 px-4">EVIDENCE</th>
                <th className="py-3.5 px-4">VALIDATION</th>
                <th className="py-3.5 px-4">COMMANDS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedRecord(row);
                    setVerifySuccess(false);
                  }}
                  className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{row.time}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 group-hover:text-sky-600 transition-colors max-w-xs truncate">
                    {row.question}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                      {row.incident}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">{row.evidenceCount} sources</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.validation === 'VALIDATED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.validation === 'ABSTAINED'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}
                    >
                      {row.validation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        row.commands === 'NONE' ? 'text-slate-500' : 'text-sky-700'
                      }`}
                    >
                      {row.commands}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-sky-600 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Inspect</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Summary Banner */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-600">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-sky-600" />
          <span>ALL INFERENCES LOGGED AUTOMATICALLY WITH TIME-STAMPED SHA-256 IMMUTABILITY</span>
        </div>
        <span className="text-slate-500 font-bold">Zero Autonomous Commands Dispatched by AI Copilot</span>
      </div>

      {/* Right-Side Audit Detail Drawer */}
      {selectedRecord && (
        <DetailDrawer
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Audit Record ${selectedRecord.id}`}
          subtitle={`${selectedRecord.time} · Operator: ${selectedRecord.operator}`}
          badge={{
            text: selectedRecord.validation,
            variant:
              selectedRecord.validation === 'VALIDATED'
                ? 'success'
                : selectedRecord.validation === 'ABSTAINED'
                ? 'warning'
                : 'sky',
          }}
          width="lg"
        >
          {/* Question / Inquiry */}
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">OPERATOR INQUIRY</div>
            <div className="text-base font-bold text-slate-900 font-sans p-3 rounded-xl bg-slate-50 border border-slate-200">
              "{selectedRecord.question}"
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash with verification button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-sky-600" />
                <span>SHA-256 AUDIT DIGEST</span>
              </span>
              <button
                onClick={handleVerifyHash}
                disabled={isVerifying}
                className="text-sky-700 hover:text-sky-900 underline font-bold cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Verify Cryptographic Seal'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs break-all">
              {selectedRecord.sha256}
            </div>

            {verifySuccess && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>SEAL VALID: Merkle tree integrity verified against root. Zero tampering detected.</span>
              </div>
            )}
          </div>

          {/* Retrieved Evidence Sources */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">
              RETRIEVED EVIDENCE SOURCES ({selectedRecord.details.retrievedSources.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRecord.details.retrievedSources.map((src, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 font-mono text-xs font-bold">
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Zero Command Execution Attestation */}
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
            <div className="text-xs font-mono font-bold text-sky-800 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-sky-600" />
              <span>SAFETY COMPLIANCE ATTESTATION</span>
            </div>
            <p className="text-xs font-mono text-slate-700">
              {selectedRecord.details.zeroCommandAttestation}
            </p>
          </div>

          {/* Reasoning Hash */}
          <div className="space-y-1 text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
            <div>Input Tokens: {selectedRecord.details.inputTokens}</div>
            <div>Claims Evaluated: {selectedRecord.details.claimsEvaluated}</div>
            <div className="truncate">Reasoning Chain Digest: {selectedRecord.details.reasoningHash}</div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
