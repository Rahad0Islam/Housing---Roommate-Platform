import { ResetPasswordForm } from "@/components/form/reset-password-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | Housing & Roommate Platform",
  description: "Set a new password",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Suspense fallback={<div className="animate-pulse flex flex-col items-center gap-4"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
