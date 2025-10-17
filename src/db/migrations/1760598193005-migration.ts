import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760598193005 implements MigrationInterface {
    name = 'Migration1760598193005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "name" TO "title"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" TO "UQ_08e86fada7ae67b1689f948e83e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME CONSTRAINT "UQ_08e86fada7ae67b1689f948e83e" TO "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "title" TO "name"`);
    }

}
