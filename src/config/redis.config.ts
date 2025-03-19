import { logger } from '@src/utils/logger';

export interface IRedisConfig {
  username: string;
  password: string;
  socket: {
    host: string;
    port: number;
  };
}

export class RedisConfig {
  private static instance: RedisConfig;
  private config: Readonly<IRedisConfig>;

  private constructor() {
    if (!process.env.NODE_ENV) {
      logger.warn('NODE_ENV not set, assuming development');
    }

    const port = this.getEnvVar('REDIS_PORT') ? parseInt(this.getEnvVar('REDIS_PORT'), 10) : 6379;

    this.config = Object.freeze({
      username: this.getEnvVar('REDIS_USERNAME'),
      password: this.getEnvVar('REDIS_PASSWORD'),
      socket: Object.freeze({
        host: this.getEnvVar('REDIS_HOST') || 'localhost',
        port: isNaN(port) ? 6379 : port,
      }),
    });

    this.validateConfig();
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];
    if (value === undefined) {
      logger.warn(`Environment variable ${name} not set`);
      return '';
    }
    return value;
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (!this.config.username) {
      errors.push('REDIS_USERNAME is missing');
    }
    if (!this.config.password) {
      errors.push('REDIS_PASSWORD is missing');
    }
    if (!this.config.socket.host) {
      errors.push('REDIS_HOST is missing');
    }
    if (isNaN(this.config.socket.port) || this.config.socket.port <= 0) {
      errors.push('REDIS_PORT must be a valid positive number');
    }

    if (errors.length > 0) {
      const errorMessage = `Redis configuration errors: ${errors.join(', ')}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    return RedisConfig.instance;
  }

  public getConfig(): IRedisConfig {
    // Return a deep copy to prevent any modification
    return {
      username: this.config.username,
      password: this.config.password,
      socket: {
        host: this.config.socket.host,
        port: this.config.socket.port,
      },
    };
  }
}
