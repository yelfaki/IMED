import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRecords } from './store/evaluationSlice';
import RecordTable from './components/RecordTable';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/api/records').then(res => {
      dispatch(setRecords(res.data));
    });
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Model Evaluation Dashboard</h1>
      <RecordTable />
    </div>
  );
}

export default App;
