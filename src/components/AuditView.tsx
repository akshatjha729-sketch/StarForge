import React from 'react';
import { SectionHeader } from './SectionHeader';
import { DataDecisionLineage } from './DataDecisionLineage';
import { AuditTrailPanel } from './AuditTrailPanel';
import { TabKey } from '../App';

interface AuditViewProps {
  onNavigate: (tab: TabKey) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 7 · TRACEABILITY & AUDIT"
        title="Complete Data Lineage & Cryptographic Audit Trail"
        subtitle="End-to-end data-to-decision lineage and immutable SHA-256 tamper-evident operator audit ledger."
        prevTab="history"
        nextTab="telemetry"
        onNavigate={onNavigate}
      />

      {/* 1. Interactive Data Decision Lineage Flowchart */}
      <DataDecisionLineage
        onNodeClick={(key) => {
          if (key === 'telemetry') onNavigate('telemetry');
          else if (key === 'ml') onNavigate('anomaly');
          else if (key === 'incident') onNavigate('home');
          else if (key === 'retrieved' || key === 'claim' || key === 'validation') onNavigate('evidence');
          else if (key === 'recommendation') onNavigate('investigation');
          else if (key === 'audit') onNavigate('audit');
        }}
      />

      {/* 2. Cryptographic Tamper-Evident Audit Trail */}
      <AuditTrailPanel />
    </div>
  );
};
