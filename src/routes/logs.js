const express = require('express');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const { publishLog, consumeAllLogs } = require('../rabbitmq');

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(requireAuth);

// WRITE PATH: Publish a log
router.post('/', async (req, res) => {
  const { level, message } = req.body;

  if (!level || !message) {
    return res.status(400).json({ error: 'Missing required fields: level and message' });
  }

  const logEntry = {
    id: crypto.randomUUID(),
    userId: req.user.sub, // User ID from Keycloak token
    level,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    await publishLog(logEntry);
    res.status(201).json({ message: 'Log published successfully', log: logEntry });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to publish log:', error);
    res.status(500).json({ error: 'Internal Server Error: Broker unavailable' });
  }
});

// READ PATH: Consume all logs
router.get('/', async (req, res) => {
  try {
    const logs = await consumeAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to consume logs:', error);
    res.status(500).json({ error: 'Internal Server Error: Broker unavailable' });
  }
});

module.exports = router;
