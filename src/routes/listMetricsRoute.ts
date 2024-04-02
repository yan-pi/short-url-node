import { FastifyInstance } from 'fastify';
import { redis } from '../lib/redis';

export default async function listMetricsRoute(fastify: FastifyInstance) {
  fastify.get('/api/metrics', async () => {
    try {
      const result = await redis.zrangebyscore('metrics', 0, 50, 'WITHSCORES');
      const metrics = result
        .sort((a, b) => Number(a[1]) - Number(b[1]))
        .map((item) => ({
          shortLinkId: Number(item[0]),
          clicks: Number(item[1]),
        }));

      return metrics;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return { error: 'Failed to fetch metrics' };
    }
  });
}
