import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { IErrorHandlingService, IExtraOptions } from './interfaces';

@Injectable()
export class ErrorHandlingService implements IErrorHandlingService {
  public async badRequestException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new BadRequestException(message || 'Bad request');
    Logger.error(extra.serviceName, exception, extra);
    throw exception;
  }

  public async unauthorizedException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new UnauthorizedException(message || 'Unauthorized');
    Logger.warn(exception, extra);
    throw exception;
  }

  public async forbiddenException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new ForbiddenException(message || 'Forbidden');
    Logger.warn(exception, extra);
    throw exception;
  }

  public async notFoundException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new NotFoundException(message || 'Not found');
    Logger.warn(exception, extra);
    throw exception;
  }

  public async conflictException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new ConflictException(message || 'Conflict');
    Logger.warn(exception, extra);
    throw exception;
  }

  public async tooManyRequestsException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new HttpException(message || 'Too Many Requests', 429);
    Logger.warn(exception, extra);
    throw exception;
  }

  public async unsupportedMediaTypeException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new UnsupportedMediaTypeException(message || 'Unsupported media type');
    Logger.error(extra.serviceName, exception, extra);
    throw exception;
  }

  public async internalServerErrorException(extra: IExtraOptions, message?: string): Promise<void> {
    const exception = new InternalServerErrorException(message || 'Internal server error');
    Logger.fatal(exception, extra);
    throw exception;
  }
}
