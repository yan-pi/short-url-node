import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});
