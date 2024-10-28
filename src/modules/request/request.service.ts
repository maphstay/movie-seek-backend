import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { IRequestService } from './interfaces';

@Injectable()
export class RequestService implements IRequestService {
  constructor(private readonly httpService: HttpService) {}

  public async getTopRatedMoviesToBeIndexed<T>(page: number): Promise<AxiosResponse<T>> {
    return await this.httpService.axiosRef.get<T>(
      `${process.env.TMDB_API_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=${page}`,
    );
  }
}
