"use client";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6">
      <h2 className="text-xl font-bold text-white">Something went wrong</h2>
      <p className="text-sm text-white/50">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gold-light"
      >
        Try again
      </button>
    </div>
  );
}
