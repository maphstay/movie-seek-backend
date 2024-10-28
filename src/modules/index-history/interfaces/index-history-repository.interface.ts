import { IBaseRepository } from '@bases/repository/base-repository.interface';
import { IndexHistory } from '../entities/index-history.entity';

export abstract class IIndexHistoryRepository extends IBaseRepository<IndexHistory> {}
