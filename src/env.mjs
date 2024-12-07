import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    KEY_APP: z.string().length(64).readonly(),
    POSTGRES_URL: z.string().url(),
    PUBLIC_ASSETS_URL: z.string(),
    PUBLIC_ASSETS_DIR: z.string(),
    MAX_SIZE: z.string().readonly(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DB_PROVIDER_USE: z.enum(["XATA", ""]).default(""),
    XATA_API_KEY: z.string(),
    XATA_POSTGRES_URL: z.string(),
    XATA_BRANCH: z.string().default("XATA_BRANCH"),
    XATA_POSTGRES_URL_HTTPS: z.string(),
    // SENTRY_AUTH_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    KEY_APP: process.env.KEY_APP,
    POSTGRES_URL: process.env.POSTGRES_URL,
    NODE_ENV: process.env.NODE_ENV,
    PUBLIC_ASSETS_URL: process.env.PUBLIC_ASSETS_URL,
    PUBLIC_ASSETS_DIR: process.env.PUBLIC_ASSETS_DIR,
    MAX_SIZE: process.env.MAX_SIZE,
    DB_PROVIDER_USE: process.env.DB_PROVIDER_USE,
    XATA_API_KEY: process.env.XATA_API_KEY,
    XATA_POSTGRES_URL: process.env.XATA_POSTGRES_URL,
    XATA_BRANCH: process.env.XATA_BRANCH,
    XATA_POSTGRES_URL_HTTPS: process.env.XATA_POSTGRES_URL_HTTPS,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
