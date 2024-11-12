import { MigrationInterface, QueryRunner } from "typeorm";

export class UserLength1729549756808 implements MigrationInterface {
    name = 'UserLength1729549756808';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cambiar la longitud de la columna "password" a 100 y mantener NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Cambiar la longitud de la columna "password" a 20 y quitar la restricción NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" TYPE character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }
}
