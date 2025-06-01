import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';
import type { RootState } from '../store';
import { selectFilteredRecords } from '../store/filterSlice';
import type { EvaluationRecord } from '../types';

export default function TimeSeriesChart() {
  // 1. Grab filtered records
  const records = useSelector(selectFilteredRecords);

  // 2. Prepare chart data: parse & sort by timestamp
  const data = useMemo(() => {
    return [...records]
      .map((r: EvaluationRecord) => ({
        time: new Date(r.timestamp).toLocaleString(),      // x-axis label
        confidence: +(r.confidence * 100).toFixed(1),       // convert to percentage
        latency: r.latencyMs
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [records]);

  if (data.length === 0) {
    return <p className="mt-4">No data to plot time series.</p>;
  }

  return (
    <div className="mt-6" style={{ width: '100%', height: 300 }}>
      <h2 className="text-xl font-semibold mb-2">Performance Over Time</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="confidence"
            name="Confidence (%)"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="latency"
            name="Latency (ms)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
