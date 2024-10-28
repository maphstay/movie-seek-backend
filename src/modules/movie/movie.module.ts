import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { IMovieService } from './interfaces/movie-service.interface';
import { IMovieRepository } from './interfaces/movie-repository.interface';
import { MovieRepository } from './movie.repository';
import { RequestService } from '@modules/request/request.service';
import { IRequestService } from '@modules/request/interfaces';
import { IndexHistoryService } from '@modules/index-history/index-history.service';
import { IIndexHistoryService } from '@modules/index-history/interfaces/index-history-service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [
    {
      provide: IMovieService,
      useClass: MovieService,
    },
    {
      provide: IMovieRepository,
      useClass: MovieRepository,
    },
    MovieService,
    {
      provide: IRequestService,
      useClass: RequestService,
    },
    RequestService,
    {
      provide: IIndexHistoryService,
      useClass: IndexHistoryService,
    },
    IndexHistoryService,
  ],
})
export class MovieModule {}
