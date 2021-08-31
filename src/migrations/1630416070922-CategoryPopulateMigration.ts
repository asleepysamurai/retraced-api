import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryPopulateMigration1630416070922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO category (name) VALUES ('category1'),('category2'),('category3')`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category11', (SELECT id FROM category WHERE name = 'category1')),('category12', (SELECT id FROM category WHERE name = 'category1')),('category13', (SELECT id FROM category WHERE name = 'category1'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category21', (SELECT id FROM category WHERE name = 'category2')),('category22', (SELECT id FROM category WHERE name = 'category2')),('category23', (SELECT id FROM category WHERE name = 'category2'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category31', (SELECT id FROM category WHERE name = 'category3')),('category32', (SELECT id FROM category WHERE name = 'category3')),('category33', (SELECT id FROM category WHERE name = 'category3'))`,
    );

    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category111', (SELECT id FROM category WHERE name = 'category11')),('category112', (SELECT id FROM category WHERE name = 'category11')),('category113', (SELECT id FROM category WHERE name = 'category11'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category211', (SELECT id FROM category WHERE name = 'category21')),('category212', (SELECT id FROM category WHERE name = 'category21')),('category213', (SELECT id FROM category WHERE name = 'category21'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category311', (SELECT id FROM category WHERE name = 'category31')),('category312', (SELECT id FROM category WHERE name = 'category31')),('category313', (SELECT id FROM category WHERE name = 'category31'))`,
    );

    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category1111', (SELECT id FROM category WHERE name = 'category111')),('category1112', (SELECT id FROM category WHERE name = 'category111')),('category1113', (SELECT id FROM category WHERE name = 'category111'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category2111', (SELECT id FROM category WHERE name = 'category211')),('category2112', (SELECT id FROM category WHERE name = 'category211')),('category2113', (SELECT id FROM category WHERE name = 'category211'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category3111', (SELECT id FROM category WHERE name = 'category311')),('category3112', (SELECT id FROM category WHERE name = 'category311')),('category3113', (SELECT id FROM category WHERE name = 'category311'))`,
    );

    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category11111', (SELECT id FROM category WHERE name = 'category1111')),('category11112', (SELECT id FROM category WHERE name = 'category1111')),('category11113', (SELECT id FROM category WHERE name = 'category1111'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category21111', (SELECT id FROM category WHERE name = 'category2111')),('category21112', (SELECT id FROM category WHERE name = 'category2111')),('category21113', (SELECT id FROM category WHERE name = 'category2111'))`,
    );
    await queryRunner.query(
      `INSERT INTO category (name, parent_id) VALUES ('category31111', (SELECT id FROM category WHERE name = 'category3111')),('category31112', (SELECT id FROM category WHERE name = 'category3111')),('category31113', (SELECT id FROM category WHERE name = 'category3111'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM category');
  }
}
