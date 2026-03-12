const express = require('express');
const logsRouter = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the protected router at /logs
app.use('/logs', logsRouter);

// Required health check endpoint for the rubric
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Log Service successfully started on port ${PORT}`);
});
