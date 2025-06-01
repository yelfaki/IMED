import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { EvaluationRecord } from '../types';
import type { RootState } from './index';
import { selectRecordsFor, selectRecordsByModel } from './evaluationSlice';

/**
 * We type the top‐level store shape here so that selectors importing
 * from evaluationSlice can see `evaluation: { recordsByModel: … }`.
 */
export type StoreWithEvaluation = {
  evaluation: {
    recordsByModel: Record<string, EvaluationRecord[]>;
  };
  filter: FilterState;
  [extra: string]: any;
};

interface FilterState {
  currentModel: string | null;   // ← which model’s data to filter
  trueLabel: string;
  predictedLabel: string;
  confidenceMin: number;
  confidenceMax: number;
  startTime: string | null;
  endTime: string | null;
}

const initialState: FilterState = {
  currentModel: null,
  trueLabel: 'all',
  predictedLabel: 'all',
  confidenceMin: 0,
  confidenceMax: 1,
  startTime: null,
  endTime: null,
};

// A single, stable empty array reference to avoid re-creating `[]` each call
export const EMPTY_RECORDS: EvaluationRecord[] = [];

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCurrentModel(state, action) {
      state.currentModel = action.payload as string | null;
    },
    setTrueLabel(state, action) {
      state.trueLabel = action.payload as string;
    },
    setPredictedLabel(state, action) {
      state.predictedLabel = action.payload as string;
    },
    setConfidenceRange(
      state,
      action
    ) {
      const payload = action.payload as { min: number; max: number };
      state.confidenceMin = payload.min;
      state.confidenceMax = payload.max;
    },
    setStartTime(state, action) {
      state.startTime = action.payload as string | null;
    },
    setEndTime(state, action) {
      state.endTime = action.payload as string | null;
    },
  },
});

export const {
  setCurrentModel,
  setTrueLabel,
  setPredictedLabel,
  setConfidenceRange,
  setStartTime,
  setEndTime,
} = filterSlice.actions;
export default filterSlice.reducer;

/* Selectors */

/**
 * 1) Get the raw array for the currently selected model,
 *    or return a stable EMPTY_RECORDS if no model is selected
 */
export const selectCurrentRawRecords = createSelector(
  [(state: RootState) => state.filter.currentModel, selectRecordsByModel],
  (currentModel, recordsByModel) =>
    currentModel
      ? recordsByModel[currentModel] ?? EMPTY_RECORDS
      : EMPTY_RECORDS
);

/**
 * 2) Apply all filters to that raw array.
 *    Using createSelector ensures we only recalc when either
 *    `selectCurrentRawRecords` or the filter slice changes.
 */
export const selectFilteredRecords = createSelector(
  [selectCurrentRawRecords, (state: RootState) => state.filter],
  (records, filter) =>
    records.filter((rec) => {
      // trueLabel filter
      if (filter.trueLabel !== 'all' && rec.trueLabel !== filter.trueLabel)
        return false;

      // predictedLabel filter
      if (
        filter.predictedLabel !== 'all' &&
        rec.predictedLabel !== filter.predictedLabel
      )
        return false;

      // confidence range filter
      if (
        rec.confidence < filter.confidenceMin ||
        rec.confidence > filter.confidenceMax
      )
        return false;

      // time window filter
      const t = new Date(rec.timestamp).getTime();
      if (filter.startTime) {
        const s = new Date(filter.startTime).getTime();
        if (t < s) return false;
      }
      if (filter.endTime) {
        const e = new Date(filter.endTime).getTime();
        if (t > e) return false;
      }

      return true;
    })
);
