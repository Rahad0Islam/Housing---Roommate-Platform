import { LoginForm } from "@/components/form/login-form";
import { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Housing & Roommate Platform",
  description: "Login to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectPath =
    redirect?.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/dashboard";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <Image
        src="/login.png"
        alt="A welcoming home interior"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-slate-950/20 to-primary/25" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl motion-rise" />
      <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl motion-rise" />

      <div className="relative z-10 w-full max-w-md motion-rise">
        <div className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-emerald-200" />
          </span>
          RoommateFinder
        </div>
        <div className="mb-5 flex items-center justify-center gap-2 text-xs font-medium text-white/75">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          A secure place to begin your next chapter
        </div>
        <LoginForm redirectPath={redirectPath} />
      </div>
    </div>
  );
}
