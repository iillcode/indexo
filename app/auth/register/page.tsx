"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthTabs } from "@/components/ui/modern-animated-sign-in";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthError = {
  code?: string;
  message: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    signUp,
    signInWithGoogle,
    checkEmailExists,
    user,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to docs
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/docs");
    }
  }, [user, authLoading, router]);

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

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError({
        code: "password_mismatch",
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError({
        code: "weak_password",
        message: "Password must be at least 6 characters long",
      });
      setLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setError({
          code: "user_already_registered",
          message:
            "A user with this email already exists. Please sign in instead.",
        });
        setLoading(false);
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
        return;
      }

      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) {
        setError({
          code: error.message.includes("already registered")
            ? "user_already_registered"
            : "signup_error",
          message: error.message,
        });
      } else {
        setSuccess(true);
        // Note: User will need to confirm email before they can sign in
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

  const goToLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/auth/login");
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-card border border-border rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Check your email
            </h2>
            <p className="text-muted-foreground mb-6">
              We've sent you a confirmation link at{" "}
              <strong>{formData.email}</strong>
            </p>
            <button
              onClick={goToLogin}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formFields = {
    header: "Create account",
    subHeader: "Sign up to get started",
    fields: [
      {
        label: "Full Name",
        required: true,
        type: "text",
        placeholder: "Enter your full name",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, "fullName"),
      },
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
      {
        label: "Confirm Password",
        required: true,
        type: "password",
        placeholder: "Confirm your password",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, "confirmPassword"),
      },
    ],
    submitButton: loading ? "Creating account..." : "Create account",
    textVariantButton: "Already have an account? Sign in",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AuthTabs
          formFields={formFields}
          goTo={goToLogin}
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
            {error.code === "user_already_registered" && (
              <div className="text-orange-600 dark:text-orange-400 mt-2 text-xs">
                Redirecting to login page...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
