import '@src/config/env.config';
import App from './app';
import { logger } from './utils/logger';
import { settings } from './config/setting.config';
import { MONGODB_DATABASE } from './database/mongodb';

class AppBootstrapper {
  private app: App;
  private port: number;
  private mongodb;

  constructor() {
    this.port = settings.application.port;
    this.app = new App();
    this.mongodb = MONGODB_DATABASE.getInstance();
  }

  public async start(): Promise<void> {
    try {
      this.app.listen(this.port);
      this.mongodb.connect();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Application startup failed: ', error);
      } else {
        logger.error('Application startup failed: Unknown error');
      }
      process.exit(1);
    }
  }
}

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception: ', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  if (reason instanceof Error) {
    logger.error('Unhandled Rejection: ', reason);
  } else {
    logger.error('Unhandled Rejection: Unknown reason');
  }
});

const bootstrapper = new AppBootstrapper();
bootstrapper.start();
