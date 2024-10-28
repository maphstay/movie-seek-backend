import { IBaseRepository } from '@bases/repository/base-repository.interface';
import { Movie } from '../entities/movie.entity';

export abstract class IMovieRepository extends IBaseRepository<Movie> {}
