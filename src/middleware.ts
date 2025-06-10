import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

// Función para obtener el rol del usuario desde dentro del middleware
async function getUserRole(supabase: any): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // No podemos usar nuestra función get_user_role() de Postgres aquí directamente,
  // así que consultamos la tabla 'profiles'
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Esto puede pasar si el perfil aún no se ha creado.
    // Tratar como el rol por defecto o el más restrictivo.
    return "attendee";
  }

  return profile.role;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // And update the response cookies.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies.
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // And update the response cookies.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete({ name, ...options } as any);
        },
      },
    }
  );

  // IMPORTANT: Avoid running Supabase auth logic for static files.
  // See https://github.com/supabase/auth-helpers/issues/705
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") || // Excluir rutas API si no necesitan sesión aquí
    request.nextUrl.pathname.startsWith("/static") ||
    [
      "/manifest.json",
      "/favicon.ico",
      // Agrega aquí otros archivos estáticos si es necesario
    ].includes(request.nextUrl.pathname)
  ) {
    return response;
  }

  // Primero, refrescar la sesión es importante
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteger rutas del dashboard
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      // Si no hay sesión, redirigir al login
      return NextResponse.redirect(
        new URL("/auth/login?next=" + pathname, request.url)
      );
    }

    const role = await getUserRole(supabase);

    // Reglas de acceso
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      pathname.startsWith("/dashboard/promoter") &&
      !["admin", "promoter"].includes(role ?? "")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|auth).*)", // Excluye /auth de ser procesado por este matcher general para evitar bucles si auth usa API routes que no deben ser procesadas por el middleware de sesión.
  ],
};
