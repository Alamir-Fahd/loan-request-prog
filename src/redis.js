const { createClient } = require('redis');
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

async function getCached(key) {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCached(key, value, ttlSeconds) {
  await client.set(key, JSON.stringify(value), {
    EX: ttlSeconds
  });
}

module.exports = {
  client,
  getCached,
  setCached
};
