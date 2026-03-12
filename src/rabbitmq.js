const amqplib = require('amqplib');

let channel = null;

async function getChannel() {
  if (channel) return channel;
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    // Ensure queue is durable (survives restarts)
    await channel.assertQueue('logs', { durable: true });
    return channel;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("RabbitMQ Connection Error:", error);
    throw error;
  }
}

async function publishLog(logEntry) {
  const ch = await getChannel();
  const buffer = Buffer.from(JSON.stringify(logEntry));
  // persistent: true ensures the message survives broker restarts
  ch.sendToQueue('logs', buffer, { persistent: true });
}

async function consumeAllLogs() {
  const ch = await getChannel();
  const status = await ch.checkQueue('logs');
  const messageCount = status.messageCount;
  
  const logs = [];
  // Destructive read: fetch and acknowledge each message
  for (let i = 0; i < messageCount; i++) {
    const msg = await ch.get('logs', { noAck: false });
    if (msg) {
      logs.push(JSON.parse(msg.content.toString()));
      ch.ack(msg);
    }
  }
  return logs;
}

module.exports = { publishLog, consumeAllLogs };
