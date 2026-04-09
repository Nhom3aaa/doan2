const { createClient } = require('redis');

let client = null;

const connectRedis = async () => {
  // Tạm thời vô hiệu hóa Redis theo yêu cầu
  console.log('ℹ️ Redis is currently disabled.');
  return;
  
  /* 
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
  */
};

const getClient = () => client;

const getCache = async (key) => {
  // Trả về null khi Redis bị vô hiệu hóa
  return null;
};

const setCache = async (key, value, ttl = 3600) => {
  // Không làm gì khi Redis bị vô hiệu hóa
  return;
};

const clearCache = async (pattern) => {
  // Không làm gì khi Redis bị vô hiệu hóa
  return;
};

module.exports = { connectRedis, getClient, getCache, setCache, clearCache };
