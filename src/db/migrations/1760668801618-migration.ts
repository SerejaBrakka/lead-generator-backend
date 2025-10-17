import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760668801618 implements MigrationInterface {
    name = 'Migration1760668801618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
    }

}
