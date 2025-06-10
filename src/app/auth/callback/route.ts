import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // For Server Components/Route Handlers, cookies need to be set on the response
            // NextResponse.next() is not available here, so we create a response to set cookies
            const response = NextResponse.redirect(
              new URL(next, origin).toString()
            );
            response.cookies.set({ name, value, ...options });
            // This set on request.cookies is for the middleware to read, if needed immediately
            request.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            const response = NextResponse.redirect(
              new URL(next, origin).toString()
            );
            response.cookies.delete({ name, ...options } as any);
            request.cookies.delete(name);
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString());
    }
  }

  // return the user to an error page with instructions
  console.error("Error en callback de OAuth o código no presente:", code);
  return NextResponse.redirect(
    new URL("/auth/auth-code-error", origin).toString()
  );
}
