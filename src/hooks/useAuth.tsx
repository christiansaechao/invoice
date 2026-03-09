import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase-client";
import type { Session } from "@supabase/supabase-js";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
};

type AuthContextValue = {
  session: Session | null;
  userId: string | null;
  profile: Profile[] | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile[] | null>(null);

  const userId = session?.user?.id ?? null;

  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      setProfile(null);
      return;
    }
    setProfile(data);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    await fetchProfile(userId);
  }, [userId, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session ?? null);
      // fetch profile once we have session
      if (data.session?.user?.id) {
        await fetchProfile(data.session.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        if (newSession?.user?.id) {
          setLoading(true);
          await fetchProfile(newSession.user.id);
          setLoading(false);
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ session, userId, profile, loading, refreshProfile }),
    [session, userId, profile, loading, refreshProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
