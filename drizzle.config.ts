import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: 'app/db/schema.ts',
  out: "app/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
