// src/components/ConfusionMatrix.tsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { selectFilteredRecords, selectCurrentRawRecords } from '../store/filterSlice';
import type { EvaluationRecord } from '../types';

export default function ConfusionMatrix() {
  // 1) Grab post‐filter array of records
  const filtered = useSelector(selectFilteredRecords);

  // 2) Grab the raw array for the current model (or EMPTY_RECORDS)
  const allRaw = useSelector(selectCurrentRawRecords);

  // 3) Derive the set of labels from the *raw* data
  const labels = useMemo(() => {
    const setL = new Set<string>();
    allRaw.forEach((r: EvaluationRecord) => {
      setL.add(r.trueLabel);
      setL.add(r.predictedLabel);
    });
    return Array.from(setL).sort();
  }, [allRaw]);

  // 4) Build a count map { "true→pred": count } and track the maximum
  const { countMap, maxCount } = useMemo(() => {
    const map: Record<string, number> = {};
    let max = 0;
    filtered.forEach((r: EvaluationRecord) => {
      const key = `${r.trueLabel}→${r.predictedLabel}`;
      map[key] = (map[key] || 0) + 1;
      if (map[key] > max) max = map[key];
    });
    return { countMap: map, maxCount: max };
  }, [filtered]);

  // 5) If no labels (no model chosen or no data), show a placeholder
  if (labels.length === 0) {
    return <p className="mt-4">No labels to build confusion matrix.</p>;
  }

  return (
    <div className="mt-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-2">Confusion Matrix</h2>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-2"></th>
            {labels.map((pred) => (
              <th key={pred} className="p-2 border text-center">
                Pred: {pred}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((trueLbl) => (
            <tr key={trueLbl}>
              <td className="p-2 border font-medium">True: {trueLbl}</td>
              {labels.map((predLbl) => {
                const key = `${trueLbl}→${predLbl}`;
                const cnt = countMap[key] || 0;
                // Normalize for background opacity
                const alpha = maxCount > 0 ? cnt / maxCount : 0;
                return (
                  <td
                    key={predLbl}
                    className="p-2 border text-center"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${alpha * 0.7 + 0.1})`,
                    }}
                  >
                    {cnt}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
