import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryCreateMigration1630415964894 implements MigrationInterface {
  name = 'CategoryCreateMigration1630415964894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "parent_id" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "parent_id" integer, CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743" FOREIGN KEY ("parent_id") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_category"("id", "name", "parent_id") SELECT "id", "name", "parent_id" FROM "category"`,
    );
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`ALTER TABLE "temporary_category" RENAME TO "category"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" RENAME TO "temporary_category"`);
    await queryRunner.query(
      `CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "parent_id" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "category"("id", "name", "parent_id") SELECT "id", "name", "parent_id" FROM "temporary_category"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
