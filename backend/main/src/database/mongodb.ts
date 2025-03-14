import { settings } from '@src/config/setting.config';
import { logger } from '@src/utils/logger';
import mongoose, { Mongoose } from 'mongoose';

const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
};

export class MONGODB_DATABASE {
  private uri: string;
  private dbName: string;
  private mongodb: Mongoose | null = null;
  private static instance: MONGODB_DATABASE | null = null;

  private constructor() {
    this.uri = settings.database.MONGODB_URI;
    this.dbName = settings.database.DB_NAME;
  }

  public static getInstance(): MONGODB_DATABASE {
    if (!MONGODB_DATABASE.instance) {
      MONGODB_DATABASE.instance = new MONGODB_DATABASE();
    }
    return MONGODB_DATABASE.instance;
  }

  public async connect(): Promise<void> {
    try {
      const connectionInstance = await mongoose.connect(
        `${this.uri}/${this.dbName}?retryWrites=true&w=majority`,
        mongooseOptions,
      );
      this.mongodb = connectionInstance;
      logger.info('MongoDB connected successfully.');
      logger.info(`DB-Name: ${connectionInstance.connection.name}`);
      logger.info(`DB-Host: ${connectionInstance.connection.host}`);
    } catch (error: any) {
      logger.error('Failed to connect to MongoDB:', error);
      console.error(error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.mongodb && this.mongodb.connection) {
        await this.mongodb.connection.close();
        logger.info('MongoDB connection closed successfully.');
        this.mongodb = null;
      } else {
        logger.warn('No active MongoDB connection to close.');
      }
    } catch (error: any) {
      logger.error('Failed to close MongoDB connection:', error.message);
    }
  }

  public getConnection(): Mongoose | null {
    return this.mongodb;
  }
}
