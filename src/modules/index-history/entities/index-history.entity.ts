import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { indexHistoryStatusEnum } from '@enums/index';

@Entity('index_history')
export class IndexHistory extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'enum', enum: indexHistoryStatusEnum })
  @Column({ type: 'enum', enum: indexHistoryStatusEnum })
  status: indexHistoryStatusEnum;

  @ApiProperty()
  @Column()
  duration: string;

  @ApiProperty({ default: 0, required: false })
  @Column({ name: 'processed_records', default: 0 })
  processedRecords?: number;

  @ApiProperty({ default: 0, required: false })
  @Column({ name: 'total_records', default: 0 })
  totalRecords?: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
