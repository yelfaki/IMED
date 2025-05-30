import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EvaluationRecord } from '../types';

interface State { records: EvaluationRecord[] }
const initialState: State = { records: [] };

export const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    setRecords(state, action: PayloadAction<EvaluationRecord[]>) {
      state.records = action.payload;
    }
  }
});

export const { setRecords } = evaluationSlice.actions;
export default evaluationSlice.reducer;
