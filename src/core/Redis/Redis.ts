import { IRedisConfig } from '@src/config/redis.config';
import { createClient, RedisClientType } from 'redis';
import { logger } from '@src/utils/logger';

export class Redis {
  private redisConfig: IRedisConfig;
  private client: RedisClientType;
  private static instance: Redis;

  private constructor(redisConfig: IRedisConfig) {
    this.redisConfig = redisConfig;
    this.client = createClient(this.redisConfig);
  }

  public static getInstance(redisConfig: IRedisConfig): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis(redisConfig);
    }
    return Redis.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Redis client connected successfully.');

      this.client.on('ready', () => {
        logger.info('Redis client ready');
      });
    } catch (error) {
      logger.error(`Failed to connect redis client: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.client.isOpen;
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Redis client disconnected successfully.');
    } catch (error) {
      logger.error('Failed to disconnect redis client.');
      throw error;
    }
  }

  public getClient() {
    return this.client;
  }
}
