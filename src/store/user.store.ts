import { create } from "zustand";
import type { UserState } from "@/types/user.types";

export const useUser = create<UserState>((set) => ({
  profile: null,
  session: null,
  setProfile: (profile) => set({ profile: profile }),
  setSession: (session) => set({ session: session }),
}));
