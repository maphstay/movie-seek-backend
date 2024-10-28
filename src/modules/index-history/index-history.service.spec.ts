import { Test, TestingModule } from '@nestjs/testing';
import { IIndexHistoryService } from './interfaces/index-history-service.interface';
import { IndexHistoryService } from './index-history.service';
import { IIndexHistoryRepository } from './interfaces/index-history-repository.interface';
import { indexHistoryStatusEnum } from '@enums/index';
import { CreateIndexHistoryDto } from './dto/create-index-history.dto';
import { IndexHistory } from './entities/index-history.entity';
import { IErrorHandlingService } from '@modules/error-handling/interfaces';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { NotFoundException } from '@nestjs/common';
import { ErrorHandlingService } from '@modules/error-handling/error-handling.service';

describe('IndexHistoryService', () => {
  let indexHistoryService: IIndexHistoryService;
  let indexHistoryRepository: jest.Mocked<IIndexHistoryRepository>;

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
      providers: [
        {
          provide: IIndexHistoryService,
          useClass: IndexHistoryService,
        },
        {
          provide: IIndexHistoryRepository,
          useValue: {
            createAndSave: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: IErrorHandlingService,
          useClass: ErrorHandlingService,
        },
      ],
    }).compile();

    indexHistoryService = module.get<IIndexHistoryService>(IIndexHistoryService);
    indexHistoryRepository = module.get(IIndexHistoryRepository);
  });

  it('should be defined', () => {
    expect(indexHistoryService).toBeDefined();
  });

  describe('create', () => {
    it('should create a index history successfully', async () => {
      const createIndexHistoryDto: CreateIndexHistoryDto = {
        status: indexHistoryStatusEnum.SUCCESS,
        duration: '40s',
        processedRecords: 100,
        totalRecords: 200,
      };

      indexHistoryRepository.createAndSave.mockResolvedValue(indexHistories[0]);

      await indexHistoryService.create(createIndexHistoryDto);

      expect(indexHistoryRepository.createAndSave).toHaveBeenCalledWith(createIndexHistoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an index history list with pagination', async () => {
      const paginationDto: PaginationDto = { limit: 10, page: 1 };

      indexHistoryRepository.findAndCount.mockResolvedValue([indexHistories, 10]);

      const result = await indexHistoryService.findAll(paginationDto);

      expect(indexHistoryRepository.findAndCount).toHaveBeenCalledWith({
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
        take: paginationDto.limit,
        skip: expect.any(Number),
      });

      expect(result).toEqual({
        metadata: {
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalItens: expect.any(Number),
          totalPages: expect.any(Number),
        },
        data: indexHistories,
      });
    });
  });

  describe('findLatest', () => {
    it('should return not found exception when no record found', async () => {
      indexHistoryRepository.find.mockResolvedValueOnce([]);

      await expect(indexHistoryService.findLatest('path/test')).rejects.toThrow(NotFoundException);
    });

    it('should return the lastest index history ', async () => {
      indexHistoryRepository.find.mockResolvedValueOnce(indexHistories);

      const result = await indexHistoryService.findLatest('path/test');

      expect(indexHistoryRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC',
        },
        take: 1,
      });

      expect(result).toEqual(indexHistories[0]);
    });
  });
});
