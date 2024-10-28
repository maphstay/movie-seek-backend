import { Injectable } from '@nestjs/common';
import { IIndexHistoryService } from './interfaces/index-history-service.interface';
import { IIndexHistoryRepository } from './interfaces/index-history-repository.interface';
import { IndexHistory } from './entities/index-history.entity';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { IPaginatedResponse } from 'src/interfaces/index';
import { IErrorHandlingService } from '@modules/error-handling/interfaces';
import { CreateIndexHistoryDto } from './dto/create-index-history.dto';

@Injectable()
export class IndexHistoryService implements IIndexHistoryService {
  constructor(
    private readonly indexHistoryRepository: IIndexHistoryRepository,
    private readonly errorHandlingService: IErrorHandlingService,
  ) {}

  public async create(createIndexHistoryDto: CreateIndexHistoryDto): Promise<void> {
    await this.indexHistoryRepository.createAndSave(createIndexHistoryDto);
  }

  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<Pick<IndexHistory, 'id' | 'status' | 'createdAt'>>> {
    const [indexHistories, count] = await this.indexHistoryRepository.findAndCount({
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
    });

    return {
      metadata: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalItens: count,
        totalPages: Math.ceil(count / paginationDto.limit),
      },
      data: indexHistories,
    };
  }

  public async findLatest(routePath: string): Promise<IndexHistory> {
    const [indexHistory] = await this.indexHistoryRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    if (!indexHistory)
      await this.errorHandlingService.notFoundException(
        {
          route: routePath,
          serviceName: IndexHistoryService.name,
          serviceMethodName: this.findLatest.name,
        },
        'there is no record yet',
      );

    return indexHistory;
  }
}
