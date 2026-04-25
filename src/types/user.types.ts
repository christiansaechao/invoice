import type { Session } from "@supabase/supabase-js";

import type { Database } from "./supabase";

export type ProfileType = Database["public"]["Tables"]["users"]["Row"];

export type UserState = {
  profile: ProfileType | null;
  session: Session | null;
  setProfile: (profile: ProfileType) => void;
  setSession: (session: Session | null) => void;
};
