const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    client = createClient({
      url: redisUrl
    });

    client.on('error', (err) => console.error('❌ Redis Client Error:', err));
    client.on('connect', () => console.log('✅ Redis Client Connected'));

    await client.connect();
  } catch (error) {
    console.error('❌ Redis Connection Failed:', error);
  }
};

const getClient = () => client;

const getCache = async (key) => {
  if (!client || !client.isOpen) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis Get Error:', err);
    return null;
  }
};

const setCache = async (key, value, ttl = 3600) => {
  if (!client || !client.isOpen) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.error('Redis Set Error:', err);
  }
};

const clearCache = async (pattern) => {
  if (!client || !client.isOpen) return;
  try {
    const keys = await client.keys(pattern); // Note: keys command is dangerous in prod with many keys, but ok for small scale
    // For production better allow flushdb or scan, but for now keys is simple
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Deleted ${keys.length} keys matching ${pattern}`);
    }
  } catch (err) {
    console.error('Redis Clear Error:', err);
  }
};

module.exports = { connectRedis, getClient, getCache, setCache, clearCache };
