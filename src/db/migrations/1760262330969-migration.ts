import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760262330969 implements MigrationInterface {
    name = 'Migration1760262330969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regions" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_9e0491ce070cc63ea3e8c71f2cf" UNIQUE ("title"), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "regions"`);
    }

}
