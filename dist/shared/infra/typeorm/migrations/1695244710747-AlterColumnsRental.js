"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlterColumnsRental1695244710747 = void 0;
class AlterColumnsRental1695244710747 {
  constructor() {
    this.name = 'AlterColumnsRental1695244710747';
  }
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "rentals" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
  }
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "rentals" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "rentals" ADD "start_date" TIMESTAMP NOT NULL`);
  }
}
exports.AlterColumnsRental1695244710747 = AlterColumnsRental1695244710747;