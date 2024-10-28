import { PaginationDto } from '@bases/pagination/pagination.dto';
import { IndexHistory } from '../entities/index-history.entity';
import { IPaginatedResponse } from 'src/interfaces/index';
import { CreateIndexHistoryDto } from '../dto/create-index-history.dto';

export abstract class IIndexHistoryService {
  abstract create(createIndexHistoryDto: CreateIndexHistoryDto): Promise<void>;
  abstract findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<Pick<IndexHistory, 'id' | 'status' | 'createdAt'>>>;
  abstract findLatest(routePath: string): Promise<IndexHistory>;
}
