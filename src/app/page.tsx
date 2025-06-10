import { getUserProfile } from "@/lib/supabase/get-user-profile";
import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { type Event } from "@/types/app.types";
import EventCard from "@/components/EventCard";

async function getFeaturedEvents(): Promise<Event[]> {
  const supabase = await createSupabaseServerClientOnServer();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const { session, profile } = await getUserProfile();
  const userRole = profile?.role;
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="absolute top-0 right-0 p-6 flex items-center space-x-4 z-10 w-full justify-end">
        {userRole === "admin" && (
          <Link href="/dashboard/admin">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Admin Dashboard
            </span>
          </Link>
        )}
        {userRole === "promoter" && (
          <Link href="/dashboard/promoter">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Promoter Dashboard
            </span>
          </Link>
        )}
        <AuthStatus />
      </header>

      <main className="flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full bg-white pt-32 pb-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
              Bienvenido a <span className="text-indigo-600">Boletera</span>
            </h1>
            <p className="mt-5 text-xl text-gray-600">
              Tu plataforma definitiva para la compra y venta de boletos para
              los mejores eventos.
            </p>
            {!session && (
              <div className="mt-8">
                <Link href="/auth/login">
                  <span className="inline-block px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                    Empezar Ahora
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <section className="w-full py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Eventos Destacados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Link href="/events">
                  <span className="inline-block px-8 py-4 text-md font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 cursor-pointer transition-colors duration-300">
                    Ver Todos los Eventos
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="w-full py-6 text-center text-gray-500 bg-white border-t border-gray-200 mt-auto">
        <p>
          &copy; {new Date().getFullYear()} Boletera Inc. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
