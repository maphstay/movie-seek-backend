import { IndexHistoryRepository } from './index-history.repository';
import { IndexHistory } from './entities/index-history.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('IndexHistoryRepository', () => {
  let indexHistoryRepository: IndexHistoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexHistoryRepository,
        {
          provide: getRepositoryToken(IndexHistory),
          useValue: {},
        },
      ],
    }).compile();

    indexHistoryRepository = module.get<IndexHistoryRepository>(IndexHistoryRepository);
  });

  it('should be defined', () => {
    expect(indexHistoryRepository).toBeDefined();
  });
});
