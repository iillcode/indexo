"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthTabs } from "@/components/ui/modern-animated-sign-in";

type FormData = {
  email: string;
  password: string;
};

type AuthError = {
  code?: string;
  message: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // Redirect authenticated users to dashboard or specified redirect URL
  useEffect(() => {
    if (!authLoading && user) {
      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace("/docs");
      }
    }
  }, [user, authLoading, router, redirect]);

  // Show loading during auth check or if redirecting
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is authenticated (prevents flash)
  if (user) {
    return null;
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(formData.email, formData.password);
      console.log(error?.message);
      if (error) {
        setError({
          code: error.message.includes("Invalid login credentials")
            ? "invalid_credentials"
            : "auth_error",
          message: error.message,
        });
      } else {
        // Redirect to the specified URL or default to docs
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/docs");
        }
      }
    } catch (err) {
      setError({
        code: "unexpected_error",
        message: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/auth/register");
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError({
          code: "google_auth_error",
          message: error.message,
        });
      }
      // Note: The redirect will be handled by the OAuth flow
    } catch (err) {
      setError({
        code: "google_auth_error",
        message: "Failed to sign in with Google",
      });
    }
  };

  const formFields = {
    header: "Welcome back",
    subHeader: "Sign in to your account",
    fields: [
      {
        label: "Email",
        required: true,
        type: "email",
        placeholder: "Enter your email address",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, "email"),
      },
      {
        label: "Password",
        required: true,
        type: "password",
        placeholder: "Enter your password",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, "password"),
      },
    ],
    submitButton: loading ? "Signing in..." : "Sign in",
    textVariantButton: "Don't have an account? Sign up",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AuthTabs
          formFields={formFields}
          goTo={goToRegister}
          handleSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
        />
        {error && (
          <div className="mt-4 p-4 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="font-medium text-red-800 dark:text-red-300">
              Error Code: {error.code}
            </div>
            <div className="text-red-700 dark:text-red-400 mt-1">
              {error.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
