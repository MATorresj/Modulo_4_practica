import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1728892809229 implements MigrationInterface {
  name = 'Initial1728892809229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(20) NOT NULL, "phone" character varying NOT NULL, "country" character varying(50) NOT NULL, "address" text NOT NULL, "city" character varying(50) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "userId" uuid, "orderDetailsId" uuid, CONSTRAINT "REL_ab56c88c3f324df235b657e9f6" UNIQUE ("orderDetailsId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "order_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "orderId" uuid, CONSTRAINT "PK_278a6e0f21c9db1653e6f406801" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "stock" integer NOT NULL, "imgUrl" character varying NOT NULL DEFAULT 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png', "categoryId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "order_details_products_products" ("orderDetailsId" uuid NOT NULL, "productsId" uuid NOT NULL, CONSTRAINT "PK_2c6c921128319f110abec51e06b" PRIMARY KEY ("orderDetailsId", "productsId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35bbcf9515eab2382bd417b385" ON "order_details_products_products" ("orderDetailsId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df657e601f53f706e4b7d253c3" ON "order_details_products_products" ("productsId") `
    );
    await queryRunner.query(
      `CREATE TABLE "products_order_details_order_details" ("productsId" uuid NOT NULL, "orderDetailsId" uuid NOT NULL, CONSTRAINT "PK_6e479078724c7021a8460d36ad7" PRIMARY KEY ("productsId", "orderDetailsId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6e6c7ee1d7f3a557ba8f599ce" ON "products_order_details_order_details" ("productsId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d01089028de42dd7afc853101b" ON "products_order_details_order_details" ("orderDetailsId") `
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ab56c88c3f324df235b657e9f62" FOREIGN KEY ("orderDetailsId") REFERENCES "order_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details" ADD CONSTRAINT "FK_147bc15de4304f89a93c7eee969" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details_products_products" ADD CONSTRAINT "FK_35bbcf9515eab2382bd417b385f" FOREIGN KEY ("orderDetailsId") REFERENCES "order_details"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details_products_products" ADD CONSTRAINT "FK_df657e601f53f706e4b7d253c30" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "products_order_details_order_details" ADD CONSTRAINT "FK_f6e6c7ee1d7f3a557ba8f599ced" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "products_order_details_order_details" ADD CONSTRAINT "FK_d01089028de42dd7afc853101bb" FOREIGN KEY ("orderDetailsId") REFERENCES "order_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products_order_details_order_details" DROP CONSTRAINT "FK_d01089028de42dd7afc853101bb"`
    );
    await queryRunner.query(
      `ALTER TABLE "products_order_details_order_details" DROP CONSTRAINT "FK_f6e6c7ee1d7f3a557ba8f599ced"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details_products_products" DROP CONSTRAINT "FK_df657e601f53f706e4b7d253c30"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details_products_products" DROP CONSTRAINT "FK_35bbcf9515eab2382bd417b385f"`
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_details" DROP CONSTRAINT "FK_147bc15de4304f89a93c7eee969"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ab56c88c3f324df235b657e9f62"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d01089028de42dd7afc853101b"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6e6c7ee1d7f3a557ba8f599ce"`
    );
    await queryRunner.query(
      `DROP TABLE "products_order_details_order_details"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df657e601f53f706e4b7d253c3"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35bbcf9515eab2382bd417b385"`
    );
    await queryRunner.query(`DROP TABLE "order_details_products_products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "order_details"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
