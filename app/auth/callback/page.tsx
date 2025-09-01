"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/auth/login?error=Authentication failed");
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to docs
          router.push("/docs");
        } else {
          // No session, redirect to login
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/auth/login?error=Unexpected error occurred");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
