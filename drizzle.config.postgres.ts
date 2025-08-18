import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations-postgres",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/agendafacil",
  },
});
