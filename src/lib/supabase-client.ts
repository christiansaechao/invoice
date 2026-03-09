import { createClient } from "@supabase/supabase-js";

const supabase_key = import.meta.env.VITE_SUPABASE_KEY;
const supabase_url = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabase_url, supabase_key);
