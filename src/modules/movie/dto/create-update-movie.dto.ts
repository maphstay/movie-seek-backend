import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateMovieDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  tmdbId: number;

  @ApiProperty({ nullable: true })
  overview?: string;

  @ApiProperty({ nullable: true })
  posterPath?: string;

  @ApiProperty()
  releaseDate: string;

  @ApiProperty()
  voteAverage: number;
}
