"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin as useApiGoogleLogin } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GoogleAuth() {
  const { mutate: apiGoogleLogin, isPending } = useApiGoogleLogin();
  const router = useRouter();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            apiGoogleLogin(
              { idToken: credentialResponse.credential },
              {
                onSuccess: () => {
                  toast.success("Successfully logged in with Google");
                  router.push("/dashboard"); // Redirect to home or dashboard
                },
                onError: (error: any) => {
                  toast.error("Google login failed", {
                    description:
                      error.message || "An error occurred during Google login.",
                  });
                },
              },
            );
          }
        }}
        onError={() => {
          toast.error("Google authentication failed");
        }}
        shape="rectangular"
        size="large"
        theme="outline"
      />
    </div>
  );
}
