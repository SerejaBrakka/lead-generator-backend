import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761626115262 implements MigrationInterface {
    name = 'Migration1761626115262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leads" ("id" SERIAL NOT NULL, "name" text NOT NULL, "phone" text NOT NULL, "region" text NOT NULL, "amount_debt" text NOT NULL, "debtTypes" text NOT NULL, "things" boolean NOT NULL, "deals" boolean NOT NULL, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "leads"`);
    }

}
