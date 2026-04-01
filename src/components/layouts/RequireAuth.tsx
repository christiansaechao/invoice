import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Loader2 } from "lucide-react";
import { useUser } from "@/store/user.store";
import { fetchProfile } from "@/services/invoice.services";

export function RequireAuth() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { setSession, session, setProfile } = useUser((state) => state);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!alive) return;

        if (!data.session) {
          throw new Error("Error, no user session exists");
        }

        setSession(data.session ?? null);

        const profile = await fetchProfile(data.session.user.id ?? null);

        setProfile(profile);
      } catch (e) {
        console.error(e);
        if (alive) setSession(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!alive) return;
        setSession(newSession);
        setLoading(false);
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
