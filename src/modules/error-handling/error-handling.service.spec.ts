import { Test, TestingModule } from '@nestjs/testing';
import { IErrorHandlingService, IExtraOptions } from './interfaces';
import { ErrorHandlingService } from './error-handling.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

describe('ErrorHandlingService', () => {
  let errorHandlingService: IErrorHandlingService;
  const extra: IExtraOptions = {
    route: '/path/test',
    serviceName: 'testServiceName',
    serviceMethodName: 'testMethodName',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IErrorHandlingService,
          useClass: ErrorHandlingService,
        },
      ],
    }).compile();

    errorHandlingService = module.get<IErrorHandlingService>(IErrorHandlingService);
  });

  it('should be defined', () => {
    expect(errorHandlingService).toBeDefined();
  });

  describe('badRequestException', () => {
    it('should throw BadRequestException with custom message and log error', async () => {
      const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      await expect(errorHandlingService.badRequestException(extra, 'Test message')).rejects.toThrow(
        BadRequestException,
      );

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
      expect(loggerErrorSpy).toHaveBeenCalledWith(extra.serviceName, expect.any(BadRequestException), extra);
      loggerErrorSpy.mockRestore();
    });

    it('should throw BadRequestException with default message and log error', async () => {
      const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      await expect(errorHandlingService.badRequestException(extra)).rejects.toThrow(BadRequestException);

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
      expect(loggerErrorSpy).toHaveBeenCalledWith(extra.serviceName, expect.any(BadRequestException), extra);
      loggerErrorSpy.mockRestore();
    });
  });

  describe('unauthorizedException', () => {
    it('should throw Unauthorized with custom message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.unauthorizedException(extra, 'Test message')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(UnauthorizedException), extra);
      loggerWarnSpy.mockRestore();
    });

    it('should throw Unauthorized with default message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.unauthorizedException(extra)).rejects.toThrow(UnauthorizedException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(UnauthorizedException), extra);
      loggerWarnSpy.mockRestore();
    });
  });

  describe('forbiddenException', () => {
    it('should throw Forbidden with custom message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.forbiddenException(extra, 'Test message')).rejects.toThrow(ForbiddenException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(ForbiddenException), extra);
      loggerWarnSpy.mockRestore();
    });

    it('should throw Forbidden with default message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.forbiddenException(extra)).rejects.toThrow(ForbiddenException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(ForbiddenException), extra);
      loggerWarnSpy.mockRestore();
    });
  });

  describe('notFoundException', () => {
    it('should throw Not found with custom message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.notFoundException(extra, 'Test message')).rejects.toThrow(NotFoundException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(NotFoundException), extra);
      loggerWarnSpy.mockRestore();
    });

    it('should throw Not found with default message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.notFoundException(extra)).rejects.toThrow(NotFoundException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(NotFoundException), extra);
      loggerWarnSpy.mockRestore();
    });
  });

  describe('conflictException', () => {
    it('should throw Conflict with custom message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.conflictException(extra, 'Test message')).rejects.toThrow(ConflictException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(ConflictException), extra);
      loggerWarnSpy.mockRestore();
    });

    it('should throw Conflict with default message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      await expect(errorHandlingService.conflictException(extra)).rejects.toThrow(ConflictException);

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(ConflictException), extra);
      loggerWarnSpy.mockRestore();
    });
  });

  describe('tooManyRequestsException', () => {
    it('should throw Too Many Requests with custom message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      try {
        await expect(errorHandlingService.tooManyRequestsException(extra, 'Test message')).rejects.toThrow(
          HttpException,
        );
      } catch (error) {
        expect(error.getStatus()).toBe(429);
      }

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(HttpException), extra);
      loggerWarnSpy.mockRestore();
    });

    it('should throw Too Many Requests with default message and log warn', async () => {
      const loggerWarnSpy = jest.spyOn(Logger, 'warn').mockImplementation(() => {});

      try {
        await expect(errorHandlingService.tooManyRequestsException(extra)).rejects.toThrow(HttpException);
      } catch (error) {
        expect(error.getStatus()).toBe(429);
      }

      expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(expect.any(HttpException), extra);
      loggerWarnSpy.mockRestore();
    });
  });

  describe('unsupportedMediaTypeException', () => {
    it('should throw Unsupported media type with custom message and log error', async () => {
      const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      await expect(errorHandlingService.unsupportedMediaTypeException(extra, 'Test message')).rejects.toThrow(
        UnsupportedMediaTypeException,
      );

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
      expect(loggerErrorSpy).toHaveBeenCalledWith(extra.serviceName, expect.any(UnsupportedMediaTypeException), extra);
      loggerErrorSpy.mockRestore();
    });

    it('should throw Unsupported media type with default message and log error', async () => {
      const loggerErrorSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

      await expect(errorHandlingService.unsupportedMediaTypeException(extra)).rejects.toThrow(
        UnsupportedMediaTypeException,
      );

      expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
      expect(loggerErrorSpy).toHaveBeenCalledWith(extra.serviceName, expect.any(UnsupportedMediaTypeException), extra);
      loggerErrorSpy.mockRestore();
    });
  });

  describe('internalServerErrorException', () => {
    it('should throw Internal server error with custom message and log warn', async () => {
      const loggerFatalSpy = jest.spyOn(Logger, 'fatal').mockImplementation(() => {});

      await expect(errorHandlingService.internalServerErrorException(extra, 'Test message')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(loggerFatalSpy).toHaveBeenCalledTimes(1);
      expect(loggerFatalSpy).toHaveBeenCalledWith(expect.any(InternalServerErrorException), extra);
      loggerFatalSpy.mockRestore();
    });

    it('should throw Internal server error with default message and log warn', async () => {
      const loggerFatalSpy = jest.spyOn(Logger, 'fatal').mockImplementation(() => {});

      await expect(errorHandlingService.internalServerErrorException(extra)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(loggerFatalSpy).toHaveBeenCalledTimes(1);
      expect(loggerFatalSpy).toHaveBeenCalledWith(expect.any(InternalServerErrorException), extra);
      loggerFatalSpy.mockRestore();
    });
  });
});
