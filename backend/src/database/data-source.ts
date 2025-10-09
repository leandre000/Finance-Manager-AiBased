import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Determine if we're running from dist (production) or src (development)
const isProduction = __filename.includes('dist');
const baseDir = isProduction ? path.join(__dirname, '..') : path.join(__dirname, '../..');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'finance_manager'}`,
  entities: isProduction 
    ? [path.join(baseDir, '**/*.entity.js')]
    : [path.join(baseDir, 'src/**/*.entity.ts')],
  migrations: isProduction
    ? [path.join(baseDir, 'migrations/*.js')]
    : [path.join(baseDir, 'src/migrations/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

