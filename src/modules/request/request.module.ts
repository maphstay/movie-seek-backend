import { Global, Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { HttpModule } from '@nestjs/axios';
import { IRequestService } from './interfaces';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: IRequestService,
      useClass: RequestService,
    },
    RequestService,
  ],
  exports: [HttpModule],
})
export class RequestModule {}
