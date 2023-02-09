import { join } from 'path';
import { mySubscriber } from 'src/utils/custom-subcribe';
import { DatabaseType, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const appDataSource = new DataSource({
  name: 'default',
  type: process.env.DB_CLIENT as 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  subscribers: ['src/utils/custom-subcribe'],
  synchronize: process.env.SYNC === 'true' ? true : false,
  entities: [join(__dirname, '..', 'entities', '**', '*.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations/*.{ts,js}')],
  migrationsTableName: 'migrations',
});

appDataSource.initialize();
