"use client";

import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Usuario ha iniciado sesión, redirigir a la página principal o a donde sea necesario
        router.push("/");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Iniciar Sesión
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]} // Puedes configurar los proveedores que quieras
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          localization={{
            variables: {
              sign_in: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                button_label: "Iniciar sesión",
                social_provider_text: "Continuar con {{provider}}",
                link_text: "¿Ya tienes una cuenta? Inicia sesión",
              },
              sign_up: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                button_label: "Registrarse",
                social_provider_text: "Continuar con {{provider}}",
                link_text: "¿No tienes cuenta? Regístrate",
              },
              forgotten_password: {
                email_label: "Correo electrónico",
                button_label: "Enviar instrucciones",
                link_text: "¿Olvidaste tu contraseña?",
              },
              update_password: {
                password_label: "Nueva contraseña",
                button_label: "Actualizar contraseña",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
