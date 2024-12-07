// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
Sentry.init({
  // https://e504b76bf70dd6d4304cf92def5096de@o4507680365019136.ingest.us.sentry.io/4507680380223488
  dsn: "",
  tracesSampleRate: 1,
  debug: false,
  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
