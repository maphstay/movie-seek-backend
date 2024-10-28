import { Global, Module } from '@nestjs/common';
import { IndexHistoryService } from './index-history.service';
import { IndexHistoryController } from './index-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexHistory } from './entities/index-history.entity';
import { IIndexHistoryService } from './interfaces/index-history-service.interface';
import { IIndexHistoryRepository } from './interfaces/index-history-repository.interface';
import { IndexHistoryRepository } from './index-history.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([IndexHistory])],
  controllers: [IndexHistoryController],
  providers: [
    {
      provide: IIndexHistoryRepository,
      useClass: IndexHistoryRepository,
    },
    {
      provide: IIndexHistoryService,
      useClass: IndexHistoryService,
    },
    IndexHistoryService,
  ],
  exports: [
    {
      provide: IIndexHistoryRepository,
      useClass: IndexHistoryRepository,
    },
  ],
})
export class IndexHistoryModule {}
