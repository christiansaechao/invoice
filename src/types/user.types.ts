import type { Session } from "@supabase/supabase-js";

export type ProfileType = {
  id: string;
  first_name: string;
  last_name: string;
  contact_email: string;
  preferred_email: string;
  updated_at: string;
  city: string;
  created_at: string;
  state: string;
  area_code: string;
  address: string;
  phone_number: string;
};

export type UserState = {
  profile: ProfileType | null;
  session: Session | null;
  setProfile: (profile: ProfileType) => void;
  setSession: (session: Session | null) => void;
};
