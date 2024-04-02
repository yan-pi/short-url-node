import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { z } from 'zod';

const getLinkSchema = z.object({
  code: z.string().min(3),
});

export default async function getLinkRoute(fastify: FastifyInstance) {
  fastify.get('/:code', async (request, reply) => {
    const { code } = getLinkSchema.parse(request.params);

    try {
      const link = await prisma.shortLink.findUnique({
        where: {
          code,
        },
      });

      if (!link) {
        return reply.status(404).send({ error: 'Link not found' });
      }

      await redis.zincrby('metrics', 1, String(link.id));

      return reply.redirect(301, link.originalUrl);
    } catch (error) {
      console.error('Error retrieving link:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
