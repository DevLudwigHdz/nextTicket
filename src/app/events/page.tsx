import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import { type Event } from "@/types/app.types";
import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import { getUserProfile } from "@/lib/supabase/get-user-profile";

async function getEvents(): Promise<Event[]> {
  const supabase = await createSupabaseServerClientOnServer();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true }); // Mostrar los eventos más próximos primero

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data;
}

export default async function EventsPage() {
  const events = await getEvents();
  const { profile } = await getUserProfile();
  const userRole = profile?.role;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-indigo-600">Boletera</span>
          </Link>
          <div className="flex items-center space-x-4">
            {userRole === "admin" && (
              <Link href="/dashboard/admin">
                <span className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Admin
                </span>
              </Link>
            )}
            {userRole === "promoter" && (
              <Link href="/dashboard/promoter">
                <span className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Promoter
                </span>
              </Link>
            )}
            <AuthStatus />
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Próximos Eventos
        </h1>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              No hay eventos disponibles por el momento
            </h2>
            <p className="mt-2 text-gray-500">
              Por favor, vuelve a consultar más tarde o crea un nuevo evento si
              eres promotor.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
