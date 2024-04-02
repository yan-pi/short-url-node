import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export default async function createLinkRoute(fastify: FastifyInstance) {
  fastify.post('/api/links', async (request, reply) => {
    const createLinkSchema = z.object({
      code: z.string().min(3),
      url: z.string().url(),
    });

    const { code, url } = createLinkSchema.parse(request.body);

    try {
      const link = await prisma.shortLink.create({
        data: {
          code,
          originalUrl: url,
        },
        select: {
          id: true,
        },
      });

      return reply.status(201).send({ shortLinkId: link.id });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        return reply.status(400).send({ error: 'Code already in use' });
      }

      console.error('Error creating link:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
