// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
Sentry.init({
  // https://e504b76bf70dd6d4304cf92def5096de@o4507680365019136.ingest.us.sentry.io/4507680380223488
  dsn: "",
  tracesSampleRate: 1,
  debug: false,
});
