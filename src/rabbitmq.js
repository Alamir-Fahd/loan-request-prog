const amqplib = require('amqplib');

let channel = null;

// Helper to reuse a single connection/channel
async function getChannel() {
  if (channel) return channel;
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    // Ensure the queue survives broker restarts
    await channel.assertQueue('logs', { durable: true });
    return channel;
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
    throw error; // Let the route handler catch this and return a 500
  }
}

async function publishLog(logEntry) {
  const ch = await getChannel();
  const buffer = Buffer.from(JSON.stringify(logEntry));

  // persistent: true ensures the message itself survives a restart
  ch.sendToQueue('logs', buffer, { persistent: true });
}

async function consumeAllLogs() {
  const ch = await getChannel();

  // Check exactly how many messages are waiting right now
  const status = await ch.checkQueue('logs');
  const messageCount = status.messageCount;

  const logs = [];

  // Destructive read: loop through and grab each message
  for (let i = 0; i < messageCount; i++) {
    const msg = await ch.get('logs', { noAck: false });
    if (msg) {
      logs.push(JSON.parse(msg.content.toString()));
      ch.ack(msg); // Remove it from the queue permanently
    }
  }

  return logs;
}

module.exports = { publishLog, consumeAllLogs };
