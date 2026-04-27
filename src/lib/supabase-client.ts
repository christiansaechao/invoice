import { createClient } from "@supabase/supabase-js";
import type { Database as GenDatabase } from "@/types/supabase";

export type Database = GenDatabase;

const supabase_key = import.meta.env.VITE_SUPABASE_KEY;
const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const REMEMBER_DEVICE_KEY = "dongma-remember-device";

const authStorage = {
  getItem: (key: string) => {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    const rememberDevice = localStorage.getItem(REMEMBER_DEVICE_KEY) === "true";
    const targetStorage = rememberDevice ? localStorage : sessionStorage;
    const otherStorage = rememberDevice ? sessionStorage : localStorage;

    otherStorage.removeItem(key);
    targetStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const supabase = createClient<Database>(supabase_url, supabase_key, {
  auth: {
    persistSession: true,
    storage: authStorage,
  },
});