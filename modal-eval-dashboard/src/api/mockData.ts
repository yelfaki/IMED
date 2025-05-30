import { EvaluationRecord } from '../types';

export const mockData: EvaluationRecord[] = [
  {
    id: '1',
    trueLabel: 'cat',
    predictedLabel: 'dog',
    confidence: 0.72,
    latencyMs: 45,
    timestamp: '2025-05-30T14:00:00Z',
  },
  // …add 10–20 more records for meaningful charts
];
