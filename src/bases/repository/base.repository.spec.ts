import { Repository, UpdateResult, InsertResult, DeleteResult } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Test, TestingModule } from '@nestjs/testing';

class MockBaseRepository<T> extends BaseRepository<T> {
  constructor(mockedEntity: Repository<T>) {
    super(mockedEntity);
  }
}

describe('BaseRepository', () => {
  let mockBaseRepository: MockBaseRepository<any>;
  let mockedEntityRepository: jest.Mocked<Repository<any>>;

  beforeEach(async () => {
    mockedEntityRepository = {
      create: jest.fn(),
      count: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<any>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Repository,
          useValue: mockedEntityRepository,
        },
        {
          provide: MockBaseRepository,
          useFactory: (repository: Repository<any>) => new MockBaseRepository(repository),
          inject: [Repository],
        },
      ],
    }).compile();

    mockBaseRepository = module.get<MockBaseRepository<any>>(MockBaseRepository);
  });

  describe('createAndSave', () => {
    it('should create and save an return the stored entity', async () => {
      const data = { name: 'Test Entity' };
      const createdEntity = { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', ...data };

      mockedEntityRepository.create.mockReturnValue(createdEntity);
      mockedEntityRepository.save.mockResolvedValue(createdEntity);

      const result = await mockBaseRepository.createAndSave(data);
      expect(mockedEntityRepository.create).toHaveBeenCalledWith(data);
      expect(mockedEntityRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(createdEntity);
    });
  });

  describe('count', () => {
    it('should return the entities count', async () => {
      const count = 5;

      jest.spyOn(mockedEntityRepository, 'count').mockResolvedValue(count);

      const result = await mockBaseRepository.count();

      expect(mockedEntityRepository.count).toHaveBeenCalled();
      expect(result).toEqual(count);
    });
  });

  describe('find', () => {
    it('should return an entities array', async () => {
      const foundEntities = [{ id: 1 }, { id: 2 }, { id: 3 }];

      mockedEntityRepository.find.mockResolvedValue(foundEntities);

      const result = await mockBaseRepository.find();

      expect(mockedEntityRepository.find).toHaveBeenCalled();
      expect(result).toEqual(foundEntities);
    });
  });

  describe('findAndCount', () => {
    it('should return an entities array and the entities count', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const entity: [any[], number] = [[{ id, name: 'Test Entity' }], 10];

      mockedEntityRepository.findAndCount.mockResolvedValue(entity);

      const result = await mockBaseRepository.findAndCount({ where: { id } });

      expect(mockedEntityRepository.findAndCount).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(entity);
    });
  });

  describe('findOneBy', () => {
    it('should return an entity that matches with the given criteria', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const entity = { id, name: 'Test Entity' };

      mockedEntityRepository.findOne.mockResolvedValue(entity);

      const result = await mockBaseRepository.findOneBy({ where: { id } });

      expect(mockedEntityRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(entity);
    });
  });

  describe('update', () => {
    it('should update and return the updated entity', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const partialEntity = { name: 'Updated name' };
      const updatedEntity = { id, ...partialEntity };

      mockedEntityRepository.create.mockReturnValue(updatedEntity);
      // mockedEntityRepository.update;
      mockedEntityRepository.findOneBy.mockResolvedValue(updatedEntity);

      const result = await mockBaseRepository.update({ where: { id } }, partialEntity);

      expect(mockedEntityRepository.create).toHaveBeenCalledWith(partialEntity);
      expect(mockedEntityRepository.update).toHaveBeenCalledWith({ where: { id } }, updatedEntity as any);
      expect(mockedEntityRepository.findOneBy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedEntity);
    });
  });

  describe('upsert', () => {
    it('should update an existing entity or create a new one and return the updated or created entity', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const conflictPaths = ['id'];
      const partialEntity = { voteAverage: '8.100' };
      const upsertResult: InsertResult = { identifiers: [{ id }], generatedMaps: [{ id, ...partialEntity }], raw: [] };

      mockedEntityRepository.upsert.mockResolvedValue(Promise.resolve<InsertResult>(upsertResult));

      const result = await mockBaseRepository.upsert(partialEntity, conflictPaths);

      expect(mockedEntityRepository.upsert).toHaveBeenCalledWith(partialEntity, {
        conflictPaths,
        skipUpdateIfNoValuesChanged: true,
      });

      expect(result).toEqual(upsertResult);
    });
  });

  describe('softDelete', () => {
    it('should soft delete the entity and return it', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const deletedResult: UpdateResult = {
        raw: { id, name: 'entity name test' },
        generatedMaps: [],
      };

      mockedEntityRepository.softDelete.mockResolvedValue(Promise.resolve<UpdateResult>(deletedResult));

      const result = await mockBaseRepository.softDelete(id);

      expect(mockedEntityRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedResult);
    });
  });

  describe('delete', () => {
    it('should delete the entity and return it', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const deletedResult: DeleteResult = {
        raw: { id, name: 'entity name test' },
      };

      mockedEntityRepository.delete.mockResolvedValue(Promise.resolve<DeleteResult>(deletedResult));

      const result = await mockBaseRepository.delete(id);

      expect(mockedEntityRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedResult);
    });
  });
});
