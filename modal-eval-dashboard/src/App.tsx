import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRecords } from './store/evaluationSlice';
import FilterPanel   from './components/FilterPanel';
import DataUploader  from './components/DataUploader';
import RecordTable   from './components/RecordTable';
import ConfusionMatrix from './components/ConfusionMatrix';
import TimeSeriesChart from './components/TimeSeriesChart';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('/api/records')
      .then(res => dispatch(setRecords(res.data)))
      .catch(err => console.error('Error fetching records:', err));
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Model Evaluation Dashboard
      </h1>
      <FilterPanel />
      <DataUploader />
      <RecordTable />
      <ConfusionMatrix />
      <TimeSeriesChart />
    </div>
  );
}

export default App;
