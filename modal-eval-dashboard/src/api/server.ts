import express from 'express';
import cors from 'cors';
import { mockData } from './mockData';

const app = express();
app.use(cors());

app.get('/api/records', (_req, res) => {
  res.json(mockData);
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Mock API running at http://localhost:${PORT}`)
);
