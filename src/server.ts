import fastify from 'fastify';
import getLinkRoute from './routes/getLinkRoute';
import listLinksRoute from './routes/listLinksRoute';
import createLinkRoute from './routes/createLinkRoute';
import listMetricsRoute from './routes/listMetricsRoute';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const app = fastify();

// Registrar as rotas
app.register(getLinkRoute);
app.register(listLinksRoute);
app.register(createLinkRoute);
app.register(listMetricsRoute);

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
