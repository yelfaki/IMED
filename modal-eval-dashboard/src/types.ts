export interface EvaluationRecord {
  id: string;
  modelName: string;    // new model field
  trueLabel: string;
  predictedLabel: string;
  confidence: number;   // 0–1
  latencyMs: number;
  timestamp: string;
}