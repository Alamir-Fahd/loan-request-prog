const express = require('express');
const router = express.Router();

// POST /applications - Start a new loan screening
router.post('/', async (req, res) => {
  const { applicantId, income, debtAmount } = req.body;
  
  // We will attach the Temporal client to app.locals in index.js
  const client = req.app.locals.temporalClient;

  // 1. Validate input (Return 400 if bad data)
  if (!applicantId || typeof income !== 'number' || typeof debtAmount !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid application data. applicantId must be a string, income and debtAmount must be numbers.' });
  }

  try {
    // 2. Generate a unique ID for this specific workflow run
    const workflowId = `screening-${applicantId}-${Date.now()}`;

    // 3. Start the workflow in the background
    await client.workflow.start('screeningWorkflow', {
      args: [{ applicantId, income, debtAmount }], // Pass data to the workflow
      taskQueue: 'loan-screening',
      workflowId,
    });

    // 4. Return 202 Accepted (Processing started)
    res.status(202).json({ 
      message: 'Screening started', 
      workflowId 
    });
  } catch (err) {
    console.error('Failed to start workflow:', err);
    res.status(500).json({ error: 'Failed to start screening' });
  }
});

// GET /applications/:id - Fetch the final decision
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = req.app.locals.temporalClient;

  try {
    // Connect to the specific running (or completed) workflow
    const handle = client.workflow.getHandle(id);
    
    // Wait for the workflow to finish and get the result
    const result = await handle.result();
    
    res.status(200).json({ workflowId: id, decision: result });
  } catch (err) {
    // If the ID doesn't exist in Temporal, return a 404
    if (err.name === 'WorkflowNotFoundError') {
      return res.status(404).json({ error: 'Workflow ID not found' });
    }
    console.error('Error fetching result:', err);
    res.status(500).json({ error: 'Error fetching workflow result' });
  }
});

module.exports = router;
