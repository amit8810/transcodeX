import dotenv, { configDotenv } from 'dotenv';
import path from 'path';

configDotenv();
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});
