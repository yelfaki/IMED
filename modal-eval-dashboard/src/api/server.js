// src/api/server.js
const express = require('express');
const cors = require('cors');
const mockData = require('./mockData.json');

const app = express();
app.use(cors());

// serve JSON at /api/records
app.get('/api/records', (_req, res) => {
  res.json(mockData);
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Mock API running at http://localhost:${PORT}`)
);
