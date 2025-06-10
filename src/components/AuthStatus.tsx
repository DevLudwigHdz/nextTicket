"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthStatus() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === "SIGNED_OUT") {
          router.refresh(); // Refresca la página para actualizar el estado del servidor
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login"); // Opcional: redirigir a login tras logout
  };

  if (loading) {
    return <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/my-tickets">
          <span className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Mis Boletos
          </span>
        </Link>
        <p className="text-sm text-gray-500 hidden sm:block">|</p>
        <p className="text-sm text-gray-700 hidden lg:block">
          Hola, {user.email}
        </p>
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <Link href="/auth/login">
      <span className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
        Iniciar Sesión
      </span>
    </Link>
  );
}
