import { IndexHistory } from '@modules/index-history/entities/index-history.entity';
import { Movie } from '@modules/movie/entities/movie.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IBaseResponse } from 'src/interfaces/index';

export class BaseResponseModel implements IBaseResponse {
  @ApiProperty()
  message: string;
}

export class IndexHistoryListResponseModel extends PickType(IndexHistory, ['id', 'status', 'createdAt']) {}

export class MovieListResponseModel extends PickType(Movie, ['id', 'title', 'posterPath']) {}
