import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts", // all tables
  out: "./.drizzle",
  dialect: "postgresql",
  dbCredentials: { url: env.POSTGRES_URL },
  tablesFilter: ["*"],
  verbose: true,
  strict: true,
} satisfies Config;
