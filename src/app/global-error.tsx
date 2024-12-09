"use client";

// import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import "../styles/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry.captureException(error);
    console.error("APP ERROR " + error?.digest || error);
  }, [error]);

  return (
    <html>
      <body>
        <Error title="APP ERROR" statusCode={500} />
        <h2>Something went wrong!</h2>
        <div className="mb-5 mt-5 rounded-lg bg-red-500 p-4">
          {error?.digest ?? "Veuillez contacter l'administrateur du site !"}
        </div>
        <button
          onClick={() => reset()}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Essayer
        </button>
      </body>
    </html>
  );
}
