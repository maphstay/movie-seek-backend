export interface IExtraOptions {
  route: string;
  serviceName: string;
  serviceMethodName: string;
}

export abstract class IErrorHandlingService {
  abstract badRequestException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract unauthorizedException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract forbiddenException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract notFoundException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract conflictException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract tooManyRequestsException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract unsupportedMediaTypeException(extra: IExtraOptions, message?: string): Promise<void>;

  abstract internalServerErrorException(extra: IExtraOptions, message?: string): Promise<void>;
}
