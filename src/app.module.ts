import { getDataSourceOptions } from '@database/data-source';
import { ErrorHandlingModule } from '@modules/error-handling/error-handling.module';
import { IndexHistoryModule } from '@modules/index-history/index-history.module';
import { MovieModule } from '@modules/movie/movie.module';
import { RequestModule } from '@modules/request/request.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDataSourceOptions(configService),
    }),
    ErrorHandlingModule,
    IndexHistoryModule,
    MovieModule,
    RequestModule,
  ],
})
export class AppModule {}
