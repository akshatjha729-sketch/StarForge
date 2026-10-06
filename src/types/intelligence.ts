export type EvidenceSufficiencyLevel = 'HIGH' | 'PARTIAL' | 'LOW' | 'INSUFFICIENT';

export type ClaimValidationStatus = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'NOT_ESTABLISHED';

export interface AnomalyAnalysisData {
  parameter: string;
  currentValue: string;
  baselineRange: string;
  rateOfChange: string;
  deviationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  modelType: string;
  modelScore: number;
  isolationForestVerdict: 'NOMINAL' | 'ANOMALY';
  whyFlagged: string[];
}

export interface CorrelationEventNode {
  id: string;
  time: string;
  label: string;
  type: 'EVENT' | 'TELEMETRY' | 'ANOMALY' | 'SUBSYSTEM' | 'INCIDENT';
  detail: string;
  sourceCode: string;
  highlight?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  score: number; // 0 to 100
  snippet: string;
  category: 'PROCEDURE' | 'HISTORICAL_INCIDENT' | 'MISSION_EVENT';
}

export interface RAGRetrievalData {
  query: string;
  bm25: SearchResultItem[];
  semantic: SearchResultItem[];
  hybrid: SearchResultItem[];
  whyRetrieved: string;
}

export interface ClaimValidationItem {
  id: string;
  claim: string;
  status: ClaimValidationStatus;
  sourceId: string;
  timestamp: string;
  parameter: string;
  telemetryValue: string;
  reason: string;
}

export interface RecommendedActionItem {
  id: string;
  stepNumber: number;
  recommendation: string;
  source: string;
  sourceTitle: string;
  rationale: string;
}

export interface HistoricalIncident {
  id: string;
  title: string;
  similarity: number;
  date: string;
  matchReasons: string[];
  subsystem: string;
  outcome: string;
  lessonsLearned: string;
  procedureUsed: string;
}

export interface StructuredInvestigationCard {
  question: string;
  evidenceSufficiency: EvidenceSufficiencyLevel;
  sufficiencyReason: string;
  isAbstention: boolean;
  abstentionTitle?: string;
  abstentionSummary?: string;
  observedFacts: Array<{ text: string; source: string; timestamp: string }>;
  correlatedEvents: Array<{ text: string; source: string; timestamp: string }>;
  historicalContext: Array<{ text: string; source: string; similarity: string }>;
  hypothesis: string;
  hypothesisConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  knownFacts: string[];
  unknownFactors: string[];
  missingEvidence: string[];
  recommendations: RecommendedActionItem[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  event: string;
  operator: string;
  evidenceReference: string;
  status: 'VERIFIED' | 'LOGGED' | 'FLAGGED';
  hashSignature: string;
}

export type PipelineStageKey =
  | 'DETECT'
  | 'CORRELATE'
  | 'RETRIEVE'
  | 'COMPARE'
  | 'EXPLAIN'
  | 'VALIDATE'
  | 'RECOMMEND'
  | 'AUDIT';

export interface PipelineStageInfo {
  key: PipelineStageKey;
  number: string;
  title: string;
  subtitle: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  summary: string;
}
