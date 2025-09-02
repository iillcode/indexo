"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>;
  checkEmailExists: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // Prevent double init in React StrictMode (dev) and avoid duplicate fetches
  const initializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Function to create user profile
  const createProfile = async (user: User) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name:
          user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating profile:", error);
      return null;
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch only when user changed or no profile present
        if (lastUserIdRef.current !== session.user.id || !profile) {
          const userProfile = await fetchProfile(session.user.id);
          if (!userProfile) {
            const newProfile = await createProfile(session.user);
            setProfile(newProfile);
          } else {
            setProfile(userProfile);
          }
          lastUserIdRef.current = session.user.id;
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Ignore INITIAL_SESSION to avoid double work (we already handled initial load)
      if (event === "INITIAL_SESSION") {
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Only refetch if user changed
        if (lastUserIdRef.current !== session.user.id) {
          const userProfile = await fetchProfile(session.user.id);
          if (!userProfile) {
            const newProfile = await createProfile(session.user);
            setProfile(newProfile);
          } else {
            setProfile(userProfile);
          }
          lastUserIdRef.current = session.user.id;
        }
      } else {
        setProfile(null);
        lastUserIdRef.current = null;
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
        },
      },
    });
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error("No user logged in") as any };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        // Refresh profile data
        const updatedProfile = await fetchProfile(user.id);
        setProfile(updatedProfile);
      }

      return { error };
    } catch (error) {
      return { error: error as any };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (error && error.code === "PGRST116") {
        // No rows found, email doesn't exist
        return false;
      }

      if (error) {
        console.error("Error checking email:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    profile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    checkEmailExists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
