import React from 'react';
import { SectionHeader } from './SectionHeader';
import { HistoricalIncidentComparison } from './HistoricalIncidentComparison';
import { TabKey } from '../App';

interface HistoryViewProps {
  onNavigate: (tab: TabKey) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 6 · MISSION MEMORY"
        title="Historical Incident Intelligence & Precedents"
        subtitle="Cross-mission historical incident search (INC-008 91%, INC-013 76%), root-cause comparisons, and validated flight mitigations."
        prevTab="evidence"
        nextTab="audit"
        onNavigate={onNavigate}
      />

      <HistoricalIncidentComparison
        onSelectProcedure={() => onNavigate('investigation')}
      />
    </div>
  );
};
