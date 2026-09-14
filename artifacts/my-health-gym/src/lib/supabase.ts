import { createClient } from "@supabase/supabase-js";

export type Item = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  category: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type NewItem = {
  title: string;
  price: number;
  image?: string | null;
  category: string;
  active?: boolean;
};

export type UpdateItem = Partial<NewItem>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

// Initialize Supabase Client
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
