import { supabaseAdmin } from "@/lib/supabase/admin";
import { type Event, type UserWithProfile } from "@/types/app.types";
import { Suspense } from "react";
import Link from "next/link";
import AdminEventsList from "@/components/dashboard/admin/AdminEventsList";
import AdminUsersList from "@/components/dashboard/admin/AdminUsersList";
import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";

async function getAllUsers(): Promise<UserWithProfile[]> {
  // Ya no usamos createSupabaseServerClientOnServer, usamos el cliente de admin importado.

  // Paso 1: Obtener todos los perfiles. Usamos el cliente de admin que bypassa RLS.
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("*");

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // Paso 2: Obtener todos los usuarios de auth usando la API de admin
  const {
    data: { users: authUsers },
    error: authError,
  } = await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching auth users:", authError);
    return [];
  }

  // Paso 3: Unir los datos en el código de la aplicación
  const usersWithProfiles = profiles.map((profile) => {
    const authUser = authUsers.find((u) => u.id === profile.id);
    return {
      ...profile,
      // Asociamos el usuario de auth al perfil correspondiente
      users: authUser
        ? { email: authUser.email!, created_at: authUser.created_at }
        : null,
    };
  });

  // Ordenar por fecha de registro descendente
  return usersWithProfiles.sort(
    (a, b) =>
      new Date(b.users?.created_at || 0).getTime() -
      new Date(a.users?.created_at || 0).getTime()
  );
}

async function getAllEvents(): Promise<Event[]> {
  // Usamos el cliente admin para asegurar que vemos todos los eventos, sin importar RLS
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
  return data;
}

const ListSkeleton = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
    <div className="space-y-4">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default async function AdminDashboardPage() {
  const users = await getAllUsers();
  const events = await getAllEvents();

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Administrador
          </h1>
          <Link href="/">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Volver al Inicio
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Gestión de Usuarios
          </h2>
          <Suspense fallback={<ListSkeleton title="Cargando Usuarios..." />}>
            <AdminUsersList initialUsers={users} />
          </Suspense>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Gestión de Eventos
          </h2>
          <Suspense fallback={<ListSkeleton title="Cargando Eventos..." />}>
            <AdminEventsList initialEvents={events} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
