import { VerifyAccountForm } from "@/components/form/verify-account";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Account | Housing & Roommate Platform",
  description: "Verify your email account",
};

export default function VerifyAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Suspense fallback={<div className="animate-pulse flex flex-col items-center gap-4"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <VerifyAccountForm />
      </Suspense>
    </div>
  );
}
