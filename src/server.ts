import fastify from 'fastify';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const app = fastify();

app.get('/:code', async (request, reply) => {
  const getLinkSchema = z.object({
    code: z.string().min(3),
  });

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

app.get('/api/links', async () => {
  const links = await prisma.shortLink.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return links;
});

app.post('/api/links', async (request, reply) => {
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

app.get('/api/metrics', async () => {
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

const start = async () => {
  try {
    await app.listen({
      port: 8080,
    });
    console.log('Server is running on port 8080');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

// Fechar as conexões Prisma e Redis quando o aplicativo for encerrado
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect();
    await redis.quit();
  } catch (error) {
    console.error('Error closing connections:', error);
  }
});
