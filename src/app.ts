/**
 * Application Entry Point
 */

import { fastify, FastifyInstance } from 'fastify';

import { env } from 'src/utils/environment';
import * as routes from 'src/routes';
import { resolve } from 'path';

import { createConnection } from 'typeorm';
import { Category } from 'src/entities/Category.entity';

const initDB = async () => {
  await createConnection({
    type: 'sqlite',
    database:
      env.get('DB_PATH') === 'memory'
        ? ':memory:'
        : resolve(__dirname, '../../', env.get('DB_PATH')),
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

export const initApp = async () => {
  const app = fastify({
    ignoreTrailingSlash: true,
    logger: true,
    trustProxy: true,
  });

  try {
    await initDB();
    await initRoutes(app);

    return app;
  } catch (err) {
    // Error  during DB or route init, log error and rethrow to be handled by caller
    app.log.error(err);
    throw err;
  }
};
