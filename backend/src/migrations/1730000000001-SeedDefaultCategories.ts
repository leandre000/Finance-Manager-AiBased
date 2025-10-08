import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultCategories1730000000001 implements MigrationInterface {
  name = 'SeedDefaultCategories1730000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default expense categories
    await queryRunner.query(`
      INSERT INTO "categories" ("id", "name", "type", "color", "icon", "description", "isSystem", "userId", "createdAt", "updatedAt")
      VALUES
        (uuid_generate_v4(), 'Food & Dining', 'expense', '#FF6B6B', '🍔', 'Restaurants, groceries, and food delivery', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Transportation', 'expense', '#4ECDC4', '🚗', 'Gas, public transit, car maintenance, parking', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Shopping', 'expense', '#95E1D3', '🛍️', 'Clothing, electronics, and general shopping', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Entertainment', 'expense', '#F38181', '🎬', 'Movies, games, hobbies, subscriptions', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Bills & Utilities', 'expense', '#AA96DA', '⚡', 'Electricity, water, internet, phone bills', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Healthcare', 'expense', '#FCBAD3', '🏥', 'Medical expenses, insurance, pharmacy', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Housing', 'expense', '#A8D8EA', '🏠', 'Rent, mortgage, property tax, home maintenance', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Education', 'expense', '#FED9B7', '📚', 'Tuition, books, courses, training', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Personal Care', 'expense', '#F07167', '💇', 'Haircuts, spa, cosmetics, gym membership', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Insurance', 'expense', '#00AFB9', '🛡️', 'Life, health, car, home insurance', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Travel', 'expense', '#0081A7', '✈️', 'Flights, hotels, vacation expenses', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Gifts & Donations', 'expense', '#F4A261', '🎁', 'Charity, gifts for others', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Pets', 'expense', '#E76F51', '🐾', 'Pet food, vet, supplies', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Subscriptions', 'expense', '#264653', '📺', 'Streaming services, magazines, apps', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Other Expenses', 'expense', '#8D99AE', '📦', 'Miscellaneous expenses', true, NULL, now(), now())
    `);

    // Insert default income categories
    await queryRunner.query(`
      INSERT INTO "categories" ("id", "name", "type", "color", "icon", "description", "isSystem", "userId", "createdAt", "updatedAt")
      VALUES
        (uuid_generate_v4(), 'Salary', 'income', '#06FFA5', '💰', 'Monthly salary and wages', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Freelance', 'income', '#2EC4B6', '💼', 'Freelance and contract work', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Business', 'income', '#11B5E4', '🏢', 'Business revenue and profits', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Investments', 'income', '#4CC9F0', '📈', 'Dividends, interest, capital gains', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Rental Income', 'income', '#4361EE', '🏘️', 'Property rental income', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Gifts Received', 'income', '#7209B7', '🎉', 'Money received as gifts', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Refunds', 'income', '#F72585', '↩️', 'Tax refunds, purchase refunds', true, NULL, now(), now()),
        (uuid_generate_v4(), 'Other Income', 'income', '#3A86FF', '💵', 'Miscellaneous income', true, NULL, now(), now())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "categories" WHERE "isSystem" = true`);
  }
}

