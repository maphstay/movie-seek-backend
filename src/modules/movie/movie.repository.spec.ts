import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './entities/movie.entity';

describe('MovieRepository', () => {
  let movieRepository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: getRepositoryToken(Movie),
          useValue: {},
        },
      ],
    }).compile();

    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(movieRepository).toBeDefined();
  });
});
