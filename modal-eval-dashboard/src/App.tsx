import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRecords } from './store/evaluationSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/api/records').then(res => {
      dispatch(setRecords(res.data));
    });
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Model Evaluation Dashboard</h1>
      {/* TODO: Add components here */}
    </div>
  );
}

export default App;
