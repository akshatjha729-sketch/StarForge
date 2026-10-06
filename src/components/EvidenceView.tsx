import React from 'react';
import { SectionHeader } from './SectionHeader';
import { EvidenceRetrievalRAG } from './EvidenceRetrievalRAG';
import { AIClaimValidationPanel } from './AIClaimValidationPanel';
import { DEFAULT_CLAIM_VALIDATIONS } from '../services/intelligenceEngine';
import { TabKey } from '../App';

interface EvidenceViewProps {
  onNavigate: (tab: TabKey) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 5 · EVIDENCE & RAG"
        title="Evidence Retrieval (RAG) & AI Claim Validation"
        subtitle="Hybrid BM25 + semantic retrieval grounded against flight SOPs with proposition-level verification and zero hallucination tolerances."
        prevTab="anomaly"
        nextTab="history"
        onNavigate={onNavigate}
      />

      {/* 1. Evidence Retrieval RAG Engine */}
      <EvidenceRetrievalRAG
        initialQuery="Why did the battery voltage decrease?"
        onSelectDocument={() => onNavigate('investigation')}
      />

      {/* 2. AI Claim Validation & Traceable Evidence Chain */}
      <AIClaimValidationPanel
        claims={DEFAULT_CLAIM_VALIDATIONS}
        onHighlightSource={() => onNavigate('anomaly')}
      />
    </div>
  );
};
