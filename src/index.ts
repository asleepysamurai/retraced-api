/**
 * Application Entry Point
 */

import { fastify, FastifyInstance } from 'fastify';

import { env } from 'utils/environment';
import * as routes from 'routes';
import { resolve } from 'path';

import { createConnection } from 'typeorm';
import { Category } from 'entities/Category.entity';

const initDB = async () => {
  await createConnection({
    type: 'sqlite',
    database: resolve(__dirname, '../../', env.get('DB_PATH')),
    entities: [Category],
    synchronize: true,
  });
};

const initRoutes = async (app: FastifyInstance) => {
  return Object.values(routes).map((init) => {
    app.register(
      async (app, _, done) => {
        await init(app);
        done();
      },
      { prefix: '/v1' },
    );
  });
};

const init = async () => {
  const app = fastify({
    ignoreTrailingSlash: true,
    logger: true,
    trustProxy: true,
  });

  try {
    await initDB();
    await initRoutes(app);

    await app.listen(env.getAsInt('APP_SERVER_PORT'), env.get('APP_SERVER_HOST'));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
};

init();
