import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export default async function listLinksRoute(fastify: FastifyInstance) {
  fastify.get('/api/links', async () => {
    const links = await prisma.shortLink.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return links;
  });
}
