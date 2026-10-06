import React from 'react';
import { SectionHeader } from './SectionHeader';
import { AIInvestigationConsole } from './AIInvestigationConsole';
import { EvidenceGroundedRecommendations } from './EvidenceGroundedRecommendations';
import { NoCommandPathBanner } from './NoCommandPathBanner';
import { PREBUILT_INVESTIGATIONS } from '../services/intelligenceEngine';
import { TabKey } from '../App';

interface InvestigationViewProps {
  onOpenInvestigationModal: () => void;
  onNavigate: (tab: TabKey) => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  onOpenInvestigationModal,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 3 · CONTEXTUAL INVESTIGATION"
        title="Evidence-Grounded AI Investigation Console"
        subtitle="Contextual multi-turn inquiries, known facts vs uncertainties, working hypotheses, abstention demonstration, and flight procedures."
        prevTab="spacecraft"
        nextTab="anomaly"
        onNavigate={onNavigate}
      />

      {/* 1. AI Investigation Console */}
      <AIInvestigationConsole
        onInvestigateIncident={onOpenInvestigationModal}
        onOpenAuditTrail={() => onNavigate('audit')}
      />

      {/* 2. Evidence Grounded Recommendations */}
      <EvidenceGroundedRecommendations
        recommendations={PREBUILT_INVESTIGATIONS['why-battery-decrease'].recommendations}
        onExecuteSimulation={onOpenInvestigationModal}
      />

      {/* 3. Safety Architecture: No Autonomous Command Execution */}
      <NoCommandPathBanner />
    </div>
  );
};
