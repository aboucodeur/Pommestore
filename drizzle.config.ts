import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts", // all tables
  out: "./.drizzle",
  dialect: "postgresql",
  dbCredentials: { url: env.NODE_ENV === "production" ? env.XATA_POSTGRES_URL : env.POSTGRES_URL, },
  tablesFilter: ["*"],
  verbose: true,
  strict: true,
} satisfies Config;
