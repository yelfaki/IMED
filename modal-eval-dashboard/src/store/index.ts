import { configureStore } from '@reduxjs/toolkit';
import evaluationReducer from './evaluationSlice';
import filterReducer     from './filterSlice';

export const store = configureStore({
  reducer: {
    evaluation: evaluationReducer,
    filter:     filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
