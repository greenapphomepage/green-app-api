import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { mySubscriber } from 'src/utils/custom-subcribe';
// import '../utils/polyfill';

dotenv.config();

const DatabaseConfig = {
  name: 'default',
  type: process.env.DB_CLIENT,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  // logging: true,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  subscribers: [mySubscriber],
  // autoLoadEntities: true,
  synchronize: process.env.SYNC === 'true' ? true : false,
  // migrationsRun: false,
  entities: [join(__dirname, '..', 'entities', '**', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrations: [join(__dirname, '..', 'migrations/*.{ts,js}')],
  migrationsDir: join(__dirname, '..', 'migrations'),
  cli: {
    migrationsDir: 'src/migrations',
  },
} as TypeOrmModuleAsyncOptions;

export default DatabaseConfig;
