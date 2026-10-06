import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { AuditRecord } from '../types/intelligence';
import { INITIAL_AUDIT_LOGS } from '../services/intelligenceEngine';

interface AuditTrailPanelProps {
  logs?: AuditRecord[];
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ logs = INITIAL_AUDIT_LOGS }) => {
  return (
    <div id="sec-audit-trail" className="rounded-xl border border-sky-300 bg-white p-5 shadow-sm shadow-sky-100/60 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-sky-700" />
            <span>STAGE 08 · CRYPTOGRAPHIC AUDIT TRAIL & LINEAGE VERIFICATION</span>
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide mt-0.5">
            MISSION INVESTIGATION AUDIT TRAIL
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Immutable log of all automated inferences, RAG retrievals, claim validations, and operator interactions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-xs text-slate-800 font-bold">
          <Lock className="h-3.5 w-3.5 text-slate-600" />
          <span>SHA-256 INTEGRITY BOUND</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-sky-200 text-slate-600 bg-sky-50/50">
              <th className="py-2.5 px-3">RECORD ID</th>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">ACTOR / AGENT</th>
              <th className="py-2.5 px-3">EVENT & SYNTHESIS</th>
              <th className="py-2.5 px-3">EVIDENCE REF</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">HASH SIGNATURE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-sky-800">{log.id}</td>
                <td className="py-2.5 px-3 text-slate-600">{log.timestamp}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">{log.operator}</td>
                <td className="py-2.5 px-3 text-slate-800 font-sans text-xs">{log.event}</td>
                <td className="py-2.5 px-3 text-sky-700 font-medium">[{log.evidenceReference}]</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      log.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">{log.hashSignature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
