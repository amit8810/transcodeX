import express from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'http';
import { logger } from './utils/logger';
import apiRoutes from './api/routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
  }

  public listen(port: number): Server {
    const server = this.app.listen(port, () => {
      logger.info(`App is listening on the port ${port}`);
    });

    this.handleGracefulShutdown(server);
    return server;
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use('/api', apiRoutes);
  }

  private handleGracefulShutdown(server: Server): void {
    const shutdown = (signal: string): void => {
      logger.warn(`Received signal: ${signal}`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));
    process.on('SIGHUP', () => shutdown('SIGHUP'));
  }
}

export default App;
