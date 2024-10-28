import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IMovieRepository } from './interfaces/movie-repository.interface';
import { BaseRepository } from '@bases/repository/base.repository';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieRepository extends BaseRepository<Movie> implements IMovieRepository {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {
    super(movieRepository);
  }
}
