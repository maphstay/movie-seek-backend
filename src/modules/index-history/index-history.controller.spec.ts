import { Test, TestingModule } from '@nestjs/testing';
import { IndexHistoryController } from './index-history.controller';
import { IIndexHistoryService } from './interfaces/index-history-service.interface';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { indexHistoryStatusEnum } from '@enums/index';
import { IndexHistory } from './entities/index-history.entity';

describe('IndexHistoryController', () => {
  let indexHistoryController: IndexHistoryController;
  let indexHistoryService: jest.Mocked<IIndexHistoryService>;

  const indexHistories = [
    {
      id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
      createdAt: new Date(),
      status: indexHistoryStatusEnum.SUCCESS,
      duration: '40s',
      processedRecords: 100,
      totalRecords: 200,
    },
  ] as unknown as IndexHistory[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndexHistoryController],
      providers: [
        {
          provide: IIndexHistoryService,
          useValue: {
            findAll: jest.fn(),
            findLatest: jest.fn(),
          },
        },
      ],
    }).compile();

    indexHistoryController = module.get<IndexHistoryController>(IndexHistoryController);
    indexHistoryService = module.get(IIndexHistoryService);
  });

  describe('findAll', () => {
    it('should return a paginated index histories list', async () => {
      const paginationDto: PaginationDto = { limit: 10, page: 1 };
      const paginatedResponse = {
        metadata: {
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalItens: expect.any(Number),
          totalPages: expect.any(Number),
        },
        data: indexHistories,
      };

      indexHistoryService.findAll.mockResolvedValueOnce(paginatedResponse);

      const result = await indexHistoryController.findAll(paginationDto);

      expect(indexHistoryService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findLatest', () => {
    it('should return the latest index history', async () => {
      const path = '/path/test';
      const req = { route: { path } };

      indexHistoryService.findLatest.mockResolvedValueOnce(indexHistories[0]);

      const result = await indexHistoryController.findLatest(req);

      expect(indexHistoryService.findLatest).toHaveBeenCalledWith(path);
      expect(result).toEqual(indexHistories[0]);
    });
  });
});
