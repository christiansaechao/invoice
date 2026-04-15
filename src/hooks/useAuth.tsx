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
import { getProfile } from "@/services/user.services";

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

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    await getProfile(userId);
  }, [userId, getProfile]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session ?? null);
      // fetch profile once we have session
      if (data.session?.user?.id) {
        await getProfile(data.session.user.id);
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
          await getProfile(newSession.user.id);
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
