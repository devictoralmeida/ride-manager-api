import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterEntities1694694324700 implements MigrationInterface {
  name = 'AlterEntities1694694324700'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE 'cars' DROP CONSTRAINT 'FKCategoryCar'`,
    )
    await queryRunner.query(
      `ALTER TABLE 'users' DROP CONSTRAINT 'UQ_fe0bb3f6520ee0469504521e710'`,
    )
    await queryRunner.query(`ALTER TABLE 'users' DROP COLUMN 'username'`)
    await queryRunner.query(
      `ALTER TABLE 'specifications' ALTER COLUMN 'id' SET DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE 'cars' ALTER COLUMN 'id' SET DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(`ALTER TABLE 'cars' DROP COLUMN 'daily_rate'`)
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD 'daily_rate' integer NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE 'cars' DROP COLUMN 'fine_amount'`)
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD 'fine_amount' integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE 'categories' ALTER COLUMN 'id' SET DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE 'users' ALTER COLUMN 'id' SET DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD CONSTRAINT 'FK_9b6410d2f4eabb985524faae074' FOREIGN KEY ('category_id') REFERENCES 'categories'('id') ON DELETE SET NULL ON UPDATE SET NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE 'cars' DROP CONSTRAINT 'FK_9b6410d2f4eabb985524faae074'`,
    )
    await queryRunner.query(
      `ALTER TABLE 'users' ALTER COLUMN 'id' DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE 'categories' ALTER COLUMN 'id' DROP DEFAULT`,
    )
    await queryRunner.query(`ALTER TABLE 'cars' DROP COLUMN 'fine_amount'`)
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD 'fine_amount' numeric NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE 'cars' DROP COLUMN 'daily_rate'`)
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD 'daily_rate' numeric NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE 'cars' ALTER COLUMN 'id' DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE 'specifications' ALTER COLUMN 'id' DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE 'users' ADD 'username' character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE 'users' ADD CONSTRAINT 'UQ_fe0bb3f6520ee0469504521e710' UNIQUE ('username')`,
    )
    await queryRunner.query(
      `ALTER TABLE 'cars' ADD CONSTRAINT 'FKCategoryCar' FOREIGN KEY ('category_id') REFERENCES 'categories'('id') ON DELETE SET NULL ON UPDATE SET NULL`,
    )
  }
}
