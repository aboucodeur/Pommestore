import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts", // all tables
  out: "./.drizzle",
  dialect: "postgresql",
  //  env.NODE_ENV === "production" ? 
  dbCredentials: { url: env.XATA_POSTGRES_URL  },
  tablesFilter: ["*"],
  verbose: true,
  strict: true,
} satisfies Config;