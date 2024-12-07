"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-500 text-white">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">Oops !</h1>
        <p className="mb-8 text-xl">
          Il semblerait qu&apos;une erreur soit survenue.
        </p>
        <div className="mb-5 mt-5 rounded-lg bg-red-400 p-4">
          {error.message || "Veuillez contacter l'administrateur du site !"}
        </div>
        <button
          onClick={() => reset()}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Retourner à l&apos;accueil
        </button>
      </div>
    </div>
  );
}
