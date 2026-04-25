import type { Database } from "./supabase";

export type Client = Database["public"]["Tables"]["clients"]["Row"];
