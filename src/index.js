const express = require('express');
const { Connection, Client } = require('@temporalio/client');
const { Worker, NativeConnection } = require('@temporalio/worker');
const applicationsRouter = require('./routes/applications');
const logsRouter = require('./routes/logs');

const app = express();
app.use(express.json());

async function start() {
  const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';

  // Connect to Temporal Client
  const clientConnection = await Connection.connect({ address });
  const temporalClient = new Client({ connection: clientConnection });
  app.locals.temporalClient = temporalClient;

  // Mount routers
  app.use('/applications', applicationsRouter);
  app.use('/logs', logsRouter);

  // Temporal Worker requires a NativeConnection
  const nativeConnection = await NativeConnection.connect({ address });

  // Set up Temporal Worker
  const worker = await Worker.create({
    connection: nativeConnection,
    namespace: 'default',
    taskQueue: 'loan-screening',
    workflowsPath: require.resolve('./workflow'),
    activities: require('./activities'),
  });

  // Start Express server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });

  // Run the Temporal Worker
  await worker.run();
}

start().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
