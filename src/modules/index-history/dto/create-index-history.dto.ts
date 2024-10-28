import { indexHistoryStatusEnum } from '@enums/index';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndexHistoryDto {
  @ApiProperty({ type: 'enum', enum: indexHistoryStatusEnum })
  status: indexHistoryStatusEnum;

  @ApiProperty()
  duration: string;

  @ApiProperty({ default: 0, required: false })
  processedRecords?: number;

  @ApiProperty({ default: 0, required: false })
  totalRecords?: number;
}
