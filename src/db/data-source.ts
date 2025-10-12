import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: '../.env' });

// ДЛЯ ОТЛАДКИ - добавьте это
console.log('=== DEBUG DATABASE CONFIG ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
console.log('=============================');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
