import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IIndexHistoryRepository } from './interfaces/index-history-repository.interface';
import { BaseRepository } from '@bases/repository/base.repository';
import { IndexHistory } from './entities/index-history.entity';

@Injectable()
export class IndexHistoryRepository extends BaseRepository<IndexHistory> implements IIndexHistoryRepository {
  constructor(
    @InjectRepository(IndexHistory)
    private readonly indexHistoryRepository: Repository<IndexHistory>,
  ) {
    super(indexHistoryRepository);
  }
}
