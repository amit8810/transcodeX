import { logger } from '../utils/logger';

interface ISetting {
  application: {
    port: number;
  };
  database: {
    MONGODB_URI: string;
    DB_NAME: string;
  };
  jwt: {
    SECRET: string;
    EXPIRES_IN: string;
  };
}

class Setting {
  private static instance: Setting;
  private setting;

  private constructor() {
    this.setting = {
      application: {
        port: this.getNumber('PORT', 8000),
      },
      database: {
        MONGODB_URI: this.getString('MONGODB_URI', ''),
        DB_NAME: this.getString('MONGODB_NAME', ''),
      },
      jwt: {
        SECRET: this.getString('JWT_SECRET', 'top-secret-1234'),
        EXPIRES_IN: this.getString('JWT_EXPIRES_IN', '1h'),
      },
    };
  }

  public static getInstance(): Setting {
    if (!Setting.instance) {
      Setting.instance = new Setting();
    }
    return Setting.instance;
  }

  getSetting(): ISetting {
    return this.setting;
  }

  private getNumber(envVar: string, defaultValue: number): number {
    const val = process.env[envVar];
    if (!val) {
      logger.warn(`Missing ${envVar}, using default value ${defaultValue}`);
      return defaultValue;
    }
    const parsedValue = parseInt(val, 10);
    if (isNaN(parsedValue)) {
      throw new Error(`${envVar} must be a valid number.`);
    }
    return parsedValue;
  }

  private getString(envVar: string, defaultValue: string): string {
    const val = process.env[envVar];
    if (!val) {
      logger.warn(`Missing ${envVar}, using default value ${defaultValue}`);
      return defaultValue;
    }
    return val;
  }
}

export const settings = Setting.getInstance().getSetting();
