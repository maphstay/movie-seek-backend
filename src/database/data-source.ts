import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

export const getDataSourceOptions = (configService?: ConfigService): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('PGSQL_HOST'),
    port: configService.get<number>('PGSQL_PORT'),
    username: configService.get<string>('PGSQL_USER'),
    password: configService.get<string>('PGSQL_PASSWORD'),
    database: configService.get<string>('PGSQL_NAME'),
    schema: configService.get<string>('PGSQL_SCHEMA'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*.{ts,js}', __dirname + '/../dist/database/migrations/*.{js}'],
    logging: false,
    synchronize: false,
    migrationsRun: false,
  };
};

ConfigModule.forRoot();
const configService = new ConfigService();

const dataSource = new DataSource(getDataSourceOptions(configService));
export default dataSource;
