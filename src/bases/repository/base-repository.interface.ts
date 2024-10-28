import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
  InsertResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class IBaseRepository<T> {
  abstract createAndSave(data: DeepPartial<T>): Promise<T>;
  abstract count(options?: FindManyOptions<T>): Promise<number>;
  abstract find(options?: FindManyOptions<T>): Promise<T[]>;
  abstract findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  abstract findOneBy(where: FindOneOptions<T>): Promise<T>;
  abstract update(id: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T>;
  abstract upsert(
    data: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    conflictPaths: string[],
  ): Promise<InsertResult>;
  abstract softDelete(id: string): Promise<UpdateResult>;
  abstract delete(id: string): Promise<DeleteResult>;
}
