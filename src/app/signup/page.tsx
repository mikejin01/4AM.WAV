import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function SignUpPage() {
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
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-white/50">
            Join 4AM.WAV to discover and create events
          </p>
        </div>

        <GoogleAuthButton />

        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:text-gold-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
