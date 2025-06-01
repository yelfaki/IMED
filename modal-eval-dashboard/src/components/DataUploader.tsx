// src/components/DataUploader.tsx
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import Papa from 'papaparse';
import { setRecords } from '../store/evaluationSlice';
import type { EvaluationRecord } from '../types';

export default function DataUploader() {
  const dispatch = useDispatch();
  const [modelName, setModelName] = useState<string>('');

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;

      // Attach modelName and ensure timestamp is a string
      const attachModelAndFixDate = (arr: any[]): EvaluationRecord[] =>
        arr.map((rec: any) => {
          const rawTimestamp = rec.timestamp;
          const fixedTimestamp =
            rawTimestamp instanceof Date
              ? rawTimestamp.toISOString()
              : String(rawTimestamp);
          return {
            ...rec,
            modelName: modelName.trim(),
            timestamp: fixedTimestamp,
          } as EvaluationRecord;
        });

      if (file.name.toLowerCase().endsWith('.csv')) {
        Papa.parse<EvaluationRecord>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const withModel = attachModelAndFixDate(results.data);
            dispatch(setRecords(withModel));
          },
          error: (err) => console.error('[Uploader] PapaParse error:', err),
        });
      } else {
        try {
          const data = JSON.parse(text) as EvaluationRecord[];
          const withModel = attachModelAndFixDate(data);
          dispatch(setRecords(withModel));
        } catch (err) {
          console.error('[Uploader] Invalid JSON:', err);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Model Name</label>
      <input
        type="text"
        placeholder="e.g. ModelA or ResNet50_v2"
        className="border p-1 mb-2 w-full"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      />

      <label className="block mb-1 font-medium">Upload JSON or CSV:</label>
      <input
        type="file"
        accept=".json, .csv"
        onChange={handleFile}
        className="p-1 border rounded"
      />
    </div>
  );
}
