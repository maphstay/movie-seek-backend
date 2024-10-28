import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { MovieController } from './movie.controller';
import { IMovieService } from './interfaces/movie-service.interface';
import { Movie } from './entities/movie.entity';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: jest.Mocked<IMovieService>;

  const path = '/path/test';
  const req = { route: { path } };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: IMovieService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            indexMoviesRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get(IMovieService);
  });

  describe('findAll', () => {
    it('should return a paginated movies list', async () => {
      const paginationDto: PaginationDto = { limit: 10, page: 1 };
      const paginatedResponse = {
        metadata: {
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalItens: expect.any(Number),
          totalPages: expect.any(Number),
        },
        data: movies,
      };

      movieService.findAll.mockResolvedValueOnce(paginatedResponse);

      const result = await movieController.findAll(paginationDto);

      expect(movieService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a movie with the given id', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

      movieService.findOne.mockResolvedValueOnce(movies[0]);

      const result = await movieController.findOne(id, req);

      expect(movieService.findOne).toHaveBeenCalledWith(id, path);
      expect(result).toEqual(movies[0]);
    });
  });

  describe('indexMoviesFromApi', () => {
    it('should return a success message', async () => {
      const message = { message: 'index request received' };

      movieService.indexMoviesRequest.mockResolvedValueOnce(message);

      const result = await movieController.indexMoviesFromApi(req);

      expect(movieService.indexMoviesRequest).toHaveBeenCalledWith(path);
      expect(result).toEqual(message);
    });
  });
});
