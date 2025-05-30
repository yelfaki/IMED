// src/components/RecordTable.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { EvaluationRecord } from '../types';

export default function RecordTable() {
  const records = useSelector((state: RootState) => state.evaluation.records);

  if (records.length === 0) {
    return <p>No records to display.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">
        Records ({records.length})
      </h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">True Label</th>
            <th className="border px-2 py-1">Predicted</th>
            <th className="border px-2 py-1">Confidence</th>
            <th className="border px-2 py-1">Latency (ms)</th>
            <th className="border px-2 py-1">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec: EvaluationRecord) => (
            <tr key={rec.id}>
              <td className="border px-2 py-1">{rec.id}</td>
              <td className="border px-2 py-1">{rec.trueLabel}</td>
              <td className="border px-2 py-1">{rec.predictedLabel}</td>
              <td className="border px-2 py-1">
                {(rec.confidence * 100).toFixed(1)}%
              </td>
              <td className="border px-2 py-1">{rec.latencyMs}</td>
              <td className="border px-2 py-1">
                {new Date(rec.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
