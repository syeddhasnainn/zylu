"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import type { SVGProps } from "react";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Signin() {
  const { signIn } = useAuthActions();
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-slate-100 dark:bg-slate-100 dark:text-slate-900">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl dark:bg-indigo-400/40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/30 blur-3xl dark:bg-purple-400/40" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-clip-padding p-10 backdrop-blur-xl dark:border-slate-200/50 dark:bg-white/80">
        <div className="mb-10 space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 dark:border-slate-300/70 dark:text-slate-500">
            Welcome to Zylu
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Sign in to continue
            </h1>
            <p className="text-sm text-white/70 dark:text-slate-600">
              Connect your Google account to sync your conversations securely
              and pick up right where you left off.
            </p>
          </div>
        </div>

        {!clicked ? (
          <button
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-[1px] hover:border-white/40 hover:bg-white/20 focus-visible:outline-offset-2 focus-visible:outline-white/60 dark:border-slate-300/70 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-slate-800"
            onClick={() => {
              setClicked(true);

              void signIn("google", {
                redirectTo: "/chat",
              });
            }}
          >
            <Google className="h-5 w-5" />
            Sign in with Google
          </button>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:-translate-y-[1px] hover:border-white/40 hover:bg-white/20 focus-visible:outline-offset-2 focus-visible:outline-white/60 dark:border-slate-300/70 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-slate-800"
            onClick={() => {
              setClicked(true);

              void signIn("google", {
                redirectTo: "/chat",
              });
            }}
          >
            <Spinner />
          </button>
        )}

        <p className="mt-6 text-center text-xs text-white/50 dark:text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

const Google = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 256 262"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      fill="#4285F4"
    />
    <path
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      fill="#34A853"
    />
    <path
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      fill="#FBBC05"
    />
    <path
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      fill="#EB4335"
    />
  </svg>
);
