import { Test, TestingModule } from '@nestjs/testing';
import { IRequestService } from './interfaces';
import { RequestService } from './request.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

describe('RequestService', () => {
  let requestService: IRequestService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IRequestService,
          useClass: RequestService,
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    requestService = module.get<IRequestService>(IRequestService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(requestService).toBeDefined();
  });

  describe('getTopRatedMoviesToBeIndexed', () => {
    it('should call the URL with the provided page number', async () => {
      const page = 1;
      const response: AxiosResponse = {
        data: { results: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce(response);

      const result = await requestService.getTopRatedMoviesToBeIndexed(page);

      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        `${process.env.TMDB_API_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=${page}`,
      );
      expect(result).toEqual(response);
    });
  });
});
