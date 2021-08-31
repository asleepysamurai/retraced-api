/**
 * Application Entry Point
 */

import { initApp } from 'src/app';
import { env } from 'src/utils/environment';

const init = async () => {
  try {
    const app = await initApp();

    try {
      await app.listen(env.getAsInt('APP_SERVER_PORT'), env.get('APP_SERVER_HOST'));
    } catch (err) {
      // Error during port binding, log and throw to be handled by outer try
      app.log.error(err);
      throw err;
    }
  } catch (err) {
    // Errors should be logged by the time they get here
    // We do this roundabout thing to be able to use fastify built in logger
    // If we have our own logging system instead just throw the error and catch once and log and exit
    process.exit(1);
  }
};

void init();
