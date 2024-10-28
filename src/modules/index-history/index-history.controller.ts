import { Controller, Get, Query, Req } from '@nestjs/common';
import { IIndexHistoryService } from './interfaces/index-history-service.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@bases/pagination/pagination.dto';
import { IndexHistory } from './entities/index-history.entity';
import { ApiPaginatedResponse } from '@decorators/api-paginated-response.decorator';
import { ApiCustomNotFoundResponse, ApiCustomOkResponse } from '@decorators/index';
import { IndexHistoryListResponseModel } from 'src/models';

@ApiTags('Index Histories')
@ApiBearerAuth()
@Controller('index-histories')
export class IndexHistoryController {
  constructor(private readonly indexHistoryService: IIndexHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Find all index histories' })
  @ApiPaginatedResponse({ type: IndexHistoryListResponseModel })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.indexHistoryService.findAll(paginationDto);
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Find latest index history',
  })
  @ApiCustomOkResponse({ type: IndexHistory })
  @ApiCustomNotFoundResponse({ message: 'there is no record yet' })
  findLatest(@Req() req: any) {
    return this.indexHistoryService.findLatest(req.route?.path);
  }
}
