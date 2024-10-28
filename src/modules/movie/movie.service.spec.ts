import { Test, TestingModule } from '@nestjs/testing';
import { IErrorHandlingService } from '@modules/error-handling/interfaces';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { HttpException, Logger, NotFoundException } from '@nestjs/common';
import { ErrorHandlingService } from '@modules/error-handling/error-handling.service';
import { IMovieService } from './interfaces/movie-service.interface';
import { IMovieRepository } from './interfaces/movie-repository.interface';
import { MovieService } from './movie.service';
import { IRequestService } from '@modules/request/interfaces';
import { IIndexHistoryService } from '@modules/index-history/interfaces/index-history-service.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { IIndexHistoryRepository } from '@modules/index-history/interfaces/index-history-repository.interface';
import { Movie } from './entities/movie.entity';
import { AxiosResponse } from 'axios';
import { ITmdbResponse } from './interfaces';
import { InsertResult } from 'typeorm';

describe('MovieService', () => {
  let movieService: IMovieService;
  let movieRepository: jest.Mocked<IMovieRepository>;
  let requestService: jest.Mocked<IRequestService>;

  const path = 'path/test';

  const movies = [
    {
      id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
      createdAt: new Date(),
      releaseDate: '2020-10-02',
      title: 'movie test',
      tmdbId: 54658,
      voteAverage: 8.12,
    },
  ] as unknown as Movie[];

  const mockResponse: AxiosResponse<ITmdbResponse> = {
    data: {
      results: [
        {
          id: 1,
          title: 'Movie 1',
          overview: 'Overview of Movie 1',
          release_date: '2024-01-01',
          vote_average: 8.0,
          poster_path: '/path/to/poster1.jpg',
        },
        {
          id: 2,
          title: 'Movie 2',
          overview: 'Overview of Movie 2',
          release_date: '2024-01-02',
          vote_average: 7.5,
          poster_path: '/path/to/poster2.jpg',
        },
      ],
      total_results: 6,
      total_pages: 3,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IMovieService,
          useClass: MovieService,
        },
        {
          provide: IMovieRepository,
          useValue: {
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            upsert: jest.fn(),
          },
        },
        EventEmitter2,
        {
          provide: IRequestService,
          useValue: {
            getTopRatedMoviesToBeIndexed: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: IErrorHandlingService,
          useClass: ErrorHandlingService,
        },
        {
          provide: IIndexHistoryService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: IIndexHistoryRepository,
          useValue: {},
        },
        {
          provide: IRequestService,
          useValue: {
            getTopRatedMoviesToBeIndexed: jest.fn(),
          },
        },
      ],
    }).compile();

    movieService = module.get<IMovieService>(IMovieService);
    movieRepository = module.get(IMovieRepository);
    requestService = module.get(IRequestService);

    jest.spyOn(Logger, 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a movie list with pagination', async () => {
      const paginationDto: PaginationDto = { limit: 10, page: 1 };

      movieRepository.findAndCount.mockResolvedValue([movies, 10]);

      const result = await movieService.findAll(paginationDto);

      expect(movieRepository.findAndCount).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          posterPath: true,
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
        data: movies,
      });
    });
  });

  describe('findOne', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

    it('should return not found exception when no movie found', async () => {
      movieRepository.findOneBy.mockResolvedValueOnce(undefined);

      await expect(movieService.findOne(id, path)).rejects.toThrow(NotFoundException);
    });

    it('should return a movie with the given id', async () => {
      movieRepository.findOneBy.mockResolvedValueOnce(movies[0]);

      const result = await movieService.findOne(id, path);

      expect(movieRepository.findOneBy).toHaveBeenCalledWith({
        where: {
          id,
        },
      });

      expect(result).toEqual(movies[0]);
    });
  });

  describe('indexMoviesRequest', () => {
    it('should return too many requests exception when a request is still in progress', async () => {
      movieService['inProgress'] = true;

      try {
        await expect(movieService.indexMoviesRequest(path)).rejects.toThrow(HttpException);
      } catch (error) {
        expect(error.getStatus()).toBe(429);
      }
    });

    it('should emit indexApiData event when no indexing is in progress', async () => {
      const response = await movieService.indexMoviesRequest(path);

      expect(response).toEqual({ message: 'index request received' });
    });

    it('should call indexMoviesFromApi method and set inProgress to true', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const partialEntity = { voteAverage: '8.100' };
      const upsertResult: InsertResult = { identifiers: [{ id }], generatedMaps: [{ id, ...partialEntity }], raw: [] };

      movieRepository.upsert.mockResolvedValue(upsertResult);

      requestService.getTopRatedMoviesToBeIndexed.mockResolvedValue(mockResponse);

      const result = await movieService.indexMoviesRequest(path);

      expect(movieService['inProgress']).toBe(true);

      await new Promise(setImmediate);

      expect(result).toEqual({ message: 'index request received' });
      expect(requestService.getTopRatedMoviesToBeIndexed).toHaveBeenCalledTimes(3);
      expect(requestService.getTopRatedMoviesToBeIndexed).toHaveBeenCalledWith(1);
      expect(requestService.getTopRatedMoviesToBeIndexed).toHaveBeenCalledWith(2);
      expect(requestService.getTopRatedMoviesToBeIndexed).toHaveBeenCalledWith(3);
      expect(movieRepository.upsert).toHaveBeenCalledTimes(3);
      expect(movieService['inProgress']).toBe(false);
    });
  });
});
