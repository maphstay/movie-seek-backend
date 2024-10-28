import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Movie extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ name: 'tmbd_id', unique: true })
  tmdbId: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ nullable: true, required: false })
  @Column({ type: 'text', nullable: true })
  overview?: string;

  @ApiProperty({ nullable: true, required: false })
  @Column({ nullable: true, name: 'poster_path' })
  posterPath?: string;

  @ApiProperty()
  @Column({ name: 'release_date' })
  releaseDate: string;

  @ApiProperty()
  @Column({
    name: 'vote_average',
    default: 0,
    type: 'decimal',
    precision: 10,
    scale: 3,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  voteAverage: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
