import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedInitialUser1730000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if user already exists
    const existingUser = await queryRunner.query(
      `SELECT * FROM users WHERE email = 'Iamshemaleandre@gmail.com' LIMIT 1`
    );

    if (existingUser && existingUser.length > 0) {
      console.log('Initial admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('shema@1050!', 10);

    // Insert admin user
    await queryRunner.query(
      `INSERT INTO users (email, "fullName", password, "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      ['Iamshemaleandre@gmail.com', 'Shema Leandre', hashedPassword, true]
    );

    console.log('✅ Initial admin user created successfully');
    console.log('   Email: Iamshemaleandre@gmail.com');
    console.log('   Password: shema@1050!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = 'Iamshemaleandre@gmail.com'`
    );
  }
}

