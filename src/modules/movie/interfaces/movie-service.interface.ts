import { PaginationDto } from '@bases/pagination/pagination.dto';
import { Movie } from '../entities/movie.entity';
import { IPaginatedResponse } from 'src/interfaces/index';

export abstract class IMovieService {
  abstract indexMoviesRequest(routePath: string): Promise<{ message: string }>;
  abstract findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<Pick<Movie, 'id' | 'title' | 'posterPath'>>>;
  abstract findOne(id: string, routePath: string): Promise<Movie>;
}
