import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnsRental1695244710747 implements MigrationInterface {
    name = 'AlterColumnsRental1695244710747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD "start_date" TIMESTAMP NOT NULL`);
    }

}
