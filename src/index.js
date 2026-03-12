const express = require('express');
const logsRouter = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());

// Mount the protected router
app.use('/logs', logsRouter);

// Required health check
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Log Service successfully started on port ${PORT}`);
});
