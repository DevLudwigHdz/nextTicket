import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

// Esta función está diseñada para ser llamada DENTRO de Server Components,
// Route Handlers, o Server Actions, donde `cookies()` está disponible.
export async function createSupabaseServerClientOnServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            (cookieStore as any).set(name, value, options);
          } catch (error) {
            // En Server Components, set es no-op y puede que no lance error o sí dependiendo de Next.js internals
            // console.warn(`Error setting cookie (server): ${name}`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            (cookieStore as any).delete(name, options);
          } catch (error) {
            // console.warn(`Error removing cookie (server): ${name}`, error);
          }
        },
      },
    }
  );
}
