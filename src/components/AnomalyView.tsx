import React from 'react';
import { SectionHeader } from './SectionHeader';
import { AnomalyAnalysisPanel } from './AnomalyAnalysisPanel';
import { EventCorrelationTimeline } from './EventCorrelationTimeline';
import { AnomalyAnalysisData } from '../types/intelligence';
import { DEFAULT_CORRELATION_EVENTS } from '../services/intelligenceEngine';
import { TabKey } from '../App';

interface AnomalyViewProps {
  realAnomalyAnalysis: AnomalyAnalysisData;
  onNavigate: (tab: TabKey) => void;
}

export const AnomalyView: React.FC<AnomalyViewProps> = ({
  realAnomalyAnalysis,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        badge="TAB 4 · ANOMALY & CORRELATION"
        title="ML Anomaly Detection & Multi-Stream Event Correlation"
        subtitle="Isolation Forest ML scoring, rate-of-change telemetry deltas, and multi-stream timeline showing temporal correlation ≠ causation."
        prevTab="investigation"
        nextTab="evidence"
        onNavigate={onNavigate}
      />

      {/* 1. Visible ML Anomaly Detection */}
      <AnomalyAnalysisPanel analysis={realAnomalyAnalysis} />

      {/* 2. Multi-Stream Event Correlation Timeline */}
      <EventCorrelationTimeline
        events={DEFAULT_CORRELATION_EVENTS}
        onSelectEvent={() => onNavigate('investigation')}
      />
    </div>
  );
};
