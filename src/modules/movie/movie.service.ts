import { Injectable, Logger } from '@nestjs/common';
import { CreateOrUpdateMovieDto } from './dto/create-update-movie.dto';
import { IMovieService } from './interfaces/movie-service.interface';
import { IMovieRepository } from './interfaces/movie-repository.interface';
import { Movie } from './entities/movie.entity';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { IPaginatedResponse } from 'src/interfaces/index';
import { IErrorHandlingService } from '@modules/error-handling/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ITmdbResponse } from './interfaces';
import { IRequestService } from '@modules/request/interfaces';
import { IIndexHistoryService } from '@modules/index-history/interfaces/index-history-service.interface';
import { indexHistoryStatusEnum } from '@enums/index';

@Injectable()
export class MovieService implements IMovieService {
  private inProgress = false;
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly requestService: IRequestService,
    private readonly errorHandlingService: IErrorHandlingService,
    private readonly indexHistoryService: IIndexHistoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<Pick<Movie, 'id' | 'title' | 'posterPath'>>> {
    const [users, count] = await this.movieRepository.findAndCount({
      select: {
        id: true,
        title: true,
        posterPath: true,
      },
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
    });

    return {
      metadata: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalItens: count,
        totalPages: Math.ceil(count / paginationDto.limit),
      },
      data: users,
    };
  }

  public async findOne(id: string, routePath: string): Promise<Movie> {
    const user = await this.movieRepository.findOneBy({
      where: {
        id,
      },
    });

    if (!user)
      await this.errorHandlingService.notFoundException(
        {
          route: routePath,
          serviceName: MovieService.name,
          serviceMethodName: this.findOne.name,
        },
        'movie not found',
      );

    return user;
  }

  public async indexMoviesRequest(routePath: string): Promise<{ message: string }> {
    if (this.inProgress)
      await this.errorHandlingService.tooManyRequestsException(
        {
          route: routePath,
          serviceName: MovieService.name,
          serviceMethodName: this.indexMoviesRequest.name,
        },
        'there is an indexing process in progress',
      );
    this.eventEmitter.once('indexApiData', async () => {
      this.inProgress = true;
      await this.indexMoviesFromApi();
    });

    this.eventEmitter.emit('indexApiData');
    return { message: 'index request received' };
  }

  private async indexMoviesFromApi(): Promise<void> {
    Logger.log('Start movies index process', MovieService.name);
    const startProcess = Date.now();
    let hasError = false;
    let parsedMoviesToStore: CreateOrUpdateMovieDto[] = [];
    let totalPages = 1;
    let totalRecords = 0;
    let processedRecords = 0;
    const pagesQuantityToGetBeforeSave = 3;
    try {
      for (let page = 1; page <= totalPages; page++) {
        const moviesList = await this.requestService
          .getTopRatedMoviesToBeIndexed(page)
          .then((res) => res.data as ITmdbResponse);

        totalRecords = moviesList.total_results;
        if (totalPages === 1) totalPages = moviesList.total_pages;

        for (const i in moviesList.results) {
          const parsedMovie: CreateOrUpdateMovieDto = {
            overview: moviesList.results[i]?.overview,
            releaseDate: moviesList.results[i]?.release_date,
            title: moviesList.results[i]?.title,
            tmdbId: moviesList.results[i]?.id,
            voteAverage: moviesList.results[i]?.vote_average,
            posterPath: moviesList.results[i]?.poster_path,
          };
          parsedMoviesToStore.push(parsedMovie);
        }

        if (page % pagesQuantityToGetBeforeSave === 0 || totalPages - page < pagesQuantityToGetBeforeSave) {
          await this.movieRepository.upsert(parsedMoviesToStore, ['tmdbId']);
          processedRecords += parsedMoviesToStore.length;
          parsedMoviesToStore = [];
        }
      }
    } catch (error) {
      hasError = true;
      Logger.error(error);
    } finally {
      const finishProcess = Date.now();
      const duration = `${((finishProcess - startProcess) / 1000).toFixed(0)}s`;
      await this.indexHistoryService.create({
        status: hasError ? indexHistoryStatusEnum.FAILED : indexHistoryStatusEnum.SUCCESS,
        duration,
        processedRecords,
        totalRecords,
      });
      this.inProgress = false;
      Logger.log('Finish movies index process', MovieService.name);
    }
  }
}
