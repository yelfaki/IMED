import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { EvaluationRecord } from '../types';
import type { StoreWithEvaluation } from './filterSlice';

interface EvaluationState {
  recordsByModel: Record<string, EvaluationRecord[]>;
}

const initialState: EvaluationState = {
  recordsByModel: {},
};

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    // Overwrites the array for a given modelName (taken from payload[0].modelName)
    setRecords(state, action) {
      const arr = action.payload as EvaluationRecord[];
      if (arr.length === 0) return;
      const name = arr[0].modelName;
      state.recordsByModel[name] = arr;
    },
    // (Optional) Remove all records for a single model
    clearModel(state, action) {
      const modelName = action.payload as string;
      delete state.recordsByModel[modelName];
    },
    // (Optional) Remove every model’s records
    clearAllModels(state) {
      state.recordsByModel = {};
    },
  },
});

export const { setRecords, clearModel, clearAllModels } = evaluationSlice.actions;
export default evaluationSlice.reducer;

/* Memoized selectors */

// 1) Base selector: return the entire recordsByModel map
export const selectRecordsByModel = (state: StoreWithEvaluation) =>
  state.evaluation.recordsByModel;

// 2) Memoized list of model names (keys of recordsByModel)
export const selectModels = createSelector(
  [selectRecordsByModel],
  (recordsByModel) => Object.keys(recordsByModel)
);

// 3) Return the raw array for a specific modelName (or undefined if not present)
export const selectRecordsFor =
  (modelName: string) =>
  (state: StoreWithEvaluation): EvaluationRecord[] | undefined =>
    state.evaluation.recordsByModel[modelName];
