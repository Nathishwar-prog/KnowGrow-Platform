import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const statements = [
      // Admins.createdAt
      `ALTER TABLE "admins" ADD COLUMN "createdAt_tmp" timestamp;`,
      `UPDATE "admins" SET "createdAt_tmp" = "createdAt"::timestamp WHERE "createdAt" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}';`,
      `ALTER TABLE "admins" DROP COLUMN "createdAt";`,
      `ALTER TABLE "admins" RENAME COLUMN "createdAt_tmp" TO "createdAt";`,
      `ALTER TABLE "admins" ALTER COLUMN "createdAt" SET DEFAULT now();`,

      // Admins.lastLogin
      `ALTER TABLE "admins" ADD COLUMN "lastLogin_tmp" timestamp;`,
      `UPDATE "admins" SET "lastLogin_tmp" = "lastLogin"::timestamp WHERE "lastLogin" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}';`,
      `ALTER TABLE "admins" DROP COLUMN "lastLogin";`,
      `ALTER TABLE "admins" RENAME COLUMN "lastLogin_tmp" TO "lastLogin";`,
      `ALTER TABLE "admins" ALTER COLUMN "lastLogin" SET DEFAULT now();`,

      // Quizzes.createdAt
      `ALTER TABLE "quizzes" ADD COLUMN "createdAt_tmp" timestamp;`,
      `UPDATE "quizzes" SET "createdAt_tmp" = "createdAt"::timestamp WHERE "createdAt" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}';`,
      `ALTER TABLE "quizzes" DROP COLUMN "createdAt";`,
      `ALTER TABLE "quizzes" RENAME COLUMN "createdAt_tmp" TO "createdAt";`,
      `ALTER TABLE "quizzes" ALTER COLUMN "createdAt" SET DEFAULT now();`
    ];

    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt);
        console.log('Executed:', stmt);
      } catch (e) {
        console.warn('Skipped (likely already correct):', e.message);
      }
    }
    console.log('Timestamp columns fixed successfully');

    const rows = await sql`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE column_name = 'createdAt' ORDER BY table_name;`;
    console.log('createdAt column types:', rows);
    const rows2 = await sql`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE column_name = 'lastLogin' ORDER BY table_name;`;
    console.log('lastLogin column types:', rows2);
  } catch (e) {
    console.error('Failed to fix timestamps:', e);
    process.exit(1);
  }
}

main();