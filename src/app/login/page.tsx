import Link from "next/link";
import GoogleAuthButton from "@/features/auth/GoogleAuthButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <Link
        href="/"
        className="mb-12 text-2xl font-bold tracking-wider text-white"
      >
        4AM.WAV
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to discover events
          </p>
        </div>

        <GoogleAuthButton />

        <p className="text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold hover:text-gold-light">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
