import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1730069029976 implements MigrationInterface {
  name = 'CreateDatabase1730069029976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_seek"."movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tmbd_id" integer NOT NULL, "title" character varying NOT NULL, "overview" text, "poster_path" character varying, "release_date" character varying NOT NULL, "vote_average" numeric(10,3) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f1ce46f15cb966cdf75ebc19091" UNIQUE ("tmbd_id"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "movie_seek"."index_history_status_enum" AS ENUM('success', 'failed')`);
    await queryRunner.query(
      `CREATE TABLE "movie_seek"."index_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "movie_seek"."index_history_status_enum" NOT NULL, "duration" character varying NOT NULL, "processed_records" integer NOT NULL DEFAULT '0', "total_records" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b7885d432824b61dc84ac35d60b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movie_seek"."index_history"`);
    await queryRunner.query(`DROP TYPE "movie_seek"."index_history_status_enum"`);
    await queryRunner.query(`DROP TABLE "movie_seek"."movie"`);
  }
}
