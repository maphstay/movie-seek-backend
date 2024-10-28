import { AxiosResponse } from 'axios';

export abstract class IRequestService {
  abstract getTopRatedMoviesToBeIndexed<T>(page: number): Promise<AxiosResponse<T>>;
}
