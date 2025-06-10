import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Asegúrate de reemplazar estos valores con tus propias credenciales de Supabase.
// Es MUY RECOMENDABLE usar variables de entorno para esto en producción.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
