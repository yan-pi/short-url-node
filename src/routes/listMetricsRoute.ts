import { FastifyInstance } from 'fastify';
import { redis } from '../lib/redis';

export default async function listMetricsRoute(fastify: FastifyInstance) {
  fastify.get('/api/metrics', async () => {
    try {
      const result = await redis.zrangebyscore('metrics', 0, 50, 'WITHSCORES');
      const metrics = result.reduce((acc: { [key: string]: number }, item, index, array) => {
        if (index % 2 === 0) {
          const shortLinkId = Number(item);
          const clicks = Number(array[index + 1]);
          acc[shortLinkId] = (acc[shortLinkId] || 0) + clicks;
        }
        return acc;
      }, {} as { [key: string]: number });

      const formattedMetrics = Object.keys(metrics).map((shortLinkId) => ({
        shortLinkId: Number(shortLinkId),
        clicks: metrics[shortLinkId],
      }));

      return formattedMetrics;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return { error: 'Failed to fetch metrics' };
    }
  });
}
