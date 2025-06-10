import TicketCard from "@/components/dashboard/TicketCard";
import { getUserProfile } from "@/lib/supabase/get-user-profile";
import { createSupabaseServerClientOnServer } from "@/lib/supabase/server";
import { type TicketWithEvent } from "@/types/app.types";
import Link from "next/link";
import { Suspense } from "react";

async function getUserTickets(userId: string): Promise<TicketWithEvent[]> {
  const supabase = await createSupabaseServerClientOnServer();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
        *,
        events (
          name,
          date,
          location,
          image_url
        )
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user tickets:", error);
    return [];
  }
  return data as TicketWithEvent[];
}

const TicketsList = async () => {
  const { profile } = await getUserProfile();
  if (!profile)
    return (
      <p className="text-center text-red-500">
        No se pudo identificar al usuario.
      </p>
    );

  const tickets = await getUserTickets(profile.id);

  if (tickets.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">
          Aún no tienes boletos
        </h3>
        <p className="mt-2 text-gray-600">
          Explora los eventos disponibles y compra tu primer boleto.
        </p>
        <div className="mt-6">
          <Link href="/events">
            <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Ver Eventos
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

const TicketsListSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-lg shadow-md h-48 flex">
      <div className="w-1/3 bg-gray-200 rounded-l-lg"></div>
      <div className="p-6 flex-1">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-md h-48 flex">
      <div className="w-1/3 bg-gray-200 rounded-l-lg"></div>
      <div className="p-6 flex-1">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default function MyTicketsPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mis Boletos</h1>
          <Link href="/">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Volver al Inicio
            </span>
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<TicketsListSkeleton />}>
          <TicketsList />
        </Suspense>
      </main>
    </div>
  );
}
