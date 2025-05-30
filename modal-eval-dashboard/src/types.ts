// src/types.ts
export interface EvaluationRecord {
  id: string;
  trueLabel: string;
  predictedLabel: string;
  confidence: number;   // 0–1
  latencyMs: number;    // in milliseconds
  timestamp: string;    // ISO‑8601 string
}
