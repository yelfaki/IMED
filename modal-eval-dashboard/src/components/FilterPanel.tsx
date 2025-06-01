import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  setCurrentModel,
  setTrueLabel,
  setPredictedLabel,
  setConfidenceRange,
  setStartTime,
  setEndTime,
  selectFilteredRecords,
  selectCurrentRawRecords,
} from '../store/filterSlice';
import { selectModels } from '../store/evaluationSlice';

export default function FilterPanel() {
  const dispatch = useDispatch();

  // 1. Memoized list of all loaded model names:
  const models = useSelector((s: RootState) => selectModels(s));

  // 2. Currently selected model name:
  const currentModel = useSelector((s: RootState) => s.filter.currentModel);

  // 3. Raw records for that model (or EMPTY_RECORDS if none)
  const allRecords = useSelector(selectCurrentRawRecords);

  // 4. After applying filters, how many remain?
  const filteredCount = useSelector(selectFilteredRecords).length;

  // 5. Build unique trueLabel options (memoized)
  const trueLabels = useMemo(() => {
    const setL = new Set(allRecords.map((r) => r.trueLabel));
    return ['all', ...Array.from(setL)];
  }, [allRecords]);

  // 6. Build unique predictedLabel options (memoized)
  const predictedLabels = useMemo(() => {
    const setL = new Set(allRecords.map((r) => r.predictedLabel));
    return ['all', ...Array.from(setL)];
  }, [allRecords]);

  // 7. Destructure filter state for convenient use
  const {
    trueLabel,
    predictedLabel,
    confidenceMin,
    confidenceMax,
    startTime,
    endTime,
  } = useSelector((s: RootState) => s.filter);

  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">Filters</h2>

      {/* ─── Model Selector ─── */}
      <label className="block mb-1">Model</label>
      <select
        className="border p-1 mb-4 w-full"
        value={currentModel ?? ''}
        onChange={(e) =>
          dispatch(setCurrentModel(e.target.value || null))
        }
      >
        <option value="">— Select Model —</option>
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* ─── True Label Filter ─── */}
      <label className="block mb-1">True Label</label>
      <select
        className="border p-1 mb-3 w-full"
        value={trueLabel}
        onChange={(e) => dispatch(setTrueLabel(e.target.value))}
        disabled={!currentModel}
      >
        {trueLabels.map((lbl) => (
          <option key={lbl} value={lbl}>
            {lbl}
          </option>
        ))}
      </select>

      {/* ─── Predicted Label Filter ─── */}
      <label className="block mb-1">Predicted Label</label>
      <select
        className="border p-1 mb-3 w-full"
        value={predictedLabel}
        onChange={(e) => dispatch(setPredictedLabel(e.target.value))}
        disabled={!currentModel}
      >
        {predictedLabels.map((lbl) => (
          <option key={lbl} value={lbl}>
            {lbl}
          </option>
        ))}
      </select>

      {/* ─── Confidence Range ─── */}
      <label className="block mb-1">Confidence Min / Max</label>
      <div className="flex space-x-2 mb-3">
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          className="border p-1 flex-1"
          value={confidenceMin}
          onChange={(e) =>
            dispatch(
              setConfidenceRange({
                min: Number(e.target.value),
                max: confidenceMax,
              })
            )
          }
          disabled={!currentModel}
        />
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          className="border p-1 flex-1"
          value={confidenceMax}
          onChange={(e) =>
            dispatch(
              setConfidenceRange({
                min: confidenceMin,
                max: Number(e.target.value),
              })
            )
          }
          disabled={!currentModel}
        />
      </div>

      {/* ─── Time Window ─── */}
      <label className="block mb-1">Start Time</label>
      <input
        type="datetime-local"
        className="border p-1 mb-3 w-full"
        value={startTime ?? ''}
        onChange={(e) => dispatch(setStartTime(e.target.value || null))}
        disabled={!currentModel}
      />

      <label className="block mb-1">End Time</label>
      <input
        type="datetime-local"
        className="border p-1 mb-3 w-full"
        value={endTime ?? ''}
        onChange={(e) => dispatch(setEndTime(e.target.value || null))}
        disabled={!currentModel}
      />

      {/* ─── Summary ─── */}
      <p className="mt-2 text-sm">
        Showing <strong>{filteredCount}</strong> /{' '}
        <strong>{allRecords.length}</strong> records
      </p>
    </div>
  );
}
