export interface EvaluationRecord {
  id: string;
  trueLabel: string;
  predictedLabel: string;
  confidence: number;    // 0–1
  latencyMs: number;     // in ms
  timestamp: string;     // ISO8601
}
