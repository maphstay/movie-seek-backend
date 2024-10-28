import { Global, Module } from '@nestjs/common';
import { IErrorHandlingService } from './interfaces';
import { ErrorHandlingService } from './error-handling.service';

@Global()
@Module({
  providers: [
    {
      provide: IErrorHandlingService,
      useClass: ErrorHandlingService,
    },
  ],
  exports: [
    {
      provide: IErrorHandlingService,
      useClass: ErrorHandlingService,
    },
  ],
})
export class ErrorHandlingModule {}
