import { Controller, Get, HttpCode, Param, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { IMovieService } from './interfaces/movie-service.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { Movie } from './entities/movie.entity';
import { ApiPaginatedResponse } from '@decorators/api-paginated-response.decorator';
import {
  ApiCustomAcceptedResponse,
  ApiCustomNotFoundResponse,
  ApiCustomOkResponse,
  ApiCustomTooManyRequestsResponse,
} from '@decorators/index';
import { MovieListResponseModel } from 'src/models';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: IMovieService) {}

  @Get()
  @ApiOperation({ summary: 'Find all movies' })
  @ApiPaginatedResponse({ type: MovieListResponseModel })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.movieService.findAll(paginationDto);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Find one movie',
  })
  @ApiCustomOkResponse({ type: Movie })
  @ApiCustomNotFoundResponse({ message: 'movie not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.movieService.findOne(id, req.route?.path);
  }

  @Get('re-index')
  @HttpCode(202)
  @ApiOperation({ summary: 'Index movies from tmdb api' })
  @ApiCustomAcceptedResponse({ message: 'index request received' })
  @ApiCustomTooManyRequestsResponse({ message: 'there is an indexing process in progress' })
  indexMoviesFromApi(@Req() req: any): Promise<{ message: string }> {
    return this.movieService.indexMoviesRequest(req.route?.path);
  }
}
